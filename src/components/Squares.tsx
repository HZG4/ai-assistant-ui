'use client';

import React, { useRef, useEffect } from 'react';

type CanvasStrokeStyle = string | CanvasGradient | CanvasPattern;

interface GridOffset {
  x: number;
  y: number;
}

interface SquaresProps {
  direction?: 'diagonal' | 'up' | 'right' | 'down' | 'left';
  speed?: number;
  borderColor?: CanvasStrokeStyle;
  squareSize?: number;
  hoverFillColor?: CanvasStrokeStyle;
}

const Squares: React.FC<SquaresProps> = ({
  direction = 'right',
  speed = 1,
  borderColor = '#999',
  squareSize = 40,
  hoverFillColor = '#222'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const numSquaresX = useRef<number>(0);
  const numSquaresY = useRef<number>(0);
  const gridOffset = useRef<GridOffset>({ x: 0, y: 0 });
  const hoveredSquareRef = useRef<GridOffset | null>(null);
  const hoverAlphaRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    // Ensure canvas can receive pointer events
    canvas.style.pointerEvents = 'auto';
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      numSquaresX.current = Math.ceil(canvas.width / squareSize) + 1;
      numSquaresY.current = Math.ceil(canvas.height / squareSize) + 1;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

  // listeners attached

    const drawGrid = () => {
      if (!ctx) return;

      // Clear canvas completely
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set solid opaque background
      ctx.globalAlpha = 1.0;
      ctx.fillStyle = '#000000'; // Pure black background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
        for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
          const squareX = x - (gridOffset.current.x % squareSize);
          const squareY = y - (gridOffset.current.y % squareSize);

          // Compute absolute grid indices for this cell so we compare in the same coordinate space
          const absGridX = Math.floor(x / squareSize);
          const absGridY = Math.floor(y / squareSize);

          if (
            hoveredSquareRef.current &&
            absGridX === hoveredSquareRef.current.x &&
            absGridY === hoveredSquareRef.current.y
          ) {
            ctx.save();
            // Use animated alpha for smooth fade
            ctx.globalAlpha = Math.max(0, Math.min(1, hoverAlphaRef.current));
            const fill = (hoverFillColor as string) || '#222';
            ctx.fillStyle = fill;
            ctx.fillRect(squareX, squareY, squareSize, squareSize);
            ctx.restore();
          }

          ctx.strokeStyle = borderColor as string;
          ctx.strokeRect(squareX, squareY, squareSize, squareSize);
        }
      }

      // Gradient effect removed
    };

    // Throttle animation to a target FPS and pause when page is hidden to reduce CPU/GPU usage.
    const targetFPS = 30;
    let lastFrameTime = 0;

  const updateAnimation = (t: number) => {
      // If timestamp missing, schedule next frame and return
      if (!t) {
        requestRef.current = requestAnimationFrame(updateAnimation);
        return;
      }

      const msPerFrame = 1000 / targetFPS;
      if (t - lastFrameTime < msPerFrame) {
        requestRef.current = requestAnimationFrame(updateAnimation);
        return;
      }
      lastFrameTime = t;

      const effectiveSpeed = Math.max(speed, 0.1);
      switch (direction) {
        case 'right':
          gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
          break;
        case 'left':
          gridOffset.current.x = (gridOffset.current.x + effectiveSpeed + squareSize) % squareSize;
          break;
        case 'up':
          gridOffset.current.y = (gridOffset.current.y + effectiveSpeed + squareSize) % squareSize;
          break;
        case 'down':
          gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
          break;
        case 'diagonal':
          gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
          gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
          break;
        default:
          break;
      }

  // Smoothly animate hover alpha for fade-in/out effect
  const targetHover = hoveredSquareRef.current ? 1 : 0;
  hoverAlphaRef.current += (targetHover - hoverAlphaRef.current) * 0.15;

  drawGrid();
      requestRef.current = requestAnimationFrame(updateAnimation);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      // Compute hovered absolute grid indices taking current grid offset into account
      const hoveredSquareX = Math.floor((mouseX + gridOffset.current.x) / squareSize);
      const hoveredSquareY = Math.floor((mouseY + gridOffset.current.y) / squareSize);

  // mouse and computed hovered indices

      if (
        !hoveredSquareRef.current ||
        hoveredSquareRef.current.x !== hoveredSquareX ||
        hoveredSquareRef.current.y !== hoveredSquareY
      ) {
  hoveredSquareRef.current = { x: hoveredSquareX, y: hoveredSquareY };
        // Immediately redraw when hover changes for responsive feedback
        drawGrid();
      }
    };

    const handleMouseLeave = () => {
      hoveredSquareRef.current = null;
      // Immediately redraw when mouse leaves
      drawGrid();
    };

    // Attach listeners to both the canvas and the document.
    // In this layout the overlaying app UI may intercept pointer events, so
    // forwarding document-level mouse moves ensures hover detection still works.
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    // Also listen on document to catch pointer movement even when an overlay
    // intercepts events. We still compute positions relative to the canvas.
    document.addEventListener('mousemove', handleMouseMove);
    // Start animation only when page is visible. Use visibilitychange to pause when hidden.
    const onVisibilityChange = () => {
      if (document.hidden) {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
          requestRef.current = null;
        }
      } else {
        if (!requestRef.current) {
          // reset lastFrameTime so first frame renders immediately
          lastFrameTime = performance.now();
          requestRef.current = requestAnimationFrame(updateAnimation);
        }
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    requestRef.current = requestAnimationFrame(updateAnimation);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
  document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [direction, speed, borderColor, hoverFillColor, squareSize]);

  return <canvas ref={canvasRef} className="w-full h-full border-none block"></canvas>;
};

export default Squares;
