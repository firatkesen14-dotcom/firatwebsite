import { useEffect, useRef, useState } from "react";

const TOTAL = 30;

export default function SketchbookSection() {
  const [page, setPage] = useState(0); // 0: kapak, 1: sketch1...
  const [flipping, setFlipping] = useState<"none" | "next" | "prev">("none");
  const [flipProgress, setFlipProgress] = useState(0);

  const bookRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const [dragging, setDragging] = useState(false);

  const canNext = page + 1 <= TOTAL;
  const canPrev = page > 0;

  /* ---------------- DRAG ---------------- */
  const onMouseDown = (e: React.MouseEvent) => {
    if (flipping !== "none") return;

    const rect = bookRef.current?.getBoundingClientRect();
    if (!rect) return;

    startX.current = e.clientX;
    setDragging(true);

    const midX = rect.left + rect.width / 2;
    if (e.clientX > midX && canNext) setFlipping("next");
    if (e.clientX < midX && canPrev) setFlipping("prev");
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging || flipping === "none") return;

      const delta = e.clientX - startX.current;

      if (flipping === "next" && delta < -10) {
        setDragging(false);
        startFlip("next");
      }
      if (flipping === "prev" && delta > 10) {
        setDragging(false);
        startFlip("prev");
      }
    };
    const onMouseUp = () => setDragging(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging, flipping]);

  /* ---------------- FLIP ANIMATION ---------------- */
  const startFlip = (dir: "next" | "prev") => {
    setFlipping(dir);
    const duration = 800;
    const start = performance.now();

    const step = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      setFlipProgress(progress * 100);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setPage((p) => (dir === "next" ? p + 1 : p - 1));
        setFlipping("none");
        setFlipProgress(0);
      }
    };

    requestAnimationFrame(step);
  };

  /* ---------------- IMAGES ---------------- */
  const leftImage = page === 0 ? null : `/sketches/sketch${page}.JPG`;
  const rightImage =
    page === 0 ? `/sketches/sketch1.JPG` : `/sketches/sketch${page + 1}.JPG`;
  const nextRightImage = page + 2 <= TOTAL ? `/sketches/sketch${page + 2}.JPG` : null;
  const prevLeftImage = page - 1 >= 1 ? `/sketches/sketch${page - 1}.JPG` : null;

  /* ---------------- STYLES ---------------- */
  const rightFlipStyle: React.CSSProperties = {
    position: "absolute",
    right: 0,
    top: 0,
    width: "50%",
    height: "100%",
    transformOrigin: "0% center",
    transformStyle: "preserve-3d",
    transform:
      flipping === "next"
        ? `rotateY(${(flipProgress / 100) * -180}deg)`
        : "rotateY(0deg)",
    transition: flipping === "none" ? "none" : undefined,
    zIndex: 5,
  };

  const leftFlipStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    width: "50%",
    height: "100%",
    transformOrigin: "100% center",
    transformStyle: "preserve-3d",
    transform:
      flipping === "prev"
        ? `rotateY(${(flipProgress / 100) * 180}deg)`
        : "rotateY(0deg)",
    transition: flipping === "none" ? "none" : undefined,
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
        <div
          style={{
            position: "absolute",
            left: 0,
            width: "50%",
            height: "100%",
            background: "#f5f2ec",
            zIndex: 1,
          }}
        >
          {leftImage && (
            <img
              src={leftImage}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}
        </div>

        {/* RIGHT PAGE UNDER FLIP */}
        <div
          style={{
            position: "absolute",
            right: 0,
            width: "50%",
            height: "100%",
            background: "#f5f2ec",
            zIndex: 1,
          }}
        >
          {nextRightImage && (
            <img
              src={nextRightImage}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
        </div>

        {/* RIGHT FLIP */}
        {canNext && (
          <div style={rightFlipStyle}>
            <img
              src={rightImage}
              style={{
                position: "absolute",
                inset: 0,
                backfaceVisibility: "hidden",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            {page + 1 <= TOTAL && (
              <img
                src={`/sketches/sketch${page + 1}.JPG`}
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
            )}
          </div>
        )}

        {/* LEFT FLIP */}
        {canPrev && (
          <div style={leftFlipStyle}>
            <img
              src={leftImage || ""}
              style={{
                position: "absolute",
                inset: 0,
                backfaceVisibility: "hidden",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            {prevLeftImage && (
              <img
                src={prevLeftImage}
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
            )}
          </div>
        )}
      </div>
    </section>
  );
}
