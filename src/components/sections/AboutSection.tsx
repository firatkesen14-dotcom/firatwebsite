import { useEffect, useRef, useState } from "react";

const AboutSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [scrollY, setScrollY] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  // Scroll her zaman aktif
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mouse SADECE hover iken
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    setMouse({ x, y });
  };

  // Scroll → derinlik
  const scrollDepth = Math.min(scrollY / 300, 1);

  return (
    <section id="about" className="py-32 border-t border-border/50">
      <div className="container-narrow grid lg:grid-cols-5 gap-16">
        
        {/* ===== IMAGE ===== */}
        <div
          ref={containerRef}
          className="lg:col-span-2 relative aspect-[3/4] overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{ perspective: "1400px" }}
        >
          {/* DEPTH LAYER */}
          <img
            src="/profile-depth.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{
              transform: `
                translateX(${(hovered ? mouse.x : 0) * 40}px)
                translateY(${(hovered ? mouse.y : 0) * 40 + scrollDepth * 30}px)
                scale(1.05)
              `,
              filter: "blur(2px)",
              opacity: 0.35,
              mixBlendMode: "overlay",
              transition: "transform 0.15s ease-out",
            }}
          />

          {/* MAIN IMAGE */}
          <img
            src="/profile.jpg"
            alt="Portrait"
            className="relative w-full h-full object-cover"
            style={{
              transform: `
                rotateZ(20deg)
                translateX(${(hovered ? mouse.x : 0) * 20}px)
                translateY(${(hovered ? mouse.y : 0) * 20 + scrollDepth * 15}px)
              `,
              transition: "transform 0.15s ease-out",
            }}
          />
        </div>

        {/* ===== TEXT ===== */}
        <div className="lg:col-span-3 space-y-8">
          <p className="text-lg md:text-xl leading-relaxed">
            Fırat Kesen is an industrial designer educated at Middle East Technical 
            University (METU). His practice focuses on product, system, and spatial 
            design, combining conceptual thinking with technical awareness.
          </p>

          <p className="leading-relaxed">
            His project experience spans transportation, medical products, urban 
            spaces, and consumer-oriented solutions, shaped by production-oriented 
            environments and international collaboration.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
