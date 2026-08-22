import HikayemSlider from "./HikayemSlider";
export default function HakkimdaPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-950">
      {/* ÜST ALAN */}
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-[86px] max-w-[1450px] items-center justify-between px-6 md:px-10">
          <a href="/" className="shrink-0">
            <div className="text-xl font-bold tracking-[0.1em] md:text-2xl">
              BİLAL BAŞOL
            </div>

            <div className="mt-1 text-[9px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
              Gayrimenkul Danışmanlığı
            </div>
          </a>

          <a
            href="/"
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
          >
            Ana Sayfaya Dön
          </a>
        </div>
      </header>

      {/* BAŞLIK */}
      <section className="px-6 pb-10 pt-14 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-blue-600">
            Hakkımda
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            #Doğru karar, doğru plan, doğru sonuç.
          </h1>
        </div>
      </section>

      {/* HİKAYEM */}
      <HikayemSlider />

      {/* GÜVEN / ÖZET */}
      <section className="px-6 pb-16 md:px-12 lg:px-20">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-zinc-500">Bölge Uzmanlığı</p>
            <p className="mt-2 text-2xl font-semibold text-zinc-950">
              Eskişehir
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-zinc-500">Uzmanlık Alanları</p>
            <p className="mt-2 text-2xl font-semibold text-zinc-950">
              Konut • Ticari • Arsa
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-zinc-500">Yaklaşım</p>
            <p className="mt-2 text-2xl font-semibold text-zinc-950">
              Güven • Analiz • Sonuç
            </p>
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
            <div className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm">
              <h3 className="text-xl font-semibold">Konut</h3>
              <p className="mt-3 leading-7 text-zinc-600">
                Satılık ve kiralık konutlarda ihtiyaç odaklı portföy
                değerlendirmesi.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm">
              <h3 className="text-xl font-semibold">Ticari Gayrimenkul</h3>
              <p className="mt-3 leading-7 text-zinc-600">
                İş yeri, mağaza ve yatırım amaçlı ticari gayrimenkul analizleri.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm">
              <h3 className="text-xl font-semibold">Arsa</h3>
              <p className="mt-3 leading-7 text-zinc-600">
                Konum, imar ve yatırım potansiyeli odaklı arsa
                değerlendirmeleri.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm">
              <h3 className="text-xl font-semibold">Yatırım Danışmanlığı</h3>
              <p className="mt-3 leading-7 text-zinc-600">
                Bütçe ve yatırım hedeflerine göre doğru fırsatların
                belirlenmesi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ÇALIŞMA ANLAYIŞIM */}
      <section className="bg-white px-6 py-20 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-[32px] border border-blue-100 bg-blue-50 p-8 shadow-sm md:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-blue-600">
              Çalışma Anlayışım
            </p>

            <blockquote className="mt-5 max-w-5xl text-xl font-medium leading-9 text-zinc-900 md:text-2xl md:leading-10">
              “Ainesi iştir kişinin, lafa bakılmaz.”
            </blockquote>

            <p className="mt-6 max-w-5xl text-base leading-8 text-zinc-600 md:text-lg">
              Bu düsturla, temas ettiğim kişilerde oluşan memnuniyetin ve
              onların tavsiye ettiği kişilerin gayrimenkul ihtiyaçlarına çözüm
              üretme çabasının beni bu meslekte kalıcı kıldığına inanıyorum.
            </p>

            <p className="mt-5 max-w-5xl text-base leading-8 text-zinc-600 md:text-lg">
              Beni ve ürettiğim hizmet kalitesini henüz tanımayan kişilerin de
              bir gün gayrimenkul işleriyle ilgili destek ve yönlendirmeye
              ihtiyaç duyduklarında yollarımızın kesişmesi dileğiyle...
            </p>

            <div className="mt-8">
              <p className="text-2xl font-semibold italic text-blue-600">
                Bilal Başol
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                Gayrimenkul Profesyoneli
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
