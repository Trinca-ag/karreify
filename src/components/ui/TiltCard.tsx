"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
  glare?: boolean;
}

export default function TiltCard({
  children,
  className = "",
  intensity = 10,
  glare = true,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -intensity;
    const rotateY = ((x - centerX) / centerX) * intensity;

    card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

    if (glare && glareRef.current) {
      const percentX = (x / rect.width) * 100;
      const percentY = (y / rect.height) * 100;
      glareRef.current.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 50%)`;
      glareRef.current.style.opacity = "1";
    }
  }

  function handleMouseLeave() {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    if (glareRef.current) glareRef.current.style.opacity = "0";
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-transform duration-300 ease-out will-change-transform ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
      {glare && (
        <div
          ref={glareRef}
          aria-hidden
          className="absolute inset-0 rounded-[inherit] pointer-events-none opacity-0 transition-opacity duration-300"
        />
      )}
    </div>
  );
}
