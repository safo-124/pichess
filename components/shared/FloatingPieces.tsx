"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface Piece {
  char: string;
  top: string;
  left: string;
  size: string;
  speed: number;
  delay: number;
  opacity: number;
}

const pieces: Piece[] = [
  { char: "♔", top: "15%", left: "5%",  size: "text-3xl sm:text-5xl", speed: -80,  delay: 0,   opacity: 0.04 },
  { char: "♕", top: "35%", left: "92%", size: "text-2xl sm:text-4xl", speed: -120, delay: 0.5, opacity: 0.035 },
  { char: "♖", top: "58%", left: "8%",  size: "text-xl sm:text-3xl",  speed: -60,  delay: 1,   opacity: 0.03 },
  { char: "♗", top: "72%", left: "88%", size: "text-2xl sm:text-4xl", speed: -100, delay: 1.5, opacity: 0.04 },
  { char: "♘", top: "25%", left: "85%", size: "text-xl sm:text-3xl",  speed: -90,  delay: 0.8, opacity: 0.035 },
  { char: "♙", top: "48%", left: "3%",  size: "text-lg sm:text-2xl",  speed: -50,  delay: 0.3, opacity: 0.03 },
  { char: "♚", top: "85%", left: "15%", size: "text-2xl sm:text-3xl", speed: -70,  delay: 1.2, opacity: 0.035 },
  { char: "♛", top: "10%", left: "50%", size: "text-xl sm:text-2xl",  speed: -110, delay: 0.6, opacity: 0.03 },
];

/**
 * Decorative chess pieces scattered across the page that move with parallax
 * as user scrolls. Each piece moves at a different speed for depth illusion.
 */
export default function FloatingPieces() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll();

  return (
    <div
      ref={ref}
      className="fixed inset-0 pointer-events-none z-[1] overflow-hidden"
      aria-hidden="true"
    >
      {pieces.map((p, i) => (
        <ParallaxPiece key={i} piece={p} progress={scrollYProgress} />
      ))}
    </div>
  );
}

function ParallaxPiece({
  piece,
  progress,
}: {
  piece: Piece;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const y = useTransform(progress, [0, 1], [0, piece.speed]);
  const rotate = useTransform(progress, [0, 1], [0, piece.speed * 0.3]);

  return (
    <motion.span
      className={`absolute ${piece.size} text-black select-none`}
      style={{
        top: piece.top,
        left: piece.left,
        y,
        rotate,
        opacity: piece.opacity,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: piece.opacity }}
      transition={{ duration: 2, delay: piece.delay }}
    >
      {piece.char}
    </motion.span>
  );
}
