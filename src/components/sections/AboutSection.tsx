import { useEffect, useRef } from "react";

const AboutSection = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    const depth = new Image();

    img.src = "/profile.png";
    depth.src = "/profile-depth.png";

    let mouseX = 0;
    let mouseY = 0;
    let scrollY = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", resize);
    resize();

    window.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width - 0.5;
      mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    });

    window.addEventListener("scroll", () => {
      scrollY = window.scrollY * 0.0006;
    });

    Promise.all([
      new Promise((res) => (img.onload = res)),
      new Promise((res) => (depth.onload = res)),
    ]).then(() => {
      const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const strength = 40;
        const dx = (mouseX + scrollY) * strength;
        const dy = (mouseY + scrollY) * strength;

        ctx.drawImage(
          img,
          dx,
          dy,
          canvas.width - dx * 2,
          canvas.height - dy * 2
        );

        ctx.globalCompositeOperation = "destination-in";
        ctx.drawImage(depth, 0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = "source-over";

        requestAnimationFrame(render);
      };

      render();
    });

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section
      id="about"
      className="py-24 md:py-32 border-t border-border/50"
    >
      <div className="container-narrow">
        <header className="mb-16">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight">
            About
          </h2>
        </header>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          {/* Portrait with depth */}
          <div className="lg:col-span-2">
            <div className="aspect-[3/4] rounded-sm overflow-hidden bg-black">
              <canvas
                ref={canvasRef}
                className="w-full h-full block"
              />
            </div>
          </div>

          {/* Text */}
          <div className="lg:col-span-3 space-y-8">
            <p className="text-lg md:text-xl leading-relaxed">
              Fırat Kesen is an industrial designer educated at Middle East
              Technical University (METU). His work focuses on product, system,
              and spatial design, balancing conceptual depth with technical
              clarity.
            </p>

            <p className="leading-relaxed">
              His experience spans manufacturing, energy systems, and design
              studios, shaped further by international work experience in the
              United States.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-6">
              <div>
                <h3 className="text-sm uppercase tracking-wider opacity-60 mb-2">
                  Focus
                </h3>
                <ul className="space-y-1">
                  <li>Product Design</li>
                  <li>System Design</li>
                  <li>Spatial Design</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm uppercase tracking-wider opacity-60 mb-2">
                  Experience
                </h3>
                <ul className="space-y-1">
                  <li>Manufacturing</li>
                  <li>Design Studio</li>
                  <li>International</li>
                </ul>
              </div>
            </div>

            <div className="pt-4">
              <h3 className="text-sm uppercase tracking-wider opacity-60 mb-2">
                Education
              </h3>
              <p>
                Middle East Technical University<br />
                <span className="opacity-60">Industrial Design</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
