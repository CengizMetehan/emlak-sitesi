"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FeaturedToggleButton from "@/components/FeaturedToggleButton";
import type { Property } from "@/data/properties";

type AdminProperty = Property & {
  displayTitle: string;
  displayPriceText: string;
  displayCoverImage: string;
};

type AdminPropertyListProps = {
  properties: AdminProperty[];
};

export default function AdminPropertyList({
  properties,
}: AdminPropertyListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProperties = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase("tr-TR");

    if (!query) {
      return properties;
    }

    return properties.filter((property) => {
      const searchableText = [
        property.displayTitle,
        property.title,
        property.sahibindenId,
        property.city,
        property.district,
        property.neighborhood,
        property.category,
        property.propertyType,
        property.rooms,
        property.priceText,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("tr-TR");

      return searchableText.includes(query);
    });
  }, [properties, searchQuery]);

  return (
    <>
      {/* ARAMA */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="İlan adı, ilan no, mahalle, ilçe veya fiyat ara..."
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 pr-11 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-slate-500 transition hover:text-white"
                aria-label="Aramayı temizle"
              >
                ×
              </button>
            )}
          </div>

          <div className="shrink-0 text-sm text-slate-400">
            <span className="font-semibold text-white">
              {filteredProperties.length}
            </span>{" "}
            ilan bulundu
          </div>
        </div>
      </div>

      {/* İLAN LİSTESİ */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        <div className="hidden grid-cols-[110px_1.8fr_1fr_1fr_160px_150px] gap-4 border-b border-white/10 bg-white/[0.02] px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 xl:grid">
          <div>Fotoğraf</div>
          <div>İlan</div>
          <div>Konum</div>
          <div>Özellikler</div>
          <div>Fiyat</div>
          <div>İşlem</div>
        </div>

        {filteredProperties.length > 0 ? (
          <div className="divide-y divide-white/10">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="grid gap-5 px-5 py-5 transition hover:bg-white/[0.025] xl:grid-cols-[110px_1.8fr_1fr_1fr_160px_150px] xl:items-center"
              >
                {/* FOTOĞRAF */}
                <div className="relative h-24 w-full overflow-hidden rounded-xl bg-white/5 xl:h-20 xl:w-[110px]">
                  {property.displayCoverImage ? (
                    <Image
                      src={property.displayCoverImage}
                      alt={property.displayTitle}
                      fill
                      sizes="110px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-slate-500">
                      Görsel yok
                    </div>
                  )}
                </div>

                {/* İLAN BİLGİSİ */}
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-slate-300">
                      {property.category}
                    </span>

                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-slate-300">
                      {property.propertyType}
                    </span>

                    {property.featured && (
                      <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-400">
                        Öne Çıkan
                      </span>
                    )}
                  </div>

                  <h2 className="line-clamp-2 text-sm font-semibold leading-6 text-white">
                    {property.displayTitle}
                  </h2>

                  <p className="mt-2 break-all text-xs text-slate-500">
                    ID: {property.sahibindenId}
                  </p>
                </div>

                {/* KONUM */}
                <div>
                  <p className="text-sm font-medium text-slate-200">
                    {property.district}
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    {property.neighborhood}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">{property.city}</p>
                </div>

                {/* ÖZELLİKLER */}
                <div className="space-y-1 text-sm">
                  {property.rooms && (
                    <p className="text-slate-300">
                      <span className="text-slate-500">Oda:</span>{" "}
                      {property.rooms}
                    </p>
                  )}

                  {property.grossArea && (
                    <p className="text-slate-300">
                      <span className="text-slate-500">Brüt:</span>{" "}
                      {property.grossArea} m²
                    </p>
                  )}

                  {property.netArea && (
                    <p className="text-slate-300">
                      <span className="text-slate-500">Net:</span>{" "}
                      {property.netArea} m²
                    </p>
                  )}
                </div>

                {/* FİYAT */}
                <div>
                  <p className="text-base font-bold text-white">
                    {property.displayPriceText}
                  </p>
                </div>

                {/* İŞLEMLER */}
                <div className="space-y-2">
                  <FeaturedToggleButton
                    propertyId={property.id}
                    initialFeatured={property.featured}
                  />

                  <Link
                    href={`/admin/ilanlar/${property.id}`}
                    className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white hover:text-slate-950"
                  >
                    Düzenle
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-14 text-center">
            <p className="text-sm font-medium text-white">
              Aramanızla eşleşen ilan bulunamadı.
            </p>

            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mt-3 text-sm font-medium text-blue-400 transition hover:text-blue-300"
            >
              Aramayı temizle
            </button>
          </div>
        )}
      </div>
    </>
  );
}
