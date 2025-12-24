import { useEffect, useRef, useState } from "react";

const TOTAL = 30; // sketch1 - sketch30

export default function SketchbookSection() {
  const [page, setPage] = useState(0); // 0 = ön kapak
  const [flipping, setFlipping] = useState<"none" | "next" | "prev">("none");
  const [dragging, setDragging] = useState(false);
  const [flipProgress, setFlipProgress] = useState(0);

  const startX = useRef(0);
  const bookRef = useRef<HTMLDivElement>(null);

  const canNext = page < TOTAL;
  const canPrev = page > 0;

  const onMouseDown = (e: React.MouseEvent) => {
    if (flipping !== "none") return;
    const rect = bookRef.current?.getBoundingClientRect();
    if (!rect) return;
    const midX = rect.left + rect.width / 2;

    startX.current = e.clientX;
    setDragging(true);

    if (e.clientX > midX && canNext) setFlipping("next");
    if (e.clientX < midX && canPrev) setFlipping("prev");
  };

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!dragging || flipping === "none") return;
      const delta = e.clientX - startX.current;

      if (flipping === "next" && delta < -16) finalizeFlip("next");
      if (flipping === "prev" && delta > 16) finalizeFlip("prev");
    };

    const up = () => setDragging(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [dragging, flipping]);

  const finalizeFlip = (dir: "next" | "prev") => {
    setFlipping(dir);
    const duration = 400; // ms, daha hızlı ve akıcı
    const start = performance.now();

    const step = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      setFlipProgress(progress * 100);

      if (progress < 1) requestAnimationFrame(step);
      else {
        setPage((p) => {
          if (dir === "next") return Math.min(p + 2, TOTAL);
          else return Math.max(p - 2, 0);
        });
        setFlipping("none");
        setFlipProgress(0);
      }
    };

    requestAnimationFrame(step);
  };

  /* ---------------- Görsel Seçimi ---------------- */
  const leftImage =
    page === 0
      ? "/sketches/cover-front.JPG"
      : `/sketches/sketch${page}.JPG`;
  const rightImage =
    page === 0
      ? `/sketches/sketch1.JPG`
      : page === TOTAL
      ? "/sketches/cover-back.JPG"
      : `/sketches/sketch${page + 1}.JPG`;

  const nextRightImage = page + 2 <= TOTAL ? `/sketches/sketch${page + 2}.JPG` : "/sketches/cover-back.JPG";
  const prevLeftImage = page - 1 > 0 ? `/sketches/sketch${page - 1}.JPG` : "/sketches/cover-front.JPG";

  /* ---------------- Flip Stilleri ---------------- */
  const rightFlipStyle: React.CSSProperties = {
    position: "absolute",
    right: 0,
    top: 0,
    width: "50%",
    height: "100%",
    transformOrigin: "0% center",
    transformStyle: "preserve-3d",
    transform: flipping === "next" ? `rotateY(${-flipProgress * 1.8}deg)` : "rotateY(0deg)",
    zIndex: 6,
  };

  const leftFlipStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    width: "50%",
    height: "100%",
    transformOrigin: "100% center",
    transformStyle: "preserve-3d",
    transform: flipping === "prev" ? `rotateY(${flipProgress * 1.8}deg)` : "rotateY(0deg)",
    zIndex: 6,
  };

  const leftDisplayImage =
    flipping === "next" && flipProgress >= 50 && page + 2 <= TOTAL
      ? nextRightImage
      : leftImage;

  const rightFrontOpacity = flipping === "next" ? (flipProgress < 50 ? 1 : 0) : 1;
  const rightBackOpacity = flipping === "next" ? (flipProgress >= 50 ? 1 : 0) : 0;

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
          <img
            src={leftDisplayImage}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
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
          <img
            src={nextRightImage}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
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
                opacity: rightFrontOpacity,
              }}
            />
            <img
              src={nextRightImage}
              style={{
                position: "absolute",
                inset: 0,
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: rightBackOpacity,
              }}
            />
          </div>
        )}

        {/* LEFT FLIP */}
        {canPrev && (
          <div style={leftFlipStyle}>
            <img
              src={leftImage}
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
