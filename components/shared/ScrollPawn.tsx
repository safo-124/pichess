"use client";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface ScrollPawnProps {
  /** Accent color for the glow (default: gold #c9a84c) */
  color?: string;
  /** Whether pawn is on a light background (adjusts shadow style) */
  light?: boolean;
}

/**
 * A chess pawn that tracks the user's scroll position down the right side
 * of the page. Works on both desktop and mobile. Rotates and scales subtly
 * as you scroll, with a glowing trail effect behind it.
 */
export default function ScrollPawn({ color = "#c9a84c", light = false }: ScrollPawnProps) {
  const { scrollYProgress } = useScroll();

  // Smooth spring-based tracking
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.001,
  });

  // Pawn moves from top to bottom of viewport
  const y = useTransform(smoothProgress, [0, 1], ["10vh", "84vh"]);

  // Subtle rotation as you scroll
  const rotate = useTransform(smoothProgress, [0, 0.5, 1], [0, 15, -10]);

  // Scale pulse at middle of page
  const scale = useTransform(smoothProgress, [0, 0.3, 0.5, 0.7, 1], [0.9, 1, 1.15, 1, 0.9]);

  // Opacity — fade in after a tiny scroll, fade out near bottom
  const opacity = useTransform(smoothProgress, [0, 0.03, 0.9, 1], [0, 1, 1, 0.3]);

  // Glow intensity
  const glowOpacity = useTransform(smoothProgress, [0, 0.5, 1], [0.3, 0.7, 0.3]);

  // Trail length
  const trailHeight = useTransform(smoothProgress, [0, 1], ["0px", "40px"]);
  const trailOpacity = useTransform(smoothProgress, [0, 0.05, 0.9, 1], [0, 0.6, 0.6, 0]);

  return (
    <motion.div
      className="fixed right-3 sm:right-8 z-50 pointer-events-none select-none"
      style={{ top: y, opacity }}
      aria-hidden="true"
    >
      {/* Glow trail behind pawn */}
      <motion.div
        className="absolute -inset-3 rounded-full blur-xl"
        style={{
          opacity: glowOpacity,
          scale,
          backgroundColor: color,
        }}
      />

      {/* Pawn character — visible on all screen sizes */}
      <motion.div
        className="relative text-3xl sm:text-5xl"
        style={{
          rotate,
          scale,
          filter: light
            ? `drop-shadow(0 0 10px ${color}88) drop-shadow(0 2px 4px rgba(0,0,0,0.3))`
            : `drop-shadow(0 0 12px ${color}99)`,
        }}
      >
        ♟
      </motion.div>

      {/* Scroll progress dot trail */}
      <motion.div
        className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-1 rounded-full"
        style={{
          height: trailHeight,
          opacity: trailOpacity,
          background: `linear-gradient(to bottom, ${color}80, transparent)`,
        }}
      />
    </motion.div>
  );
}
