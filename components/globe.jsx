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
  // Convert variables to refs to fix linter warnings
  const phiRef = useRef(0);
  const widthRef = useRef(0);
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
    // Store these in local variables for cleanup - fixes the linter warnings
    let localAnimationFrameId = null;
    const canvasRefValue = canvasRef.current;
    
    // Dynamically import cobe to avoid SSR issues
    const initGlobe = async () => {
      try {
        const createGlobe = (await import("cobe")).default;
        
        // Define onResize function and store it in a ref so we can access it in cleanup
        onResizeRef.current = throttle(() => {
          if (canvasRef.current) {
            widthRef.current = canvasRef.current.offsetWidth;
            if (globeInstanceRef.current) {
              // Update existing globe dimensions if already created
              if (globeInstanceRef.current.resize) {
                globeInstanceRef.current.resize(widthRef.current * 2, widthRef.current * 2);
              }
            }
          }
        }, 100); // Less frequent resize handling

        window.addEventListener("resize", onResizeRef.current);
        onResizeRef.current();

        // Restored original configuration but with performance improvements
        const GLOBE_CONFIG = {
          width: widthRef.current * 2,
          height: widthRef.current * 2,
          onRender: (state) => {
            // Only update phi if not interacting
            if (!pointerInteracting.current) phiRef.current += 0.005;
            state.phi = phiRef.current + rs.get();
            state.width = widthRef.current * 2;
            state.height = widthRef.current * 2;
          },
          devicePixelRatio: 2,
          phi: 0,
          theta: 0.3,
          dark: 0,
          diffuse: 0.4,
          mapSamples: 16000, // Restored original value
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
            { location: [-23.5505, -46.6333], size: 0.1 },
            { location: [19.4326, -99.1332], size: 0.1 },
            { location: [40.7128, -74.006], size: 0.1 },
            { location: [34.6937, 135.5022], size: 0.05 },
            { location: [41.0082, 28.9784], size: 0.06 },
          ],
        };

        // Store the globe instance for cleanup
        globeInstanceRef.current = createGlobe(canvasRef.current, GLOBE_CONFIG);

        // Store animation frame ID in the local variable
        if (animationFrameId.current) {
          localAnimationFrameId = animationFrameId.current;
        }

        // Fade in the globe
        if (canvasRef.current) {
          setTimeout(() => {
            if (canvasRef.current) {
              canvasRef.current.style.opacity = "1";
            }
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

    if (canvasRefValue) {
      observer.observe(canvasRefValue);
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
      // Use the local variable instead of the ref directly
      if (localAnimationFrameId) {
        cancelAnimationFrame(localAnimationFrameId);
      }
      // Use the captured value rather than the ref's current value
      if (canvasRefValue) {
        observer.unobserve(canvasRefValue);
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