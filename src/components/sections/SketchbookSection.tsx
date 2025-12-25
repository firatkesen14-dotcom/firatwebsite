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
    if (e.button !== 0) return; // sadece sol tık
    startX.current = e.clientX;
    setDragging(true);
  };

  const onMouseUp = () => {
    setDragging(false);
  };

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
    <section className="py-32 flex flex-col items-center">
      {/* ================= SKETCHBOOK HEADER (EKLENDİ) ================= */}
      <div className="mb-12 text-center">
        <h2
          style={{
            fontSize: 48,
            fontWeight: 600,
            letterSpacing: "0.1em",
          }}
        >
          SKETCHBOOK
        </h2>
        <p
          style={{
            marginTop: 12,
            fontSize: 16,
            opacity: 0.7,
          }}
        >
          El çalışmalarım ve çizimlerim
        </p>
      </div>

      <div
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onContextMenu={(e) => e.preventDefault()}
        style={{
          width: 1000,
          height: 700,
          position: "relative",
          perspective: 2400,
          background: "#ddd",
          userSelect: "none",
          cursor: "grab",
        }}
      >
        {/* LEFT STATIC */}
        <div style={{ position: "absolute", left: 0, width: "50%", height: "100%" }}>
          <img
            src={pageSrc(leftIndex)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* RIGHT STATIC */}
        <div style={{ position: "absolute", right: 0, width: "50%", height: "100%" }}>
          <img
            src={pageSrc(rightIndex)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* NEXT UNDER */}
        {flip === "next" && (
          <div style={{ position: "absolute", right: 0, width: "50%", height: "100%", zIndex: 1 }}>
            <img
              src={pageSrc(nextRight)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}

        {/* PREV UNDER */}
        {flip === "prev" && (
          <div style={{ position: "absolute", left: 0, width: "50%", height: "100%", zIndex: 1 }}>
            <img
              src={pageSrc(prevLeft)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}

        {/* RIGHT FLIP */}
        {flip === "next" && (
          <div
            style={{
              position: "absolute",
              right: 0,
              width: "50%",
              height: "100%",
              transformOrigin: "0% center",
              transform: `rotateY(${-180 * progress}deg)`,
              transformStyle: "preserve-3d",
              zIndex: 5,
            }}
          >
            <img
              src={pageSrc(rightIndex)}
              style={{
                position: "absolute",
                inset: 0,
                backfaceVisibility: "hidden",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <img
              src={pageSrc(nextLeft)}
              style={{
                position: "absolute",
                inset: 0,
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        )}

        {/* LEFT FLIP */}
        {flip === "prev" && (
          <div
            style={{
              position: "absolute",
              left: 0,
              width: "50%",
              height: "100%",
              transformOrigin: "100% center",
              transform: `rotateY(${180 * progress}deg)`,
              transformStyle: "preserve-3d",
              zIndex: 5,
            }}
          >
            <img
              src={pageSrc(leftIndex)}
              style={{
                position: "absolute",
                inset: 0,
                backfaceVisibility: "hidden",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <img
              src={pageSrc(prevRight)}
              style={{
                position: "absolute",
                inset: 0,
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        )}
      </div>

      {/* ================= ARROWS (SADECE EKLENDİ) ================= */}
      <div
        style={{
          marginTop: 24,
          display: "flex",
          gap: 40,
          fontSize: 40,
          userSelect: "none",
        }}
      >
        <button
          onClick={() => canPrev && startFlip("prev")}
          disabled={!canPrev}
          style={{
            background: "none",
            border: "none",
            cursor: canPrev ? "pointer" : "default",
            opacity: canPrev ? 1 : 0.3,
          }}
        >
          ‹
        </button>

        <button
          onClick={() => canNext && startFlip("next")}
          disabled={!canNext}
          style={{
            background: "none",
            border: "none",
            cursor: canNext ? "pointer" : "default",
            opacity: canNext ? 1 : 0.3,
          }}
        >
          ›
        </button>
      </div>
    </section>
  );
}
