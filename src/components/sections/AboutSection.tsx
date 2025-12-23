import { useEffect, useRef } from "react";

const AboutSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const photo = photoRef.current;
    if (!container || !photo) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentScroll = window.scrollY;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width - 0.5;
      mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    };

    const onScroll = () => {
      currentScroll = window.scrollY;
    };

    const animate = () => {
      const scrollEffect = currentScroll * 0.025;

      const x1 = 50 + mouseX * 10;
      const y1 = 50 + mouseY * 10 + scrollEffect;

      const x2 = 50 + mouseX * 22;
      const y2 = 50 + mouseY * 22 + scrollEffect * 1.4;

      photo.style.backgroundPosition = `
        ${x1}% ${y1}%,
        ${x2}% ${y2}%
      `;

      requestAnimationFrame(animate);
    };

    container.addEventListener("mousemove", onMouseMove);
    window.addEventListener("scroll", onScroll);

    animate();

    return () => {
      container.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section id="about" className="py-24 md:py-32 border-t border-border/50">
      <div className="container-narrow">
        <header className="mb-16 md:mb-24">
          <h2 className="text-4xl md:text-5xl font-light text-foreground tracking-tight">
            About
          </h2>
        </header>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* PHOTO */}
          <div className="lg:col-span-2">
            <div
              ref={containerRef}
              className="aspect-[3/4] rounded-sm overflow-hidden bg-surface-elevated"
            >
              <div
                ref={photoRef}
                className="depth-photo w-full h-full"
              />
            </div>
          </div>

          {/* TEXT */}
          <div className="lg:col-span-3 space-y-8">
            <p className="text-lg md:text-xl text-secondary-foreground leading-relaxed">
              Fırat Kesen is an industrial designer educated at Middle East Technical
              University (METU). His design practice focuses on product, system, and
              spatial design, combining conceptual thinking with technical awareness.
            </p>

            <p className="text-secondary-foreground leading-relaxed">
              He has worked across manufacturing, design studios, and international
              environments, developing solutions that balance concept, engineering,
              and real-world constraints.
            </p>

            <div className="section-divider my-8" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
