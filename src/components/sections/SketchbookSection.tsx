import { useEffect, useRef, useState } from "react";

const TOTAL_PAGES = 30;

export default function SketchbookSection() {
  const [spread, setSpread] = useState(0); // 0: kapak + 1, sonra 2-3, 4-5...
  const [isFlipping, setIsFlipping] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragLeftIntent, setDragLeftIntent] = useState(false);

  const startX = useRef(0);

  const canGoNext = spread < TOTAL_PAGES - 1;
  const canGoPrev = spread > 0;

  /* ---------------- MOUSE DRAG LOGIC ---------------- */

  const onMouseDown = (e: React.MouseEvent) => {
    if (!canGoNext || isFlipping) return;
    startX.current = e.clientX;
    setIsDragging(true);
    setDragLeftIntent(false);
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const delta = e.clientX - startX.current;
      if (delta < 0) setDragLeftIntent(true); // en ufak sola niyet yeter
    };

    const onUp = () => {
      if (!isDragging) return;
      setIsDragging(false);

      if (dragLeftIntent && canGoNext) {
        triggerNext();
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDragging, dragLeftIntent, canGoNext]);

  /* ---------------- PAGE CHANGE ---------------- */

  const triggerNext = () => {
    if (isFlipping) return;
    setIsFlipping(true);

    setTimeout(() => {
      setSpread(s => Math.min(s + 2, TOTAL_PAGES - 1));
      setIsFlipping(false);
    }, 2200);
  };

  const triggerPrev = () => {
    if (isFlipping || !canGoPrev) return;
    setSpread(s => Math.max(s - 2, 0));
  };

  /* ---------------- IMAGE PATHS ---------------- */

  const leftPage =
    spread === 0
      ? null
      : `/sketches/sketch${spread}.JPG`;

  const rightPage =
    spread === 0
      ? `/sketches/sketch1.JPG`
      : `/sketches/sketch${spread + 1}.JPG`;

  /* ---------------- STYLES ---------------- */

  const flipStyle = {
    transform: isFlipping
      ? "rotateY(-180deg) skewY(12deg)"
      : "rotateY(0deg)",
    transition: isFlipping
      ? "transform 2.2s cubic-bezier(.18,.75,.25,1)"
      : "none",
    transformOrigin: "left center",
    transformStyle: "preserve-3d" as const,
  };

  return (
    <section className="w-full flex flex-col items-center py-32 select-none">
      <h2 className="text-3xl mb-10">Sketchbook</h2>

      {/* BOOK */}
      <div
        className="relative"
        style={{
          width: "1000px",
          height: "700px",
          perspective: "2200px",
        }}
      >
        {/* LEFT PAGE */}
        <div
          className="absolute left-0 top-0 h-full bg-[#f5f2ec] shadow-inner"
          style={{ width: "48%" }}
        >
          {leftPage ? (
            <img
              src={leftPage}
              className="w-full h-full object-contain"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl tracking-widest">
              SKETCHES
            </div>
          )}
        </div>

        {/* SPINE GAP */}
        <div
          className="absolute top-0 h-full"
          style={{
            left: "48%",
            width: "4%",
          }}
        />

        {/* RIGHT STATIC PAGE */}
        {!isFlipping && (
          <div
            className="absolute right-0 top-0 h-full bg-[#f5f2ec]"
            style={{ width: "48%" }}
          >
            <img
              src={rightPage}
              className="w-full h-full object-contain"
              draggable={false}
            />
          </div>
        )}

        {/* FLIPPING PAGE */}
        {canGoNext && (
          <div
            onMouseDown={onMouseDown}
            className="absolute right-0 top-0 h-full bg-[#f5f2ec] cursor-grab active:cursor-grabbing"
            style={{
              width: "48%",
              ...flipStyle,
            }}
          >
            <img
              src={rightPage}
              className="w-full h-full object-contain"
              draggable={false}
            />
          </div>
        )}
      </div>

      {/* CONTROLS */}
      <div className="flex gap-6 mt-10">
        <button
          onClick={triggerPrev}
          disabled={!canGoPrev}
          className="px-4 py-2 border disabled:opacity-30"
        >
          ←
        </button>
        <button
          onClick={triggerNext}
          disabled={!canGoNext}
          className="px-4 py-2 border disabled:opacity-30"
        >
          →
        </button>
      </div>
    </section>
  );
}
