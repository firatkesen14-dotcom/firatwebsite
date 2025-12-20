import { ArrowDown } from "lucide-react";
import Layout from "@/components/Layout";
import ProjectsSection from "@/components/sections/ProjectsSection";
import SketchbookSection from "@/components/sections/SketchbookSection";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";

const Index = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Layout>
      {/* SEO */}
      <title>Fırat Kesen — Industrial Designer</title>
      <meta name="description" content="Industrial designer specializing in product, system, and spatial design. Portfolio featuring transportation, medical products, and urban space projects." />

      {/* Hero Section */}
      <section id="home" className="min-h-[calc(100vh-5rem)] flex items-center justify-center relative">
        <div className="container-narrow text-center">
          <div className="space-y-8 opacity-0 animate-fade-in-up">
            {/* Name */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-foreground">
              Fırat Kesen
            </h1>

            {/* Title */}
            <p className="text-lg md:text-xl text-muted-foreground tracking-wide">
              Industrial Designer
            </p>

            {/* Divider */}
            <div className="flex justify-center">
              <div className="w-12 h-px bg-divider" />
            </div>

            {/* Introduction */}
            <p className="max-w-2xl mx-auto text-secondary-foreground leading-relaxed opacity-0 animate-fade-in-up stagger-2">
              Transforming complex challenges into refined solutions through 
              thoughtful product, system, and spatial design. Each project is 
              an exercise in precision, balancing human needs with technical 
              excellence.
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button 
          onClick={() => scrollToSection("projects")}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-foreground transition-colors duration-300 animate-bounce"
          aria-label="Scroll to projects"
        >
          <ArrowDown size={24} />
        </button>
      </section>

      {/* Projects Section */}
      <ProjectsSection />

      {/* Sketchbook Section */}
      <SketchbookSection />

      {/* About Section */}
      <AboutSection />

      {/* Contact Section */}
      <ContactSection />
    </Layout>
  );
};

export default Index;
