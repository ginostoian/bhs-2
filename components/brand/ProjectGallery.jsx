"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
export default function ProjectGallery({ images, title }) {
  const [current, setCurrent] = useState(null);
  const dialog = useRef(null);
  const origin = useRef(null);
  const close = () => {
    dialog.current?.close();
    setCurrent(null);
    origin.current?.focus();
  };
  const open = (i, e) => {
    origin.current = e.currentTarget;
    setCurrent(i);
    dialog.current?.showModal();
  };
  const move = (n) =>
    setCurrent((i) => (i + n + images.length) % images.length);
  useEffect(() => {
    if (current === null) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [current]);
  return (
    <>
      <div className="bh-gallery">
        {images.map((src, i) => (
          <button
            key={src}
            className={i % 5 === 0 ? "bh-gallery-wide" : ""}
            onClick={(e) => open(i, e)}
            aria-label={`Enlarge photograph ${i + 1}: ${title}`}
          >
            <Image
              src={src}
              alt={`${title}, completed project photograph ${i + 1}`}
              width={1400}
              height={1000}
              sizes="(max-width:700px) 100vw, 60vw"
            />
            <span>View photograph ↗</span>
          </button>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="bh-lightbox"
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") move(1);
          if (e.key === "ArrowLeft") move(-1);
        }}
      >
        <div className="bh-lightbox-toolbar">
          <span>
            {current === null
              ? ""
              : `${current + 1} of ${images.length} · ${title}`}
          </span>
          <button
            autoFocus
            onClick={close}
            aria-label="Close photograph viewer"
          >
            Close ×
          </button>
        </div>
        {current !== null ? (
          <Image
            src={images[current]}
            alt={`${title}, photograph ${current + 1}`}
            width={1800}
            height={1300}
            sizes="95vw"
          />
        ) : null}
        <div className="bh-lightbox-controls">
          <button onClick={() => move(-1)} aria-label="Previous photograph">
            ← Previous
          </button>
          <button onClick={() => move(1)} aria-label="Next photograph">
            Next →
          </button>
        </div>
      </dialog>
    </>
  );
}
