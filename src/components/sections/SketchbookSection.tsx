import { useEffect, useRef, useState } from "react";

const TOTAL = 30;

export default function SketchbookSection() {
  const [page, setPage] = useState(0);
  const [flipping, setFlipping] = useState<1 | -1 | null>(null);
  const startX = useRef(0);
  const dragDir = useRef<1 | -1 | null>(null);

  const canNext = page < TOTAL - 1;
  const canPrev = page > 0;

  /* ---------------- DRAG ---------------- */

  const onMouseDownRight = (e: React.MouseEvent) => {
    if (!canNext || flipping) return;
    startX.current = e.clientX;
    dragDir.current = 1;
  };

  const onMouseDownLeft = (e: React.MouseEvent) => {
    if (!canPrev || flipping) return;
    startX.current = e.clientX;
    dragDir.current = -1;
  };

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!dragDir.current || flipping) return;

      if (dragDir.current === 1 && e.clientX < startX.current - 14) {
        setFlipping(1);
        dragDir.current = null;
      }

      if (dragDir.current === -1 && e.clientX > startX.current + 14) {
        setFlipping(-1);
        dragDir.current = null;
      }
    };

    const up = () => (dragDir.current = null);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [flipping]);

  /* ---------------- PAGE CHANGE ---------------- */

  useEffect(() => {
    if (!flipping) return;

    const t = setTimeout(() => {
      setPage(p =>
        flipping === 1
          ? Math.min(p + 2, TOTAL - 1)
          : Math.max(p - 2, 0)
      );
      setFlipping(null);
    }, 2400);

    return () => clearTimeout(t);
  }, [flipping]);

  /* ---------------- IMAGES ---------------- */

  const leftImage = page === 0 ? null : `/sketches/sketch${page}.JPG`;
  const rightImage =
    page === 0
      ? `/sketches/sketch1.JPG`
      : `/sketches/sketch${page + 1}.JPG`;

  /* ---------------- STYLES ---------------- */

  const rightFlipStyle: React.CSSProperties = {
    position: "absolute",
    right: 0,
    top: 0,
    width: "50%",
    height: "100%",
    transformStyle: "preserve-3d",
    transformOrigin: "0% center",
    transform: flipping === 1 ? "rotateY(-180deg)" : "none",
    transition: flipping === 1 ? "transform 2.4s ease" : "none",
    zIndex: 10,
    cursor: "grab",
  };

  const leftFlipStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    width: "50%",
    height: "100%",
    transformStyle: "preserve-3d",
    transformOrigin: "100% center",
    transform: flipping === -1 ? "rotateY(180deg)" : "none",
    transition: flipping === -1 ? "transform 2.4s ease" : "none",
    zIndex: 10,
    cursor: "grab",
  };

  return (
    <section className="py-32 flex justify-center">
      <div
        style={{
          width: 1000,
          height: 700,
          position: "relative",
          perspective: 2600,
        }}
      >
        {/* LEFT PAGE */}
        <div
          onMouseDown={onMouseDownLeft}
          style={{
            position: "absolute",
            left: 0,
            width: "50%",
            height: "100%",
            background: "#f5f2ec",
          }}
        >
          {leftImage && (
            <img src={leftImage} style={{ width: "100%", height: "100%" }} />
          )}
        </div>

        {/* RIGHT PAGE */}
        <div
          style={{
            position: "absolute",
            right: 0,
            width: "50%",
            height: "100%",
            background: "#f5f2ec",
          }}
        >
          <img src={rightImage} style={{ width: "100%", height: "100%" }} />
        </div>

        {/* RIGHT FLIP (İLERİ) */}
        {canNext && (
          <div style={rightFlipStyle} onMouseDown={onMouseDownRight}>
            <img
              src={rightImage}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backfaceVisibility: "hidden",
              }}
            />
            <img
              src={`/sketches/sketch${page + 2}.JPG`}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden",
              }}
            />
          </div>
        )}

        {/* LEFT FLIP (GERİ) */}
        {canPrev && (
          <div style={leftFlipStyle}>
            <img
              src={leftImage!}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backfaceVisibility: "hidden",
              }}
            />
            <img
              src={`/sketches/sketch${page - 1}.JPG`}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
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
