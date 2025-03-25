"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { ArrowRightIcon, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";

const FloatingImage = ({
  src,
  alt,
  width,
  height,
  className,
  delay = 0,
  rotate = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
      }}
      className={cn("absolute shadow-xl rounded-lg overflow-hidden", className)}
    >
      <motion.div
        animate={{
          y: [0, 10, 0],
          rotate: [rotate, rotate + 2, rotate],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="object-cover rounded-lg"
          priority
        />
      </motion.div>
    </motion.div>
  );
};

const TextAnimation = ({ children, delay = 0, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const RotatingText = ({ words, className }) => {
  const [index, setIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [words.length]);
  
  return (
    <span className={cn("inline-block relative", className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className="inline-block text-white font-bold text-glow"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export function ModernLanding({
  title = "Explore World",
  subtitle = "Capitals",
  description = "Challenge yourself with our interactive quiz on capital cities from around the world. Choose your difficulty level and compete for a spot on the leaderboard!",
  primaryButtonText = "Start Quiz",
  primaryButtonLink = "/start",
  secondaryButtonText = "View Leaderboard",
  secondaryButtonLink = "/leaderboard",
  rotatingWords = ["educational", "challenging", "fun", "competitive"],
  badge = "Capital Cities Quiz",
}) {
  const words = title.split(" ");

  return (
    <HeroHighlight containerClassName="min-h-screen">
      {/* Floating images */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingImage
          src="https://images.unsplash.com/photo-1529655683826-aba9b3e77383?q=80&w=1000&auto=format&fit=crop"
          alt="London"
          width={400}
          height={300}
          rotate={-5}
          delay={0.3}
          className="left-[-5%] top-[15%] w-[200px] h-[150px] md:w-[300px] md:h-[200px] lg:w-[400px] lg:h-[300px]"
        />
        
        <FloatingImage
          src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop"
          alt="Paris"
          width={350}
          height={250}
          rotate={5}
          delay={0.5}
          className="right-[-5%] top-[20%] w-[180px] h-[120px] md:w-[250px] md:h-[180px] lg:w-[350px] lg:h-[250px]"
        />
        
        <FloatingImage
          src="https://images.unsplash.com/photo-1505761671935-60b3a7427bad?q=80&w=1000&auto=format&fit=crop"
          alt="New York"
          width={300}
          height={400}
          rotate={-3}
          delay={0.7}
          className="left-[10%] bottom-[10%] w-[150px] h-[200px] md:w-[200px] md:h-[300px] lg:w-[300px] lg:h-[400px]"
        />
        
        <FloatingImage
          src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop"
          alt="Tokyo"
          width={320}
          height={420}
          rotate={8}
          delay={0.9}
          className="right-[5%] bottom-[15%] w-[160px] h-[210px] md:w-[240px] md:h-[320px] lg:w-[320px] lg:h-[420px]"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-12 sm:py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <TextAnimation delay={0.2}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 dark:bg-black/50 border border-border mb-8 backdrop-blur-sm">
              <Circle className="h-2 w-2 fill-primary text-primary" />
              <span className="text-sm text-neutral-700 dark:text-slate-200 tracking-wide font-medium">
                {badge}
              </span>
            </div>
          </TextAnimation>

          {/* Content container with backdrop blur for better visibility */}
          <div className="p-6 backdrop-blur-sm bg-white/60 dark:bg-black/60 rounded-2xl">
            {/* Heading with letter animation */}
            <div className="mb-8">
              {words.map((word, wordIndex) => (
                <span
                  key={wordIndex}
                  className="inline-block mr-4 last:mr-0"
                >
                  {word.split("").map((letter, letterIndex) => (
                    <motion.span
                      key={`${wordIndex}-${letterIndex}`}
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay:
                          wordIndex * 0.1 +
                          letterIndex * 0.03,
                        type: "spring",
                        stiffness: 150,
                        damping: 25,
                      }}
                      className="inline-block text-transparent bg-clip-text 
                      bg-gradient-to-r from-blue-600 to-indigo-600 
                      text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>
              ))}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500 text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mt-2">
                {subtitle}
              </span>
            </div>

            {/* Rotating words */}
            <TextAnimation delay={0.6} className="text-2xl sm:text-3xl md:text-4xl font-medium mb-6">
              <div className="relative z-10 py-4 px-8 rounded-2xl backdrop-blur-sm inline-block transform hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-600/90 rounded-2xl -z-10 bg-pulse"
                  style={{ boxShadow: "0 0 25px rgba(59,130,246,0.6)" }}
                ></div>
                <span className="text-white font-semibold tracking-wide">
                  A quiz that&apos;s{" "}
                  <RotatingText 
                    words={rotatingWords} 
                    className="text-white font-extrabold relative"
                  />
                </span>
              </div>
            </TextAnimation>

            {/* Description */}
            <TextAnimation delay={0.8}>
              <p className="text-base sm:text-lg md:text-xl text-neutral-800 dark:text-slate-200 mb-8 max-w-2xl mx-auto font-medium">
                {description}
              </p>
            </TextAnimation>

            {/* Buttons */}
            <TextAnimation delay={1.0}>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href={primaryButtonLink}>
                  <div className="inline-block group relative bg-gradient-to-b from-blue-600/90 to-indigo-600/90 p-px rounded-full backdrop-blur-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <motion.button
                      className="rounded-full px-8 py-3 text-lg font-semibold backdrop-blur-md 
                      bg-primary text-primary-foreground transition-all duration-300 
                      group-hover:-translate-y-0.5"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="opacity-90 group-hover:opacity-100 transition-opacity">
                        {primaryButtonText}
                      </span>
                      <span className="ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-300">
                        →
                      </span>
                    </motion.button>
                  </div>
                </Link>
                <Link href={secondaryButtonLink}>
                  <motion.button
                    className="bg-background border border-border text-foreground px-6 py-3 rounded-full font-medium text-base sm:text-lg flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {secondaryButtonText}
                    <ArrowRightIcon className="h-4 w-4" />
                  </motion.button>
                </Link>
              </div>
            </TextAnimation>
          </div>
        </div>
      </div>
    </HeroHighlight>
  );
} 