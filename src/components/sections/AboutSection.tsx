import { useRef, useEffect } from "react";

const AboutSection = () => {
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  let mouseRotateX = 0;
  let mouseRotateY = 0;

  const applyTransform = () => {
    if (!imageRef.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Scroll progress (0–1)
    const scrollProgress = Math.min(
      Math.max(1 - rect.top / windowHeight, 0),
      1
    );

    const scrollRotateX = scrollProgress * 4;
    const scrollTranslateY = scrollProgress * -18;
    const scrollTranslateZ = scrollProgress * 22;

    imageRef.current.style.transform = `
      perspective(1100px)
      rotateZ(4deg)
      rotateX(${mouseRotateX + scrollRotateX}deg)
      rotateY(${mouseRotateY}deg)
      translateY(${scrollTranslateY}px)
      translateZ(${scrollTranslateZ}px)
    `;
  };

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    mouseRotateX = ((y - centerY) / centerY) * 6;
    mouseRotateY = ((x - centerX) / centerX) * -6;

    applyTransform();
  };

  const handleMouseLeave = () => {
    mouseRotateX = 0;
    mouseRotateY = 0;
    applyTransform();
  };

  useEffect(() => {
    window.addEventListener("scroll", applyTransform);
    applyTransform();

    return () => {
      window.removeEventListener("scroll", applyTransform);
    };
  }, []);

  return (
    <section
      id="about"
      className="py-24 md:py-32 border-t border-border/50"
    >
      <div className="container-narrow">
        {/* Section Header */}
        <header className="mb-16 md:mb-24">
          <h2 className="text-4xl md:text-5xl font-light text-foreground tracking-tight">
            About
          </h2>
        </header>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Profile Image */}
          <div className="lg:col-span-2">
            <div
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="aspect-[3/4] bg-surface-elevated rounded-sm overflow-hidden"
              style={{
                perspective: "1100px",
              }}
            >
              <img
                ref={imageRef}
                src="/profile.png"
                alt="Fırat Kesen portrait"
                className="w-full h-full object-cover"
                style={{
                  transition: "transform 0.25s ease-out",
                  willChange: "transform",
                }}
              />
            </div>
          </div>

          {/* Bio Content */}
          <div className="lg:col-span-3 space-y-8">
            <p className="text-lg md:text-xl text-secondary-foreground leading-relaxed">
              Fırat Kesen is an industrial designer educated at Middle East Technical
              University (METU). His design practice focuses on product, system, and
              spatial design, combining conceptual thinking with technical awareness.
              His project experience spans transportation design, medical products,
              urban spaces, and consumer-oriented solutions.
            </p>

            <p className="text-secondary-foreground leading-relaxed">
              Throughout his education and professional experience, he worked in
              production-oriented environments ranging from manufacturing facilities
              and energy companies to a design studio, gaining hands-on experience
              with real-world constraints, workflows, and interdisciplinary
              collaboration. His recent international work experience in the United
              States further strengthened his adaptability, communication skills, and
              global design perspective.
            </p>

            <div className="section-divider my-8" />

            {/* Focus Areas & Experience */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm text-muted-foreground tracking-wider uppercase mb-3">
                  Focus Areas
                </h3>
                <ul className="space-y-2 text-secondary-foreground">
                  <li>Product Design</li>
                  <li>System Design</li>
                  <li>Spatial Design</li>
                  <li>Transportation</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm text-muted-foreground tracking-wider uppercase mb-3">
                  Experience
                </h3>
                <ul className="space-y-2 text-secondary-foreground">
                  <li>Manufacturing</li>
                  <li>Design Studio</li>
                  <li>Energy Sector</li>
                  <li>International</li>
                </ul>
              </div>
            </div>

            {/* Education */}
            <div className="pt-4">
              <h3 className="text-sm text-muted-foreground tracking-wider uppercase mb-3">
                Education
              </h3>
              <p className="text-secondary-foreground">
                Middle East Technical University (METU)
                <br />
                <span className="text-muted-foreground">
                  Industrial Design
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
