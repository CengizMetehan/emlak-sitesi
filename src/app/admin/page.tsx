import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") {
    redirect("/giris");
  }

  const menuItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: "⌂",
      active: true,
    },
    {
      title: "İlanlar",
      href: "/admin/ilanlar",
      icon: "▦",
      active: false,
    },

    {
      title: "Sahibinden Import",
      href: "/admin/sahibinden-import",
      icon: "↻",
      active: true,
    },
    {
      title: "Kullanıcılar",
      href: "/admin/kullanicilar",
      icon: "♙",
      active: false,
    },
    {
      title: "Ayarlar",
      href: "/admin/ayarlar",
      icon: "⚙",
      active: false,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        {/* SOL MENÜ */}
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-slate-950 lg:flex lg:flex-col">
          {/* LOGO / BAŞLIK */}
          <div className="border-b border-white/10 px-7 py-7">
            <Link href="/" className="block">
              <p className="text-xl font-bold tracking-wide">BİLAL BAŞOL</p>

              <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-400">
                Gayrimenkul Yönetimi
              </p>
            </Link>
          </div>

          {/* MENÜ */}
          <nav className="flex-1 space-y-2 px-4 py-6">
            {menuItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={`flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  item.active
                    ? "bg-white text-slate-950"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-base">
                  {item.icon}
                </span>

                {item.title}
              </Link>
            ))}
          </nav>

          {/* ALT KISIM */}
          <div className="border-t border-white/10 p-4">
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm font-semibold">
                {session.user.name || "Admin"}
              </p>

              <p className="mt-1 break-all text-xs text-slate-400">
                {session.user.email}
              </p>

              <div className="mt-3 inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                ADMIN
              </div>
            </div>
          </div>
        </aside>

        {/* SAĞ ANA ALAN */}
        <main className="min-w-0 flex-1">
          {/* ÜST BAR */}
          <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
            <div className="flex h-20 items-center justify-between px-5 md:px-8 xl:px-10">
              <div>
                <p className="text-sm text-slate-400">Yönetim Paneli</p>

                <h1 className="text-xl font-semibold">Dashboard</h1>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="hidden rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white sm:block"
                >
                  Siteyi Görüntüle
                </Link>

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-950">
                  {(session.user.name || session.user.email)
                    .charAt(0)
                    .toUpperCase()}
                </div>
              </div>
            </div>
          </header>

          {/* DASHBOARD */}
          <div className="p-5 md:p-8 xl:p-10">
            {/* KARŞILAMA */}
            <section className="mb-8">
              <p className="text-sm font-medium text-amber-400">
                Yönetim Merkezi
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                Hoş geldiniz, {session.user.name || "Admin"}
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                Gayrimenkul ilanlarınızı, Sahibinden verilerinizi ve site
                yönetimini buradan kontrol edebilirsiniz.
              </p>
            </section>

            {/* İSTATİSTİK KARTLARI */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <DashboardCard
                title="Toplam İlan"
                value="15"
                description="Aktif portföy"
                icon="▦"
              />

              <DashboardCard
                title="Aktif İlan"
                value="15"
                description="Yayındaki ilanlar"
                icon="✓"
              />

              <DashboardCard
                title="Admin Düzenlemesi"
                value="0"
                description="Manuel değişiklik"
                icon="✎"
              />

              <DashboardCard
                title="Son Import"
                value="Başarılı"
                description="Sahibinden"
                icon="↻"
              />
            </section>

            {/* ORTA ALAN */}
            <section className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
              {/* HIZLI İŞLEMLER */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Hızlı İşlemler</h3>

                    <p className="mt-1 text-sm text-slate-400">
                      Sık kullanılan yönetim işlemleri
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <QuickAction
                    href="/admin/ilanlar"
                    title="İlanları Yönet"
                    description="Tüm ilanları görüntüle ve düzenle."
                    icon="▦"
                  />

                  <QuickAction
                    href="/admin/sahibinden-import"
                    title="Sahibinden Import"
                    description="Yeni Sahibinden verilerini içeri aktar."
                    icon="↻"
                  />

                  <QuickAction
                    href="/admin/ayarlar"
                    title="Site Ayarları"
                    description="Yönetim seçeneklerini görüntüle."
                    icon="⚙"
                  />
                </div>
              </div>

              {/* SİSTEM DURUMU */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h3 className="text-lg font-semibold">Sistem Durumu</h3>

                <p className="mt-1 text-sm text-slate-400">
                  Yönetim sisteminin temel bileşenleri
                </p>

                <div className="mt-6 space-y-5">
                  <StatusItem
                    title="Authentication"
                    description="Better Auth"
                  />

                  <StatusItem
                    title="Veritabanı"
                    description="SQLite • Development"
                  />

                  <StatusItem
                    title="Sahibinden Import"
                    description="Çalışıyor"
                  />

                  <StatusItem title="Admin Yetkilendirme" description="Aktif" />
                </div>
              </div>
            </section>

            {/* SON AKTİVİTE */}
            <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03]">
              <div className="border-b border-white/10 px-6 py-5">
                <h3 className="text-lg font-semibold">Son İşlemler</h3>

                <p className="mt-1 text-sm text-slate-400">
                  Yönetim panelindeki son aktiviteler burada görüntülenecek.
                </p>
              </div>

              <div className="flex min-h-48 flex-col items-center justify-center px-6 py-10 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-xl">
                  ↻
                </div>

                <p className="mt-4 font-medium">Henüz aktivite kaydı yok</p>

                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  İlan düzenlemeleri ve import işlemleri ilerleyen aşamada
                  burada gösterilecek.
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/20 hover:bg-white/[0.05]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>

          <p className="mt-3 text-2xl font-bold">{value}</p>

          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-lg">
          {icon}
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-white/10 bg-slate-950/60 p-5 transition hover:border-white/20 hover:bg-white/[0.05]"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-lg transition group-hover:bg-white group-hover:text-slate-950">
        {icon}
      </div>

      <h4 className="mt-4 font-semibold">{title}</h4>

      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </Link>
  );
}

function StatusItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium">{title}</p>

        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>

      <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.65)]" />
    </div>
  );
}
