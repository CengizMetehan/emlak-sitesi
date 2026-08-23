import PropertyGallery from "../../../components/PropertyGallery";
import { getPropertyById } from "@/lib/properties-db";
import { getPropertyOverride } from "@/lib/property-overrides";
import { notFound } from "next/navigation";
import ContactModalButton from "@/components/ContactModalButton";

export const dynamic = "force-dynamic";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
  // GALERİ SIRALAMASI
  let displayImages = [...property.images];

  /*
   * ADMIN TARAFINDA KAYDEDİLEN GÖRSEL SIRASINI UYGULA
   */
  if (override?.image_order) {
    try {
      const savedOrder = JSON.parse(override.image_order);

      if (Array.isArray(savedOrder)) {
        const existingImages = savedOrder.filter(
          (image): image is string =>
            typeof image === "string" && property.images.includes(image),
        );

        const newImages = property.images.filter(
          (image) => !existingImages.includes(image),
        );

        displayImages = [...existingImages, ...newImages];
      }
    } catch {
      displayImages = [...property.images];
    }
  }

  /*
   * KAPAK GÖRSELİNİ HER ZAMAN 1. SIRAYA AL
   *
   * Admin panelinde "Kapak Yap" denilen görsel,
   * kullanıcı tarafındaki galerinin de ilk fotoğrafı olur.
   */
  if (displayCoverImage && displayImages.includes(displayCoverImage)) {
    displayImages = [
      displayCoverImage,
      ...displayImages.filter((image) => image !== displayCoverImage),
    ];
  }

  const featureEntries = Object.entries(property.features).filter(
    ([, value]) => value !== null && value !== "" && value !== "false",
  );

  const propertyFeatures = property.features as Record<
    string,
    string | null | undefined
  >;

  function getFeature(name: string) {
    const value = propertyFeatures[name];

    if (value === null || value === undefined || value === "") {
      return "-";
    }

    return String(value);
  }

  const floor =
    getFeature("Bulunduğu Kat") !== "-" ? getFeature("Bulunduğu Kat") : "-";

  const bathroom =
    getFeature("Banyo Sayısı") !== "-" ? getFeature("Banyo Sayısı") : "-";

  const heating = getFeature("Isıtma") !== "-" ? getFeature("Isıtma") : "-";

  const siteName =
    getFeature("Site Adı") !== "-" ? getFeature("Site Adı") : "-";

  const mapUrl =
    property.latitude && property.longitude
      ? `https://www.google.com/maps?q=${property.latitude},${property.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${property.neighborhood}, ${property.district}, ${property.city}`,
        )}`;

  function createSahibindenSlug(value: string) {
    return value
      .toLocaleLowerCase("tr-TR")
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/\+/g, "-plus")
      .replace(/['’]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  let sahibindenCategorySlug = "emlak";

  if (property.propertyType === "Daire") {
    sahibindenCategorySlug =
      property.category === "Kiralık"
        ? "emlak-konut-kiralik"
        : "emlak-konut-satilik";
  } else if (property.propertyType === "Villa") {
    sahibindenCategorySlug =
      property.category === "Kiralık"
        ? "emlak-konut-kiralik"
        : "emlak-konut-satilik";
  } else if (property.propertyType === "Arsa") {
    sahibindenCategorySlug =
      property.category === "Kiralık"
        ? "emlak-arsa-kiralik"
        : "emlak-arsa-satilik";
  } else if (property.propertyType === "Ticari") {
    sahibindenCategorySlug =
      property.category === "Kiralık"
        ? "emlak-is-yeri-kiralik"
        : "emlak-is-yeri-satilik";
  }

  const sahibindenUrl = displaySahibindenNo
    ? `https://www.sahibinden.com/ilan/${sahibindenCategorySlug}-${createSahibindenSlug(
        displayTitle,
      )}-${displaySahibindenNo}/detay/`
    : "";

  return (
    <main className="min-h-screen bg-[#f8f9fb] text-zinc-950">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[86px] max-w-[1450px] items-center justify-between px-6 md:px-10">
          <a href="/" className="shrink-0">
            <div className="text-xl font-bold tracking-[0.1em] md:text-2xl">
              BİLAL BAŞOL
            </div>

            <div className="mt-1 text-[9px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
              Gayrimenkul Danışmanlığı
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-medium lg:flex">
            <a href="/" className="transition hover:text-blue-600">
              Ana Sayfa
            </a>

            <a href="/hakkimda" className="transition hover:text-blue-600">
              Hakkımda
            </a>

            <ContactModalButton className="transition hover:text-blue-600">
              İletişim
            </ContactModalButton>
          </nav>

          <a
            href="/#portfoyler"
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Portföy Ara
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-[1450px] px-5 py-7 md:px-8 lg:px-10">
        {/* BREADCRUMB */}
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
          <a href="/" className="transition hover:text-blue-600">
            Ana Sayfa
          </a>

          <span>›</span>

          <a href="/#portfoyler" className="transition hover:text-blue-600">
            Portföy
          </a>

          <span>›</span>

          <span className="line-clamp-1 text-zinc-700">{displayTitle}</span>
        </div>

        {/* ÜST BÖLÜM */}
        <section className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,1fr)]">
          {/* SOL - GALERİ */}
          <div className="min-w-0">
            <div className="relative min-w-0 overflow-hidden">
              <div className="absolute left-5 top-5 z-20 rounded-full bg-blue-600 px-4 py-2 text-xs font-bold uppercase text-white shadow-lg">
                {property.category}
              </div>

              <PropertyGallery
                images={displayImages}
                title={displayTitle}
                initialImage={displayCoverImage}
                sahibindenUrl={sahibindenUrl}
              />
            </div>
          </div>

          {/* SAĞ */}
          <div className="min-w-0 space-y-5">
            {/* İLAN ANA KART */}
            <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
              <div className="p-6 md:p-7">
                <h1 className="text-2xl font-bold leading-tight tracking-tight md:text-3xl">
                  {displayTitle}
                </h1>

                <div className="mt-4 flex items-center gap-2 text-sm text-zinc-600">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5 shrink-0 text-blue-600"
                  >
                    <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
                    <circle cx="12" cy="10" r="2" />
                  </svg>

                  <span>
                    {property.neighborhood}, {property.district} /{" "}
                    {property.city}
                  </span>
                </div>

                <div className="my-6 h-px bg-zinc-200" />

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <p className="text-3xl font-bold tracking-tight text-blue-600 md:text-4xl">
                    {displayPriceText}
                  </p>

                  <a
                    href="tel:+905301591856"
                    className="rounded-full border border-blue-600 px-5 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                  >
                    Fiyat Teklifi Al
                  </a>
                </div>
              </div>

              {/* HIZLI ÖZELLİKLER */}
              <div className="grid grid-cols-2 border-t border-zinc-200 sm:grid-cols-4">
                <QuickInfo label="Oda Sayısı" value={property.rooms || "-"} />

                <QuickInfo
                  label="Brüt Alan"
                  value={property.grossArea ? `${property.grossArea} m²` : "-"}
                />

                <QuickInfo label="Bulunduğu Kat" value={floor} />

                <QuickInfo label="Emlak Tipi" value={property.propertyType} />
              </div>
            </section>

            {/* DANIŞMAN KARTI */}
            <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              {/* DANIŞMAN BİLGİLERİ */}
              <div className="flex items-center gap-5">
                {/* PROFİL FOTOĞRAFI */}
                <div className="h-[76px] w-[76px] shrink-0 overflow-hidden rounded-full border border-zinc-200 bg-zinc-100">
                  <img
                    src="/bilal-basol-profil.jpg"
                    alt="Bilal Başol"
                    className="h-full w-full object-cover object-top"
                  />
                </div>

                {/* İSİM VE İLETİŞİM */}
                <div>
                  <p className="text-lg font-bold text-zinc-950">Bilal Başol</p>

                  <p className="mt-1 text-sm text-zinc-500">
                    Gayrimenkul Danışmanı
                  </p>

                  <a
                    href="tel:+905301591856"
                    className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-zinc-700 transition hover:text-blue-600"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-4 w-4 text-blue-600"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
                    </svg>
                    0530 159 18 56
                  </a>
                </div>
              </div>

              {/* TELEFON */}
              <a
                href="tel:+905301591856"
                className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-center font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
                </svg>
                İletişime Geç
              </a>

              {/* WHATSAPP */}
              <a
                href="https://wa.me/905301591856"
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-blue-600 bg-white px-5 py-3.5 text-center font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current text-[11px] font-bold">
                  ☎
                </span>
                WhatsApp ile İletişime Geç
              </a>
            </section>
          </div>
        </section>

        {sahibindenUrl && (
          <section className="mt-7 rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-base font-bold text-zinc-950">
                  İlanı Sahibinden&apos;de görüntüleyin
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  İlanın Sahibinden üzerindeki güncel sayfasını açabilirsiniz.
                </p>
              </div>

              <a
                href={sahibindenUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
              >
                Sahibinden&apos;de Gör
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </section>
        )}

        {/* ALT BÖLÜM */}
        <section className="mt-7 grid gap-6 xl:grid-cols-[1.45fr_1fr]">
          {/* SOL */}
          <div className="space-y-6">
            {/* AÇIKLAMA */}
            {displayDescription && (
              <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-7">
                <h2 className="text-xl font-bold">Portföy Açıklaması</h2>

                <div
                  className="mt-5 max-h-[420px] overflow-y-auto pr-2
                    [scrollbar-width:thin]
                    [scrollbar-color:#2563eb_#e5e7eb]
                    [&::-webkit-scrollbar]:w-2
                    [&::-webkit-scrollbar-track]:rounded-full
                    [&::-webkit-scrollbar-track]:bg-zinc-200
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    [&::-webkit-scrollbar-thumb]:bg-blue-600
                    [&::-webkit-scrollbar-thumb:hover]:bg-blue-700"
                >
                  <div
                    className="max-w-none leading-8 text-zinc-700
                      [&_p]:mb-3
                      [&_div]:mb-3
                      [&_h1]:mb-4
                      [&_h1]:mt-7
                      [&_h1]:text-2xl
                      [&_h1]:font-semibold
                      [&_h2]:mb-4
                      [&_h2]:mt-7
                      [&_h2]:text-xl
                      [&_h2]:font-semibold
                      [&_b]:font-semibold
                      [&_strong]:font-semibold"
                    dangerouslySetInnerHTML={{
                      __html: displayDescription,
                    }}
                  />
                </div>
              </section>
            )}

            {/* KONUM */}
            <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-7">
              <h2 className="text-xl font-bold">Konum</h2>

              <div className="mt-5 rounded-xl border border-zinc-200 bg-zinc-50 p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                    ●
                  </div>

                  <div>
                    <p className="font-semibold text-zinc-950">
                      {property.neighborhood} Mahallesi
                    </p>

                    <p className="mt-1 text-sm text-zinc-500">
                      {property.district}, {property.city}
                    </p>
                  </div>
                </div>

                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                >
                  Haritada Görüntüle ↗
                </a>
              </div>
            </section>
          </div>

          {/* SAĞ - DETAYLI BİLGİLER */}
          <section className="self-start rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-7">
            <h2 className="text-xl font-bold">Detaylı Bilgiler</h2>

            <div
              className="mt-5 max-h-[420px] overflow-y-auto pr-2
              [scrollbar-width:thin]
              [scrollbar-color:#2563eb_#e5e7eb]
              [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-track]:rounded-full
              [&::-webkit-scrollbar-track]:bg-zinc-200
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb]:bg-blue-600
              [&::-webkit-scrollbar-thumb:hover]:bg-blue-700"
            >
              <div className="divide-y divide-zinc-200">
                <DetailRow
                  label="İlan No"
                  value={displaySahibindenNo || property.id}
                />

                <DetailRow label="Emlak Tipi" value={property.propertyType} />

                <DetailRow label="Kategori" value={property.category} />

                <DetailRow label="Oda Sayısı" value={property.rooms || "-"} />

                <DetailRow
                  label="Brüt Alan"
                  value={property.grossArea ? `${property.grossArea} m²` : "-"}
                />

                <DetailRow
                  label="Net Alan"
                  value={property.netArea ? `${property.netArea} m²` : "-"}
                />

                <DetailRow label="Bulunduğu Kat" value={floor} />

                <DetailRow label="Banyo Sayısı" value={bathroom} />

                <DetailRow label="Isıtma" value={heating} />

                <DetailRow label="Site" value={siteName} />
              </div>

              {featureEntries.length > 0 && (
                <div className="mt-5 space-y-3 border-t border-zinc-200 pt-5">
                  {featureEntries.map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-start justify-between gap-5 rounded-lg bg-zinc-50 px-4 py-3 text-sm"
                    >
                      <span className="text-zinc-500">{key}</span>

                      <span className="text-right font-medium text-zinc-950">
                        {String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </section>

        {/* ALT İLETİŞİM */}
        <section className="mt-7 rounded-2xl border border-blue-100 bg-blue-50 p-6 text-center md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
            Detaylı Bilgi ve Randevu
          </p>

          <h2 className="mt-3 text-2xl font-bold md:text-3xl">
            Bu portföy hakkında görüşelim.
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-zinc-600">
            Gayrimenkul hakkında detaylı bilgi, yer gösterimi ve randevu için
            doğrudan iletişime geçebilirsiniz.
          </p>

          <a
            href="tel:+905301591856"
            className="mt-6 inline-block rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white transition hover:bg-blue-700"
          >
            Bilal Başol&apos;u Ara
          </a>
        </section>
      </div>
    </main>
  );
}

function QuickInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-zinc-200 p-4 text-center sm:border-r sm:last:border-r-0">
      <p className="text-base font-bold text-zinc-950">{value}</p>

      <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[0.9fr_1.1fr] gap-5 py-4 text-sm">
      <span className="text-zinc-500">{label}</span>

      <span className="font-medium text-zinc-950">{value}</span>
    </div>
  );
}
