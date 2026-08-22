"use client";

import { useState } from "react";

export default function HikayemSlider() {
  const [page, setPage] = useState(1);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const goToPage = (newPage: number) => {
    if (newPage === page) return;

    setDirection(newPage > page ? "right" : "left");
    setPage(newPage);
  };

  const previousPage = () => {
    if (page === 1) return;

    setDirection("left");
    setPage(1);
  };

  const nextPage = () => {
    if (page === 2) return;

    setDirection("right");
    setPage(2);
  };

  return (
    <section className="px-6 pb-16 md:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[32px] border border-zinc-200 bg-white p-7 shadow-sm md:p-10 lg:p-12">
          <div className="grid items-start gap-12 lg:grid-cols-[1fr_380px]">
            {/* SOL - DEĞİŞEN HİKÂYE */}
            <div className="min-w-0 overflow-hidden">
              <div
                key={page}
                className={
                  direction === "right"
                    ? "animate-[storySlideRight_0.7s_cubic-bezier(0.22,1,0.36,1)]"
                    : "animate-[storySlideLeft_0.7s_cubic-bezier(0.22,1,0.36,1)]"
                }
              >
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-blue-600">
                  Hikâyem
                </p>

                <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
                  Disiplinden danışmanlığa uzanan profesyonel bir yolculuk
                </h2>

                {page === 1 ? (
                  <div className="mt-8 space-y-5 text-base leading-8 text-zinc-600 md:text-lg">
                    <p>
                      1974 İzmir doğumluyum. Evli ve 3 erkek çocuk babasıyım.
                      Türk Hava Kuvvetleri&apos;nde hizmet verdiğim 26 yılı önce
                      Astsubay, sonra Subay olarak tamamlayarak Binbaşı
                      rütbesinde emekli oldum.
                    </p>

                    <p>
                      İşletme Fakültesi Yönetim ve Organizasyon bölümünde önce
                      Lisans, sonrasında Yüksek Lisans eğitimlerimi tamamladım.
                      Emeklilik sonrasında İşçi Sağlığı ve İş Güvenliği
                      Uzmanlığı ile Emlak ve Emlak Yönetimi bölümlerinde
                      Önlisans eğitimimi tamamladım.
                    </p>

                    <p>
                      “Hayat bir okuldur ve öğrenmenin yaşı yoktur” ilkesiyle
                      her zaman kendimi yeniliğe ve öğrenmeye açık tuttum.
                    </p>
                  </div>
                ) : (
                  <div className="mt-8 space-y-5 text-base leading-8 text-zinc-600 md:text-lg">
                    <p>
                      Son 8 yıldır Eskişehir&apos;de gayrimenkul sektöründe;
                      önce yerel markalarda, sonrasında Remax ve Realty World
                      gibi kurumsal gayrimenkul ofislerinde danışmanlık ve
                      yöneticilik görevlerinde bulundum.
                    </p>

                    <p>
                      Bugün Keller Williams Alles Gayrimenkul bünyesinde
                      Gayrimenkul Profesyoneli olarak çalışıyorum.
                    </p>

                    <p>
                      Askerliğin kazandırdığı disiplin, titiz ve sistemli
                      çalışma anlayışını gayrimenkul mesleğinde güvene dayalı,
                      yüksek memnuniyet üreten bir hizmete dönüştürdüm.
                    </p>

                    <p className="font-medium text-zinc-950">
                      Benim için başarı, müşterilerimin günün sonunda “İyi ki bu
                      kararı birlikte verdik, tam istediğimiz gibi oldu”
                      diyebilmesidir.
                    </p>
                  </div>
                )}
              </div>

              {/* SAYFALAMA */}
              <div className="mt-10 flex items-center gap-3">
                <button
                  type="button"
                  onClick={previousPage}
                  disabled={page === 1}
                  className={`flex h-12 w-12 items-center justify-center rounded-full border text-xl shadow-sm transition ${
                    page === 1
                      ? "cursor-not-allowed border-zinc-200 text-zinc-300"
                      : "border-zinc-300 bg-white text-zinc-800 hover:border-blue-600 hover:text-blue-600"
                  }`}
                >
                  ←
                </button>

                {[1, 2].map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => goToPage(pageNumber)}
                    className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold transition ${
                      page === pageNumber
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "bg-zinc-100 text-zinc-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={nextPage}
                  disabled={page === 2}
                  className={`flex h-12 w-12 items-center justify-center rounded-full border text-xl shadow-sm transition ${
                    page === 2
                      ? "cursor-not-allowed border-zinc-200 text-zinc-300"
                      : "border-zinc-300 bg-white text-zinc-800 hover:border-blue-600 hover:text-blue-600"
                  }`}
                >
                  →
                </button>
              </div>
            </div>

            {/* SAĞ - FOTOĞRAF */}
            <div className="lg:sticky lg:top-8">
              <div className="overflow-hidden rounded-[28px] border border-zinc-200 bg-zinc-100 shadow-sm">
                <img
                  src="/bilal-basol.jpg"
                  alt="Bilal Başol Gayrimenkul Danışmanı"
                  className="aspect-[4/5] h-full w-full object-cover"
                />
              </div>

              <div className="px-2 pt-5">
                <p className="text-xl font-semibold text-zinc-950">
                  Bilal Başol
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  Gayrimenkul Profesyoneli
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
