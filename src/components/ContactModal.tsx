"use client";
import { createPortal } from "react-dom";

type ContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 px-4 py-8 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[440px] overflow-hidden rounded-[24px] border border-zinc-200 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* KAPAT */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full text-2xl text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950"
          aria-label="İletişim penceresini kapat"
        >
          ×
        </button>

        <div className="px-6 pb-6 pt-7 md:px-7">
          {/* MİNİMAL GÖRSEL ALANI */}
          <div className="mx-auto flex h-[115px] max-w-[220px] items-center justify-center rounded-2xl bg-blue-50">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-10 w-10 text-blue-600"
              >
                <path d="M3 11.5 12 4l9 7.5" />
                <path d="M5.5 10.5V20h13v-9.5" />
                <path d="M9 20v-5h6v5" />
              </svg>

              <div className="absolute -bottom-2 -right-3 flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-md">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
                </svg>
              </div>
            </div>
          </div>

          {/* BAŞLIK */}
          <div className="mt-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
              İletişim
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-950">
              Benimle iletişime geçin
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-500 md:text-base">
              Gayrimenkulünüz, yatırım planınız veya portföyler hakkında
              görüşmek için size en uygun iletişim yöntemini seçebilirsiniz.
            </p>
          </div>

          {/* TELEFON */}
          <a
            href="tel:+905301591856"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
            </svg>
            Telefonla Ara
          </a>

          {/* WHATSAPP */}
          <a
            href="https://wa.me/905301591856?text=Merhaba%20Bilal%20Bey%2C%20gayrimenkul%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum."
            target="_blank"
            rel="noreferrer"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-600 bg-white px-5 py-3.5 font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            WhatsApp&apos;tan Yaz
          </a>

          {/* AYIRICI */}
          <div className="my-5 flex items-center gap-4">
            <div className="h-px flex-1 bg-zinc-200" />

            <div className="h-px flex-1 bg-zinc-200" />
          </div>

          {/* ALT BİLGİ */}
          <div className="mt-6 border-t border-zinc-100 pt-5 text-center">
            <p className="font-semibold text-zinc-950">Bilal Başol</p>

            <p className="mt-1 text-sm text-zinc-500">
              Gayrimenkul Profesyoneli
            </p>

            <p className="mt-2 text-sm font-medium text-zinc-700">
              0530 159 18 56
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
