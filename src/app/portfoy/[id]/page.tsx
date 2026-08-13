import { properties } from "../../../data/properties";
import { notFound } from "next/navigation";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const property = properties.find((item) => item.id === id);

  if (!property) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-white/10 px-6 py-6 md:px-12 lg:px-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <a href="/" className="text-xl font-semibold tracking-wide">
            BİLAL BAŞOL
          </a>

          <a
            href="/"
            className="rounded-full border border-white/20 px-5 py-2.5 text-sm transition hover:bg-white hover:text-black"
          >
            Ana Sayfaya Dön
          </a>
        </div>
      </header>

      <section className="px-6 py-12 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
            {property.category} • {property.propertyType}
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            {property.title}
          </h1>

          <p className="mt-5 text-lg text-zinc-400">
            {property.neighborhood} • {property.district} • {property.city}
          </p>

          <div className="mt-10 overflow-hidden rounded-3xl">
            <img
              src={property.image}
              alt={property.title}
              className="h-[420px] w-full object-cover md:h-[600px]"
            />
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[2fr_1fr]">
            <div>
              <h2 className="text-3xl font-semibold">
                Portföy Bilgileri
              </h2>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {property.rooms && (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-sm text-zinc-500">Oda Sayısı</p>
                    <p className="mt-2 text-xl font-medium">
                      {property.rooms}
                    </p>
                  </div>
                )}

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-sm text-zinc-500">Gayrimenkul Tipi</p>
                  <p className="mt-2 text-xl font-medium">
                    {property.propertyType}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-sm text-zinc-500">Konum</p>
                  <p className="mt-2 text-xl font-medium">
                    {property.district}
                  </p>
                </div>

                {property.grossArea && (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-sm text-zinc-500">Brüt Alan</p>
                    <p className="mt-2 text-xl font-medium">
                      {property.grossArea} m²
                    </p>
                  </div>
                )}

                {property.netArea && (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-sm text-zinc-500">Net Alan</p>
                    <p className="mt-2 text-xl font-medium">
                      {property.netArea} m²
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-12">
                <h2 className="text-3xl font-semibold">
                  Portföy Açıklaması
                </h2>

                <p className="mt-5 max-w-3xl leading-8 text-zinc-400">
                  Bu portföye ait detaylı açıklamalar, konum avantajları,
                  bina özellikleri, ulaşım bilgileri ve yatırım değerlendirmesi
                  bu bölümde yer alacaktır.
                </p>
              </div>
            </div>

            <aside>
              <div className="sticky top-8 rounded-3xl border border-white/10 bg-white/[0.05] p-7">
                <p className="text-sm text-zinc-500">
                  Satış Fiyatı
                </p>

                <p className="mt-2 text-3xl font-semibold">
                  {property.priceText}
                </p>

                <div className="my-7 h-px bg-white/10" />

                <p className="text-sm text-zinc-400">
                  Portföy hakkında detaylı bilgi ve randevu için iletişime
                  geçebilirsiniz.
                </p>

                <a
                  href="#"
                  className="mt-7 block rounded-full bg-white px-6 py-4 text-center font-medium text-black transition hover:bg-zinc-200"
                >
                  İletişime Geç
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}