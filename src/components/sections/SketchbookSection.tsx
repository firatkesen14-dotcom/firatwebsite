import { useEffect, useRef, useState } from "react";

const TOTAL = 30;

export default function SketchbookSection() {
  const [page, setPage] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [flipDir, setFlipDir] = useState<1 | -1>(1);

  const startX = useRef(0);
  const bookRef = useRef<HTMLDivElement>(null);

  const canNext = page + 2 < TOTAL;
  const canPrev = page - 2 >= 0;

  /* ---------------- DRAG START ---------------- */
  const onMouseDown = (e: React.MouseEvent) => {
    if (flipping) return;
    const book = bookRef.current;
    if (!book) return;

    const rect = book.getBoundingClientRect();
    const midX = rect.left + rect.width / 2;

    startX.current = e.clientX;

    // SAĞ SAYFA → İLERİ
    if (e.clientX > midX && canNext) {
      setFlipDir(1);
      setDragging(true);
    }

    // SOL SAYFA → GERİ
    if (e.clientX < midX && canPrev) {
      setFlipDir(-1);
      setDragging(true);
    }
  };

  /* ---------------- DRAG MOVE ---------------- */
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!dragging || flipping) return;

      const delta = e.clientX - startX.current;

      // ileri
      if (flipDir === 1 && delta < -14) {
        setDragging(false);
        startFlip(1);
      }

      // geri
      if (flipDir === -1 && delta > 14) {
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
  }, [dragging, flipDir, flipping]);

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

  /* ---------------- IMAGES (AYNEN SENİN) ---------------- */
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

  /* ---------------- FLIP STYLE ---------------- */
  const flipStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    right: flipDir === 1 ? 0 : "50%",
    width: "50%",
    height: "100%",
    transformStyle: "preserve-3d",
    transformOrigin:
      flipDir === 1 ? "0% center" : "100% center",
    transform: flipping
      ? `rotateY(${flipDir === 1 ? -180 : 180}deg)`
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
        ref={bookRef}
        style={{
          width: "1000px",
          height: "700px",
          perspective: "2600px",
          position: "relative",
        }}
      >
        {/* LEFT PAGE */}
        <div
          onMouseDown={onMouseDown}
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
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl tracking-widest">
              SKETCHES
            </div>
          )}
        </div>

        {/* RIGHT PAGE */}
        <div
          onMouseDown={onMouseDown}
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

        {/* FLIPPING PAGE */}
        {(canNext || canPrev) && (
          <div onMouseDown={onMouseDown} style={flipStyle}>
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
              src={
                page + 2 <= TOTAL
                  ? `/sketches/sketch${page + 2}.JPG`
                  : rightImage
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
