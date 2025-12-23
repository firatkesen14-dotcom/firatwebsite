import { useEffect, useRef } from "react";

const AboutSection = () => {
  const imageRef = useRef<HTMLImageElement | null>(null);

  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const scrollOffset = useRef(0);
  const isHovering = useRef(false);

  useEffect(() => {
    const img = imageRef.current;
    if (!img) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovering.current) return;

      const rect = img.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      mouseX.current = x * 22;
      mouseY.current = y * 22;
    };

    const handleScroll = () => {
      scrollOffset.current = window.scrollY * 0.03;
    };

    const animate = () => {
      img.style.setProperty("--mx", `${mouseX.current}px`);
      img.style.setProperty(
        "--my",
        `${mouseY.current + scrollOffset.current}px`
      );
      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
