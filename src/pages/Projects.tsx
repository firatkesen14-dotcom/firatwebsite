import Layout from "@/components/Layout";
import ProjectCard from "@/components/ProjectCard";

const projects = [
  {
    title: "NeoNest",
    type: "Neonatal Care Unit",
    description: "A comprehensive neonatal care system designed to provide optimal thermal regulation and monitoring for premature infants, integrating advanced sensors with intuitive caregiver interfaces.",
    modelSrc: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    images: ["/placeholder.svg", "/placeholder.svg"],
  },
  {
    title: "Angoray",
    type: "Metro Train Concept for Ankara",
    description: "A modern metro train concept balancing passenger comfort with operational efficiency. The design emphasizes accessibility, natural wayfinding, and sustainable material choices.",
    modelSrc: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    images: ["/placeholder.svg", "/placeholder.svg"],
  },
  {
    title: "Gençlik Parkı Reimagined",
    type: "Urban Space for 50+ Users",
    description: "An inclusive urban park redesign focusing on accessibility and social engagement for users aged 50 and above, incorporating adaptive seating, clear navigation, and sensory gardens.",
    modelSrc: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    images: ["/placeholder.svg", "/placeholder.svg"],
  },
  {
    title: "Game Console Redesign",
    type: "Ergonomic Product Study",
    description: "An ergonomic study of handheld gaming devices, addressing extended use comfort through refined grip geometry, weight distribution, and thermal management solutions.",
    modelSrc: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    images: ["/placeholder.svg", "/placeholder.svg"],
  },
  {
    title: "Portable Toilet",
    type: "Disaster Relief Solution",
    description: "A rapidly deployable sanitation unit designed for disaster relief scenarios, prioritizing dignity, hygiene, and structural stability in challenging field conditions.",
    modelSrc: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    images: ["/placeholder.svg", "/placeholder.svg"],
  },
];

const Projects = () => {
  return (
    <Layout>
      <title>Projects — Fırat Kesen</title>
      <meta name="description" content="Industrial design portfolio featuring transportation, medical products, urban spaces, and consumer product projects." />

      <section className="py-16 md:py-24">
        <div className="container-wide">
          {/* Page Header */}
          <header className="mb-16 md:mb-24 opacity-0 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-light text-foreground tracking-tight mb-4">
              Architecture
            </h1>
            <p className="text-muted-foreground max-w-xl">
              Selected works spanning transportation design, medical products, 
              urban spaces, and consumer-oriented solutions.
            </p>
          </header>

          {/* Projects List */}
          <div className="space-y-24 md:space-y-32">
            {projects.map((project, index) => (
              <div key={project.title}>
                <ProjectCard {...project} index={index} />
                {index < projects.length - 1 && (
                  <div className="section-divider mt-24 md:mt-32" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Projects;
