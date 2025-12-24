import { useRef, useState } from "react";

type Props = {
  sketches: string[];
};

export default function SketchbookSection({ sketches }: Props) {
  const [page, setPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);

  const startX = useRef(0);

  const canGoForward = page + 2 < sketches.length;
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

      // ileri drag → sağ sayfa → sola
      if (zone === "right" && delta < -30) {
        cleanup();
        startFlip(1);
      }

      // geri drag → sol sayfa → sağa
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

  // =========================
  // GÖRSEL INDEX HESAPLARI
  // =========================

  const leftIndex =
    direction === 1 ? page : page - 2;

  const rightIndex =
    direction === 1 ? page + 1 : page - 1;

  const backIndex =
    direction === 1 ? page + 2 : page - 3;

  return (
    <div className="sketchbook">

      {/* SOL SAYFA */}
      <div
        className="page left"
        onMouseDown={e => onMouseDown(e, "left")}
      >
        {sketches[leftIndex] && (
          <img src={sketches[leftIndex]} />
        )}
      </div>

      {/* SAĞ SAYFA */}
      <div
        className="page right"
        onMouseDown={e => onMouseDown(e, "right")}
      >
        {sketches[rightIndex] && (
          <img src={sketches[rightIndex]} />
        )}
      </div>

      {/* FLIP SAYFASI */}
      {isFlipping && (
        <div
          className={`flip ${direction === 1 ? "forward" : "backward"}`}
        >
          <img src={sketches[rightIndex]} />
          {sketches[backIndex] && (
            <img className="back" src={sketches[backIndex]} />
          )}
        </div>
      )}
    </div>
  );
}
