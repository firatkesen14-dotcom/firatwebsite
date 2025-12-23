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
      }, 700); // Flip süresi biraz uzun, doğal his için
    },
    [currentPage, isFlipping]
  );

  const handlePrevious = () => goToPage("left");
  const handleNext = () => goToPage("right");

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
                {/* Previous page (back face) */}
                {flipDirection && currentPage > 0 && (
                  <img
                    src={sketchPages[flipDirection === "right" ? currentPage : currentPage - 1].src}
                    alt="Back page"
                    className={`absolute inset-0 w-full h-full object-contain rounded-sm shadow-2xl transition-opacity duration-700 ease-in-out ${
                      flipDirection === "right" ? "opacity-0" : "opacity-100"
                    }`}
                  />
                )}

                {/* Active Page */}
                <img
                  src={sketchPages[currentPage].src}
                  alt={sketchPages[currentPage].label}
                  className={`absolute inset-0 w-full h-full object-contain rounded-sm shadow-2xl transition-transform duration-700 ease-in-out transform origin-left ${
                    isFlipping && flipDirection === "right"
                      ? "rotateY-180"
                      : isFlipping && flipDirection === "left"
                      ? "-rotateY-180"
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
        .rotateY-180 { transform: rotateY(-180deg); }
        .-rotateY-180 { transform: rotateY(180deg); }
      `}</style>
    </section>
  );
};

export default SketchbookSection;
