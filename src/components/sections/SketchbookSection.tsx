import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const sketchPages = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  label: `Sketch ${i + 1}`,
  src: `/sketches/sketch${i + 1}.JPG`
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
      }, 800);
    },
    [currentPage, isFlipping]
  );

  const handlePrevious = () => goToPage("left");
  const handleNext = () => goToPage("right");

  const getNextPageSrc = () => {
    if (flipDirection === "right" && currentPage < sketchPages.length - 1)
      return sketchPages[currentPage + 1].src;
    if (flipDirection === "left" && currentPage > 0)
      return sketchPages[currentPage - 1].src;
    return null;
  };

  return (
    <section id="sketchbook" className="py-24 md:py-32 border-t border-border/50">
      <div className="container-wide">
        <header className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-light text-foreground tracking-tight mb-4">
            Sketchbook
          </h2>
          <p className="text-muted-foreground">
            Conceptual explorations and design studies
          </p>
        </header>

        <div className="relative max-w-3xl mx-auto">
          <div
            className="relative mx-auto"
            style={{
              perspective: "2000px",
              aspectRatio: "1 / 1.414",
              maxHeight: "70vh"
            }}
          >
            <div className="relative w-full h-full">
              {/* Current Page */}
              <div className="relative w-full h-full">
                {getNextPageSrc() && (
                  <img
                    src={getNextPageSrc()!}
                    alt="Next page"
                    className="absolute inset-0 w-full h-full object-contain rounded-sm shadow-2xl opacity-30"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(0deg)" }}
                  />
                )}

                <img
                  src={sketchPages[currentPage].src}
                  alt={sketchPages[currentPage].label}
                  className={`absolute inset-0 w-full h-full object-contain rounded-sm shadow-2xl transform transition-transform duration-800 ${
                    isFlipping && flipDirection === "right"
                      ? "animate-flip-right-elastic"
                      : isFlipping && flipDirection === "left"
                      ? "animate-flip-left-elastic"
                      : "rotateY-0"
                  }`}
                  style={{ backfaceVisibility: "hidden" }}
                />
              </div>
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

      <style>{`
        .rotateY-0 { transform: rotateY(0deg); }

        /* Smooth elastic flip right */
        .animate-flip-right-elastic {
          animation: flipRightElastic 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          transform-origin: left center;
        }

        /* Smooth elastic flip left */
        .animate-flip-left-elastic {
          animation: flipLeftElastic 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          transform-origin: right center;
        }

        @keyframes flipRightElastic {
          0% { transform: rotateY(0deg) scaleX(1); }
          30% { transform: rotateY(-45deg) scaleX(1.02) skewY(0.3deg); }
          60% { transform: rotateY(-90deg) scaleX(1.05) skewY(0.5deg); }
          100% { transform: rotateY(-180deg) scaleX(1) skewY(0deg); }
        }

        @keyframes flipLeftElastic {
          0% { transform: rotateY(0deg) scaleX(1); }
          30% { transform: rotateY(45deg) scaleX(1.02) skewY(-0.3deg); }
          60% { transform: rotateY(90deg) scaleX(1.05) skewY(-0.5deg); }
          100% { transform: rotateY(180deg) scaleX(1) skewY(0deg); }
        }
      `}</style>
    </section>
  );
};

export default SketchbookSection;
