import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Sketch sayfaları: 30 görsel, public/sketches klasöründe
const sketchPages = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  label: `Sketch ${i + 1}`,
  src: `/sketches/sketch${i + 1}.jpg`, // public/sketches klasörü
}));

const SketchbookSection = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"left" | "right" | null>(null);

  const goToPage = useCallback(
    (direction: "left" | "right") => {
      if (isFlipping) return;

      const newPage =
        direction === "right"
          ? Math.min(currentPage + 1, sketchPages.length - 1)
          : Math.max(currentPage - 1, 0);

      if (newPage === currentPage) return;

      setFlipDirection(direction);
      setIsFlipping(true);

      setTimeout(() => {
        setCurrentPage(newPage);
        setIsFlipping(false);
        setFlipDirection(null);
      }, 500);
    },
    [currentPage, isFlipping]
  );

  const handlePrevious = () => goToPage("left");
  const handleNext = () => goToPage("right");

  return (
    <section id="sketchbook" className="py-24 md:py-32 border-t border-border/50">
      <div className="container-wide">
        {/* Section Header */}
        <header className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-light text-foreground tracking-tight mb-4">
            Sketchbook
          </h2>
          <p className="text-muted-foreground">
            Conceptual explorations and design studies
          </p>
        </header>

        {/* Sketchbook Container */}
        <div className="relative max-w-3xl mx-auto">
          {/* Book - A3 proportions */}
          <div
            className="relative mx-auto"
            style={{
              perspective: "1500px",
              aspectRatio: "1 / 1.414",
              maxHeight: "70vh",
            }}
          >
            {/* Book Pages */}
            <div className="relative w-full h-full">
              {/* Current Page */}
              <div
                className={`absolute inset-0 rounded-sm shadow-2xl overflow-hidden transition-transform duration-500 ease-in-out ${
                  isFlipping && flipDirection === "right"
                    ? "animate-flip-right"
                    : isFlipping && flipDirection === "left"
                    ? "animate-flip-left"
                    : ""
                }`}
                style={{
                  transformStyle: "preserve-3d",
                  background: "linear-gradient(135deg, hsl(40 30% 95%) 0%, hsl(40 25% 90%) 100%)",
                }}
              >
                {/* Page Content - Sketch Görsel */}
                <img
                  src={sketchPages[currentPage].src}
                  alt={sketchPages[currentPage].label}
                  className="absolute inset-0 w-full h-full object-contain"
                />

                {/* Page Edge Effect */}
                <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-black/5 to-transparent" />
              </div>

              {/* Book Spine Shadow */}
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-black/20 to-transparent rounded-l-sm" />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-8 mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 0 || isFlipping}
              className="p-3 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
              aria-label="Previous page"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={handleNext}
              disabled={currentPage === sketchPages.length - 1 || isFlipping}
              className="p-3 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
              aria-label="Next page"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Flip Animations */}
      <style>{`
        @keyframes flipRight {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(-180deg); }
        }
        @keyframes flipLeft {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(180deg); }
        }
        .animate-flip-right {
          animation: flipRight 0.5s ease-in-out forwards;
          transform-origin: left center;
        }
        .animate-flip-left {
          animation: flipLeft 0.5s ease-in-out forwards;
          transform-origin: right center;
        }
      `}</style>
    </section>
  );
};

export default SketchbookSection;
