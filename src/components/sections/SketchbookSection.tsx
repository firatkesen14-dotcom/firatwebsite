import React, { useRef } from "react";
import { HTMLFlipBook } from "./HTMLFlipBook"; // senin wrapper component'in

const TOTAL = 30;

export default function SketchbookSectionPageFlip() {
  const flipBookRef = useRef<any>(null);

  // Tüm sayfalar: kapak + sketchler + kapanış kapak
  const pages = [
    // Sol Kapak (boş)
    <div
      key="cover-left"
      style={{
        background: "#f5f2ec",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "48px",
        fontWeight: "bold",
        color: "#000",
      }}
    >
      Sketchbook
    </div>,
    // İlk sketch
    <img
      key="sketch1"
      src="/sketches/sketch1.JPG"
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />,
  ];

  // Diğer sketchler
  for (let i = 2; i <= TOTAL; i++) {
    pages.push(
      <img
        key={`sketch${i}`}
        src={`/sketches/sketch${i}.JPG`}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    );
  }

  // Son kapak
  pages.push(
    <div
      key="cover-right"
      style={{
        background: "#f5f2ec",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "48px",
        fontWeight: "bold",
        color: "#000",
      }}
    >
      Sketchbook
    </div>
  );

  return (
    <section className="py-32 flex justify-center">
      <div style={{ width: "1000px", height: "700px" }}>
        <HTMLFlipBook
          ref={flipBookRef}
          className="flip-book"
          style={{ width: "100%", height: "100%" }}
          width={1000}
          height={700}
          size="stretch"
          minWidth={315}
          maxWidth={1000}
          maxHeight={700}
          drawShadow={true}
          flippingTime={1000}
          showCover={true}
          mobileScrollSupport={true}
          children={pages}
        />
      </div>
    </section>
  );
}
