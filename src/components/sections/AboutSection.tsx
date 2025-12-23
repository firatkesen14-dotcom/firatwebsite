import { useEffect, useRef, useState } from "react";

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  // 🔹 Scroll her zaman aktif (mouse tekeri dahil)
  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // section ekrana girdikçe 0 → 1
      const progress =
        1 - Math.min(Math.max(rect.top / windowHeight, 0), 1);

      setScrollProgress(progress);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 🔹 Mouse hareketi (sadece hover)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();

    setMouse({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    });
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-32 border-t border-border/50"
    >
      <div className="container-narrow grid lg:grid-cols-5 gap-16">

        {/* IMAGE */}
        <div
          className="lg:col-span-2 relative aspect-[3/4] overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Depth map – GÖRÜNMEZ */}
          <img
            src="/profile-depth.png"
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none"
          />

          {/* MAIN IMAGE */}
          <img
            ref={imageRef}
            src="/profile.jpg"
            alt="Portrait"
            className="w-full h-full object-cover will-change-transform"
            style={{
              transform: `
                translateX(${(hovered ? mouse.x : 0) * 20}px)
                translateY(${(hovered ? mouse.y : 0) * 20 + scrollProgress * 30}px)
                scale(${1 + scrollProgress * 0.03})
              `,
              transition: hovered
                ? "transform 0.12s ease-out"
                : "transform 0.4s ease-out",
            }}
          />
        </div>

        {/* TEXT */}
        <div className="lg:col-span-3 space-y-8">
          <p className="text-lg md:text-xl leading-relaxed">
            Fırat Kesen is an industrial designer educated at Middle East Technical
            University (METU). His design practice focuses on product, system, and
            spatial design, combining conceptual thinking with technical awareness.
          </p>

          <p className="leading-relaxed">
            His experience spans transportation, medical products, urban spaces,
            and consumer-oriented solutions, shaped by production-oriented
            environments and international collaboration.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
