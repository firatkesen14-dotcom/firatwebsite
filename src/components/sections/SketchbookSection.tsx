import { useEffect, useRef, useState } from "react";

const TOTAL = 30;
const DRAG_THRESHOLD = 14;

export default function SketchbookSection() {
  const [page, setPage] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [flipDir, setFlipDir] = useState<1 | -1>(1);

  const startX = useRef(0);
  const bookRef = useRef<HTMLDivElement>(null);

  const canNext = page < TOTAL - 1;
  const canPrev = page > 0;

  /* ---------------- DRAG START ---------------- */
  const onMouseDown = (e: React.MouseEvent) => {
    if (flipping) return;
    if (!bookRef.current) return;

    const rect = bookRef.current.getBoundingClientRect();
    const midX = rect.left + rect.width / 2;

    // 👉 Sağ sayfa → ileri
    if (e.clientX > midX && canNext) {
      setFlipDir(1);
      startX.current = e.clientX;
      setDragging(true);
    }

    // 👈 Sol sayfa → geri
    if (e.clientX < midX && canPrev) {
      setFlipDir(-1);
      startX.current = e.clientX;
      setDragging(true);
    }
  };

  /* ---------------- DRAG MOVE ---------------- */
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!dragging || flipping) return;

      const deltaX = e.clientX - startX.current;

      // 👉 ileri
      if (flipDir === 1 && deltaX < -DRAG_THRESHOLD) {
        setDragging(false);
        startFlip(1);
      }

      // 👈 geri
      if (flipDir === -1 && deltaX > DRAG_THRESHOLD) {
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
    setFlipDir(dir);

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

  const backImage =
    flipDir === 1
      ? page + 2 <= TOTAL
        ? `/sketches/sketch${page + 2}.JPG`
        : rightImage
      : page - 1 > 0
      ? `/sketches/sketch${page - 1}.JPG`
      : leftImage;

  const nextRightImage =
    flipDir === 1 && page + 3 <= TOTAL
      ? `/sketches/sketch${page + 3}.JPG`
      : null;

  /* ---------------- FLIP STYLE ---------------- */
  const flipStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    width: "50%",
    height: "100%",
    transformStyle: "preserve-3d",
    zIndex: 6,
    cursor: "grab",

    ...(flipDir === 1
      ? {
          right: 0,
          transformOrigin: "0% center",
          transform: flipping ? "rotateY(-180deg)" : "rotateY(0deg)",
        }
      : {
          left: 0,
          transformOrigin: "100% center",
          transform: flipping ? "rotateY(180deg)" : "rotateY(0deg)",
        }),

    transition: flipping
      ? "transform 2.4s cubic-bezier(.22,.61,.36,1)"
      : "none",
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
            <img src={leftImage} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl tracking-widest">
              SKETCHES
            </div>
          )}
        </div>

        {/* RIGHT PAGE (UNDER FLIP) */}
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

        {/* FLIPPING PAGE */}
        {(canNext || canPrev) && (
          <div onMouseDown={onMouseDown} style={flipStyle}>
            {/* FRONT */}
            <img
              src={flipDir === 1 ? rightImage : leftImage ?? rightImage}
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
            {backImage && (
              <img
                src={backImage}
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
            )}
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
