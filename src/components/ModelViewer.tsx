import { useEffect, useRef } from "react";

interface ModelViewerProps {
  src: string;
  alt: string;
  className?: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          "auto-rotate"?: boolean;
          "rotation-per-second"?: string;
          "camera-controls"?: boolean;
          "disable-zoom"?: boolean;
          "camera-orbit"?: string;
          "min-camera-orbit"?: string;
          "max-camera-orbit"?: string;
          "interaction-prompt"?: string;
          loading?: string;
          "shadow-intensity"?: string;
          exposure?: string;
          "environment-image"?: string;
        },
        HTMLElement
      >;
    }
  }
}

const ModelViewer = ({ src, alt, className = "" }: ModelViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load model-viewer script if not already loaded
    if (!customElements.get("model-viewer")) {
      const script = document.createElement("script");
      script.type = "module";
      script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js";
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div ref={containerRef} className={`bg-surface-elevated rounded-sm ${className}`}>
      <model-viewer
        src={src}
        alt={alt}
        auto-rotate
        rotation-per-second="20deg"
        camera-orbit="0deg 75deg 2.5m"
        min-camera-orbit="auto 60deg auto"
        max-camera-orbit="auto 90deg auto"
        interaction-prompt="none"
        loading="lazy"
        shadow-intensity="0.5"
        exposure="0.8"
        style={{ width: "100%", height: "100%", background: "transparent" }}
      />
    </div>
  );
};

export default ModelViewer;
