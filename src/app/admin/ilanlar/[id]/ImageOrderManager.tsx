"use client";

import { useEffect, useRef, useState } from "react";

type ImageOrderManagerProps = {
  images: string[];
  currentCoverImage: string;
  propertyId: string;
  updateOrderAction: (propertyId: string, formData: FormData) => Promise<void>;
  updateCoverAction: (propertyId: string, formData: FormData) => Promise<void>;
};

export default function ImageOrderManager({
  images,
  currentCoverImage,
  propertyId,
  updateOrderAction,
  updateCoverAction,
}: ImageOrderManagerProps) {
  const [orderedImages, setOrderedImages] = useState(images);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [positionInputs, setPositionInputs] = useState<Record<number, string>>(
    {},
  );

  const maxImageNum = orderedImages.length;

  const scrollAnimationRef = useRef<number | null>(null);
  const scrollSpeedRef = useRef(0);

  async function saveOrder(newOrder: string[]) {
    const formData = new FormData();
    formData.set("imageOrder", JSON.stringify(newOrder));

    await updateOrderAction(propertyId, formData);
  }

  async function handleDrop(targetIndex: number) {
    stopAutoScroll();

    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      return;
    }

    const newOrder = [...orderedImages];

    const [movedImage] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, movedImage);

    setOrderedImages(newOrder);
    setDraggedIndex(null);

    await saveOrder(newOrder);
  }

  async function moveImageToPosition(
    currentIndex: number,
    requestedPosition: number,
  ) {
    if (orderedImages.length === 0) {
      return;
    }

    const safePosition = Math.min(Math.max(requestedPosition, 1), maxImageNum);

    const targetIndex = safePosition - 1;

    if (currentIndex === targetIndex) {
      setPositionInputs((prev) => ({
        ...prev,
        [currentIndex]: String(safePosition),
      }));

      return;
    }

    const newOrder = [...orderedImages];

    const [movedImage] = newOrder.splice(currentIndex, 1);
    newOrder.splice(targetIndex, 0, movedImage);

    setOrderedImages(newOrder);

    /*
     * Taşıma sonrası geçici input değerlerini temizliyoruz.
     * Böylece kartların yeni sıra numaraları otomatik görünür.
     */
    setPositionInputs({});

    await saveOrder(newOrder);
  }

  function startAutoScroll() {
    if (scrollAnimationRef.current !== null) {
      return;
    }

    const scroll = () => {
      if (scrollSpeedRef.current !== 0) {
        window.scrollBy({
          top: scrollSpeedRef.current,
          behavior: "auto",
        });
      }

      scrollAnimationRef.current = requestAnimationFrame(scroll);
    };

    scrollAnimationRef.current = requestAnimationFrame(scroll);
  }

  function stopAutoScroll() {
    scrollSpeedRef.current = 0;

    if (scrollAnimationRef.current !== null) {
      cancelAnimationFrame(scrollAnimationRef.current);
      scrollAnimationRef.current = null;
    }
  }

  function handleDragMove(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();

    const mouseY = event.clientY;
    const viewportHeight = window.innerHeight;

    /*
     * Ekranın üst ve alt kenarında otomatik kaydırma alanı.
     */
    const edgeSize = 140;

    /*
     * Maksimum kaydırma hızı.
     * Değeri büyütürsek daha hızlı kayar.
     */
    const maxSpeed = 20;

    if (mouseY < edgeSize) {
      const intensity = (edgeSize - mouseY) / edgeSize;

      scrollSpeedRef.current = -Math.max(4, Math.round(maxSpeed * intensity));

      startAutoScroll();
      return;
    }

    if (mouseY > viewportHeight - edgeSize) {
      const intensity = (mouseY - (viewportHeight - edgeSize)) / edgeSize;

      scrollSpeedRef.current = Math.max(4, Math.round(maxSpeed * intensity));

      startAutoScroll();
      return;
    }

    stopAutoScroll();
  }

  useEffect(() => {
    return () => {
      stopAutoScroll();
    };
  }, []);

  return (
    <div
      className="grid grid-cols-2 gap-3 sm:grid-cols-3"
      onDragOver={handleDragMove}
      onDragLeave={(event) => {
        /*
         * Galerinin dışına gerçekten çıkıldıysa scroll'u durdur.
         */
        const relatedTarget = event.relatedTarget;

        if (
          relatedTarget instanceof Node &&
          event.currentTarget.contains(relatedTarget)
        ) {
          return;
        }

        stopAutoScroll();
      }}
    >
      {orderedImages.map((image, index) => (
        <div
          key={image}
          draggable
          onDragStart={() => {
            setDraggedIndex(index);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            handleDragMove(event);
          }}
          onDrop={() => handleDrop(index)}
          onDragEnd={() => {
            stopAutoScroll();
            setDraggedIndex(null);
          }}
          className={`relative aspect-[4/3] cursor-grab overflow-hidden rounded-xl border bg-white/5 transition active:cursor-grabbing ${
            draggedIndex === index
              ? "border-amber-400 opacity-50"
              : "border-white/10"
          }`}
        >
          <img
            src={image}
            alt={`Galeri fotoğrafı ${index + 1}`}
            draggable={false}
            className="h-full w-full object-cover"
          />

          <div
            className="absolute left-2 top-2 z-20 flex items-center gap-1 rounded-lg bg-slate-950/90 px-2 py-1 backdrop-blur"
            onClick={(event) => {
              event.stopPropagation();
            }}
            onMouseDown={(event) => {
              event.stopPropagation();
            }}
          >
            <input
              type="text"
              inputMode="numeric"
              value={positionInputs[index] ?? String(index + 1)}
              onChange={(event) => {
                /*
                 * Rakam dışındaki her şeyi siliyoruz.
                 */
                const onlyNumbers = event.target.value.replace(/\D/g, "");

                if (onlyNumbers === "") {
                  setPositionInputs((prev) => ({
                    ...prev,
                    [index]: "",
                  }));

                  return;
                }

                const numericValue = Number(onlyNumbers);

                /*
                 * 1'den küçük olamaz.
                 * maxImageNum değerinden büyük olamaz.
                 */
                const safeValue = Math.min(
                  Math.max(numericValue, 1),
                  maxImageNum,
                );

                setPositionInputs((prev) => ({
                  ...prev,
                  [index]: String(safeValue),
                }));
              }}
              onKeyDown={async (event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  event.stopPropagation();

                  const rawValue = positionInputs[index] ?? String(index + 1);

                  const numericValue = Number(rawValue);

                  const safeValue = Number.isFinite(numericValue)
                    ? Math.min(Math.max(numericValue, 1), maxImageNum)
                    : index + 1;

                  await moveImageToPosition(index, safeValue);
                }
              }}
              onBlur={async () => {
                const rawValue = positionInputs[index] ?? String(index + 1);

                const numericValue = Number(rawValue);

                const safeValue = Number.isFinite(numericValue)
                  ? Math.min(Math.max(numericValue, 1), maxImageNum)
                  : index + 1;

                await moveImageToPosition(index, safeValue);
              }}
              className="w-8 bg-transparent text-center text-xs font-bold text-white outline-none"
              aria-label={`Görsel sıra numarası ${index + 1}`}
            />

            <span className="text-[10px] text-slate-400">/ {maxImageNum}</span>
          </div>
          <div className="absolute right-2 top-2 rounded-lg bg-slate-950/80 px-2.5 py-1 text-[10px] font-medium text-slate-300 backdrop-blur">
            Sürükle
          </div>

          <form
            action={updateCoverAction.bind(null, propertyId)}
            className="absolute bottom-2 left-2 right-2"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <input type="hidden" name="coverImage" value={image} />

            <input
              type="hidden"
              name="imageOrder"
              value={JSON.stringify([
                image,
                ...orderedImages.filter((item) => item !== image),
              ])}
            />

            <button
              type="submit"
              disabled={image === currentCoverImage}
              onClick={() => {
                const newOrder = [
                  image,
                  ...orderedImages.filter((item) => item !== image),
                ];

                setOrderedImages(newOrder);
                setPositionInputs({});
              }}
              className={`w-full rounded-lg px-3 py-2 text-xs font-semibold backdrop-blur transition ${
                image === currentCoverImage
                  ? "cursor-default bg-emerald-500/90 text-white"
                  : "bg-slate-950/80 text-white hover:bg-white hover:text-slate-950"
              }`}
            >
              {image === currentCoverImage ? "Mevcut Kapak" : "Kapak Yap"}
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}
