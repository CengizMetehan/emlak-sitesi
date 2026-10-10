"use client";

import { useEffect, useRef, useState } from "react";

export type PremiumFilterOption = {
  value: string;
  label: string;
  description: string;
};

type PremiumFilterSelectProps = {
  label: string;
  value: string;
  options: PremiumFilterOption[];
  onChange: (value: string) => void;
};

export default function PremiumFilterSelect({
  label,
  value,
  options,
  onChange,
}: PremiumFilterSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className="relative min-w-0">
      <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 transition-colors focus-within:border-blue-300">
        <span className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
          {label}
        </span>
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
          className="mt-1 flex min-h-6 w-full items-center justify-between gap-3 text-left text-sm font-medium text-zinc-950 outline-none"
        >
          <span className="truncate">{selectedOption?.label ?? value}</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          >
            <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          role="listbox"
          aria-label={label}
          className="absolute left-0 top-[calc(100%+8px)] z-50 w-full min-w-[250px] overflow-hidden rounded-2xl border border-zinc-200 bg-white p-2 shadow-[0_18px_50px_-18px_rgba(15,23,42,0.35)]"
        >
          <div className="px-3 pb-2 pt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Seçiminizi yapın
          </div>
          <div className="grid gap-1">
            {options.map((option) => {
              const selected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                    selected
                      ? "bg-blue-50 text-blue-700"
                      : "text-zinc-800 hover:bg-[#F8F6F1]"
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{option.label}</span>
                    <span className={`mt-0.5 block text-[11px] ${selected ? "text-blue-600/75" : "text-zinc-500"}`}>
                      {option.description}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      selected
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-zinc-200 text-transparent"
                    }`}
                  >
                    <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3">
                      <path d="m3.5 8 3 3 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
