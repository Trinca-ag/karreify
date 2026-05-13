"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "scale" | "fade";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

const initialStyles: Record<Direction, string> = {
  up: "opacity-0 translate-y-12",
  down: "opacity-0 -translate-y-12",
  left: "opacity-0 -translate-x-16",
  right: "opacity-0 translate-x-16",
  scale: "opacity-0 scale-90",
  fade: "opacity-0",
};

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 800,
  threshold = 0.15,
  once = true,
  className = "",
  as: Tag = "div",
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -80px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, once]);

  const TagComponent = Tag as React.ElementType;

  return (
    <TagComponent
      ref={ref as React.RefObject<HTMLElement>}
      className={`${className} transition-all ease-out will-change-transform ${
        visible ? "opacity-100 translate-x-0 translate-y-0 scale-100" : initialStyles[direction]
      }`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </TagComponent>
  );
}
