"use client";

import { useRef, useState, type TouchEvent } from "react";
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

  const panTouchStart = useRef({
    x: 0,
    y: 0,
    positionX: 0,
    positionY: 0,
  });

  const [zoom, setZoom] = useState(1);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const dragStart = useRef({
    x: 0,
    y: 0,
    positionX: 0,
    positionY: 0,
  });

  const pinchStartDistance = useRef<number | null>(null);
  const pinchStartZoom = useRef(1);

  const MIN_ZOOM = 1;
  const MAX_ZOOM = 4;

  const clampZoom = (value: number) => {
    return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
  };

  const resetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setIsDragging(false);

    pinchStartDistance.current = null;
    pinchStartZoom.current = 1;
  };

  // SWIPE KONTROLÜ
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);
  const isSwiping = useRef(false);

  const previousImage = () => {
    resetZoom();
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    resetZoom();
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const getTouchDistance = (
    touch1: { clientX: number; clientY: number },
    touch2: { clientX: number; clientY: number },
  ) => {
    const x = touch2.clientX - touch1.clientX;
    const y = touch2.clientY - touch1.clientY;

    return Math.sqrt(x * x + y * y);
  };

  const handleZoomWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!isOpen) return;

    e.preventDefault();

    const change = e.deltaY < 0 ? 0.2 : -0.2;

    setZoom((currentZoom) => clampZoom(currentZoom + change));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoom <= 1) return;

    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);

    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      positionX: position.x,
      positionY: position.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || zoom <= 1) return;

    e.preventDefault();

    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;

    setPosition({
      x: dragStart.current.positionX + deltaX,
      y: dragStart.current.positionY + deltaY,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handlePinchStart = (e: TouchEvent<HTMLElement>) => {
    if (e.touches.length === 2) {
      const distance = getTouchDistance(e.touches[0], e.touches[1]);

      pinchStartDistance.current = distance;
      pinchStartZoom.current = zoom;

      isSwiping.current = true;
      return;
    }

    if (e.touches.length === 1 && zoom > 1) {
      const touch = e.touches[0];

      panTouchStart.current = {
        x: touch.clientX,
        y: touch.clientY,
        positionX: position.x,
        positionY: position.y,
      };

      isSwiping.current = true;
      return;
    }

    handleTouchStart(e);
  };

  const handlePinchMove = (e: TouchEvent<HTMLElement>) => {
    if (e.touches.length === 2 && pinchStartDistance.current !== null) {
      const currentDistance = getTouchDistance(e.touches[0], e.touches[1]);

      const ratio = currentDistance / pinchStartDistance.current;

      const newZoom = pinchStartZoom.current * ratio;

      setZoom(clampZoom(newZoom));

      isSwiping.current = true;
      return;
    }

    if (e.touches.length === 1 && zoom > 1) {
      const touch = e.touches[0];

      const deltaX = touch.clientX - panTouchStart.current.x;

      const deltaY = touch.clientY - panTouchStart.current.y;

      setPosition({
        x: panTouchStart.current.positionX + deltaX,
        y: panTouchStart.current.positionY + deltaY,
      });

      isSwiping.current = true;
      return;
    }

    if (zoom === 1) {
      handleTouchMove(e);
    }
  };

  const handlePinchEnd = (e: TouchEvent<HTMLElement>) => {
    if (e.touches.length < 2) {
      pinchStartDistance.current = null;
    }

    if (zoom === 1) {
      handleTouchEnd();
    } else {
      touchStartX.current = null;
      touchStartY.current = null;
      touchEndX.current = null;
      touchEndY.current = null;

      window.setTimeout(() => {
        isSwiping.current = false;
      }, 200);
    }
  };

  const handleTouchStart = (e: TouchEvent<HTMLElement>) => {
    const touch = e.targetTouches[0];

    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;

    touchEndX.current = touch.clientX;
    touchEndY.current = touch.clientY;

    isSwiping.current = false;
  };

  const handleTouchMove = (e: TouchEvent<HTMLElement>) => {
    const touch = e.targetTouches[0];

    touchEndX.current = touch.clientX;
    touchEndY.current = touch.clientY;

    if (touchStartX.current === null || touchStartY.current === null) {
      return;
    }

    const horizontalDistance = Math.abs(touchStartX.current - touch.clientX);

    const verticalDistance = Math.abs(touchStartY.current - touch.clientY);

    // Yatay hareket belirginse bunu swipe olarak kabul et
    if (horizontalDistance > 10 && horizontalDistance > verticalDistance) {
      isSwiping.current = true;
    }
  };

  const handleTouchEnd = () => {
    if (
      touchStartX.current === null ||
      touchStartY.current === null ||
      touchEndX.current === null ||
      touchEndY.current === null
    ) {
      return;
    }

    const horizontalDistance = touchStartX.current - touchEndX.current;

    const verticalDistance = touchStartY.current - touchEndY.current;

    const absHorizontalDistance = Math.abs(horizontalDistance);
    const absVerticalDistance = Math.abs(verticalDistance);

    const minSwipeDistance = 50;

    /*
     * Sadece yatay hareket dikey hareketten daha büyükse
     * fotoğraf değiştiriyoruz.
     *
     * Böylece kullanıcı sayfayı yukarı-aşağı kaydırırken
     * yanlışlıkla fotoğraf değişmez.
     */
    if (
      absHorizontalDistance >= minSwipeDistance &&
      absHorizontalDistance > absVerticalDistance
    ) {
      isSwiping.current = true;

      // Parmağı sola kaydırdı
      if (horizontalDistance > 0) {
        nextImage();
      }

      // Parmağı sağa kaydırdı
      if (horizontalDistance < 0) {
        previousImage();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
    touchEndX.current = null;
    touchEndY.current = null;

    /*
     * Swipe sonrasında oluşabilecek click olayının
     * galeriyi yanlışlıkla açmasını engellemek için
     * kısa süre bekliyoruz.
     */
    window.setTimeout(() => {
      isSwiping.current = false;
    }, 300);
  };

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
            className="mt-3 text-base text-blue-600 underline decoration-blue-300 underline-offset-4 transition hover:text-blue-700 hover:decoration-blue-700"
          >
            Sahibinden&apos;de görüntülemek için buraya tıklayın
          </a>
        )}
      </div>
    );
  }

  return (
    <>
      {/* ANA GALERİ */}
      <div className="w-full min-w-0 max-w-full">
        {/* BÜYÜK FOTOĞRAF */}
        <div
          className="group relative h-[300px] w-full min-w-0 max-w-full cursor-zoom-in touch-pan-y select-none overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-sm md:h-[380px] xl:h-[530px]"
          onClick={() => {
            if (isSwiping.current) {
              isSwiping.current = false;
              return;
            }

            setIsOpen(true);
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            src={images[activeIndex]}
            alt={`${title} - ${activeIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 850px"
            priority={activeIndex === 0}
            loading={activeIndex === 0 ? "eager" : "lazy"}
            fetchPriority={activeIndex === 0 ? "high" : "auto"}
            quality={82}
            draggable={false}
            className="select-none object-cover transition duration-500 group-hover:scale-[1.015]"
          />

          {/* SOL OK */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                previousImage();
              }}
              className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-2xl text-zinc-950 shadow-lg backdrop-blur transition hover:scale-105 hover:bg-white"
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
              className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-2xl text-zinc-950 shadow-lg backdrop-blur transition hover:scale-105 hover:bg-white"
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
                  quality={55}
                  draggable={false}
                  className="h-[64px] w-[92px] select-none object-cover md:h-[70px] md:w-[104px]"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TAM EKRAN GALERİ */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex select-none items-center justify-center overflow-hidden bg-black/95 p-4"
          onClick={() => {
            resetZoom();
            setIsOpen(false);
          }}
          onWheel={handleZoomWheel}
          onTouchStart={handlePinchStart}
          onTouchMove={handlePinchMove}
          onTouchEnd={handlePinchEnd}
        >
          {/* KAPAT */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              resetZoom();
              setIsOpen(false);
            }}
            className="absolute right-6 top-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white hover:text-black"
            aria-label="Galeriyi kapat"
          >
            ×
          </button>

          {/* SOL OK */}
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
          <div
            className="relative h-[90vh] w-[90vw] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`relative h-full w-full ${
                isDragging
                  ? "cursor-grabbing"
                  : zoom > 1
                    ? "cursor-grab"
                    : "cursor-default"
              }`}
              style={{
                transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${zoom})`,
                transformOrigin: "center center",
                transition: isDragging ? "none" : "transform 120ms ease-out",
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            >
              <Image
                src={images[activeIndex]}
                alt={`${title} - ${activeIndex + 1}`}
                fill
                sizes="90vw"
                quality={88}
                draggable={false}
                className="select-none object-contain"
              />
            </div>
          </div>

          {/* SAĞ OK */}
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

          {/* TAM EKRAN SAYACI */}
          {/* ALT KONTROLLER */}
          <div className="absolute bottom-6 z-30 flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setZoom((current) => clampZoom(current - 0.25));
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-xl font-semibold text-white backdrop-blur transition hover:bg-white hover:text-black"
              aria-label="Uzaklaştır"
            >
              −
            </button>

            <div className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur">
              {Math.round(zoom * 100)}%
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setZoom((current) => clampZoom(current + 0.25));
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-xl font-semibold text-white backdrop-blur transition hover:bg-white hover:text-black"
              aria-label="Yakınlaştır"
            >
              +
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                resetZoom();
              }}
              className="rounded-full bg-white/15 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-white hover:text-black"
            >
              Sıfırla
            </button>

            <div className="rounded-full bg-white/15 px-4 py-2 text-sm text-white backdrop-blur">
              {activeIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
