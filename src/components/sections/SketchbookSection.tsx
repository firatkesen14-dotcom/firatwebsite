import { useEffect, useRef, useState } from "react";

const TOTAL = 30;

export default function SketchbookSection() {
  const [page, setPage] = useState(0);
  const [flipping, setFlipping] = useState<"next" | "prev" | null>(null);

  const dragStartX = useRef(0);
  const dragSide = useRef<"left" | "right" | null>(null);

  const canNext = page < TOTAL - 1;
  const canPrev = page > 0;

  /* ---------------- DRAG ---------------- */

  const onMouseDownRight = (e: React.MouseEvent) => {
    if (!canNext || flipping) return;
    dragStartX.current = e.clientX;
    dragSide.current = "right";
  };

  // 🔹 EKLENEN: soldan tutup sağa çekerek geri dönüş
  const onMouseDownLeft = (e: React.MouseEvent) => {
    if (!canPrev || flipping) return;
    dragStartX.current = e.clientX;
    dragSide.current = "left";
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragSide.current || flipping) return;

      const delta = e.clientX - dragStartX.current;

      // ileri (sağ sayfadan sola)
      if (dragSide.current === "right" && delta < -20) {
        dragSide.current = null;
        startNext();
      }

      // 🔹 geri (sol sayfadan sağa)
      if (dragSide.current === "left" && delta > 20) {
        dragSide.current = null;
        startPrev();
      }
    };

    const onUp = () => {
      dragSide.current = null;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [flipping]);

  /* ---------------- FLIP ---------------- */

  const startNext = () => {
    if (flipping) return;
    setFlipping("next");
    setTimeout(() => {
      setPage(p => Math.min(p + 2, TOTAL - 1));
      setFlipping(null);
    }, 2400);
  };

  const startPrev = () => {
    if (flipping) return;
    setFlipping("prev");
    setTimeout(() => {
      setPage(p => Math.max(p - 2, 0));
      setFlipping(null);
    }, 2400);
  };

  /* ---------------- IMAGES ---------------- */

  const left =
    page === 0 ? null : `/sketches/sketch${page}.JPG`;

  const right =
    page === 0
      ? `/sketches/sketch1.JPG`
      : `/sketches/sketch${page + 1}.JPG`;

  const nextRight =
    page + 3 <= TOTAL ? `/sketches/sketch${page + 3}.JPG` : null;

  const prevLeft =
    page - 1 >= 1 ? `/sketches/sketch${page - 1}.JPG` : null;

  /* ---------------- VIEW ---------------- */

  return (
    <section className="py-32 flex justify-center">
      <div
        style={{
          width: 1000,
          height: 700,
          perspective: 2600,
          position: "relative",
        }}
      >
        {/* LEFT PAGE */}
        <div
          onMouseDown={onMouseDownLeft} // 🔹 soldan geri drag
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
          {left ? (
            <img
              src={left}
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
          {nextRight && (
            <img
              src={nextRight}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: flipping === "next" ? 1 : 0,
                transition: "opacity 1.2s ease",
              }}
            />
          )}
        </div>

        {/* SPINE */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            width: 6,
            height: "100%",
            transform: "translateX(-50%)",
            background:
              "linear-gradient(to right, rgba(0,0,0,.18), rgba(0,0,0,.02), rgba(0,0,0,.18))",
            zIndex: 4,
          }}
        />

        {/* NEXT FLIP */}
        {canNext && (
          <div
            onMouseDown={onMouseDownRight}
            style={{
              position: "absolute",
              right: 0,
              width: "50%",
              height: "100%",
              transformStyle: "preserve-3d",
              transformOrigin: "0% center",
              transform:
                flipping === "next" ? "rotateY(-180deg)" : "none",
              transition:
                flipping === "next"
                  ? "transform 2.4s cubic-bezier(.22,.61,.36,1)"
                  : "none",
              zIndex: 6,
            }}
          >
            <img
              src={right}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                backfaceVisibility: "hidden",
              }}
            />
            <img
              src={`/sketches/sketch${page + 2}.JPG`}
              style={{
                position: "absolute",
                inset: 0,
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden",
              }}
            />
          </div>
        )}

        {/* PREV FLIP (geri dönüş – AYNI efekt) */}
        {canPrev && (
          <div
            style={{
              position: "absolute",
              left: 0,
              width: "50%",
              height: "100%",
              transformStyle: "preserve-3d",
              transformOrigin: "100% center",
              transform:
                flipping === "prev" ? "rotateY(180deg)" : "none",
              transition:
                flipping === "prev"
                  ? "transform 2.4s cubic-bezier(.22,.61,.36,1)"
                  : "none",
              zIndex: 5,
            }}
          >
            <img
              src={left!}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                backfaceVisibility: "hidden",
              }}
            />
            <img
              src={prevLeft ?? "/sketches/cover.JPG"}
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
