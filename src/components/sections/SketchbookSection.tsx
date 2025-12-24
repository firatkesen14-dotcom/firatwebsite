import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TOTAL_PAGES = 30;

export default function SketchbookSection() {
  const [page, setPage] = useState(0);
  const [flipping, setFlipping] = useState<null | "next" | "prev">(null);

  const next = () => {
    if (flipping || page >= TOTAL_PAGES - 1) return;
    setFlipping("next");
    setTimeout(() => {
      setPage(p => p + 1);
      setFlipping(null);
    }, 1200);
  };

  const prev = () => {
    if (flipping || page <= 0) return;
    setFlipping("prev");
    setTimeout(() => {
      setPage(p => p - 1);
      setFlipping(null);
    }, 1200);
  };

  return (
    <section className="py-32 border-t border-border/50">
      <div className="max-w-6xl mx-auto">

        {/* BOOK */}
        <div
          className="relative mx-auto"
          style={{ perspective: "2400px" }}
        >
          <div className="relative mx-auto flex gap-6 max-w-5xl aspect-[2/1.414]">

            {/* LEFT STATIC PAGE */}
            <div className="relative w-1/2 h-full overflow-hidden bg-neutral-100 shadow-inner">
              {page === 0 ? (
                <div className="flex items-center justify-center h-full text-neutral-400 text-xl tracking-wide">
                  sketches
                </div>
              ) : (
                <img
                  src={`/sketches/sketch${page}.JPG`}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* RIGHT STATIC PAGE */}
            <div className="relative w-1/2 h-full overflow-hidden bg-white shadow-inner">
              {page + 1 <= TOTAL_PAGES && (
                <img
                  src={`/sketches/sketch${page + 1}.JPG`}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* FLIPPING PAGE (OVER BOTH) */}
            {flipping === "next" && (
              <div
                className="absolute top-0 right-0 h-full w-1/2 origin-left"
                style={{
                  transformStyle: "preserve-3d",
                  animation: "pageFlipNext 1.2s cubic-bezier(.22,.61,.36,1)"
                }}
              >
                {/* FRONT (current right) */}
                <img
                  src={`/sketches/sketch${page + 1}.JPG`}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ backfaceVisibility: "hidden" }}
                />

                {/* BACK (next left) */}
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

            {flipping === "prev" && (
              <div
                className="absolute top-0 left-0 h-full w-1/2 origin-right"
                style={{
                  transformStyle: "preserve-3d",
                  animation: "pageFlipPrev 1.2s cubic-bezier(.22,.61,.36,1)"
                }}
              >
                <img
                  src={`/sketches/sketch${page}.JPG`}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ backfaceVisibility: "hidden" }}
                />

                <img
                  src={`/sketches/sketch${page - 1}.JPG`}
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

        {/* NAV */}
        <div className="flex justify-center gap-12 mt-10">
          <button onClick={prev} disabled={page === 0 || flipping !== null}>
            <ChevronLeft size={28} />
          </button>
          <button onClick={next} disabled={page >= TOTAL_PAGES - 1 || flipping !== null}>
            <ChevronRight size={28} />
          </button>
        </div>
      </div>

      {/* ANIMATIONS */}
      <style>{`
        @keyframes pageFlipNext {
          0% {
            transform: rotateY(0deg);
          }
          40% {
            transform: rotateY(-70deg) translateX(-10px);
          }
          70% {
            transform: rotateY(-140deg) translateX(-30px);
          }
          100% {
            transform: rotateY(-180deg) translateX(-40px);
          }
        }

        @keyframes pageFlipPrev {
          0% {
            transform: rotateY(0deg);
          }
          40% {
            transform: rotateY(70deg) translateX(10px);
          }
          70% {
            transform: rotateY(140deg) translateX(30px);
          }
          100% {
            transform: rotateY(180deg) translateX(40px);
          }
        }
      `}</style>
    </section>
  );
}
