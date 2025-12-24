import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TOTAL_PAGES = 30;
const sketchPages = Array.from({ length: TOTAL_PAGES }, (_, i) => ({
  id: i + 1,
  label: `Sketch ${i + 1}`,
}));

const SketchbookSection = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"left" | "right" | null>(null);

  const goToPage = useCallback(
    (direction: "left" | "right") => {
      if (isFlipping) return;

      let newPage =
        direction === "right"
          ? Math.min(currentPage + 2, TOTAL_PAGES - 1)
          : Math.max(currentPage - 2, 0);

      if (newPage === currentPage) return;

      setFlipDirection(direction);
      setIsFlipping(true);

      setTimeout(() => {
        setCurrentPage(newPage);
        setIsFlipping(false);
        setFlipDirection(null);
      }, 800); // animasyon süresi
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
            My design explorations and visual studies
          </p>
        </header>

        {/* Sketchbook Container */}
        <div className="relative max-w-5xl mx-auto flex justify-center">
          {/* Book Spread */}
          <div
            className="relative flex w-full max-w-4xl aspect-[2/1.414]"
            style={{ perspective: "1500px" }}
          >
            {/* Left Page */}
            <img
              src={`/sketches/sketch${currentPage + 1}.JPG`}
              alt={`Sketch ${currentPage + 1}`}
              className={`absolute left-0 w-1/2 h-full object-cover rounded-sm shadow-2xl transition-transform duration-800 ease-in-out transform ${
                isFlipping && flipDirection === "right" ? "-rotate-y-[180deg] scale-x-[0.98]" : ""
              }`}
              style={{ transformOrigin: "right center", backfaceVisibility: "hidden" }}
            />

            {/* Right Page */}
            {currentPage + 2 < TOTAL_PAGES && (
              <img
                src={`/sketches/sketch${currentPage + 2}.JPG`}
                alt={`Sketch ${currentPage + 2}`}
                className={`absolute right-0 w-1/2 h-full object-cover rounded-sm shadow-2xl transition-opacity duration-800 ease-in-out ${
                  isFlipping && flipDirection === "right" ? "opacity-100" : "opacity-100"
                }`}
                style={{ backfaceVisibility: "hidden" }}
              />
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-8 mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 0 || isFlipping}
            className="p-3 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
            aria-label="Previous pages"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={handleNext}
            disabled={currentPage >= TOTAL_PAGES - 2 || isFlipping}
            className="p-3 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
            aria-label="Next pages"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Page Flip Animations */}
      <style>{`
        @keyframes flipRight {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(-180deg); }
        }
        .-rotate-y-[180deg] {
          transform: rotateY(-180deg);
        }
      `}</style>
    </section>
  );
};

export default SketchbookSection;
