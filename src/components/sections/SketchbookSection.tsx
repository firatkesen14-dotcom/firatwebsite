import { useEffect, useRef, useState } from "react";

const TOTAL = 30;

export default function SketchbookSection() {
  const [page, setPage] = useState(0);
  const [flipping, setFlipping] = useState<"none" | "next" | "prev">("none");
  const [flipProgress, setFlipProgress] = useState(0);
  const [dragging, setDragging] = useState(false);

  const startX = useRef(0);

  const canNext = page < TOTAL;
  const canPrev = page > 0;

  // ---------------- FLIP ----------------
  const startFlip = (dir: "next" | "prev") => {
    if (flipping !== "none") return;
    setFlipping(dir);
    setFlipProgress(0);
  };

  useEffect(() => {
    if (flipping === "none") return;

    const id = setInterval(() => {
      setFlipProgress((p) => {
        if (p >= 1) {
          clearInterval(id);
          setFlipping("none");
          setPage((pg) => (flipping === "next" ? pg + 1 : pg - 1));
          return 0;
        }
        return p + 0.08;
      });
    }, 16);

    return () => clearInterval(id);
  }, [flipping]);

  // ---------------- MOUSE ----------------
  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setDragging(true);
    startX.current = e.clientX;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    if (flipping !== "none") return;

    const delta = e.clientX - startX.current;

    if (delta < -80 && canNext) {
      setDragging(false);
      startFlip("next");
    }

    if (delta > 80 && canPrev) {
      setDragging(false);
      startFlip("prev");
    }
  };

  const onMouseUp = () => {
    setDragging(false);
  };

  // ---------------- IMAGES ----------------
  const getImage = (index: number) => {
    if (index === 0) return "/cover.jpg";
    if (index === TOTAL + 1) return "/backcover.jpg";
    return `/sketch${index}.JPG`;
  };

  const leftIndex = page;
  const rightIndex = page + 1;

  // ---------------- RENDER ----------------
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        userSelect: "none",
      }}
    >
      {/* BOOK */}
      <div
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onContextMenu={(e) => e.preventDefault()}
        style={{
          width: 800,
          height: 500,
          display: "flex",
          position: "relative",
          background: "#111",
        }}
      >
        {/* LEFT PAGE */}
        <img
          src={getImage(leftIndex)}
          style={{
            width: "50%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* RIGHT PAGE */}
        <img
          src={getImage(rightIndex)}
          style={{
            width: "50%",
            height: "100%",
            objectFit: "cover",
            transform:
              flipping === "next"
                ? `rotateY(${-180 * flipProgress}deg)`
                : flipping === "prev"
                ? `rotateY(${180 * flipProgress}deg)`
                : "none",
            transformOrigin:
              flipping === "next" ? "left center" : "right center",
          }}
        />
      </div>

      {/* ================================================= */}
      {/* =============== SADECE BURASI EKLENDİ ============ */}
      {/* ================================================= */}

      <div
        style={{
          marginTop: 24,
          display: "flex",
          gap: 40,
          fontSize: 32,
        }}
      >
        <button
          onClick={() => canPrev && startFlip("prev")}
          disabled={!canPrev}
          style={{
            background: "none",
            border: "none",
            color: canPrev ? "#fff" : "#555",
            cursor: canPrev ? "pointer" : "default",
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
            color: canNext ? "#fff" : "#555",
            cursor: canNext ? "pointer" : "default",
          }}
        >
          ›
        </button>
      </div>
    </div>
  );
}
