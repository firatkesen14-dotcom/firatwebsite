import ModelViewer from "./ModelViewer";

interface ProjectCardProps {
  title: string;
  type: string;
  description: string;
  modelSrc: string;
  images: string[];
  index: number;
}

const ProjectCard = ({ title, type, description, modelSrc, images, index }: ProjectCardProps) => {
  return (
    <article className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${0.2 + index * 0.15}s` }}>
      <div className="space-y-8">
        {/* 1. Project Title & Type */}
        <div>
          <p className="text-sm text-muted-foreground tracking-wide mb-2">{type}</p>
          <h3 className="text-3xl md:text-4xl font-light text-foreground tracking-tight">
            {title}
          </h3>
        </div>

        {/* 2. Large 3D Model Area */}
        <div className="w-full">
          <ModelViewer 
            src={modelSrc} 
            alt={`${title} 3D model`}
            className="aspect-[16/10] w-full"
          />
        </div>

        {/* 3. Render Images - Stacked Vertically */}
        <div className="space-y-6">
          {images.map((image, imgIndex) => (
            <div 
              key={imgIndex}
              className="w-full bg-surface-elevated rounded-sm overflow-hidden group"
            >
              <div className="aspect-[16/9] w-full flex items-center justify-center text-muted-foreground/20 group-hover:text-muted-foreground/40 transition-colors duration-500">
                <span className="text-sm tracking-wider">RENDER {imgIndex + 1}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 4. Description */}
        <p className="text-secondary-foreground leading-relaxed max-w-2xl">
          {description}
        </p>
      </div>
    </article>
  );
};

export default ProjectCard;
