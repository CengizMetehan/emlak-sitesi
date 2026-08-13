export default function HakkimdaPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-950">

      {/* HERO */}
      <section className="px-6 py-20 md:px-12 lg:px-20">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">

          {/* SOL */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-blue-600">
              Hakkımda
            </p>

            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              Gayrimenkulde güven,
              <br />
              doğru analiz ve
              <br />
              profesyonel danışmanlık.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-600">
              Eskişehir gayrimenkul piyasasında konut, ticari gayrimenkul,
              arsa ve yatırım fırsatlarında profesyonel danışmanlık hizmeti
              sunuyorum.
            </p>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-600">
              Amacım yalnızca bir gayrimenkul işlemini tamamlamak değil;
              müşterilerimin ihtiyaçlarını doğru analiz ederek, güvenli ve
              doğru kararlar almalarına yardımcı olmak.
            </p>
          </div>

          {/* SAĞ FOTOĞRAF */}
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-[36px] bg-zinc-100">
              <img
                src="/bilal-basol.jpg"
                alt="Bilal Başol Gayrimenkul Danışmanı"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* UZMANLIK ALANLARI */}
      <section className="bg-zinc-50 px-6 py-20 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">

          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-blue-600">
              Uzmanlık Alanlarım
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
              Doğru gayrimenkul kararları için profesyonel yaklaşım
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-3xl border border-zinc-200 bg-white p-7">
              <h3 className="text-xl font-semibold">
                Konut
              </h3>

              <p className="mt-3 leading-7 text-zinc-600">
                Satılık ve kiralık konutlarda ihtiyaç odaklı portföy
                değerlendirmesi.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-7">
              <h3 className="text-xl font-semibold">
                Ticari Gayrimenkul
              </h3>

              <p className="mt-3 leading-7 text-zinc-600">
                İş yeri, mağaza ve yatırım amaçlı ticari gayrimenkul
                analizleri.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-7">
              <h3 className="text-xl font-semibold">
                Arsa
              </h3>

              <p className="mt-3 leading-7 text-zinc-600">
                Konum, imar ve yatırım potansiyeli odaklı arsa
                değerlendirmeleri.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-7">
              <h3 className="text-xl font-semibold">
                Yatırım Danışmanlığı
              </h3>

              <p className="mt-3 leading-7 text-zinc-600">
                Bütçe ve yatırım hedeflerine göre doğru fırsatların
                belirlenmesi.
              </p>
            </div>

          </div>

        </div>
      </section>

    </main>
  );
}