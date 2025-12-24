import { useEffect, useRef, useState } from "react";

const TOTAL = 30;

export default function SketchbookSection() {
  const [page, setPage] = useState(0);
  const [flipping, setFlipping] = useState<"none" | "next" | "prev">("none");
  const [dragging, setDragging] = useState(false);

  const startX = useRef(0);
  const bookRef = useRef<HTMLDivElement>(null);

  const canNext = page + 2 < TOTAL;
  const canPrev = page - 2 >= 0;

  /* ---------------- DRAG START ---------------- */
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
    }

    if (e.clientX < midX && canPrev) {
      setFlipping("prev");
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

  /* ---------------- FLIP END ---------------- */
  const finalizeFlip = (dir: "next" | "prev") => {
    setTimeout(() => {
      setPage(p => (dir === "next" ? p + 2 : p - 2));
      setFlipping("none");
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
    page + 3 <= TOTAL
      ? `/sketches/sketch${page + 3}.JPG`
      : null;

  const prevLeftImage =
    page - 1 >= 0
      ? `/sketches/sketch${page - 1}.JPG`
      : null;

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
      flipping === "next" ? "rotateY(-180deg)" : "rotateY(0deg)",
    transition:
      flipping === "next"
        ? "transform 2.4s cubic-bezier(.22,.61,.36,1)"
        : "none",
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
    transform:
      flipping === "prev" ? "rotateY(180deg)" : "rotateY(0deg)",
    transition:
      flipping === "prev"
        ? "transform 2.4s cubic-bezier(.22,.61,.36,1)"
        : "none",
    zIndex: 6,
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
        <div style={{ position: "absolute", left: 0, width: "50%", height: "100%", background: "#f5f2ec", zIndex: 1 }}>
          {leftImage && <img src={leftImage} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
        </div>

        {/* RIGHT PAGE */}
        <div style={{ position: "absolute", right: 0, width: "50%", height: "100%", background: "#f5f2ec", zIndex: 1 }}>
          {nextRightImage && <img src={nextRightImage} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: flipping === "next" ? 1 : 0 }} />}
        </div>

        {/* RIGHT FLIP */}
        {canNext && (
          <div style={rightFlipStyle}>
            <img src={rightImage} style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", width: "100%", height: "100%", objectFit: "cover" }} />
            <img src={`/sketches/sketch${page + 2}.JPG`} style={{ position: "absolute", inset: 0, transform: "rotateY(180deg)", backfaceVisibility: "hidden", width: "100%", height: "100%", objectFit: "cover" }} />
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
