import React, { useEffect, useRef, useState } from 'react';
import { portfolioConfig } from '../../config/portfolio';

interface CharacterCanvasProps {
  onLoaded?: () => void;
  className?: string;
}

export const CharacterCanvas: React.FC<CharacterCanvasProps> = ({ onLoaded, className }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [framesLoaded, setFramesLoaded] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Animation and state refs
  const framesRef = useRef<HTMLImageElement[]>([]);
  const centerImageRef = useRef<HTMLImageElement | null>(null);
  const mousePosRef = useRef<{ x: number; y: number; active: boolean }>({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 400,
    active: false,
  });

  const angleRef = useRef<number>(0);
  const isEyeContactRef = useRef<boolean>(true);
  const eyeContactAlphaRef = useRef<number>(1);

  // Check reduced motion and touch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setIsReducedMotion(reducedMotionQuery.matches);
      const handleMotionChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
      reducedMotionQuery.addEventListener('change', handleMotionChange);

      const touchDetected = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
      setIsTouchDevice(touchDetected);

      return () => reducedMotionQuery.removeEventListener('change', handleMotionChange);
    }
  }, []);

  // Preload all 64 frames + center frame
  useEffect(() => {
    let isCancelled = false;
    const totalFrames = 64;
    const loadedImages: HTMLImageElement[] = new Array(totalFrames);
    let loadedCount = 0;

    const checkComplete = () => {
      loadedCount++;
      if (loadedCount >= totalFrames + 1 && !isCancelled) {
        framesRef.current = loadedImages;
        setFramesLoaded(true);
        if (onLoaded) onLoaded();
      }
    };

    // Load center frame
    const centerImg = new Image();
    centerImg.src = '/frames/center.webp';
    centerImg.onload = () => {
      centerImageRef.current = centerImg;
      checkComplete();
    };
    centerImg.onerror = () => {
      console.warn('Fallback: center.webp failed to load');
      checkComplete();
    };

    // Load 64 frames
    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `/frames/frame_${frameNum}.webp`;
      img.onload = () => {
        loadedImages[i] = img;
        checkComplete();
      };
      img.onerror = () => {
        console.warn(`Fallback: frame_${frameNum}.webp missing, using center`);
        loadedImages[i] = centerImg;
        checkComplete();
      };
    }

    // Safety timer
    const safetyTimer = setTimeout(() => {
      if (!isCancelled && loadedCount > 5) {
        framesRef.current = loadedImages;
        setFramesLoaded(true);
        if (onLoaded) onLoaded();
      }
    }, 2500);

    return () => {
      isCancelled = true;
      clearTimeout(safetyTimer);
    };
  }, [onLoaded]);

  // Pointer event listeners (desktop cursor tracking)
  useEffect(() => {
    if (isTouchDevice || isReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = {
        x: e.clientX,
        y: e.clientY,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mousePosRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isTouchDevice, isReducedMotion]);

  // RequestAnimationFrame render loop
  useEffect(() => {
    if (!framesLoaded) return;

    let animationId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Shortest-path circular angular lerp
    const lerpAngle = (current: number, target: number, speed: number): number => {
      let diff = (target - current) % (2 * Math.PI);
      if (diff < -Math.PI) diff += 2 * Math.PI;
      if (diff > Math.PI) diff -= 2 * Math.PI;
      return current + diff * speed;
    };

    // Resize handler
    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Clear with exact background color
      ctx.fillStyle = portfolioConfig.characterBgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Reference frame for dimensions
      const refImg = centerImageRef.current || framesRef.current[0];
      if (!refImg || !refImg.naturalWidth) {
        animationId = requestAnimationFrame(render);
        return;
      }

      // Calculate object-fit: cover placement
      const imgW = refImg.naturalWidth;
      const imgH = refImg.naturalHeight;
      const canvasW = canvas.width;
      const canvasH = canvas.height;

      const scale = Math.max(canvasW / imgW, canvasH / imgH);
      const drawW = imgW * scale;
      const drawH = imgH * scale;

      // Responsive positioning: center horizontally on mobile, offset to right half on desktop
      const isMobile = width < 768;
      const horizontalOffset = isMobile ? 0 : 0.16 * canvasW;
      const drawX = (canvasW - drawW) / 2 + horizontalOffset;
      const drawY = (canvasH - drawH) / 2;

      // If reduced motion or touch device, render center frame directly
      if (isReducedMotion || isTouchDevice) {
        const frameToDraw = centerImageRef.current || refImg;
        if (frameToDraw && frameToDraw.complete) {
          ctx.drawImage(frameToDraw, drawX, drawY, drawW, drawH);
        }
        animationId = requestAnimationFrame(render);
        return;
      }

      // Logical screen coordinates of face center
      const faceScreenX = (drawX + 0.50 * drawW) / dpr;
      const faceScreenY = (drawY + 0.41 * drawH) / dpr;

      const { x: mouseX, y: mouseY, active } = mousePosRef.current;

      // Determine target angle and eye-contact deadzone
      let targetAngle = angleRef.current;
      let targetEyeContact = false;

      if (active) {
        const dx = mouseX - faceScreenX;
        const dy = mouseY - faceScreenY;
        const dist = Math.hypot(dx, dy);

        // 12% screen radius deadzone for direct eye contact
        const deadzoneRadius = Math.min(width, height) * 0.12;

        if (dist < deadzoneRadius) {
          targetEyeContact = true;
        } else {
          targetAngle = Math.atan2(dy, dx);
        }
      } else {
        targetEyeContact = true;
      }

      // Eye contact state transition
      eyeContactAlphaRef.current += (targetEyeContact ? 1 : 0 - eyeContactAlphaRef.current) * 0.20;
      isEyeContactRef.current = eyeContactAlphaRef.current > 0.5;

      // Angular interpolation
      angleRef.current = lerpAngle(angleRef.current, targetAngle, 0.26);

      // Map smoothed angle to 0..63 frame index
      let normAngle = angleRef.current % (2 * Math.PI);
      if (normAngle < 0) normAngle += 2 * Math.PI;

      const frameIndex = Math.round((normAngle / (2 * Math.PI)) * 64) % 64;

      // Draw EXACTLY ONE crisp frame at 100% opacity (no alpha blending)
      ctx.globalAlpha = 1.0;

      let frameToDraw: HTMLImageElement | null = null;
      if (isEyeContactRef.current && centerImageRef.current && centerImageRef.current.complete) {
        frameToDraw = centerImageRef.current;
      } else if (framesRef.current[frameIndex] && framesRef.current[frameIndex].complete) {
        frameToDraw = framesRef.current[frameIndex];
      } else if (centerImageRef.current) {
        frameToDraw = centerImageRef.current;
      }

      if (frameToDraw) {
        ctx.drawImage(frameToDraw, drawX, drawY, drawW, drawH);
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [framesLoaded, isReducedMotion, isTouchDevice]);

  return (
    <div
      className={`absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none z-0 ${className || ''}`}
      style={{ backgroundColor: portfolioConfig.characterBgColor }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block w-full h-full"
        style={{
          backgroundColor: portfolioConfig.characterBgColor,
          transform: 'none',
        }}
      />

      {/* Fallback during initial load */}
      {!framesLoaded && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ backgroundColor: portfolioConfig.characterBgColor }}
        >
          <img
            src="/frames/center.webp"
            alt="Character Portrait"
            className="w-full h-full object-cover md:translate-x-[16%]"
          />
        </div>
      )}
    </div>
  );
};
