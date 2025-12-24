import { useEffect, useRef, useState } from "react";

const TOTAL = 30;

export default function SketchbookSection() {
  const [page, setPage] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [dragging, setDragging] = useState<"next" | "prev" | null>(null);
  const startX = useRef(0);

  const canNext = page < TOTAL - 1;
  const canPrev = page > 0;

  /* ---------------- DRAG ---------------- */

  const onMouseDownRight = (e: React.MouseEvent) => {
    if (!canNext || flipping) return;
    startX.current = e.clientX;
    setDragging("next");
  };

  const onMouseDownLeft = (e: React.MouseEvent) => {
    if (!canPrev || flipping) return;
    startX.current = e.clientX;
    setDragging("prev");
  };

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!dragging) return;

      if (dragging === "next" && e.clientX < startX.current - 12) {
        setDragging(null);
        startFlip(1);
      }

      if (dragging === "prev" && e.clientX > startX.current + 12) {
        setDragging(null);
        startFlip(-1);
      }
    };

    const up = () => setDragging(null);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [dragging]);

  /* ---------------- FLIP ---------------- */

  const startFlip = (dir: 1 | -1) => {
    if (flipping) return;
    setFlipping(true);

    setTimeout(() => {
      setPage(p =>
        dir === 1 ? Math.min(p + 2, TOTAL - 1) : Math.max(p - 2, 0)
      );
      setFlipping(false);
    }, 2400);
  };

  /* ---------------- IMAGES ---------------- */

  const leftImage =
    page === 0 ? null : `/sketches/sketch${page}.JPG`;

  const rightImage =
    page === 0
      ? `/sketches/sketch1.JPG`
      : `/sketches/sketch${page + 1}.JPG`;

  const nextRightImage =
    page + 3 <= TOTAL ? `/sketches/sketch${page + 3}.JPG` : null;

  const prevLeftImage =
    page - 2 >= 0 ? `/sketches/sketch${page - 1}.JPG` : null;

  /* ---------------- STYLES ---------------- */

  const baseFlip: React.CSSProperties = {
    position: "absolute",
    top: 0,
    width: "50%",
    height: "100%",
    transformStyle: "preserve-3d",
    transition: flipping
      ? "transform 2.4s cubic-bezier(.22,.61,.36,1)"
      : "none",
    cursor: "grab",
    zIndex: 6,
  };

  return (
    <section className="py-32 flex justify-center">
      <div
        style={{
          width: "1000px",
          height: "700px",
          perspective: "2600px",
          position: "relative",
        }}
      >
        {/* LEFT PAGE */}
        <div
          onMouseDown={onMouseDownLeft}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "50%",
            height: "100%",
            background: "#f5f2ec",
            zIndex: 1,
          }}
        >
          {leftImage ? (
            <img
              src={leftImage}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl tracking-widest">
              SKETCHES
            </div>
          )}
        </div>

        {/* RIGHT PAGE (UNDER FLIP) */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: "50%",
            height: "100%",
            background: "#f5f2ec",
            zIndex: 1,
          }}
        >
          {nextRightImage && (
            <img
              src={nextRightImage}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: flipping ? 1 : 0,
                transition: "opacity 1.2s ease",
              }}
            />
          )}
        </div>

        {/* BOOK SPINE */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            width: "6px",
            height: "100%",
            transform: "translateX(-50%)",
            background:
              "linear-gradient(to right, rgba(0,0,0,0.18), rgba(0,0,0,0.02), rgba(0,0,0,0.18))",
            zIndex: 4,
            pointerEvents: "none",
          }}
        />

        {/* FORWARD FLIP */}
        {canNext && (
          <div
            onMouseDown={onMouseDownRight}
            style={{
              ...baseFlip,
              right: 0,
              transformOrigin: "0% center",
              transform: flipping && dragging !== "prev"
                ? "rotateY(-180deg)"
                : "rotateY(0deg)",
            }}
          >
            <img
              src={rightImage}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                backfaceVisibility: "hidden",
              }}
            />
            <img
              src={`/sketches/sketch${page + 2}.JPG`}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden",
              }}
            />
          </div>
        )}

        {/* BACKWARD FLIP */}
        {canPrev && (
          <div
            style={{
              ...baseFlip,
              left: 0,
              transformOrigin: "100% center",
              transform: flipping && dragging === "prev"
                ? "rotateY(180deg)"
                : "rotateY(0deg)",
            }}
          >
            <img
              src={leftImage || ""}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                backfaceVisibility: "hidden",
              }}
            />
            {prevLeftImage && (
              <img
                src={prevLeftImage}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                }}
              />
            )}
          </div>
        )}

        {/* ARROWS */}
        <div className="absolute bottom-[-60px] left-1/2 -translate-x-1/2 flex gap-12 text-xl">
          <button
            onClick={() => canPrev && startFlip(-1)}
            className="opacity-60 hover:opacity-100"
          >
            &lt;
          </button>
          <button
            onClick={() => canNext && startFlip(1)}
            className="opacity-60 hover:opacity-100"
          >
            &gt;
          </button>
        </div>
      </div>
    </section>
  );
}
