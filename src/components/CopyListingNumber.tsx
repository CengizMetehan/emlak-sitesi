"use client";

import { useState } from "react";

export default function CopyListingNumber({
  displayValue,
  copyValue,
}: {
  displayValue: string;
  copyValue: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyValue);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="grid grid-cols-[0.9fr_1.1fr] gap-5 py-4 text-sm">
      <span className="text-zinc-500">İlan No</span>

      <div className="flex min-w-0 items-center gap-2">
        <span className="truncate font-medium text-zinc-950">
          {displayValue}
        </span>

        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-[11px] font-semibold text-zinc-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
          aria-label="İlan numarasını kopyala"
        >
          {copied ? "Kopyalandı" : "Kopyala"}
        </button>
      </div>
    </div>
  );
}
