"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

interface Props {
  end: number;
  label: string;
  suffix?: string;
  prefix?: string;
  duration?: number;
  color?: "gold" | "green" | "white";
}

export default function StatsCounter({
  end,
  label,
  suffix = "",
  prefix = "",
  duration = 2,
  color = "white",
}: Props) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const spring = useSpring(count, { duration: duration * 1000, bounce: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) spring.set(end); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, spring]);

  const colorMap = {
    gold:  "text-[#c9a84c]",
    green: "text-[#2e7d5b]",
    white: "text-white",
  };

  return (
    <div ref={ref} className="text-center">
      <div className={`text-5xl font-black tracking-tight ${colorMap[color]}`}>
        {prefix}
        <motion.span>{rounded}</motion.span>
        {suffix}
      </div>
      <p className="mt-1 text-sm font-medium text-white/60 uppercase tracking-widest">
        {label}
      </p>
    </div>
  );
}
