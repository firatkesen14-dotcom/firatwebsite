import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TOTAL = 30;
const PAGE_WIDTH_RATIO = 1 / 1.414; // A3

export default function SketchbookSection() {
  const [page, setPage] = useState(0); // 0 = cover
  const [isFlipping, setIsFlipping] = useState(false);
  const [dragX, setDragX] = useState(0);

  const startX = useRef<number | null>(null);

  /* ---------------- images ---------------- */

  const leftImage =
    page === 0 ? null : `/sketches/sketch${page}.JPG`;

  const rightImage =
    page === 0
      ? `/sketches/sketch1.JPG`
      : `/sketches/sketch${page + 1}.JPG`;

  // 🔴 KRİTİK DÜZELTİLEN KISIM
  const nextRightImage =
    page + 3 <= TOTAL ? `/sketches/sketch${page + 3}.JPG` : null;

  /* ---------------- navigation ---------------- */

  const next = () => {
    if (isFlipping || page + 1 >= TOTAL) return;
    setIsFlipping(true);
    setDragX(-300);

    setTimeout(() => {
      setPage(p => p + 2);
      setDragX(0);
      setIsFlipping(false);
    }, 900);
  };

  const prev = () => {
    if (isFlipping || page <= 0) return;
    setIsFlipping(true);
    setDragX(300);

    setTimeout(() => {
      setPage(p => Math.max(0, p - 2));
      setDragX(0);
      setIsFlipping(false);
    }, 900);
  };

  /* ---------------- mouse drag ---------------- */

  const onMouseDown = (e: React.MouseEvent) => {
    if (isFlipping) return;
    if (e.clientX < window.innerWidth / 2) return; // sadece sağ sayfa
    startX.current = e.clientX;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (startX.current === null) return;
    const delta = e.clientX - startX.current;
    if (delta < 0) setDragX(Math.max(delta, -400));
  };

  const onMouseUp = () => {
    if (startX.current === null) return;
    startX.current = null;
    if (dragX < -80) next();
    else setDragX(0);
  };

  /* ---------------- render ---------------- */

  return (
    <section id="sketchbook" className="py-32">
      <div className="max-w-6xl mx-auto">

        <header className="text-center mb-12">
          <h2 className="text-5xl font-light mb-3">Sketchbook</h2>
          <p className="text-muted-foreground">
            Drawings, studies and visual notes
          </p>
        </header>

        <div
          className="relative mx-auto flex justify-center select-none"
          style={{ perspective: "2000px" }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {/* BOOK */}
          <div className="relative flex gap-6">

            {/* LEFT PAGE */}
            <div
              className="relative overflow-hidden shadow-xl bg-white"
              style={{ aspectRatio: PAGE_WIDTH_RATIO }}
            >
              {page === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-3xl font-light">
                  Sketches
                </div>
              ) : (
                <img
                  src={leftImage!}
                  className="w-full h-full object-contain"
                  draggable={false}
                />
              )}
            </div>

            {/* RIGHT PAGE */}
            <div
              className="relative overflow-hidden shadow-xl bg-white"
              style={{ aspectRatio: PAGE_WIDTH_RATIO }}
            >
              {/* next page under */}
              {nextRightImage && (
                <img
                  src={nextRightImage}
                  className="absolute inset-0 w-full h-full object-contain opacity-40"
                  draggable={false}
                />
              )}

              {/* flipping page */}
              <div
                className="absolute inset-0 origin-left"
                style={{
                  transform: `translateX(${dragX}px) rotateY(${dragX / -4}deg)`,
                  transition: isFlipping ? "transform 0.9s ease-in-out" : "none",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* front */}
                <img
                  src={rightImage}
                  className="absolute inset-0 w-full h-full object-contain backface-hidden"
                  draggable={false}
                />

                {/* back */}
                {page + 2 <= TOTAL && (
                  <img
                    src={`/sketches/sketch${page + 2}.JPG`}
                    className="absolute inset-0 w-full h-full object-contain rotate-y-180 backface-hidden"
                    draggable={false}
                  />
                )}
              </div>
            </div>

            {/* spine shadow */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-black/10 -translate-x-1/2" />
          </div>
        </div>

        {/* NAV */}
        <div className="flex justify-center items-center gap-6 mt-10">
          <button onClick={prev} className="opacity-70 hover:opacity-100">
            <ChevronLeft />
          </button>

          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === 0 ? "bg-muted" : "bg-foreground"
                }`}
              />
            ))}
          </div>

          <button onClick={next} className="opacity-70 hover:opacity-100">
            <ChevronRight />
          </button>
        </div>
      </div>

      <style>{`
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </section>
  );
}
