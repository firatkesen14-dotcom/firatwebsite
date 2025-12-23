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
          {/* Portrait */}
          <div className="lg:col-span-2">
            <div
              className="aspect-[3/4] rounded-sm overflow-hidden"
              style={{ perspective: "1200px" }}
              onMouseEnter={() => (isHovering.current = true)}
              onMouseLeave={() => {
                isHovering.current = false;
                mouseX.current = 0;
                mouseY.current = 0;
              }}
            >
              <div className="depth-wrapper">
                <img
                  ref={imageRef}
                  src="/profile.png"
                  alt="Portrait of Fırat Kesen"
                  className="depth-image"
                />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-3 space-y-8">
            <p className="text-lg md:text-xl text-secondary-foreground leading-relaxed">
              Fırat Kesen is an industrial designer educated at Middle East
              Technical University (METU). His design practice focuses on product,
              system, and spatial design, combining conceptual thinking with
              technical awareness. His project experience spans transportation
              design, medical products, urban spaces, and consumer-oriented
              solutions.
            </p>

            <p className="text-secondary-foreground leading-relaxed">
              Throughout his education and professional experience, he worked in
              production-oriented environments ranging from manufacturing
              facilities and energy companies to a design studio, gaining
              hands-on experience with real-world constraints, workflows, and
              interdisciplinary collaboration. His recent international work
              experience in the United States further strengthened his
              adaptability, communication skills, and global design perspective.
            </p>

            <div className="section-divider my-8" />

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
