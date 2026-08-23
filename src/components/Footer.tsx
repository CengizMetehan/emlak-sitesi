import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#F3F0EA]">
      <div className="mx-auto max-w-7xl px-6 py-6 md:px-10">
        {/* ÜST ALAN */}
        <div className="mt-12 border-t border-zinc-300 pt-14">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {/* MARKA */}
            <div>
              <h2 className="text-xl font-bold tracking-[0.18em] text-zinc-950">
                BİLAL BAŞOL
              </h2>

              <p className="mt-1 text-xs tracking-[0.25em] text-blue-600">
                GAYRİMENKUL DANIŞMANLIĞI
              </p>

              <p className="mt-5 max-w-sm text-sm leading-6 text-zinc-500">
                Eskişehir&apos;de konut, ticari gayrimenkul, arsa ve yatırım
                fırsatlarında profesyonel gayrimenkul danışmanlığı.
              </p>
            </div>

            {/* HIZLI BAĞLANTILAR */}
            <div>
              <h3 className="font-semibold text-zinc-900">Hızlı Bağlantılar</h3>

              <div className="mt-4 flex flex-col gap-3 text-sm text-zinc-500">
                <Link href="/" className="transition hover:text-blue-600">
                  Ana Sayfa
                </Link>

                <Link
                  href="/#portfoyler"
                  className="transition hover:text-blue-600"
                >
                  Portföyler
                </Link>

                <Link
                  href="/hakkimda"
                  className="transition hover:text-blue-600"
                >
                  Hakkımda
                </Link>
              </div>
            </div>

            {/* HİZMETLER */}
            <div>
              <h3 className="font-semibold text-zinc-950">Hizmetler</h3>

              <div className="mt-4 flex flex-col gap-3 text-sm text-zinc-500">
                <span>Satılık Gayrimenkuller</span>
                <span>Kiralık Gayrimenkuller</span>
                <span>Ticari Gayrimenkul</span>
                <span>Arsa</span>
                <span>Yatırım Danışmanlığı</span>
              </div>
            </div>

            {/* İLETİŞİM */}
            <div>
              <h3 className="font-semibold text-zinc-950">İletişim</h3>

              <div className="mt-4 flex flex-col gap-3 text-sm text-zinc-500">
                <a
                  href="tel:+905301591856"
                  className="transition hover:text-blue-600"
                >
                  0530 159 18 56
                </a>

                <a
                  href="https://wa.me/905301591856"
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-blue-600"
                >
                  WhatsApp
                </a>

                <span>Eskişehir</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
