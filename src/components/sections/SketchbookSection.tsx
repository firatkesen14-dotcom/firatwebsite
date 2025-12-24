import { useEffect, useRef, useState } from "react";

const TOTAL = 30;

export default function SketchbookSection() {
  const [index, setIndex] = useState(0); // 0: kapak + 1
  const [flipping, setFlipping] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [intent, setIntent] = useState(false);

  const startX = useRef(0);

  const canNext = index < TOTAL - 1;

  /* ---------------- DRAG ---------------- */

  const onMouseDown = (e: React.MouseEvent) => {
    if (!canNext || flipping) return;
    startX.current = e.clientX;
    setDragging(true);
    setIntent(false);
  };

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!dragging) return;
      if (e.clientX - startX.current < -10) {
        setIntent(true); // sadece niyet
      }
    };

    const up = () => {
      if (!dragging) return;
      setDragging(false);

      if (intent) {
        startFlip();
      }
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [dragging, intent]);

  /* ---------------- FLIP ---------------- */

  const startFlip = () => {
    if (flipping) return;
    setFlipping(true);

    setTimeout(() => {
      setIndex(i => Math.min(i + 2, TOTAL - 1));
      setFlipping(false);
    }, 2600); // biraz daha yavaş
  };

  /* ---------------- IMAGE PATHS ---------------- */

  const leftImage =
    index === 0 ? null : `/sketches/sketch${index}.JPG`;

  const rightImage =
    index === 0
      ? `/sketches/sketch1.JPG`
      : `/sketches/sketch${index + 1}.JPG`;

  const backImage =
    `/sketches/sketch${index + 2}.JPG`;

  const nextRight =
    `/sketches/sketch${index + 3}.JPG`;

  /* ---------------- STYLES ---------------- */

  const flipStyle = {
    transform: flipping
      ? "rotateY(-180deg) translateX(-8px)"
      : "rotateY(0deg)",
    transition: flipping
      ? "transform 2.6s cubic-bezier(.22,.61,.36,1)"
      : "none",
    transformOrigin: "left center",
    transformStyle: "preserve-3d" as const,
  };

  return (
    <section className="w-full py-32 flex flex-col items-center">
      <h2 className="text-3xl mb-12">Sketchbook</h2>

      <div
        style={{
          width: "1000px",
          height: "700px",
          perspective: "2400px",
          position: "relative",
        }}
      >
        {/* LEFT PAGE */}
        <div
          style={{
            position: "absolute",
            left: 0,
            width: "48%",
            height: "100%",
            background: "#f5f2ec",
            boxShadow: "inset -8px 0 12px rgba(0,0,0,.06)",
          }}
        >
          {leftImage ? (
            <img
              src={leftImage}
              className="w-full h-full object-contain"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl tracking-widest">
              SKETCHES
            </div>
          )}
        </div>

        {/* SPINE */}
        <div
          style={{
            position: "absolute",
            left: "48%",
            width: "4%",
            height: "100%",
          }}
        />

        {/* RIGHT STATIC (NEW PAGE FADE IN) */}
        {!flipping && (
          <div
            style={{
              position: "absolute",
              right: 0,
              width: "48%",
              height: "100%",
              background: "#f5f2ec",
            }}
          >
            <img
              src={rightImage}
              className="w-full h-full object-contain"
              draggable={false}
            />
          </div>
        )}

        {/* NEXT PAGE (FADE) */}
        {flipping && (
          <div
            style={{
              position: "absolute",
              right: 0,
              width: "48%",
              height: "100%",
              background: "#f5f2ec",
              opacity: 0,
              animation: "fadeIn 2.4s ease forwards",
            }}
          >
            <img
              src={nextRight}
              className="w-full h-full object-contain"
              draggable={false}
            />
          </div>
        )}

        {/* FLIPPING PAGE */}
        {canNext && (
          <div
            onMouseDown={onMouseDown}
            style={{
              position: "absolute",
              right: 0,
              width: "48%",
              height: "100%",
              background: "#f5f2ec",
              cursor: "grab",
              ...flipStyle,
            }}
          >
            {/* FRONT */}
            <img
              src={rightImage}
              className="absolute w-full h-full object-contain"
              draggable={false}
            />

            {/* BACK */}
            <img
              src={backImage}
              className="absolute w-full h-full object-contain"
              style={{
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden",
              }}
              draggable={false}
            />
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes fadeIn {
            to { opacity: 1; }
          }
        `}
      </style>
    </section>
  );
}
