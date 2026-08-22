import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14 md:px-10">
        {/* ÜST ALAN */}
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
            <h3 className="font-semibold text-zinc-950">Hızlı Bağlantılar</h3>

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

              <Link href="/hakkimda" className="transition hover:text-blue-600">
                Hakkımda
              </Link>

              <Link href="/giris" className="transition hover:text-blue-600">
                Giriş Yap
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

        {/* HUKUKİ BAĞLANTILAR */}
        <div className="mt-12 border-t border-zinc-200 pt-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs text-zinc-500">
              <Link href="/kvkk" className="transition hover:text-blue-600">
                KVKK Aydınlatma Metni
              </Link>

              <Link href="/gizlilik" className="transition hover:text-blue-600">
                Gizlilik Politikası
              </Link>

              <Link
                href="/cerez-politikasi"
                className="transition hover:text-blue-600"
              >
                Çerez Politikası
              </Link>

              <Link
                href="/kullanim-kosullari"
                className="transition hover:text-blue-600"
              >
                Kullanım Koşulları
              </Link>
            </div>

            <p className="text-xs text-zinc-400">
              © {new Date().getFullYear()} Bilal Başol Gayrimenkul Danışmanlığı.
              Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
