import { useEffect, useRef, useState } from "react";

const TOTAL = 30;

export default function SketchbookSection() {
  const [page, setPage] = useState(0);
  const [flipping, setFlipping] = useState<"none" | "next" | "prev">("none");
  const [dragging, setDragging] = useState(false);
  const [flipProgress, setFlipProgress] = useState(0); // 0-100 arası ilerleme

  const startX = useRef(0);
  const bookRef = useRef<HTMLDivElement>(null);

  const canNext = page + 2 < TOTAL;
  const canPrev = page - 2 >= 0;

  /* ---------------- DRAG ---------------- */
  const onMouseDown = (e: React.MouseEvent) => {
    if (flipping !== "none") return;

    const book = bookRef.current;
    if (!book) return;

    const rect = book.getBoundingClientRect();
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

  /* ---------------- FLIP ANIMATION ---------------- */
  const finalizeFlip = (dir: "next" | "prev") => {
    setFlipping(dir);
    const duration = 2400;
    const start = performance.now();

    const step = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      setFlipProgress(progress * 100);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setPage((p) => (dir === "next" ? p + 2 : p - 2));
        setFlipping("none");
        setFlipProgress(0);
      }
    };

    requestAnimationFrame(step);
  };

  /* ---------------- IMAGES ---------------- */
  const leftImage = page === 0 ? null : `/sketches/sketch${page}.JPG`;
  const rightImage = page === 0 ? `/sketches/sketch1.JPG` : `/sketches/sketch${page + 1}.JPG`;
  const nextRightImage = page + 3 <= TOTAL ? `/sketches/sketch${page + 3}.JPG` : null;
  const prevLeftImage = page - 1 >= 0 ? `/sketches/sketch${page - 1}.JPG` : null;
  const prevPrevLeftImage = page - 2 >= 0 ? `/sketches/sketch${page - 2}.JPG` : null;

  /* ---------------- STYLES ---------------- */
  const rightFlipStyle: React.CSSProperties = {
    position: "absolute",
    right: 0,
    top: 0,
    width: "50%",
    height: "100%",
    transformOrigin: "0% center",
    transformStyle: "preserve-3d",
    transform: flipping === "next" ? `rotateY(-180deg)` : "rotateY(0deg)",
    transition: flipping === "next" ? "transform 2.4s cubic-bezier(.22,.61,.36,1)" : "none",
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
    transform: flipping === "prev" ? "rotateY(180deg)" : "rotateY(0deg)",
    transition: flipping === "prev" ? "transform 2.4s cubic-bezier(.22,.61,.36,1)" : "none",
    zIndex: 6,
  };

  /* ---------------- FADE & ZINDEX ---------------- */
  const leftFadeStyle: React.CSSProperties = {
    opacity: flipping === "next" && flipProgress > 50 ? 0 : 1,
    transition: "opacity 0.2s ease",
    zIndex: 4,
  };

  const rightFadeStyle: React.CSSProperties = {
    opacity: flipping === "prev" && flipProgress > 50 ? 0 : 1,
    transition: "opacity 0.2s ease",
    zIndex: 4,
  };

  // İleri flip: sağ sayfa ön yüz/arka yüz geçişi için
  const rightFrontOpacity = flipping === "next" ? 1 - Math.min(flipProgress / 50, 1) : 1;
  const rightBackOpacity = flipping === "next" ? Math.max(flipProgress / 50, 0) : 0;

  const leftDisplayImage =
    flipping === "prev" && prevPrevLeftImage
      ? prevPrevLeftImage
      : flipping === "next" && flipProgress > 50 && page + 2 <= TOTAL
      ? `/sketches/sketch${page + 2}.JPG`
      : leftImage;

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
        <div style={{ position: "absolute", left: 0, width: "50%", height: "100%", background: "#f5f2ec", zIndex: 1 }}>
          {leftDisplayImage && <img src={leftDisplayImage} style={{ width: "100%", height: "100%", objectFit: "cover", ...leftFadeStyle }} />}
        </div>

        {/* RIGHT PAGE UNDER FLIP */}
        <div style={{ position: "absolute", right: 0, width: "50%", height: "100%", background: "#f5f2ec", zIndex: 1 }}>
          {nextRightImage && <img src={nextRightImage} style={{ width: "100%", height: "100%", objectFit: "cover", ...rightFadeStyle }} />}
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
              src={`/sketches/sketch${page + 2}.JPG`}
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
            <img src={leftImage || ""} style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", width: "100%", height: "100%", objectFit: "cover" }} />
            {prevLeftImage && (
              <img src={prevLeftImage} style={{ position: "absolute", inset: 0, transform: "rotateY(180deg)", backfaceVisibility: "hidden", width: "100%", height: "100%", objectFit: "cover" }} />
            )}
          </div>
        )}
      </div>
    </section>
  );
}
