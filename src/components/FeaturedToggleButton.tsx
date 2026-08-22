"use client";

import { useState } from "react";

type FeaturedToggleButtonProps = {
  propertyId: string;
  initialFeatured: boolean;
};

export default function FeaturedToggleButton({
  propertyId,
  initialFeatured,
}: FeaturedToggleButtonProps) {
  const [featured, setFeatured] = useState(initialFeatured);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    const nextValue = !featured;

    setLoading(true);

    try {
      const response = await fetch(
        `/api/admin/properties/${propertyId}/featured`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            featured: nextValue,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "İşlem gerçekleştirilemedi.");
      }

      setFeatured(data.featured);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Öne çıkan durumu değiştirilemedi.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex w-full items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
        featured
          ? "border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
          : "border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
      }`}
    >
      {loading ? "Kaydediliyor..." : featured ? "Seçiliden Çıkar" : "Öne Çıkar"}
    </button>
  );
}
