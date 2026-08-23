import ImageOrderManager from "./ImageOrderManager";
import {
  resetPropertyPrice,
  resetPropertyTitle,
  updatePropertyCoverImage,
  updatePropertyImageOrder,
  updatePropertyPrice,
  updatePropertyTitle,
  updatePropertySahibindenNo,
} from "./actions";
import { getPropertyOverride } from "@/lib/property-overrides";
import { auth } from "@/lib/auth";
import { getPropertyById } from "@/lib/properties-db";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminIlanDetayPage({ params }: PageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const { id } = await params;

  const property = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  const override = await getPropertyOverride(id);
  const displayTitle = override?.title ?? property.title;
  const displayPriceText = override?.price_text ?? property.priceText;
  const displayDescription = override?.description ?? property.description;
  const displayCoverImage = override?.cover_image ?? property.image;
  const displaySahibindenNo = override?.sahibinden_no ?? "";
  let displayImages = property.images;
  if (override?.image_order) {
    try {
      const savedOrder = JSON.parse(override.image_order);

      if (Array.isArray(savedOrder)) {
        const existingImages = savedOrder.filter((image) =>
          property.images.includes(image),
        );

        const newImages = property.images.filter(
          (image) => !existingImages.includes(image),
        );

        displayImages = [...existingImages, ...newImages];
      }
    } catch {
      displayImages = property.images;
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-[1500px] px-5 py-8 md:px-8 xl:px-10">
        {/* ÜST ALAN */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-amber-400">İlan Yönetimi</p>

            <h1 className="mt-2 max-w-4xl text-2xl font-bold leading-tight md:text-3xl">
              {displayTitle}
            </h1>

            <p className="mt-3 text-sm text-slate-500">
              Sahibinden ID: {property.sahibindenId}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/ilanlar"
              className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              ← İlanlara Dön
            </Link>

            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-slate-500"
            >
              Kaydet
            </button>
          </div>
        </div>

        {/* ÜST ÖZET */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <InfoCard title="Fiyat" value={displayPriceText} />
          <InfoCard title="Oda" value={property.rooms || "-"} />
          <InfoCard
            title="Brüt Alan"
            value={property.grossArea ? `${property.grossArea} m²` : "-"}
          />
          <InfoCard
            title="Konum"
            value={`${property.district} / ${property.neighborhood}`}
          />
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.1fr_1fr]">
          {/* SOL TARAF */}
          <div className="space-y-8">
            {/* KAPAK FOTOĞRAFI */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold">Kapak Fotoğrafı</h2>

                <p className="mt-1 text-sm text-slate-500">
                  Şu anda Sahibinden verisinden gelen kapak fotoğrafı
                  gösteriliyor.
                </p>
              </div>

              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-white/5">
                {displayCoverImage ? (
                  <Image
                    src={displayCoverImage}
                    alt={property.title}
                    fill
                    sizes="(max-width: 1280px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-500">
                    Görsel yok
                  </div>
                )}
              </div>
            </section>

            {/* GALERİ */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">Galeri</h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {displayImages.length} fotoğraf
                  </p>
                </div>
              </div>

              <ImageOrderManager
                images={displayImages}
                currentCoverImage={displayCoverImage}
                propertyId={property.id}
                updateOrderAction={updatePropertyImageOrder}
                updateCoverAction={updatePropertyCoverImage}
              />
            </section>
          </div>

          {/* SAĞ TARAF */}
          <div className="space-y-8">
            {/* TEMEL BİLGİLER */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-lg font-semibold">Temel Bilgiler</h2>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
                    İlan Başlığı
                  </label>

                  <form
                    action={updatePropertyTitle.bind(null, property.id)}
                    className="flex flex-col gap-3"
                  >
                    <textarea
                      name="title"
                      defaultValue={displayTitle}
                      rows={3}
                      className="w-full resize-none rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-400/50"
                    />

                    <button
                      type="submit"
                      className="self-start rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                    >
                      Başlığı Kaydet
                    </button>
                  </form>

                  {override?.title && (
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs text-amber-400">
                        Bu başlık admin tarafından düzenlenmiş durumda.
                      </p>

                      <form action={resetPropertyTitle.bind(null, property.id)}>
                        <button
                          type="submit"
                          className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                        >
                          Sahibinden Başlığını Kullan
                        </button>
                      </form>
                    </div>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <ReadOnlyField label="Kategori" value={property.category} />

                  <ReadOnlyField
                    label="Emlak Tipi"
                    value={property.propertyType}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
                      Fiyat
                    </label>

                    <form
                      action={updatePropertyPrice.bind(null, property.id)}
                      className="flex flex-col gap-3 sm:flex-row"
                    >
                      <input
                        type="text"
                        name="price"
                        defaultValue={displayPriceText}
                        className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-400/50"
                      />

                      <button
                        type="submit"
                        className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                      >
                        Fiyatı Kaydet
                      </button>
                    </form>

                    {override?.price !== null &&
                      override?.price !== undefined && (
                        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-xs text-amber-400">
                            Bu fiyat admin tarafından düzenlenmiş durumda.
                          </p>

                          <form
                            action={resetPropertyPrice.bind(null, property.id)}
                          >
                            <button
                              type="submit"
                              className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                            >
                              Sahibinden Fiyatını Kullan
                            </button>
                          </form>
                        </div>
                      )}
                  </div>

                  <ReadOnlyField
                    label="Oda Sayısı"
                    value={property.rooms || "-"}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <ReadOnlyField
                    label="Brüt Alan"
                    value={
                      property.grossArea ? `${property.grossArea} m²` : "-"
                    }
                  />

                  <ReadOnlyField
                    label="Net Alan"
                    value={property.netArea ? `${property.netArea} m²` : "-"}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
                    Sahibinden İlan No
                  </label>

                  <form
                    action={updatePropertySahibindenNo.bind(null, property.id)}
                    className="flex flex-col gap-3 sm:flex-row"
                  >
                    <input
                      type="text"
                      inputMode="numeric"
                      name="sahibindenNo"
                      defaultValue={displaySahibindenNo}
                      placeholder="Örn. 1299416895"
                      className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-400/50"
                    />

                    <button
                      type="submit"
                      className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                    >
                      İlan No Kaydet
                    </button>
                  </form>

                  {displaySahibindenNo && (
                    <p className="mt-2 text-xs text-emerald-400">
                      Sahibinden ilan numarası kaydedildi: {displaySahibindenNo}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* KONUM */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-lg font-semibold">Konum</h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <ReadOnlyField label="Şehir" value={property.city} />

                <ReadOnlyField label="İlçe" value={property.district} />

                <ReadOnlyField label="Mahalle" value={property.neighborhood} />

                <ReadOnlyField
                  label="Koordinat"
                  value={`${property.latitude}, ${property.longitude}`}
                />
              </div>
            </section>

            {/* AÇIKLAMA */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-lg font-semibold">Açıklama</h2>

              <p className="mt-1 text-sm text-slate-500">
                Açıklama şu anda sadece ön izleme amaçlı gösteriliyor.
              </p>

              <div className="mt-5 max-h-[420px] overflow-auto rounded-xl border border-white/10 bg-slate-950/70 p-5">
                <div
                  className="text-sm leading-7 text-slate-300"
                  dangerouslySetInnerHTML={{
                    __html: displayDescription,
                  }}
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-sm text-slate-500">{title}</p>

      <p className="mt-2 line-clamp-2 text-base font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </label>

      <div className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
        {value}
      </div>
    </div>
  );
}
