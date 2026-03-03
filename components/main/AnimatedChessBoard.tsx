"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

/* ── piece unicode characters ──────────────────────────────── */
const P: Record<string, string> = {
  wK: "♔", wQ: "♕", wR: "♖", wB: "♗", wN: "♘", wP: "♙",
  bK: "♚", bQ: "♛", bR: "♜", bB: "♝", bN: "♞", bP: "♟",
};

/* ── square colours (solid for 3‑D realism) ────────────────── */
const SQ = {
  light: "#f0dbb5",
  dark: "#b58863",
  hlToLight: "#f6e36b",
  hlToDark: "#d4a72c",
  hlFromLight: "#f2e0a0",
  hlFromDark: "#cda642",
};

interface Piece {
  id: string;
  type: string;
  row: number;
  col: number;
}

function createPieces(): Piece[] {
  const layout: (string | null)[][] = [
    ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
    ["bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP"],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"],
    ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"],
  ];
  const pieces: Piece[] = [];
  layout.forEach((row, r) =>
    row.forEach((type, c) => {
      if (type) pieces.push({ id: `${r}-${c}`, type, row: r, col: c });
    })
  );
  return pieces;
}

/* ── Italian Game opening with Bg5 exchange (16 half‑moves) ── */
const MOVES: [number, number, number, number][] = [
  [6, 4, 4, 4], // 1.  e4
  [1, 4, 3, 4], // 1…  e5
  [7, 6, 5, 5], // 2.  Nf3
  [0, 1, 2, 2], // 2…  Nc6
  [7, 5, 4, 2], // 3.  Bc4
  [0, 5, 3, 2], // 3…  Bc5
  [6, 3, 5, 3], // 4.  d3
  [1, 3, 2, 3], // 4…  d6
  [7, 1, 5, 2], // 5.  Nc3
  [0, 6, 2, 5], // 5…  Nf6
  [7, 2, 3, 6], // 6.  Bg5
  [1, 7, 2, 7], // 6…  h6
  [3, 6, 2, 5], // 7.  Bxf6  (captures bN)
  [0, 3, 2, 5], // 7…  Qxf6  (captures wB)
  [5, 2, 3, 3], // 8.  Nd5
  [2, 5, 2, 3], // 8…  Qd6
];

/* ── helper: pick square colour ────────────────────────────── */
function sqColor(
  r: number,
  c: number,
  lastMove: [number, number, number, number] | null,
) {
  const dark = (r + c) % 2 === 1;
  const isTo = lastMove && lastMove[2] === r && lastMove[3] === c;
  const isFrom = lastMove && lastMove[0] === r && lastMove[1] === c;
  if (isTo) return dark ? SQ.hlToDark : SQ.hlToLight;
  if (isFrom) return dark ? SQ.hlFromDark : SQ.hlFromLight;
  return dark ? SQ.dark : SQ.light;
}

/* ── component ─────────────────────────────────────────────── */
export default function AnimatedChessBoard({
  className,
}: {
  className?: string;
}) {
  const [pieces, setPieces] = useState<Piece[]>(createPieces);
  const [step, setStep] = useState(-1);
  const [lastMove, setLastMove] = useState<
    [number, number, number, number] | null
  >(null);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const delay =
      step === -1 ? 1200 : step >= MOVES.length ? 3000 : 1600;

    const timer = setTimeout(() => {
      if (step === -1) {
        setStep(0);
      } else if (step < MOVES.length) {
        const move = MOVES[step];
        const [fr, fc, tr, tc] = move;
        setPieces((prev) =>
          prev
            .filter((p) => !(p.row === tr && p.col === tc))
            .map((p) =>
              p.row === fr && p.col === fc
                ? { ...p, row: tr, col: tc }
                : p
            )
        );
        setLastMove(move);
        setStep((s) => s + 1);
      } else {
        setFading(true);
        setTimeout(() => {
          setPieces(createPieces());
          setLastMove(null);
          setStep(-1);
          setTimeout(() => setFading(false), 80);
        }, 600);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [step]);

  const CELL = 12.5;

  /* thick‑edge height (px) — keeps ratio stable across screens */
  const EDGE = 14;

  return (
    <div className={className}>
      {/* ── perspective wrapper ─────────────────────────────── */}
      <div
        className="flex items-center justify-center"
        style={{ perspective: "1100px" }}
      >
        <div
          className={`relative w-full transition-opacity duration-500 ${
            fading ? "opacity-0" : "opacity-100"
          }`}
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateX(28deg) rotateZ(-2deg)",
          }}
        >
          {/* ── ground shadow ──────────────────────────────── */}
          <div
            className="absolute inset-[-4%] rounded-3xl pointer-events-none"
            style={{
              transform: `translateZ(-${EDGE + 6}px)`,
              boxShadow:
                "0 60px 100px -30px rgba(0,0,0,0.28), 0 30px 50px -15px rgba(181,136,99,0.18)",
            }}
          />

          {/* ── board frame (wooden surround) ──────────────── */}
          <div
            className="relative aspect-square w-full rounded-xl"
            style={{
              transformStyle: "preserve-3d",
              background:
                "linear-gradient(145deg, #c9a84c 0%, #a68838 50%, #8b7230 100%)",
              padding: "3.8%",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.25)",
            }}
          >
            {/* ─ frame bottom edge (thickness) ─────────────── */}
            <div
              className="pointer-events-none"
              style={{
                position: "absolute",
                bottom: 0,
                left: "2%",
                right: "2%",
                height: `${EDGE}px`,
                background:
                  "linear-gradient(to bottom, #8b7230, #6b5520)",
                borderRadius: "0 0 6px 6px",
                transform: "rotateX(-90deg)",
                transformOrigin: "bottom center",
              }}
            />
            {/* ─ frame right edge (thickness) ──────────────── */}
            <div
              className="pointer-events-none"
              style={{
                position: "absolute",
                top: "2%",
                right: 0,
                bottom: "2%",
                width: `${EDGE}px`,
                background:
                  "linear-gradient(to right, #8b7230, #6b5520)",
                borderRadius: "0 6px 6px 0",
                transform: "rotateY(90deg)",
                transformOrigin: "right center",
              }}
            />

            {/* ─ file labels a–h (bottom of frame) ─────────── */}
            <div className="absolute bottom-[0.3%] left-[3.8%] right-[3.8%] flex pointer-events-none z-10">
              {["a", "b", "c", "d", "e", "f", "g", "h"].map((f) => (
                <span
                  key={f}
                  className="flex-1 text-center text-[7px] sm:text-[8px] font-bold text-white/40 select-none"
                >
                  {f}
                </span>
              ))}
            </div>
            {/* ─ rank labels 1–8 (left of frame) ──────────── */}
            <div className="absolute top-[3.8%] bottom-[3.8%] left-[0.4%] flex flex-col pointer-events-none z-10">
              {[8, 7, 6, 5, 4, 3, 2, 1].map((n) => (
                <span
                  key={n}
                  className="flex-1 flex items-center text-[7px] sm:text-[8px] font-bold text-white/40 select-none"
                >
                  {n}
                </span>
              ))}
            </div>

            {/* ── board surface ─────────────────────────────── */}
            <div
              className="relative w-full h-full rounded-sm overflow-hidden"
              style={{
                transformStyle: "preserve-3d",
                boxShadow:
                  "inset 0 2px 6px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.12)",
              }}
            >
              {/* ── squares ────────────────────────────────── */}
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
                {Array.from({ length: 64 }).map((_, i) => {
                  const r = Math.floor(i / 8);
                  const c = i % 8;
                  return (
                    <div
                      key={i}
                      className="transition-colors duration-500"
                      style={{
                        backgroundColor: sqColor(r, c, lastMove),
                      }}
                    />
                  );
                })}
              </div>

              {/* ── pieces (elevated above surface) ────────── */}
              {pieces.map((p) => (
                <motion.div
                  key={p.id}
                  initial={false}
                  animate={{
                    top: `${p.row * CELL}%`,
                    left: `${p.col * CELL}%`,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 180,
                    damping: 24,
                    mass: 0.8,
                  }}
                  className="absolute w-[12.5%] h-[12.5%] flex items-center justify-center pointer-events-none"
                  style={{ transform: "translateZ(5px)" }}
                >
                  <span
                    className="leading-none select-none"
                    style={{
                      fontSize: "clamp(1rem, 3.2vw, 2.2rem)",
                      filter: p.type.startsWith("w")
                        ? "drop-shadow(0 4px 5px rgba(0,0,0,0.45)) drop-shadow(0 1px 2px rgba(0,0,0,0.3))"
                        : "drop-shadow(0 4px 5px rgba(0,0,0,0.25)) drop-shadow(0 1px 2px rgba(0,0,0,0.15))",
                    }}
                  >
                    {P[p.type]}
                  </span>
                </motion.div>
              ))}

              {/* ── surface light reflection ───────────────── */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 45%, rgba(0,0,0,0.04) 100%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
