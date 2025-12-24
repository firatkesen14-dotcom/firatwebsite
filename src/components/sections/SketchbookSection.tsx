import { useEffect, useRef, useState } from "react";

const TOTAL = 30;

export default function SketchbookSection() {
  const [page, setPage] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);

  const startX = useRef(0);

  const canNext = page < TOTAL - 1;
  const canPrev = page > 0;

  /* ---------------- DRAG ---------------- */

  const onMouseDownRight = (e: React.MouseEvent) => {
    if (!canNext || flipping) return;
    startX.current = e.clientX;
    setDirection(1);
    setDragging(true);
  };

  const onMouseDownLeft = (e: React.MouseEvent) => {
    if (!canPrev || flipping) return;
    startX.current = e.clientX;
    setDirection(-1);
    setDragging(true);
  };

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!dragging) return;

      if (direction === 1 && e.clientX < startX.current - 12) {
        setDragging(false);
        startFlip(1);
      }

      if (direction === -1 && e.clientX > startX.current + 12) {
        setDragging(false);
        startFlip(-1);
      }
    };

    const up = () => setDragging(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [dragging, direction]);

  /* ---------------- FLIP ---------------- */

  const startFlip = (dir: 1 | -1) => {
    if (flipping) return;
    setDirection(dir);
    setFlipping(true);

    setTimeout(() => {
      setPage(p =>
        dir === 1
          ? Math.min(p + 2, TOTAL - 1)
          : Math.max(p - 2, 0)
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
    page - 2 >= 0 ? `/sketches/sketch${page - 2}.JPG` : null;

  /* ---------------- FLIP STYLE ---------------- */

  const flipStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    [direction === 1 ? "right" : "left"]: 0,
    width: "50%",
    height: "100%",
    transformStyle: "preserve-3d",
    transformOrigin:
      direction === 1 ? "0% center" : "100% center",
    transform: flipping
      ? `rotateY(${direction === 1 ? -180 : 180}deg)`
      : "rotateY(0deg)",
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

        {/* RIGHT PAGE */}
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
          {direction === 1 && nextRightImage && (
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

        {/* FLIPPING PAGE */}
        {(direction === 1 ? canNext : canPrev) && (
          <div
            onMouseDown={direction === 1 ? onMouseDownRight : onMouseDownLeft}
            style={flipStyle}
          >
            {/* FRONT */}
            <img
              src={direction === 1 ? rightImage : leftImage ?? ""}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                backfaceVisibility: "hidden",
              }}
            />

            {/* BACK */}
            <img
              src={
                direction === 1
                  ? `/sketches/sketch${page + 2}.JPG`
                  : prevLeftImage ?? ""
              }
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

        {/* ARROWS */}
        <div className="absolute bottom-[-60px] left-1/2 -translate-x-1/2 flex gap-16 text-xl">
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
