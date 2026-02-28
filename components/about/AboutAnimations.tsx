"use client";

import { useEffect } from "react";

/**
 * Client-side scroll-triggered animation effects for the About page.
 * Adds smooth parallax and reveal effects via Intersection Observer.
 */
export default function AboutAnimations() {
  useEffect(() => {
    // Add smooth parallax to elements with data-parallax attribute
    const handleScroll = () => {
      const parallaxEls = document.querySelectorAll("[data-parallax]");
      parallaxEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const speed = parseFloat(el.getAttribute("data-parallax") || "0.1");
        const yOffset = (rect.top - window.innerHeight / 2) * speed;
        (el as HTMLElement).style.transform = `translateY(${yOffset}px)`;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return null; // No visual output — just side effects
}
