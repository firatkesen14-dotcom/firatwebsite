"use client";

import { useState, useRef } from "react";

const sketches = [
  "/sketches/cover.jpg",
  "/sketches/sketch1.jpg",
  "/sketches/sketch2.jpg",
  "/sketches/sketch3.jpg",
  "/sketches/sketch4.jpg",
];

const PAGE_WIDTH = 420;  // görsel genişliği (px)
const PAGE_HEIGHT = 594; // A3 oranı
const GAP = 40; // iki sayfa arası boşluk

export default function SketchbookSection() {
  const [index, setIndex] = useState(0);
  const [isTurning, setIsTurning] = useState(false);
  const [dragStartX, setDragStartX] = useState<number | null>(null);

  const maxIndex = sketches.length - 2;

  const next = () => {
    if (index < maxIndex && !isTurning) {
      setIsTurning(true);
      setTimeout(() => {
        setIndex((i) => i + 2);
        setIsTurning(false);
      }, 900);
    }
  };

  const prev = () => {
    if (index > 0 && !isTurning) {
      setIsTurning(true);
      setTimeout(() => {
        setIndex((i) => i - 2);
        setIsTurning(false);
      }, 900);
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    const bounds = (e.currentTarget as HTMLElement).getBoundingClientRect();
    if (e.clientX > bounds.left + PAGE_WIDTH / 2) {
      setDragStartX(e.clientX);
    }
  };

  const onMouseUp = (e: React.MouseEvent) => {
    if (dragStartX !== null && e.clientX < dragStartX) {
      next();
    }
    setDragStartX(null);
  };

  return (
    <div style={{ width: "100%", overflow: "hidden" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: `${GAP}px`,
          perspective: "2200px",
          userSelect: "none",
        }}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      >
        {/* SOL SAYFA */}
        <Page image={sketches[index]} />

        {/* SAĞ SAYFA + KIVRILMA */}
        <div
          style={{
            width: PAGE_WIDTH,
            height: PAGE_HEIGHT,
            position: "relative",
            transformStyle: "preserve-3d",
            transformOrigin: `-${GAP / 2}px center`,
            transform: isTurning
              ? "rotateY(-155deg)"
              : "rotateY(0deg)",
            transition: "transform 0.9s cubic-bezier(0.25, 0.8, 0.25, 1)",
          }}
        >
          {/* Ön yüz */}
          <Page image={sketches[index + 1]} />

          {/* Arka yüz */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
            }}
          >
            <Page image={sketches[index + 2]} />
          </div>
        </div>
      </div>

      {/* OKLAR + SAYFA DURUMU */}
      <div
        style={{
          marginTop: 32,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
        }}
      >
        <button onClick={prev}>{"<"}</button>

        {Array.from({ length: sketches.length / 2 }).map((_, i) => (
          <span
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background:
                i * 2 === index ? "#999" : "#000",
              opacity: i * 2 === index ? 0.4 : 1,
            }}
          />
        ))}

        <button onClick={next}>{">"}</button>
      </div>
    </div>
  );
}

function Page({ image }: { image: string }) {
  return (
    <div
      style={{
        width: PAGE_WIDTH,
        height: PAGE_HEIGHT,
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backfaceVisibility: "hidden",
      }}
    />
  );
}
