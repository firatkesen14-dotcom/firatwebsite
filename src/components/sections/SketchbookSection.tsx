import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TOTAL_PAGES = 30;

export default function SketchbookSection() {
  const [page, setPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const nextPage = () => {
    if (isFlipping || page >= TOTAL_PAGES - 1) return;
    setIsFlipping(true);
    setTimeout(() => {
      setPage(p => p + 1);
      setIsFlipping(false);
    }, 1100);
  };

  const prevPage = () => {
    if (isFlipping || page <= 0) return;
    setIsFlipping(true);
    setTimeout(() => {
      setPage(p => p - 1);
      setIsFlipping(false);
    }, 1100);
  };

  return (
    <section className="py-32 border-t border-border/50">
      <div className="max-w-6xl mx-auto">

        {/* BOOK */}
        <div
          className="relative mx-auto flex justify-center"
          style={{ perspective: "2000px" }}
        >
          <div className="relative flex gap-6 w-full max-w-5xl aspect-[2/1.414]">

            {/* LEFT PAGE */}
            <div className="relative w-1/2 h-full rounded-sm overflow-hidden bg-neutral-100 shadow-inner">
              {page === 0 ? (
                /* COVER */
                <div className="flex items-center justify-center h-full text-neutral-400 text-xl tracking-wide">
                  sketches
                </div>
              ) : (
                <img
                  src={`/sketches/sketch${page}.JPG`}
                  className="w-full h-full object-cover"
                  alt=""
                />
              )}
            </div>

            {/* RIGHT PAGE */}
            <div className="relative w-1/2 h-full rounded-sm overflow-hidden shadow-xl bg-white">
              <img
                src={`/sketches/sketch${page + 1}.JPG`}
                className="w-full h-full object-cover"
                alt=""
              />

              {/* FLIP PAGE */}
              {isFlipping && (
                <div
                  className="absolute inset-0 origin-left"
                  style={{
                    transformStyle: "preserve-3d",
                    animation: "pageFlip 1.1s cubic-bezier(0.25, 0.8, 0.3, 1)"
                  }}
                >
                  {/* FRONT */}
                  <img
                    src={`/sketches/sketch${page + 1}.JPG`}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ backfaceVisibility: "hidden" }}
                  />

                  {/* BACK */}
                  <img
                    src={`/sketches/sketch${page + 2}.JPG`}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden"
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* NAV */}
        <div className="flex justify-center gap-10 mt-10">
          <button
            onClick={prevPage}
            disabled={page === 0 || isFlipping}
            className="text-muted-foreground hover:text-foreground disabled:opacity-30"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={nextPage}
            disabled={page >= TOTAL_PAGES - 1 || isFlipping}
            className="text-muted-foreground hover:text-foreground disabled:opacity-30"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      </div>

      {/* ANIMATION */}
      <style>{`
        @keyframes pageFlip {
          0% {
            transform: rotateY(0deg);
          }
          40% {
            transform: rotateY(-60deg) translateX(-10px);
          }
          70% {
            transform: rotateY(-120deg) translateX(-20px);
          }
          100% {
            transform: rotateY(-180deg) translateX(-30px);
          }
        }
      `}</style>
    </section>
  );
}
