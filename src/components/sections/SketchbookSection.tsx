import { useEffect, useRef, useState } from "react";

const TOTAL = 30;

export default function SketchbookSection() {
  const [page, setPage] = useState(0);
  const [flipping, setFlipping] = useState(false);

  const dragStartX = useRef(0);
  const dragSide = useRef<"left" | "right" | null>(null);

  const canNext = page < TOTAL - 1;
  const canPrev = page > 0;

  /* ---------------- DRAG HANDLERS ---------------- */

  const onMouseDownRight = (e: React.MouseEvent) => {
    if (!canNext || flipping) return;
    dragStartX.current = e.clientX;
    dragSide.current = "right";
  };

  const onMouseDownLeft = (e: React.MouseEvent) => {
    if (!canPrev || flipping) return;
    dragStartX.current = e.clientX;
    dragSide.current = "left";
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragSide.current || flipping) return;

      const delta = e.clientX - dragStartX.current;

      // ileri (sağ sayfa → sola çek)
      if (dragSide.current === "right" && delta < -15) {
        dragSide.current = null;
        startFlip(1);
      }

      // geri (sol sayfa → sağa çek)
      if (dragSide.current === "left" && delta > 15) {
        dragSide.current = null;
        startFlip(-1);
      }
    };

    const onUp = () => {
      dragSide.current = null;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [flipping]);

  /* ---------------- FLIP ---------------- */

  const startFlip = (dir: 1 | -1) => {
    if (flipping) return;
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

  /* ---------------- STYLES ---------------- */

  const flipStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    right: 0,
    width: "50%",
    height: "100%",
    transformStyle: "preserve-3d",
    transformOrigin: "0% center",
    transform: flipping ? "rotateY(-180deg)" : "rotateY(0deg)",
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

        {/* FLIPPING PAGE (RIGHT → LEFT) */}
        {canNext && (
          <div
            onMouseDown={onMouseDownRight}
            style={flipStyle}
          >
            {/* FRONT */}
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

            {/* BACK */}
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
      </div>
    </section>
  );
}
