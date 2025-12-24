import { useState, useRef } from "react";

const TOTAL = 30;

export default function SketchbookSection() {
  const [page, setPage] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);

  const rightPage = page + 1;
  const nextPage = page + 2;

  const onMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
    setIsDragging(true);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setDragX(Math.min(0, e.clientX - startX.current));
  };

  const onMouseUp = () => {
    if (!isDragging) return;

    if (dragX < -180 && page < TOTAL - 1) {
      setPage(p => p + 1);
    }

    setDragX(0);
    setIsDragging(false);
  };

  const rotation = Math.max(-180, (dragX / 300) * 180);

  return (
    <section className="py-32">
      <div className="max-w-6xl mx-auto">
        <div
          className="relative mx-auto"
          style={{ perspective: "2200px" }}
        >
          <div className="relative flex gap-8 aspect-[2/1.414]">

            {/* LEFT PAGE (STATIC) */}
            <div className="w-1/2 bg-neutral-100 overflow-hidden">
              {page === 0 ? (
                <div className="h-full flex items-center justify-center text-neutral-400 text-xl">
                  sketches
                </div>
              ) : (
                <img
                  src={`/sketches/sketch${page}.JPG`}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* RIGHT PAGE (STATIC UNDER) */}
            <div className="w-1/2 bg-white overflow-hidden">
              {rightPage <= TOTAL && (
                <img
                  src={`/sketches/sketch${rightPage}.JPG`}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* DRAGGABLE PAGE */}
            {rightPage <= TOTAL && (
              <div
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
                className="absolute top-0 right-0 w-1/2 h-full cursor-grab"
                style={{
                  transformStyle: "preserve-3d",
                  transform: `rotateY(${rotation}deg)`,
                  transition: isDragging ? "none" : "transform 0.6s ease",
                  transformOrigin: "left center"
                }}
              >
                {/* FRONT */}
                <img
                  src={`/sketches/sketch${rightPage}.JPG`}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ backfaceVisibility: "hidden" }}
                />

                {/* BACK */}
                {nextPage <= TOTAL && (
                  <img
                    src={`/sketches/sketch${nextPage}.JPG`}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden"
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
