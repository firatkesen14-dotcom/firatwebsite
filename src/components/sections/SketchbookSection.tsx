import { useEffect, useRef, useState } from "react";

const TOTAL_SKETCH = 30;
const TOTAL_PAGES = TOTAL_SKETCH + 2; // cover + back cover

type FlipDir = "none" | "next" | "prev";

export default function SketchbookSection() {
  const [page, setPage] = useState(0); // sol sayfa index
  const [flip, setFlip] = useState<FlipDir>("none");
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);

  const startX = useRef(0);

  const canNext = page + 2 < TOTAL_PAGES;
  const canPrev = page - 2 >= 0;

  /* ---------------- PAGE SRC ---------------- */
  const pageSrc = (i: number) => {
    if (i === 0) return "/sketches/cover.JPG";
    if (i === TOTAL_PAGES - 1) return "/sketches/backcover.JPG";
    return `/sketches/sketch${i}.JPG`;
  };

  /* ---------------- FLIP ---------------- */
  const startFlip = (dir: FlipDir) => {
    if (flip !== "none") return;

    setFlip(dir);
    const start = performance.now();
    const duration = 1200;

    const step = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      setProgress(p);

      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        setPage((v) => (dir === "next" ? v + 2 : v - 2));
        setFlip("none");
        setProgress(0);
      }
    };

    requestAnimationFrame(step);
  };

  /* ---------------- MOUSE ---------------- */
  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    startX.current = e.clientX;
    setDragging(true);
  };
  const onMouseUp = () => setDragging(false);

  /* ---------------- DRAG MOVE ---------------- */
  useEffect(() => {
    if (!dragging) return;

    const move = (e: MouseEvent) => {
      const delta = e.clientX - startX.current;

      if (delta < -60 && canNext) {
        setDragging(false);
        startFlip("next");
      }
      if (delta > 60 && canPrev) {
        setDragging(false);
        startFlip("prev");
      }
    };

    const up = () => setDragging(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [dragging, canNext, canPrev]);

  /* ---------------- RENDER ---------------- */
  const leftIndex = page;
  const rightIndex = page + 1;
  const nextLeft = page + 2;
  const nextRight = page + 3;
  const prevLeft = page - 2;
  const prevRight = page - 1;

  return (
    <section
      id="sketchbook"
      className="py-24 sm:py-28 md:py-32 flex flex-col items-center border-t border-border/50"
    >
      <header className="mb-12 sm:mb-16 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-foreground tracking-tight mb-4">
          Sketchbook
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          A collection of hand sketches and visual explorations
        </p>
      </header>

      <div
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onContextMenu={(e) => e.preventDefault()}
        className="relative w-full max-w-[1000px] aspect-[10/7] sm:aspect-[10/7] md:aspect-[10/7] bg-gray-300 select-none cursor-grab"
        style={{ perspective: 2400 }}
      >
        {/* LEFT STATIC */}
        <div className="absolute left-0 w-1/2 h-full">
          <img
            src={pageSrc(leftIndex)}
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT STATIC */}
        <div className="absolute right-0 w-1/2 h-full">
          <img
            src={pageSrc(rightIndex)}
            className="w-full h-full object-cover"
          />
        </div>

        {/* NEXT UNDER */}
        {flip === "next" && (
          <div className="absolute right-0 w-1/2 h-full z-10">
            <img
              src={pageSrc(nextRight)}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* PREV UNDER */}
        {flip === "prev" && (
          <div className="absolute left-0 w-1/2 h-full z-10">
            <img
              src={pageSrc(prevLeft)}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* RIGHT FLIP */}
        {flip === "next" && (
          <div
            className="absolute right-0 w-1/2 h-full z-20"
            style={{
              transformOrigin: "0% center",
              transform: `rotateY(${-180 * progress}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            <img
              src={pageSrc(rightIndex)}
              className="absolute inset-0 w-full h-full object-cover backface-hidden"
            />
            <img
              src={pageSrc(nextLeft)}
              className="absolute inset-0 w-full h-full object-cover rotate-y-180 backface-hidden"
            />
          </div>
        )}

        {/* LEFT FLIP */}
        {flip === "prev" && (
          <div
            className="absolute left-0 w-1/2 h-full z-20"
            style={{
              transformOrigin: "100% center",
              transform: `rotateY(${180 * progress}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            <img
              src={pageSrc(leftIndex)}
              className="absolute inset-0 w-full h-full object-cover backface-hidden"
            />
            <img
              src={pageSrc(prevRight)}
              className="absolute inset-0 w-full h-full object-cover rotate-y-180 backface-hidden"
            />
          </div>
        )}
      </div>

      {/* ARROWS */}
      <div className="mt-6 sm:mt-8 flex gap-8 sm:gap-10 text-2xl sm:text-3xl md:text-4xl">
        <button onClick={() => canPrev && startFlip("prev")} disabled={!canPrev}>
          ‹
        </button>
        <button onClick={() => canNext && startFlip("next")} disabled={!canNext}>
          ›
        </button>
      </div>
    </section>
  );
}
