import { useEffect, useRef, useState } from "react";

const TOTAL = 30;

export default function SketchbookSection() {
  const [page, setPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);

  const startX = useRef(0);

  const canGoForward = page + 2 < TOTAL;
  const canGoBack = page - 2 >= 0;

  function startFlip(dir: 1 | -1) {
    if (isFlipping) return;
    if (dir === 1 && !canGoForward) return;
    if (dir === -1 && !canGoBack) return;

    setDirection(dir);
    setIsFlipping(true);

    setTimeout(() => {
      setPage(p => p + dir * 2);
      setIsFlipping(false);
    }, 700);
  }

  function onMouseDown(
    e: React.MouseEvent,
    zone: "left" | "right"
  ) {
    startX.current = e.clientX;

    const onMove = (ev: MouseEvent) => {
      const delta = ev.clientX - startX.current;

      // ileri → sağ sayfa → sola
      if (zone === "right" && delta < -30) {
        cleanup();
        startFlip(1);
      }

      // geri → sol sayfa → sağa
      if (zone === "left" && delta > 30) {
        cleanup();
        startFlip(-1);
      }
    };

    const cleanup = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", cleanup);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", cleanup);
  }

  return (
    <section className="sketchbook">

      {/* SOL SAYFA */}
      <div
        className="page left"
        onMouseDown={e => onMouseDown(e, "left")}
      >
        <img src={`/sketches/${page}.jpg`} />
      </div>

      {/* SAĞ SAYFA */}
      <div
        className="page right"
        onMouseDown={e => onMouseDown(e, "right")}
      >
        <img src={`/sketches/${page + 1}.jpg`} />
      </div>

      {/* FLIP */}
      {isFlipping && (
        <div
          className={`flip ${direction === 1 ? "forward" : "backward"}`}
        >
          <img src={`/sketches/${page + 1}.jpg`} />
          <img
            className="back"
            src={`/sketches/${page + 2}.jpg`}
          />
        </div>
      )}
    </section>
  );
}
