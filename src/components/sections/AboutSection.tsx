import { useEffect, useRef } from "react";

const AboutSection = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const scrollY = useRef(0);
  const hovering = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMouseMove = (e: MouseEvent) => {
      if (!hovering.current) return;

      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      mouseX.current = x * 40;
      mouseY.current = y * 40;
    };

    const onScroll = () => {
      scrollY.current = window.scrollY * 0.08;
    };

    const animate = () => {
      const x = mouseX.current;
      const y = mouseY.current + scrollY.current;

      el.style.backgroundPosition = `
        calc(50% + ${x}px)
        calc(50% + ${y}px)
      `;

      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("scroll", onScroll);
    animate();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section
      id="about"
      className="py-24 md:py-32 border-t border-border/50"
    >
      <div className="container-narrow">
        <header className="mb-16 md:mb-24">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight">
            About
          </h2>
        </header>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Portrait */}
          <div className="lg:col-span-2">
            <div
              className="aspect-[3/4] rounded-sm overflow-hidden"
              onMouseEnter={() => (hovering.current = true)}
              onMouseLeave={() => {
                hovering.current = false;
                mouseX.current = 0;
                mouseY.current = 0;
              }}
            >
              <div
                ref={containerRef}
                className="w-full h-full depth-photo"
              />
            </div>
          </div>

          {/* Text */}
          <div className="lg:col-span-3 space-y-8">
            <p className="text-lg md:text-xl leading-relaxed">
              Fırat Kesen is an industrial designer educated at Middle East
              Technical University (METU). His design practice focuses on product,
              system, and spatial design, combining conceptual thinking with
              technical awareness.
            </p>

            <p className="leading-relaxed">
              His project experience spans transportation design, medical
              products, urban spaces, and consumer-oriented solutions, shaped by
              production-oriented environments and international collaboration.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
