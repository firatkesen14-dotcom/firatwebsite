import { useEffect, useRef, useState } from "react";

const TOTAL = 30;

export default function SketchbookSection() {
  const [page, setPage] = useState(0);
  const [flipping, setFlipping] = useState<"none" | "next" | "prev">("none");
  const [dragging, setDragging] = useState(false);
  const [flipProgress, setFlipProgress] = useState(0);

  const startX = useRef(0);
  const bookRef = useRef<HTMLDivElement>(null);

  const canNext = page + 2 < TOTAL;
  const canPrev = page - 2 >= 0;

  /* ---------------- DRAG ---------------- */
  const onMouseDown = (e: React.MouseEvent) => {
    if (flipping !== "none") return;
    const rect = bookRef.current!.getBoundingClientRect();
    const midX = rect.left + rect.width / 2;

    startX.current = e.clientX;
    setDragging(true);

    if (e.clientX > midX && canNext) {
      setFlipping("next");
      setFlipProgress(0);
    }

    if (e.clientX < midX && canPrev) {
      setFlipping("prev");
      setFlipProgress(0);
    }
  };

  /* ---------------- DRAG MOVE ---------------- */
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!dragging || flipping === "none") return;
      const delta = e.clientX - startX.current;

      if (flipping === "next" && delta < -16) {
        setDragging(false);
        finalizeFlip("next");
      }

      if (flipping === "prev" && delta > 16) {
        setDragging(false);
        finalizeFlip("prev");
      }
    };

    const up = () => setDragging(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [dragging, flipping]);

  /* ---------------- FLIP ---------------- */
  const finalizeFlip = (dir: "next" | "prev") => {
    const start = performance.now();
    const duration = 2400;

    const step = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      setFlipProgress(p * 100);

      if (p < 1) requestAnimationFrame(step);
      else {
        setPage((v) => (dir === "next" ? v + 2 : v - 2));
        setFlipping("none");
        setFlipProgress(0);
      }
    };

    requestAnimationFrame(step);
  };

  /* ---------------- IMAGES ---------------- */
  const leftImage = page === 0 ? null : `/sketches/sketch${page}.JPG`;
  const rightImage = page === 0 ? `/sketches/sketch1.JPG` : `/sketches/sketch${page + 1}.JPG`;

  const nextLeftImage = page + 2 <= TOTAL ? `/sketches/sketch${page + 2}.JPG` : null;
  const prevRightImage = page - 1 >= 0 ? `/sketches/sketch${page - 1}.JPG` : null;

  /* ---------------- DISPLAY (KRİTİK KISIM) ---------------- */

  const leftDisplay =
    flipping === "next" && flipProgress >= 50 ? nextLeftImage : leftImage;

  const rightDisplay =
    flipping === "prev" && flipProgress >= 50 ? prevRightImage : rightImage;

  /* ---------------- STYLES ---------------- */
  const rightFlipStyle: React.CSSProperties = {
    position: "absolute",
    right: 0,
    width: "50%",
    height: "100%",
    transformOrigin: "0% center",
    transform: flipping === "next" ? `rotateY(${-1.8 * flipProgress}deg)` : "none",
    transformStyle: "preserve-3d",
    zIndex: 5,
  };

  const leftFlipStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    width: "50%",
    height: "100%",
    transformOrigin: "100% center",
    transform: flipping === "prev" ? `rotateY(${1.8 * flipProgress}deg)` : "none",
    transformStyle: "preserve-3d",
    zIndex: 5,
  };

  return (
    <section className="py-32 flex justify-center">
      <div
        ref={bookRef}
        onMouseDown={onMouseDown}
        style={{
          width: "1000px",
          height: "700px",
          perspective: "2600px",
          position: "relative",
        }}
      >
        {/* LEFT PAGE */}
        <div style={{ position: "absolute", left: 0, width: "50%", height: "100%" }}>
          {leftDisplay && <img src={leftDisplay} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
        </div>

        {/* RIGHT PAGE */}
        <div style={{ position: "absolute", right: 0, width: "50%", height: "100%" }}>
          {rightDisplay && <img src={rightDisplay} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
        </div>

        {/* RIGHT FLIP */}
        {canNext && flipping === "next" && (
          <div style={rightFlipStyle}>
            <img src={rightImage} style={{ width: "100%", height: "100%", backfaceVisibility: "hidden" }} />
            <img
              src={nextLeftImage!}
              style={{
                position: "absolute",
                inset: 0,
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden",
              }}
            />
          </div>
        )}

        {/* LEFT FLIP */}
        {canPrev && flipping === "prev" && (
          <div style={leftFlipStyle}>
            <img src={leftImage!} style={{ width: "100%", height: "100%", backfaceVisibility: "hidden" }} />
            <img
              src={prevRightImage!}
              style={{
                position: "absolute",
                inset: 0,
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
