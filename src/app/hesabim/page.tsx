import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function HesabimPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/giris");
  }

  if (session.user.role === "ADMIN") {
    redirect("/admin");
  }

  const displayName =
    session.user.name?.trim() ||
    session.user.email?.split("@")[0] ||
    "Kullanıcı";

  const firstLetter = displayName.charAt(0).toUpperCase();

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-zinc-950">
      {/* ÜST MENÜ */}
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-4 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
              BB
            </div>

            <div>
              <p className="text-sm font-bold tracking-wide text-zinc-950">
                BİLAL BAŞOL
              </p>

              <p className="text-xs text-zinc-500">Gayrimenkul Danışmanlığı</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-zinc-700 lg:flex">
            <Link href="/#satilik" className="transition hover:text-blue-600">
              Satılık
            </Link>

            <Link href="/#kiralik" className="transition hover:text-blue-600">
              Kiralık
            </Link>

            <Link href="/#ticari" className="transition hover:text-blue-600">
              Ticari
            </Link>

            <Link href="/#arsa" className="transition hover:text-blue-600">
              Arsa
            </Link>

            <Link href="/hakkimda" className="transition hover:text-blue-600">
              Hakkımda
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden text-right md:block">
              <p className="text-sm font-semibold text-zinc-950">
                {displayName}
              </p>

              <p className="max-w-[220px] truncate text-xs text-zinc-500">
                {session.user.email}
              </p>
            </div>

            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
              aria-label="Hesap menüsü"
            >
              {firstLetter}
            </button>
          </div>
        </div>
      </header>

      {/* HERO / KİŞİSEL KARŞILAMA */}
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-[1500px] px-6 py-12 lg:px-10 lg:py-16">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
              Kişisel Gayrimenkul Alanınız
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-950 md:text-5xl">
              Hoş geldiniz, {displayName}.
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600 md:text-lg">
              Favorilerinizi, kayıtlı aramalarınızı ve size uygun portföyleri
              tek bir yerden takip edin.
            </p>

            {/* PORTFÖY ARAMA */}
            <div className="mt-8 flex max-w-3xl items-center rounded-2xl border border-zinc-200 bg-white p-2 shadow-lg shadow-zinc-200/60">
              <div className="flex flex-1 items-center px-4">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="mr-3 h-5 w-5 shrink-0 text-zinc-500"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>

                <input
                  type="text"
                  placeholder="Mahalle, ilçe veya portföy ara..."
                  className="w-full bg-transparent py-3 text-sm text-zinc-950 outline-none placeholder:text-zinc-400 md:text-base"
                />
              </div>

              <Link
                href="/"
                className="shrink-0 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Portföy Ara
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* KİŞİSEL KARTLAR */}
      <section className="mx-auto max-w-[1500px] px-6 py-10 lg:px-10">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <Link
            href="/hesabim?tab=favoriler"
            className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              ♥
            </div>

            <h2 className="mt-5 text-lg font-bold">Favorilerim</h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Beğendiğiniz portföyleri tek yerde görüntüleyin.
            </p>

            <p className="mt-5 text-sm font-semibold text-blue-600">
              Favorilere git →
            </p>
          </Link>

          <Link
            href="/hesabim?tab=aramalar"
            className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              ⌕
            </div>

            <h2 className="mt-5 text-lg font-bold">Kayıtlı Aramalarım</h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Sık kullandığınız arama kriterlerini tekrar kullanın.
            </p>

            <p className="mt-5 text-sm font-semibold text-blue-600">
              Aramalara git →
            </p>
          </Link>

          <Link
            href="/hesabim?tab=son-goruntulenenler"
            className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              ◷
            </div>

            <h2 className="mt-5 text-lg font-bold">Son Görüntülediklerim</h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Son incelediğiniz gayrimenkullere hızlıca geri dönün.
            </p>

            <p className="mt-5 text-sm font-semibold text-blue-600">
              Geçmişi görüntüle →
            </p>
          </Link>

          <Link
            href="/hesabim?tab=randevular"
            className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              ◫
            </div>

            <h2 className="mt-5 text-lg font-bold">Randevularım</h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Portföy görüşmelerinizi ve randevularınızı takip edin.
            </p>

            <p className="mt-5 text-sm font-semibold text-blue-600">
              Randevulara git →
            </p>
          </Link>
        </div>

        {/* SİZE ÖZEL */}
        <div className="mt-10 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-blue-600">
                  Sizin İçin
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight">
                  Size Özel Portföyler
                </h2>

                <p className="mt-2 text-sm text-zinc-500">
                  Aramalarınız ve ilgi alanlarınıza göre önerilecek
                  gayrimenkuller burada görünecek.
                </p>
              </div>

              <Link
                href="/"
                className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
              >
                Tüm portföyleri görüntüle →
              </Link>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50"
                >
                  <div className="flex h-36 items-center justify-center bg-zinc-100 text-sm text-zinc-400">
                    Portföy görseli
                  </div>

                  <div className="p-4">
                    <div className="h-3 w-2/3 rounded-full bg-zinc-200" />
                    <div className="mt-3 h-3 w-1/2 rounded-full bg-zinc-200" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* DANIŞMAN */}
          <section className="rounded-3xl bg-[#08152f] p-7 text-white shadow-lg md:p-8">
            <p className="text-sm font-semibold text-blue-300">Danışmanınız</p>

            <h2 className="mt-3 text-2xl font-bold">Bilal Başol</h2>

            <p className="mt-3 text-sm leading-6 text-white/65">
              Gayrimenkul ihtiyaçlarınız, portföy talepleriniz ve randevularınız
              için doğrudan iletişime geçebilirsiniz.
            </p>

            <div className="mt-7 space-y-3">
              <a
                href="tel:+905301591856"
                className="block rounded-xl bg-blue-600 px-5 py-3.5 text-center text-sm font-semibold transition hover:bg-blue-700"
              >
                Hemen Ara
              </a>

              <Link
                href="/hakkimda"
                className="block rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 text-center text-sm font-semibold transition hover:bg-white/10"
              >
                Danışman Profili
              </Link>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
