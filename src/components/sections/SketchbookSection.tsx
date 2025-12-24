import { useEffect, useRef, useState } from "react";

const TOTAL = 30;

export default function SketchbookSection() {
  const [index, setIndex] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [dragging, setDragging] = useState<null | "left" | "right">(null);
  const startX = useRef(0);

  const canNext = index < TOTAL - 2;
  const canPrev = index > 0;

  /* ---------------- FLIP ---------------- */

  const startFlip = (dir: 1 | -1) => {
    if (flipping) return;
    setFlipping(true);

    setTimeout(() => {
      setIndex(i =>
        dir === 1
          ? Math.min(i + 2, TOTAL - 1)
          : Math.max(i - 2, 0)
      );
      setFlipping(false);
    }, 2600);
  };

  /* ---------------- MOUSE ---------------- */

  const onMouseDown = (side: "left" | "right") => (e: React.MouseEvent) => {
    if (flipping) return;
    startX.current = e.clientX;
    setDragging(side);
  };

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!dragging) return;

      const delta = e.clientX - startX.current;

      if (dragging === "right" && delta < -40 && canNext) {
        setDragging(null);
        startFlip(1);
      }

      if (dragging === "left" && delta > 40 && canPrev) {
        setDragging(null);
        startFlip(-1);
      }
    };

    const up = () => setDragging(null);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [dragging]);

  /* ---------------- IMAGES ---------------- */

  const leftImage =
    index === 0 ? null : `/sketches/sketch${index}.JPG`;

  const rightImage =
    index === 0
      ? `/sketches/sketch1.JPG`
      : `/sketches/sketch${index + 1}.JPG`;

  const backImage =
    index + 2 < TOTAL
      ? `/sketches/sketch${index + 2}.JPG`
      : null;

  const nextRight =
    index + 3 < TOTAL
      ? `/sketches/sketch${index + 3}.JPG`
      : null;

  /* ---------------- FLIP STYLE ---------------- */

  const flipForward = {
    transform: flipping ? "rotateY(-180deg)" : "rotateY(0deg)",
    transition: "transform 2.6s cubic-bezier(.22,.61,.36,1)",
    transformOrigin: "0% center",
    transformStyle: "preserve-3d" as const,
  };

  const flipBackward = {
    transform: flipping ? "rotateY(180deg)" : "rotateY(0deg)",
    transition: "transform 2.6s cubic-bezier(.22,.61,.36,1)",
    transformOrigin: "100% center",
    transformStyle: "preserve-3d" as const,
  };

  return (
    <section className="w-full py-32 flex flex-col items-center">
      <h2 className="text-3xl mb-12">Sketchbook</h2>

      <div
        style={{
          width: "1000px",
          height: "700px",
          perspective: "2600px",
          position: "relative",
        }}
      >
        {/* LEFT PAGE */}
        {leftImage && (
          <div
            onMouseDown={onMouseDown("left")}
            style={{
              position: "absolute",
              left: 0,
              width: "48%",
              height: "100%",
              cursor: "grab",
            }}
          >
            <img
              src={leftImage}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        )}

        {/* RIGHT PAGE */}
        {!flipping && (
          <div
            onMouseDown={onMouseDown("right")}
            style={{
              position: "absolute",
              right: 0,
              width: "48%",
              height: "100%",
              cursor: "grab",
            }}
          >
            <img
              src={rightImage}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        )}

        {/* NEXT RIGHT FADE */}
        {flipping && nextRight && (
          <div
            style={{
              position: "absolute",
              right: 0,
              width: "48%",
              height: "100%",
              opacity: 0,
              animation: "fadeIn 2.4s ease forwards",
            }}
          >
            <img
              src={nextRight}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        )}

        {/* FORWARD FLIP */}
        {canNext && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              width: "48%",
              height: "100%",
              ...flipForward,
            }}
          >
            <img
              src={rightImage}
              className="absolute w-full h-full object-cover"
              draggable={false}
            />

            {backImage && (
              <img
                src={backImage}
                className="absolute w-full h-full object-cover"
                style={{
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                }}
                draggable={false}
              />
            )}
          </div>
        )}

        {/* BACKWARD FLIP */}
        {canPrev && (
          <div
            style={{
              position: "absolute",
              left: 0,
              width: "48%",
              height: "100%",
              ...flipBackward,
            }}
          >
            <img
              src={leftImage!}
              className="absolute w-full h-full object-cover"
              draggable={false}
            />
          </div>
        )}
      </div>

      {/* ARROWS */}
      <div className="flex gap-10 mt-12 text-xl select-none">
        <button
          onClick={() => canPrev && startFlip(-1)}
          className="opacity-60 hover:opacity-100 transition"
        >
          &lt;
        </button>
        <button
          onClick={() => canNext && startFlip(1)}
          className="opacity-60 hover:opacity-100 transition"
        >
          &gt;
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          to { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
