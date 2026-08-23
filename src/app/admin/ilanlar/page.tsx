import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

import { getProperties } from "@/lib/properties-db";
import { getPropertyOverride } from "@/lib/property-overrides";
import AdminPropertyList from "@/components/AdminPropertyList";

export const dynamic = "force-dynamic";

export default async function AdminIlanlarPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  /*
   * Artık properties.generated.ts değil,
   * Neon PostgreSQL kullanılıyor.
   */
  const properties = await getProperties();

  /*
   * Override bilgilerini SERVER tarafında
   * uygulayıp Client Component'e hazır veri gönderiyoruz.
   */
  const adminProperties = await Promise.all(
    properties.map(async (property) => {
      const override = await getPropertyOverride(property.id);

      return {
        ...property,

        displayTitle: override?.title ?? property.title,

        displayPriceText: override?.price_text ?? property.priceText,

        displayCoverImage: override?.cover_image ?? property.image,
      };
    }),
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-[1600px] px-5 py-8 md:px-8 xl:px-10">
        {/* ÜST BAŞLIK */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-amber-400">Yönetim Paneli</p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              İlanlar
            </h1>

            <p className="mt-3 text-sm text-slate-400">
              Portföylerinizi arayın, görüntüleyin ve düzenleyin.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin"
              className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              ← Dashboard
            </Link>
          </div>
        </div>

        {/* ÖZET */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Toplam İlan</p>

              <p className="mt-1 text-2xl font-bold">{properties.length}</p>
            </div>

            <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
              Neon veritabanı
            </div>
          </div>
        </div>

        {/* ARAMA + İLAN LİSTESİ */}
        <AdminPropertyList properties={adminProperties} />

        {/* ALT BİLGİ */}
        <div className="mt-5 rounded-2xl border border-amber-500/10 bg-amber-500/[0.04] px-5 py-4 text-sm leading-6 text-slate-400">
          Sahibinden üzerinden aktarılan portföyler Neon veritabanında tutulur.
          Admin tarafından yapılan özel düzenlemeler ayrı override katmanında
          korunur.
        </div>
      </div>
    </div>
  );
}
