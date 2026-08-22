import Footer from "@/components/Footer";

export default function GizlilikPage() {
  return (
    <main className="min-h-screen bg-[#f8f9fb] text-zinc-950">
      {/* HEADER */}
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
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Ana Sayfaya Dön
          </a>
        </div>
      </header>

      {/* BAŞLIK */}
      <section className="px-6 py-14 md:px-12 lg:px-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-blue-600">
            Yasal Bilgilendirme
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Gizlilik Politikası
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-600">
            Bu Gizlilik Politikası, Bilal Başol Gayrimenkul Danışmanlığı
            internet sitesini kullandığınızda bilgilerinizin nasıl ele
            alındığını ve gizliliğinizin korunmasına yönelik yaklaşımımızı
            açıklamaktadır.
          </p>
        </div>
      </section>

      {/* İÇERİK */}
      <section className="px-6 pb-20 md:px-12 lg:px-20">
        <div className="mx-auto max-w-5xl rounded-[28px] border border-zinc-200 bg-white p-7 shadow-sm md:p-10">
          <div className="space-y-10 text-[15px] leading-8 text-zinc-700">
            {/* 1 */}
            <section>
              <h2 className="text-xl font-semibold text-zinc-950">
                1. Gizliliğe Yaklaşımımız
              </h2>

              <p className="mt-4">
                İnternet sitesini kullanan ziyaretçilerin ve kayıtlı
                kullanıcıların kişisel bilgilerinin gizliliğine önem veriyoruz.
                Kişisel verilerin yalnızca gerekli olduğu ölçüde işlenmesi,
                yetkisiz erişime karşı korunması ve amacına uygun şekilde
                kullanılması temel yaklaşımımızdır.
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2 className="text-xl font-semibold text-zinc-950">
                2. Toplanabilecek Bilgiler
              </h2>

              <p className="mt-4">
                Kullandığınız hizmetlere bağlı olarak aşağıdaki bilgiler
                işlenebilir:
              </p>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {[
                  "Ad ve soyad",
                  "E-posta adresi",
                  "Telefon numarası",
                  "Hesap ve oturum bilgileri",
                  "Favori portföyler",
                  "Kayıtlı arama tercihleri",
                  "Randevu ve iletişim talepleri",
                  "Son görüntülenen veya ilgilenilen portföy bilgileri",
                  "Site kullanımına ilişkin teknik kayıtlar",
                  "Güvenlik ve hata kayıtları",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </section>

            {/* 3 */}
            <section>
              <h2 className="text-xl font-semibold text-zinc-950">
                3. Bilgilerin Kullanım Amaçları
              </h2>

              <p className="mt-4">
                Toplanan bilgiler, ilgili hizmetin niteliğine göre aşağıdaki
                amaçlarla kullanılabilir:
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>Kullanıcı hesabının oluşturulması ve yönetilmesi,</li>

                <li>
                  Güvenli ve şifresiz giriş işlemlerinin gerçekleştirilmesi,
                </li>

                <li>
                  Kullanıcı tarafından seçilen favorilerin ve kayıtlı aramaların
                  saklanması,
                </li>

                <li>
                  Kullanıcı tercihlerine uygun gayrimenkul önerileri sunulması,
                </li>

                <li>İletişim, bilgi ve randevu taleplerinin karşılanması,</li>

                <li>
                  Talep edilen hizmetlerin ve gayrimenkul danışmanlığı
                  süreçlerinin yürütülmesi,
                </li>

                <li>
                  İnternet sitesinin güvenliğinin, performansının ve
                  kullanılabilirliğinin geliştirilmesi,
                </li>

                <li>
                  Hukuki yükümlülüklerin yerine getirilmesi ve hakların
                  korunması.
                </li>
              </ul>
            </section>

            {/* 4 */}
            <section>
              <h2 className="text-xl font-semibold text-zinc-950">
                4. Kullanıcı Hesabı ve Şifresiz Giriş
              </h2>

              <p className="mt-4">
                İnternet sitesinde kullanıcı hesabına erişim için şifre
                saklanması yerine e-posta adresine gönderilen güvenli giriş
                bağlantıları kullanılabilir.
              </p>

              <p className="mt-4">
                Bu yöntemin amacı, kullanıcıların parola oluşturma ve saklama
                ihtiyacını azaltırken hesap erişimini güvenli ve kolay hale
                getirmektir.
              </p>

              <p className="mt-4">
                Hesap güvenliği açısından kullanıcıların e-posta hesaplarının
                güvenliğini sağlamaları ve kendilerine gönderilen giriş
                bağlantılarını üçüncü kişilerle paylaşmamaları önemlidir.
              </p>
            </section>

            {/* 5 */}
            <section>
              <h2 className="text-xl font-semibold text-zinc-950">
                5. Bilgilerin Paylaşılması
              </h2>

              <p className="mt-4">
                Kişisel bilgileriniz, hizmetlerin sağlanması için gerekli
                olmadığı sürece üçüncü kişilerle paylaşılmaz.
              </p>

              <p className="mt-4">
                Teknik altyapının çalıştırılması, e-posta hizmetlerinin
                sağlanması, barındırma hizmetleri veya hukuki yükümlülüklerin
                yerine getirilmesi gibi durumlarda gerekli bilgiler, mevzuata
                uygun şekilde hizmet sağlayıcılarla veya yetkili kurumlarla
                paylaşılabilir.
              </p>

              <p className="mt-4">
                Üretim ortamında kullanılan üçüncü taraf hizmetler
                kesinleştiğinde bu bölüm gerektiği ölçüde güncellenecektir.
              </p>
            </section>

            {/* 6 */}
            <section>
              <h2 className="text-xl font-semibold text-zinc-950">
                6. Veri Güvenliği
              </h2>

              <p className="mt-4">
                Kişisel bilgilerin yetkisiz erişim, kayıp, değiştirme, açıklama
                veya kötüye kullanım risklerine karşı korunması için uygun
                teknik ve idari güvenlik tedbirlerinin uygulanması
                hedeflenmektedir.
              </p>

              <p className="mt-4">
                Bu kapsamda erişim kontrolleri, güvenli oturum yönetimi, yazılım
                ve sistem güncellemeleri, veri erişimlerinin sınırlandırılması
                ve gerektiğinde güvenlik kayıtlarının incelenmesi gibi tedbirler
                uygulanabilir.
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="text-xl font-semibold text-zinc-950">
                7. Bilgilerin Saklanması
              </h2>

              <p className="mt-4">
                Kişisel bilgiler, işlenme amaçlarının gerektirdiği süre boyunca
                ve uygulanabilir mevzuatta öngörülen süreler dikkate alınarak
                saklanır.
              </p>

              <p className="mt-4">
                Verilerin işlenmesini gerektiren nedenlerin ortadan kalkması
                halinde bilgiler yürürlükteki mevzuata uygun şekilde silinir,
                yok edilir veya anonim hale getirilir.
              </p>
            </section>

            {/* 8 */}
            <section>
              <h2 className="text-xl font-semibold text-zinc-950">
                8. Çerezler ve Benzeri Teknolojiler
              </h2>

              <p className="mt-4">
                İnternet sitesinin çalışması, güvenli oturumların
                sürdürülebilmesi ve kullanıcı deneyiminin geliştirilmesi için
                çerezler veya benzeri teknolojiler kullanılabilir.
              </p>

              <p className="mt-4">
                Kullanılan çerezlerin türleri, amaçları ve yönetim seçenekleri
                hakkında ayrıntılı bilgiye{" "}
                <a
                  href="/cerez-politikasi"
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  Çerez Politikası
                </a>{" "}
                üzerinden ulaşabilirsiniz.
              </p>
            </section>

            {/* 9 */}
            <section>
              <h2 className="text-xl font-semibold text-zinc-950">
                9. Üçüncü Taraf Bağlantıları
              </h2>

              <p className="mt-4">
                İnternet sitesinde WhatsApp, harita servisleri, sosyal medya
                platformları veya diğer üçüncü taraf internet sitelerine
                yönlendiren bağlantılar bulunabilir.
              </p>

              <p className="mt-4">
                Bu bağlantılara tıklamanız halinde ziyaret ettiğiniz üçüncü
                taraf hizmetlerin kendi gizlilik ve veri işleme politikaları
                geçerli olur.
              </p>
            </section>

            {/* 10 */}
            <section>
              <h2 className="text-xl font-semibold text-zinc-950">
                10. Kullanıcıların Hakları
              </h2>

              <p className="mt-4">
                Kişisel verilerinize ilişkin haklarınız ve bu hakları nasıl
                kullanabileceğiniz hakkında ayrıntılı bilgi için{" "}
                <a
                  href="/kvkk"
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  KVKK Aydınlatma Metni
                </a>{" "}
                sayfasını inceleyebilirsiniz.
              </p>
            </section>

            {/* 11 */}
            <section>
              <h2 className="text-xl font-semibold text-zinc-950">
                11. İletişim
              </h2>

              <p className="mt-4">
                Gizlilik veya kişisel verilerin işlenmesine ilişkin sorularınız
                için aşağıdaki iletişim kanalları kullanılabilir.
              </p>

              <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-5">
                <p>
                  <strong>Veri Sorumlusu:</strong> Bilal Başol
                </p>

                <p className="mt-2">
                  <strong>Telefon:</strong> 0530 159 18 56
                </p>

                <p className="mt-2">
                  <strong>E-posta:</strong>{" "}
                  <span className="text-zinc-500">[Daha sonra eklenecek]</span>
                </p>

                <p className="mt-2">
                  <strong>Adres:</strong>{" "}
                  <span className="text-zinc-500">[Daha sonra eklenecek]</span>
                </p>
              </div>
            </section>

            {/* SON */}
            <section className="border-t border-zinc-200 pt-8">
              <p className="text-sm text-zinc-500">
                İnternet sitesinin özelliklerinin, kullanılan hizmetlerin veya
                hukuki gerekliliklerin değişmesi halinde bu Gizlilik Politikası
                güncellenebilir.
              </p>

              <p className="mt-3 text-xs text-zinc-400">
                Son güncelleme: Ağustos 2026
              </p>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
