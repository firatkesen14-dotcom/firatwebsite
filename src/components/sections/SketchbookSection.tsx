import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TOTAL = 30;
const PAGE_WIDTH = 420;
const GAP = 24;
const FLIP_DURATION = 900;

export default function SketchbookSection() {
  const [page, setPage] = useState(0); // sol sayfa index (0 = kapak)
  const [flipping, setFlipping] = useState<"forward" | "backward" | null>(null);

  const dragStartX = useRef<number | null>(null);
  const dragSide = useRef<"left" | "right" | null>(null);

  const canGoForward = page + 1 < TOTAL;
  const canGoBackward = page > 0;

  /* ---------- IMAGES ---------- */

  const leftImage =
    page === 0
      ? "/sketches/cover.JPG"
      : `/sketches/sketch${page}.JPG`;

  const rightImage =
    page + 1 <= TOTAL
      ? `/sketches/sketch${page + 1}.JPG`
      : null;

  // ileri flip sırasında sağ arkada GÖRÜNECEK sayfa
  const nextRightImage =
    page + 3 <= TOTAL ? `/sketches/sketch${page + 3}.JPG` : null;

  // geri flip sırasında sol arkada GÖRÜNECEK sayfa
  const prevLeftImage =
    page - 2 === 0
      ? "/sketches/cover.JPG"
      : page - 2 > 0
      ? `/sketches/sketch${page - 2}.JPG`
      : null;

  /* ---------- MOUSE ---------- */

  const onMouseDown = (side: "left" | "right", e: React.MouseEvent) => {
    dragStartX.current = e.clientX;
    dragSide.current = side;
  };

  const onMouseUp = (e: React.MouseEvent) => {
    if (dragStartX.current === null || dragSide.current === null) return;

    const delta = e.clientX - dragStartX.current;

    // İLERİ
    if (dragSide.current === "right" && delta < -40 && canGoForward) {
      setFlipping("forward");
      setTimeout(() => {
        setPage((p) => p + 2);
        setFlipping(null);
      }, FLIP_DURATION);
    }

    // GERİ
    if (dragSide.current === "left" && delta > 40 && canGoBackward) {
      setFlipping("backward");
      setTimeout(() => {
        setPage((p) => p - 2);
        setFlipping(null);
      }, FLIP_DURATION);
    }

    dragStartX.current = null;
    dragSide.current = null;
  };

  /* ---------- RENDER ---------- */

  return (
    <section className="py-32 select-none">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-4xl font-light text-center mb-16">
          Sketchbook
        </h2>

        <div
          className="relative mx-auto"
          style={{
            width: PAGE_WIDTH * 2 + GAP,
            perspective: "1800px",
          }}
          onMouseUp={onMouseUp}
        >
          {/* SOL ARKA (geri flip için kapak vs) */}
          {flipping === "backward" && prevLeftImage && (
            <img
              src={prevLeftImage}
              className="absolute top-0 left-0 shadow-xl"
              style={{ width: PAGE_WIDTH }}
              draggable={false}
            />
          )}

          {/* SOL SAYFA */}
          <img
            src={leftImage}
            className="absolute top-0 left-0 shadow-xl cursor-grab"
            style={{ width: PAGE_WIDTH }}
            onMouseDown={(e) => onMouseDown("left", e)}
            draggable={false}
          />

          {/* SAĞ SAYFA */}
          {rightImage && (
            <img
              src={rightImage}
              className="absolute top-0 shadow-xl cursor-grab"
              style={{
                width: PAGE_WIDTH,
                left: PAGE_WIDTH + GAP,
              }}
              onMouseDown={(e) => onMouseDown("right", e)}
              draggable={false}
            />
          )}

          {/* SAĞ ARKA (ileri flip için sketch3) */}
          {flipping === "forward" && nextRightImage && (
            <img
              src={nextRightImage}
              className="absolute top-0 shadow-xl"
              style={{
                width: PAGE_WIDTH,
                left: PAGE_WIDTH + GAP,
                opacity: 0.9,
              }}
              draggable={false}
            />
          )}

          {/* FLIP SAYFA */}
          {flipping && (
            <div
              className={`absolute top-0 ${
                flipping === "forward" ? "right-0" : "left-0"
              }`}
              style={{
                width: PAGE_WIDTH,
                transformStyle: "preserve-3d",
                transformOrigin: "center center",
                animation: `${
                  flipping === "forward" ? "flipForward" : "flipBackward"
                } ${FLIP_DURATION}ms cubic-bezier(.25,.8,.25,1) forwards`,
              }}
            >
              {/* FRONT */}
              <img
                src={
                  flipping === "forward"
                    ? rightImage!
                    : `/sketches/sketch${page}.JPG`
                }
                style={{ backfaceVisibility: "hidden" }}
                draggable={false}
              />

              {/* BACK */}
              <img
                src={
                  flipping === "forward"
                    ? `/sketches/sketch${page + 2}.JPG`
                    : leftImage
                }
                style={{
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                }}
                draggable={false}
              />
            </div>
          )}
        </div>

        {/* OKLAR */}
        <div className="flex justify-center items-center gap-8 mt-12">
          <button
            disabled={!canGoBackward || flipping !== null}
            onClick={() => {
              setFlipping("backward");
              setTimeout(() => {
                setPage((p) => p - 2);
                setFlipping(null);
              }, FLIP_DURATION);
            }}
          >
            <ChevronLeft />
          </button>

          <button
            disabled={!canGoForward || flipping !== null}
            onClick={() => {
              setFlipping("forward");
              setTimeout(() => {
                setPage((p) => p + 2);
                setFlipping(null);
              }, FLIP_DURATION);
            }}
          >
            <ChevronRight />
          </button>
        </div>

        {/* KEYFRAMES */}
        <style>{`
          @keyframes flipForward {
            0% {
              transform: rotateY(0deg) translateZ(0);
            }
            100% {
              transform: rotateY(-180deg) translateZ(0);
            }
          }

          @keyframes flipBackward {
            0% {
              transform: rotateY(0deg) translateZ(0);
            }
            100% {
              transform: rotateY(180deg) translateZ(0);
            }
          }
        `}</style>
      </div>
    </section>
  );
}
