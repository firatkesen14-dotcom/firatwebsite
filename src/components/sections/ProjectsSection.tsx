import { useState } from "react";
import ProjectCard from "@/components/ProjectCard";

const projects = [
  {
    title: "NeoNest",
    type: "Neonatal Care Unit",
    description:
      "A comprehensive neonatal care system designed to provide optimal thermal regulation and monitoring for premature infants, integrating advanced sensors with intuitive caregiver interfaces.",
    modelSrc: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    images: ["/placeholder.svg", "/placeholder.svg"],
  },
  {
    title: "Angoray",
    type: "Metro Train Concept for Ankara",
    description:
      "A modern metro train concept balancing passenger comfort with operational efficiency. The design emphasizes accessibility, natural wayfinding, and sustainable material choices.",
    modelSrc: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    images: ["/placeholder.svg", "/placeholder.svg"],
  },
  {
    title: "Gençlik Parkı Reimagined",
    type: "Urban Space for 50+ Users",
    description:
      "An inclusive urban park redesign focusing on accessibility and social engagement for users aged 50 and above, incorporating adaptive seating, clear navigation, and sensory gardens.",
    modelSrc: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    images: ["/placeholder.svg", "/placeholder.svg"],
  },
  {
    title: "Game Console Redesign",
    type: "Ergonomic Product Study",
    description:
      "An ergonomic study of handheld gaming devices, addressing extended use comfort through refined grip geometry, weight distribution, and thermal management solutions.",
    modelSrc: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    images: ["/placeholder.svg", "/placeholder.svg"],
  },
  {
    title: "Portable Toilet",
    type: "Disaster Relief Solution",
    description:
      "A rapidly deployable sanitation unit designed for disaster relief scenarios, prioritizing dignity, hygiene, and structural stability in challenging field conditions.",
    modelSrc: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    images: ["/placeholder.svg", "/placeholder.svg"],
  },
];

const ProjectsSection = () => {
  const [showAll, setShowAll] = useState(false);

  const visibleProjects = showAll ? projects : projects.slice(0, 1);

  return (
    <section id="projects" className="py-24 md:py-32 border-t border-border/50">
      <div className="container-wide">
        {/* Section Header */}
        <header className="mb-16 md:mb-24">
          <h2 className="text-4xl md:text-5xl font-light text-foreground tracking-tight mb-4">
            Projects
          </h2>
          <p className="text-muted-foreground max-w-xl">
            Selected works spanning transportation design, medical products, urban spaces,
            and consumer-oriented solutions.
          </p>
        </header>

        {/* Projects List */}
        <div className="space-y-24 md:space-y-32">
          {visibleProjects.map((project, index) => (
            <div key={project.title}>
              <ProjectCard {...project} index={index} />
              {index < visibleProjects.length - 1 && (
                <div className="section-divider mt-24 md:mt-32" />
              )}
            </div>
          ))}

          {/* View More Button */}
          {!showAll && (
            <div className="text-center mt-12">
              <button
                onClick={() => setShowAll(true)}
                className="px-6 py-3 border border-foreground rounded-lg text-foreground hover:bg-foreground hover:text-background transition"
              >
                View More Projects
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
