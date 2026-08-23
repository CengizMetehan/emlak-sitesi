"use client";

import { useState } from "react";
import Image from "next/image";

type PropertyGalleryProps = {
  images: string[];
  title: string;
  initialImage?: string;
  sahibindenUrl?: string;
};
export default function PropertyGallery({
  images,
  title,
  initialImage,
  sahibindenUrl,
}: PropertyGalleryProps) {
  const initialIndex = initialImage ? images.indexOf(initialImage) : 0;

  const [activeIndex, setActiveIndex] = useState(
    initialIndex >= 0 ? initialIndex : 0,
  );
  const [isOpen, setIsOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div className="flex h-[360px] flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white px-6 text-center shadow-sm">
        <p className="text-base text-zinc-500">
          Bu portföy için görsel bulunamadı.
        </p>

        {sahibindenUrl && (
          <a
            href={sahibindenUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 text-base  text-blue-600 underline decoration-blue-300 underline-offset-4 transition hover:text-blue-700 hover:decoration-blue-700"
          >
            Sahibinden&apos;de görüntülemek için buraya tıklayın
          </a>
        )}
      </div>
    );
  }

  const previousImage = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      {/* ANA GALERİ */}
      <div className="w-full min-w-0 max-w-full">
        {/* BÜYÜK FOTOĞRAF */}
        <div
          className="group relative h-[300px] w-full min-w-0 max-w-full cursor-zoom-in overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-sm md:h-[380px] xl:h-[530px]"
          onClick={() => setIsOpen(true)}
        >
          <img
            src={images[activeIndex]}
            alt={`${title} - ${activeIndex + 1}`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.015]"
          />

          {/* SOL OK */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                previousImage();
              }}
              className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-2xl text-zinc-950 shadow-lg backdrop-blur transition hover:scale-105 hover:bg-white"
              aria-label="Önceki fotoğraf"
            >
              ‹
            </button>
          )}

          {/* SAĞ OK */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-2xl text-zinc-950 shadow-lg backdrop-blur transition hover:scale-105 hover:bg-white"
              aria-label="Sonraki fotoğraf"
            >
              ›
            </button>
          )}

          {/* FOTOĞRAF SAYACI */}
          <div className="absolute bottom-4 right-4 rounded-full bg-zinc-950/80 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur">
            {activeIndex + 1} / {images.length}
          </div>
        </div>

        {/* KÜÇÜK FOTOĞRAFLAR */}
        <div className="mt-4 w-full min-w-0 max-w-full overflow-hidden">
          <div
            className="flex w-full min-w-0 max-w-full gap-3 overflow-x-auto pb-3
              [scrollbar-width:thin]
              [scrollbar-color:#2563eb_#e5e7eb]
              [&::-webkit-scrollbar]:h-2
              [&::-webkit-scrollbar-track]:rounded-full
              [&::-webkit-scrollbar-track]:bg-zinc-200
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb]:bg-blue-600
              [&::-webkit-scrollbar-thumb:hover]:bg-blue-700"
          >
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`shrink-0 overflow-hidden rounded-xl border-2 bg-white transition ${
                  activeIndex === index
                    ? "border-blue-600 shadow-sm"
                    : "border-zinc-200 opacity-75 hover:border-blue-300 hover:opacity-100"
                }`}
              >
                <Image
                  src={image}
                  alt={`${title} küçük görsel ${index + 1}`}
                  width={104}
                  height={70}
                  sizes="104px"
                  loading="lazy"
                  className="h-[64px] w-[92px] object-cover md:h-[70px] md:w-[104px]"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TAM EKRAN */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4"
          onClick={() => setIsOpen(false)}
        >
          {/* KAPAT */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute right-6 top-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white hover:text-black"
            aria-label="Galeriyi kapat"
          >
            ×
          </button>

          {/* SOL */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                previousImage();
              }}
              className="absolute left-5 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-4xl text-white transition hover:bg-white hover:text-black"
              aria-label="Önceki fotoğraf"
            >
              ‹
            </button>
          )}

          {/* FOTOĞRAF */}
          <img
            src={images[activeIndex]}
            alt={`${title} - ${activeIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />

          {/* SAĞ */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-5 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-4xl text-white transition hover:bg-white hover:text-black"
              aria-label="Sonraki fotoğraf"
            >
              ›
            </button>
          )}

          <div className="absolute bottom-6 rounded-full bg-white/10 px-5 py-2 text-sm text-white backdrop-blur">
            {activeIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
