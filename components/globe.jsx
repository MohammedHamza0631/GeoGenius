"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useSpring } from "framer-motion";

const MOVEMENT_DAMPING = 1400;

export function Globe({
  className,
}) {
  let phi = 0;
  let width = 0;
  const canvasRef = useRef(null);
  const pointerInteracting = useRef(null);
  const pointerInteractionMovement = useRef(0);

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

  const updateMovement = (clientX) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      r.set(r.get() + delta / MOVEMENT_DAMPING);
    }
  };

  useEffect(() => {
    // Dynamically import cobe to avoid SSR issues
    const initGlobe = async () => {
      const createGlobe = (await import("cobe")).default;
      
      const onResize = () => {
        if (canvasRef.current) {
          width = canvasRef.current.offsetWidth;
        }
      };

      window.addEventListener("resize", onResize);
      onResize();

      const GLOBE_CONFIG = {
        width: width * 2,
        height: width * 2,
        onRender: (state) => {
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
        mapSamples: 16000,
        mapBrightness: 1.2,
        baseColor: [1, 1, 1],
        markerColor: [0.4, 0.4, 0.9],
        glowColor: [1, 1, 1],
        markers: [
          { location: [51.5074, -0.1278], size: 0.05 }, // London
          { location: [48.8566, 2.3522], size: 0.05 },  // Paris
          { location: [40.7128, -74.0060], size: 0.05 }, // New York
          { location: [35.6762, 139.6503], size: 0.05 }, // Tokyo
          { location: [55.7558, 37.6173], size: 0.05 },  // Moscow
          { location: [-33.8688, 151.2093], size: 0.05 }, // Sydney
          { location: [19.4326, -99.1332], size: 0.05 },  // Mexico City
          { location: [-22.9068, -43.1729], size: 0.05 },  // Rio de Janeiro
          { location: [37.7749, -122.4194], size: 0.05 },  // San Francisco
          { location: [41.9028, 12.4964], size: 0.05 },    // Rome
        ],
      };

      const globe = createGlobe(canvasRef.current, GLOBE_CONFIG);

      setTimeout(() => {
        if (canvasRef.current) {
          canvasRef.current.style.opacity = "1";
        }
      }, 0);
      
      return () => {
        globe.destroy();
        window.removeEventListener("resize", onResize);
      };
    };

    initGlobe();
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