import { useRef, useState } from "react";

const TOTAL = 30;
const DRAG_THRESHOLD = 80;

export default function SketchbookSection() {
  const [page, setPage] = useState(0); // 0 = kapak
  const [flipping, setFlipping] = useState<"next" | "prev" | null>(null);
  const [draggingSide, setDraggingSide] = useState<"left" | "right" | null>(null);

  const startX = useRef(0);

  /* ---------------- IMAGES ---------------- */

  const leftImage =
    page === 0
      ? "/sketches/cover.JPG"
      : `/sketches/sketch${page * 2}.JPG`;

  const rightImage =
    page === 0
      ? "/sketches/sketch1.JPG"
      : `/sketches/sketch${page * 2 + 1}.JPG`;

  const nextRightImage =
    page * 2 + 3 <= TOTAL
      ? `/sketches/sketch${page * 2 + 3}.JPG`
      : null;

  const prevLeftImage =
    page > 1 ? `/sketches/sketch${page * 2 - 2}.JPG` : "/sketches/cover.JPG";

  /* ---------------- DRAG ---------------- */

  const onMouseDown = (e: React.MouseEvent, side: "left" | "right") => {
    startX.current = e.clientX;
    setDraggingSide(side);
  };

  const onMouseUp = (e: React.MouseEvent) => {
    if (!draggingSide) return;

    const diff = e.clientX - startX.current;

    /* ---- NEXT ---- */
    if (
      draggingSide === "right" &&
      diff < -DRAG_THRESHOLD &&
      page * 2 + 1 < TOTAL &&
      !flipping
    ) {
      setFlipping("next");
      setTimeout(() => {
        setPage((p) => p + 1);
        setFlipping(null);
      }, 900);
    }

    /* ---- PREV ---- */
    if (
      draggingSide === "left" &&
      diff > DRAG_THRESHOLD &&
      page > 0 &&
      !flipping
    ) {
      setFlipping("prev");
      setTimeout(() => {
        setPage((p) => p - 1);
        setFlipping(null);
      }, 900);
    }

    setDraggingSide(null);
  };

  /* ---------------- STYLES ---------------- */

  const pageBase: React.CSSProperties = {
    width: "48%",
    height: "100%",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "absolute",
    top: 0,
  };

  return (
    <section className="py-32">
      <div className="mx-auto max-w-6xl">
        <div
          className="relative mx-auto"
          style={{
            height: "80vh",
            perspective: "2200px",
            display: "flex",
            justifyContent: "space-between",
            gap: "4%",
          }}
          onMouseUp={onMouseUp}
        >
          {/* ---------- LEFT PAGE ---------- */}
          <div
            style={{
              ...pageBase,
              left: 0,
              backgroundImage: `url(${leftImage})`,
            }}
            onMouseDown={(e) => onMouseDown(e, "left")}
          />

          {/* ---------- RIGHT PAGE ---------- */}
          <div
            style={{
              ...pageBase,
              right: 0,
              backgroundImage: `url(${rightImage})`,
            }}
            onMouseDown={(e) => onMouseDown(e, "right")}
          />

          {/* ---------- NEXT FLIP ---------- */}
          {flipping === "next" && nextRightImage && (
            <div
              style={{
                position: "absolute",
                right: "52%",
                width: "48%",
                height: "100%",
                transformOrigin: "left center",
                animation: "pageFlipNext 0.9s ease-in-out forwards",
                backgroundImage: `url(${rightImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  transform: "rotateY(180deg)",
                  backgroundImage: `url(${nextRightImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </div>
          )}

          {/* ---------- PREV FLIP ---------- */}
          {flipping === "prev" && (
            <div
              style={{
                position: "absolute",
                left: "52%",
                width: "48%",
                height: "100%",
                transformOrigin: "right center",
                animation: "pageFlipPrev 0.9s ease-in-out forwards",
                backgroundImage: `url(${leftImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  transform: "rotateY(180deg)",
                  backgroundImage: `url(${prevLeftImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* ---------- ANIMATIONS ---------- */}
      <style>{`
        @keyframes pageFlipNext {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(-180deg); }
        }

        @keyframes pageFlipPrev {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(180deg); }
        }
      `}</style>
    </section>
  );
}
