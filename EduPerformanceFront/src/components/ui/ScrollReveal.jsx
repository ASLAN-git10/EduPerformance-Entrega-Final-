import { useEffect, useRef, useState } from "react";

export default function ScrollReveal({ children, delay = 0, duration = 600, threshold = 0.1 }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(entry.target); // Trigger once
        }
      },
      { threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [threshold]);

  return (
    <div
      ref={elementRef}
      style={{
        opacity: isRevealed ? 1 : 0,
        transform: isRevealed ? "translateY(0)" : "translateY(30px)",
        transition: `opacity ${duration}ms cubic-bezier(0.215, 0.61, 0.355, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.215, 0.61, 0.355, 1) ${delay}ms`
      }}
    >
      {children}
    </div>
  );
}
