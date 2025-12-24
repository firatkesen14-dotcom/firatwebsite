import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TOTAL = 30;

export default function SketchbookSection() {
  // spread = sol sayfadaki sketch index (1-based)
  // -1 özel durum: kapak
  const [spread, setSpread] = useState(-1);

  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);

  const leftSketch = spread === -1 ? null : spread + 1;
  const rightSketch = spread === -1 ? 1 : spread + 2;

  const canGoNext = rightSketch < TOTAL;
  const canGoPrev = spread > -1;

  /* ---------------- mouse drag ---------------- */

  const onMouseDown = (e: React.MouseEvent) => {
    if (!canGoNext) return;
    startX.current = e.clientX;
    setIsDragging(true);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - startX.current;
    setDragX(Math.min(0, delta));
  };

  const onMouseUp = () => {
    if (!isDragging) return;

    if (dragX < -160 && canGoNext) {
      setSpread(s => s + 2);
    }

    setDragX(0);
    setIsDragging(false);
  };

  const rotation = Math.max(-180, (dragX / 280) * 180);

  /* ---------------- arrows ---------------- */

  const goNext = () => {
    if (canGoNext) setSpread(s => s + 2);
  };

  const goPrev = () => {
    if (canGoPrev) setSpread(s => Math.max(-1, s - 2));
  };

  return (
    <section id="sketchbook" className="py-32">
      <div className="max-w-6xl mx-auto">

        <div className="relative" style={{ perspective: "2400px" }}>
          <div className="relative flex gap-10 aspect-[2/1.414]">

            {/* LEFT PAGE */}
            <div className="w-1/2 bg-neutral-100 overflow-hidden">
              {spread === -1 ? (
                <div className="h-full flex items-center justify-center text-neutral-400 text-xl tracking-widest">
                  SKETCHES
                </div>
              ) : (
                <img
                  src={`/sketches/sketch${leftSketch}.JPG`}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* RIGHT PAGE (STATIC) */}
            <div className="w-1/2 bg-white overflow-hidden">
              {rightSketch <= TOTAL && (
                <img
                  src={`/sketches/sketch${rightSketch}.JPG`}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* FLIPPING PAGE */}
            {canGoNext && (
              <div
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
                className="absolute top-0 right-0 w-1/2 h-full cursor-grab active:cursor-grabbing"
                style={{
                  transformStyle: "preserve-3d",
                  transform: `rotateY(${rotation}deg)`,
                  transition: isDragging
                    ? "none"
                    : "transform 0.8s cubic-bezier(.4,0,.2,1)",
                  transformOrigin: "left center",
                }}
              >
                {/* FRONT */}
                <img
                  src={`/sketches/sketch${rightSketch}.JPG`}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ backfaceVisibility: "hidden" }}
                />

                {/* BACK */}
                {rightSketch + 1 <= TOTAL && (
                  <img
                    src={`/sketches/sketch${rightSketch + 1}.JPG`}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden",
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex justify-center gap-10 mt-10">
          <button
            onClick={goPrev}
            disabled={!canGoPrev}
            className="p-3 text-muted-foreground hover:text-foreground disabled:opacity-30"
          >
            <ChevronLeft size={28} />
          </button>

          <button
            onClick={goNext}
            disabled={!canGoNext}
            className="p-3 text-muted-foreground hover:text-foreground disabled:opacity-30"
          >
            <ChevronRight size={28} />
          </button>
        </div>

      </div>
    </section>
  );
}
