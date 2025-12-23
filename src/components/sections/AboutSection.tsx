import DepthParallaxImage from '@/components/DepthParallaxImage';

const AboutSection = () => {
  return (
    <section id="about" className="py-24 md:py-32 border-t border-border/50">
      <div className="container-narrow">
        {/* Section Header */}
        <header className="mb-16 md:mb-24">
          <h2 className="text-4xl md:text-5xl font-light text-foreground tracking-tight">
            About
          </h2>
        </header>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Profile Photo with 3D Depth Effect */}
          <div className="lg:col-span-2">
            <div className="aspect-[3/4] bg-surface-elevated rounded-sm overflow-hidden">
              <DepthParallaxImage
                imageUrl="/profile.png"
                depthUrl="/profile-depth.png"
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
              with real-world constraints, workflows, and interdisciplinary collaboration. 
              His recent international work experience in the United States further 
              strengthened his adaptability, communication skills, and global design 
              perspective.
            </p>

            {/* Divider */}
            <div className="section-divider my-8" />

            {/* Skills / Focus Areas */}
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
                Middle East Technical University (METU)<br />
                <span className="text-muted-foreground">Industrial Design</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
