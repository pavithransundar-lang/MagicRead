
import React, { useEffect, useRef, useState } from 'react';
import { ButterflyIcon, SparkleIcon, ButterflyVariant, CrownOverlayIcon } from './Icons';

interface ButterflyGameProps {
  onCatch: () => void;
  onClose: () => void;
}

interface Butterfly {
  id: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  flapSpeed: number;
  isCaught?: boolean;
  variant: ButterflyVariant;
}

interface Particle {
  id: number;
  x: number;
  y: number;
}

interface CrownPosition {
  x: number;
  y: number;
  width: number;
}

const ButterflyGame: React.FC<ButterflyGameProps> = ({ onCatch, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [butterflies, setButterflies] = useState<Butterfly[]>([]);
  const [gameEnded, setGameEnded] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [crownPos, setCrownPos] = useState<CrownPosition | null>(null);
  const modelRef = useRef<any>(null);
  const loopRef = useRef<number>(0);

  // Initialize camera and Face Detection
  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCameraAndModel = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          // Wait for video to load data to get dimensions
          videoRef.current.onloadeddata = async () => {
             // Load Blazeface
             if ((window as any).blazeface) {
                console.log("Loading Face Model...");
                modelRef.current = await (window as any).blazeface.load();
                console.log("Face Model Loaded");
                detectFace();
             }
          };
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setPermissionError(true);
      }
    };

    startCameraAndModel();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (loopRef.current) cancelAnimationFrame(loopRef.current);
    };
  }, []);

  // Face Detection Loop
  const detectFace = async () => {
      if (!modelRef.current || !videoRef.current || !containerRef.current) return;

      try {
        // returnTensors: false ensures we get JS objects back
        const predictions = await modelRef.current.estimateFaces(videoRef.current, false);

        // CRITICAL FIX: Check refs again after await, as component might have unmounted
        if (!videoRef.current || !containerRef.current) return;

        if (predictions.length > 0) {
            const start = predictions[0].topLeft;
            const end = predictions[0].bottomRight;
            const size = [end[0] - start[0], end[1] - start[1]]; // [width, height] in video coords

            // Video Dimensions (Intrinsic)
            const videoW = videoRef.current.videoWidth;
            const videoH = videoRef.current.videoHeight;
            
            // Screen Dimensions (Displayed)
            const clientW = containerRef.current.clientWidth;
            const clientH = containerRef.current.clientHeight;

            // Calculate Scale (object-cover behavior)
            const scale = Math.max(clientW / videoW, clientH / videoH);
            
            // Calculate displayed offsets (centering)
            const displayedW = videoW * scale;
            const displayedH = videoH * scale;
            const offsetX = (clientW - displayedW) / 2;
            const offsetY = (clientH - displayedH) / 2;

            // Calculate Center of face (Video Coords)
            const faceCenterX = start[0] + size[0] / 2;
            const faceTopY = start[1];

            // Mirror Logic: If we flip the video visually, we must flip the X coord relative to video width
            // Visual CSS: transform: scaleX(-1) (handled by Tailwind -scale-x-100)
            const mirroredFaceCenterX = videoW - faceCenterX;

            // Map to Screen Coords
            const screenX = mirroredFaceCenterX * scale + offsetX;
            const screenY = faceTopY * scale + offsetY;
            const screenFaceWidth = size[0] * scale;

            const targetPos = {
                x: screenX,
                y: screenY,
                width: screenFaceWidth
            };

            // Update state with smoothing (Low Pass Filter)
            setCrownPos(prev => {
                if (!prev) return targetPos;
                
                // Smoothing factor: 0.1 = very smooth/laggy, 0.9 = very responsive/jittery
                const k = 0.25; 

                return {
                    x: prev.x * (1 - k) + targetPos.x * k,
                    y: prev.y * (1 - k) + targetPos.y * k,
                    width: prev.width * (1 - k) + targetPos.width * k
                };
            });

        } else {
            setCrownPos(null);
        }
      } catch (e) {
        console.warn("Face detection loop error", e);
      }

      loopRef.current = requestAnimationFrame(detectFace);
  };


  // Helper to get random variant
  const getRandomVariant = (): ButterflyVariant => {
      const variants: ButterflyVariant[] = ['purple', 'blue', 'orange', 'green', 'pink', 'gold'];
      return variants[Math.floor(Math.random() * variants.length)];
  };

  // Spawn Initial Butterflies (Runs ONCE on mount)
  useEffect(() => {
    const initialButterflies: Butterfly[] = Array.from({ length: 5 }).map((_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        scale: Math.random() * 0.4 + 0.6,
        rotation: (Math.random() * 40) - 20,
        flapSpeed: Math.random() * 0.3 + 0.15,
        variant: getRandomVariant()
    }));
    setButterflies(initialButterflies);
  }, []);

  // Game Loop - Movement & Spawning (Stops when gameEnded)
  useEffect(() => {
    if (gameEnded) return;
    
    // Dynamic Flight Loop - Move butterflies around every 2.5s
    const moveInterval = setInterval(() => {
      setButterflies(prev => prev.map(b => {
        if (b.isCaught) return b;
        
        // Calculate new position with some randomness but keep on screen
        const moveX = (Math.random() - 0.5) * 30; // +/- 15% move
        const moveY = (Math.random() - 0.5) * 30;
        
        return {
          ...b,
          x: Math.max(5, Math.min(90, b.x + moveX)),
          y: Math.max(5, Math.min(90, b.y + moveY)),
          rotation: (Math.random() * 60) - 30, // Tilt into turn
        };
      }));
    }, 2500);

    // Spawn more occasionally
    const spawnInterval = setInterval(() => {
        setButterflies(prev => {
            if (prev.length >= 12) return prev;
            return [...prev, {
                id: Date.now(),
                x: Math.random() * 90 + 5,
                y: 110, // Fly in from bottom
                scale: Math.random() * 0.4 + 0.6,
                rotation: 0,
                flapSpeed: Math.random() * 0.3 + 0.15,
                variant: getRandomVariant()
            }];
        });
    }, 3000);

    return () => {
        clearInterval(moveInterval);
        clearInterval(spawnInterval);
    };
  }, [gameEnded]);

  const handleButterflyClick = (id: number, e: React.MouseEvent) => {
    if (gameEnded) return;
    
    // 1. Mark butterfly as caught (triggers CSS catch animation)
    setButterflies(prev => prev.map(b => b.id === id ? { ...b, isCaught: true } : b));

    // 2. Spawn particles at click location
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    
    const b = butterflies.find(b => b.id === id);
    if(b) {
        setParticles(Array.from({length: 8}).map((_, i) => ({ id: i, x: b.x, y: b.y })));
    }

    // 3. End game sequence
    setTimeout(() => {
        setGameEnded(true);
    }, 800); // Wait for catch animation to finish
  };

  const handleFinish = () => {
      onCatch();
  };

  const caughtButterfly = butterflies.find(b => b.isCaught);

  if (permissionError) {
    return (
      <div className="fixed inset-0 z-50 bg-pink-50 flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-handwriting text-red-500 mb-4">Oh no!</h2>
        <p className="mb-6 text-gray-600">We need your magic camera to find the butterflies!</p>
        <button onClick={onClose} className="bg-pink-400 text-white px-6 py-2 rounded-full">Go Back</button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
      {/* Video Feed with Mirror Effect */}
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        className="absolute inset-0 w-full h-full object-cover -scale-x-100" 
      />
      
      {/* Magical Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-purple-900/40 via-transparent to-pink-500/20"></div>

      {/* Crown Overlay */}
      {crownPos && !gameEnded && (
          <div 
            className="absolute pointer-events-none z-30 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)] will-change-transform"
            style={{
                left: crownPos.x,
                top: crownPos.y,
                width: crownPos.width * 1.1, // Reduced scale for better fit
                transform: 'translate(-50%, -80%)' // Sit on top of the hairline
            }}
          >
              <CrownOverlayIcon className="w-full h-full animate-float" />
          </div>
      )}

      {/* Close Button */}
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 bg-white/40 backdrop-blur-sm p-3 rounded-full text-white hover:bg-white/60 transition-colors z-50"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      {/* Instruction */}
      {!gameEnded && (
        <div className="absolute bottom-12 bg-white/80 backdrop-blur-md px-8 py-3 rounded-full border-2 border-pink-300 shadow-lg animate-float z-40">
          <p className="font-handwriting text-2xl text-pink-600 font-bold">Tap a butterfly to catch it!</p>
        </div>
      )}

      {/* Butterflies */}
      {butterflies.map((b) => (
        <div
          key={b.id}
          className={`absolute transition-all duration-[2500ms] ease-in-out cursor-pointer ${
              b.isCaught ? 'animate-catch-burst pointer-events-none' : 'hover:scale-110 hover:drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]'
          }`}
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            transform: `scale(${b.scale}) rotate(${b.rotation}deg)`,
            zIndex: b.isCaught ? 50 : 10
          }}
          onClick={(e) => handleButterflyClick(b.id, e)}
        >
          {/* Inner container for buoyancy - independent of flight path */}
          <div className={b.isCaught ? '' : 'animate-float-complex'}>
             <ButterflyIcon 
              className="w-24 h-24 drop-shadow-lg filter" 
              animated={true} 
              flapSpeed={b.flapSpeed}
              variant={b.variant}
              uniqueId={b.id.toString()}
             />
          </div>
          
          {/* Particles for this butterfly when caught */}
          {b.isCaught && (
              <div className="absolute inset-0 flex items-center justify-center">
                  {[...Array(6)].map((_, i) => (
                      <SparkleIcon 
                        key={i} 
                        className="absolute w-8 h-8 text-yellow-300 animate-sparkle" 
                        style={{
                            transform: `translate(${Math.cos(i) * 50}px, ${Math.sin(i) * 50}px)`,
                            animationDuration: '0.8s'
                        }} 
                      />
                  ))}
              </div>
          )}
        </div>
      ))}

      {/* Success Modal Overlay */}
      {gameEnded && caughtButterfly && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-md animate-in fade-in duration-500">
          <div className="bg-white/95 p-10 rounded-[3rem] shadow-2xl text-center border-4 border-pink-300 transform scale-100 animate-bounce-slow max-w-sm mx-4 relative overflow-hidden">
            
            {/* Background burst in modal */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-200/50 blur-3xl rounded-full animate-pulse"></div>

            <div className="relative mb-6 inline-block">
                <ButterflyIcon 
                  className="w-32 h-32 relative z-10 drop-shadow-2xl" 
                  animated={true} 
                  flapSpeed={0.2} 
                  variant={caughtButterfly.variant}
                  uniqueId="modal"
                />
            </div>
            
            <h2 className="text-5xl font-handwriting text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-2 drop-shadow-sm">Magical! ✨</h2>
            <p className="text-lg text-slate-600 font-medium mb-8">
               You caught a <span className="font-bold capitalize text-pink-600">{caughtButterfly.variant}</span> Butterfly!
            </p>
            
            <button 
                onClick={handleFinish}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xl font-bold px-10 py-3 rounded-full shadow-lg hover:scale-105 transition-transform relative z-20"
            >
                Add to Collection
            </button>
          </div>
          
          {/* Confetti */}
          {[...Array(20)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-3 h-3 bg-yellow-400 rounded-full animate-float"
                style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random()}s`,
                    animationDuration: `${3 + Math.random()}s`
                }}
              />
          ))}
        </div>
      )}
    </div>
  );
};

export default ButterflyGame;
