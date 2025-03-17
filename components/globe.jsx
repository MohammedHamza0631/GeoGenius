"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useSpring } from "framer-motion";

const MOVEMENT_DAMPING = 1400;
const THROTTLE_MS = 16; // ~60fps throttle

// Throttle function to limit frequent updates
const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export function Globe({
  className,
}) {
  let phi = 0;
  let width = 0;
  const canvasRef = useRef(null);
  const pointerInteracting = useRef(null);
  const pointerInteractionMovement = useRef(0);
  const globeInstanceRef = useRef(null);
  const animationFrameId = useRef(null);
  const onResizeRef = useRef(null);

  const r = useMotionValue(0);
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  });

  const updatePointerInteraction = (value) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
    }
  };

  const updateMovement = throttle((clientX) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      r.set(r.get() + delta / MOVEMENT_DAMPING);
    }
  }, THROTTLE_MS);

  useEffect(() => {
    // Dynamically import cobe to avoid SSR issues
    const initGlobe = async () => {
      try {
        const createGlobe = (await import("cobe")).default;
        
        // Define onResize function and store it in a ref so we can access it in cleanup
        onResizeRef.current = throttle(() => {
          if (canvasRef.current) {
            width = canvasRef.current.offsetWidth;
            if (globeInstanceRef.current) {
              // Update existing globe dimensions if already created
              if (globeInstanceRef.current.resize) {
                globeInstanceRef.current.resize(width * 2, width * 2);
              }
            }
          }
        }, 100); // Less frequent resize handling

        window.addEventListener("resize", onResizeRef.current);
        onResizeRef.current();

        // Restored original configuration but with performance improvements
        const GLOBE_CONFIG = {
          width: width * 2,
          height: width * 2,
          onRender: (state) => {
            // Only update phi if not interacting
            if (!pointerInteracting.current) phi += 0.005;
            state.phi = phi + rs.get();
            state.width = width * 2;
            state.height = width * 2;
          },
          devicePixelRatio: 2,
          phi: 0,
          theta: 0.3,
          dark: 0,
          diffuse: 0.4,
          mapSamples: 10000, // Restored original value
          mapBrightness: 1.2,
          baseColor: [1, 1, 1],
          markerColor: [0.4, 0.4, 0.9],
          glowColor: [1, 1, 1],
          markers: [
            { location: [14.5995, 120.9842], size: 0.03 },
            { location: [19.076, 72.8777], size: 0.1 },
            { location: [23.8103, 90.4125], size: 0.05 },
            { location: [30.0444, 31.2357], size: 0.07 },
            { location: [39.9042, 116.4074], size: 0.08 },

          ],
        };

        // Store the globe instance for cleanup
        globeInstanceRef.current = createGlobe(canvasRef.current, GLOBE_CONFIG);

        // Fade in the globe
        if (canvasRef.current) {
          setTimeout(() => {
            canvasRef.current.style.opacity = "1";
          }, 100);
        }
      } catch (error) {
        console.error("Failed to initialize globe:", error);
      }
    };

    // Only initialize if component is visible in viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !globeInstanceRef.current) {
          initGlobe();
        }
      });
    }, { threshold: 0.1 });

    if (canvasRef.current) {
      observer.observe(canvasRef.current);
    }
    
    return () => {
      // Clean up all resources
      if (onResizeRef.current) {
        window.removeEventListener("resize", onResizeRef.current);
      }
      if (globeInstanceRef.current) {
        globeInstanceRef.current.destroy();
        globeInstanceRef.current = null;
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (canvasRef.current) {
        observer.unobserve(canvasRef.current);
      }
      observer.disconnect();
    };
  }, [rs]);

  return (
    <div
      className={`absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[600px] ${className || ""}`}
    >
      <canvas
        className="w-full h-full opacity-0 transition-opacity duration-500"
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX;
          updatePointerInteraction(e.clientX);
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  );
} 