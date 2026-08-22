import Footer from "@/components/Footer";

export default function KvkkPage() {
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
            İnternet Sitesi KVKK Aydınlatma Metni
          </h1>

          <p className="mt-5 max-w-4xl text-base leading-8 text-zinc-600">
            Bilal Başol tarafından işletilen internet sitesini ziyaret eden,
            kullanıcı hesabı oluşturan veya site üzerinden iletişim kuran
            kişilerin gizliliğinin ve kişisel verilerinin korunmasına önem
            verilmektedir.
          </p>

          <p className="mt-4 max-w-4xl text-base leading-8 text-zinc-600">
            İşbu Aydınlatma Metni, 6698 sayılı Kişisel Verilerin Korunması
            Kanunu kapsamında kişisel verilerinizin hangi amaçlarla ve hangi
            hukuki sebeplere dayanılarak işlendiği konusunda sizi bilgilendirmek
            amacıyla hazırlanmıştır.
          </p>
        </div>
      </section>

      {/* İÇERİK */}
      <section className="px-6 pb-20 md:px-12 lg:px-20">
        <div className="mx-auto max-w-5xl rounded-[28px] border border-zinc-200 bg-white p-7 shadow-sm md:p-10">
          <div className="space-y-10 text-[15px] leading-8 text-zinc-700">
            {/* VERİ SORUMLUSU */}
            <section>
              <h2 className="text-xl font-semibold text-zinc-950">
                Veri Sorumlusu
              </h2>

              <p className="mt-4">
                6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında
                kişisel verileriniz bakımından veri sorumlusu:
              </p>

              <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                <p>
                  <strong>Veri Sorumlusu:</strong> Bilal Başol
                </p>

                <p className="mt-2">
                  <strong>Telefon:</strong> 0530 159 18 56
                </p>

                <p className="mt-2">
                  <strong>E-posta:</strong>{" "}
                  <span className="text-zinc-400">[Daha sonra eklenecek]</span>
                </p>

                <p className="mt-2">
                  <strong>Adres:</strong>{" "}
                  <span className="text-zinc-400">[Daha sonra eklenecek]</span>
                </p>
              </div>
            </section>

            {/* 1 */}
            <section>
              <h2 className="text-xl font-semibold text-zinc-950">
                1. Kişisel Verilerin İşlenme Amaçları
              </h2>

              <p className="mt-4">
                İnternet sitesini ziyaret etmeniz, kullanıcı hesabı oluşturmanız
                veya site üzerindeki hizmetleri kullanmanız sırasında elde
                edilen kişisel verileriniz, ilgili işlemin niteliğine göre
                aşağıdaki amaçlarla işlenebilir:
              </p>

              <ul className="mt-5 list-disc space-y-3 pl-6">
                <li>
                  İnternet sitesinde kullanıcı hesabı oluşturulması ve hesabın
                  yönetilmesi,
                </li>

                <li>
                  Kullanıcının e-posta adresi üzerinden şifresiz ve güvenli
                  giriş işlemlerinin gerçekleştirilmesi,
                </li>

                <li>
                  Kullanıcıların internet sitesinde sunulan hizmetlerden
                  faydalanmasının sağlanması,
                </li>

                <li>
                  Gayrimenkul arama, portföy inceleme ve kullanıcı tercihlerinin
                  yönetilmesi,
                </li>

                <li>
                  Favori portföylerin, kayıtlı aramaların ve benzeri
                  kişiselleştirilmiş kullanıcı özelliklerinin sunulması,
                </li>

                <li>
                  İletişim, bilgi talebi ve randevu taleplerinin alınması,
                  değerlendirilmesi ve yanıtlanması,
                </li>

                <li>
                  Kullanıcının belirlediği kriterlere uygun gayrimenkul
                  seçeneklerinin değerlendirilmesi ve sunulması,
                </li>

                <li>
                  Gayrimenkul danışmanlığı hizmetlerinin planlanması ve
                  yürütülmesi,
                </li>

                <li>
                  İnternet sitesinin işleyişinin, güvenliğinin ve kullanıcı
                  deneyiminin sağlanması,
                </li>

                <li>
                  Hukuki yükümlülüklerin yerine getirilmesi ve gerektiğinde
                  hakların tesisi, kullanılması veya korunması.
                </li>
              </ul>
            </section>

            {/* 2 */}
            <section>
              <h2 className="text-xl font-semibold text-zinc-950">
                2. İşlenebilecek Kişisel Veriler
              </h2>

              <p className="mt-4">
                Kullanılan hizmete ve kullanıcı tarafından gerçekleştirilen
                işleme bağlı olarak aşağıdaki kişisel veriler işlenebilir:
              </p>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {[
                  "Ad ve soyad bilgileri",
                  "E-posta adresi",
                  "Telefon numarası",
                  "Kullanıcı hesabı ve oturum bilgileri",
                  "Favori portföy bilgileri",
                  "Kayıtlı arama ve gayrimenkul tercihleri",
                  "Randevu ve iletişim talepleri",
                  "İlgilenilen veya görüntülenen portföylere ilişkin bilgiler",
                  "İnternet sitesi kullanımına ilişkin teknik kayıtlar",
                  "Güvenlik ve işlem kayıtları",
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
                3. Kişisel Verilerin Aktarılabileceği Taraflar ve Aktarım
                Amaçları
              </h2>

              <p className="mt-4">
                Kişisel verileriniz, yalnızca ilgili hizmetin sunulması,
                internet sitesinin teknik altyapısının çalıştırılması, hukuki
                yükümlülüklerin yerine getirilmesi veya hakların korunması
                amacıyla ve gerekli olduğu ölçüde aktarılabilir.
              </p>

              <p className="mt-4">
                Bu kapsamda veriler; internet sitesinin barındırılması,
                kullanıcı hesabı ve kimlik doğrulama işlemleri, e-posta
                gönderimi ve benzeri teknik hizmetleri sağlayan hizmet
                sağlayıcılarla ve mevzuat gereği talep edilmesi halinde kanunen
                yetkili kamu kurum ve kuruluşları ile yetkili mercilerle
                paylaşılabilir.
              </p>

              <p className="mt-4">
                İnternet sitesi üretim ortamına alındığında kullanılan üçüncü
                taraf hizmetler ve varsa kişisel veri aktarım süreçleri ayrıca
                değerlendirilerek bu Aydınlatma Metni gerektiğinde
                güncellenecektir.
              </p>
            </section>

            {/* 4 */}
            <section>
              <h2 className="text-xl font-semibold text-zinc-950">
                4. Kişisel Verilerin Toplanma Yöntemi ve Hukuki Sebebi
              </h2>

              <p className="mt-4">
                Kişisel verileriniz; internet sitesi üzerindeki kullanıcı hesabı
                işlemleri, e-posta ile giriş işlemleri, iletişim ve randevu
                alanları, favori ve kayıtlı arama özellikleri, kullanıcı
                tarafından sunulan bilgiler ile internet sitesinin kullanılması
                sırasında oluşan teknik kayıtlar aracılığıyla elektronik ortamda
                otomatik veya kısmen otomatik yollarla elde edilebilir.
              </p>

              <p className="mt-5">
                Kişisel verileriniz, işleme faaliyetinin niteliğine göre
                özellikle aşağıdaki hukuki sebeplere dayanılarak işlenebilir:
              </p>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                  <p className="font-semibold text-zinc-950">KVKK m.5/2(c)</p>

                  <p className="mt-2">
                    Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya
                    ilgili olması kaydıyla, sözleşmenin taraflarına ait kişisel
                    verilerin işlenmesinin gerekli olması.
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                  <p className="font-semibold text-zinc-950">KVKK m.5/2(ç)</p>

                  <p className="mt-2">
                    Veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi
                    için veri işlemenin zorunlu olması.
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                  <p className="font-semibold text-zinc-950">KVKK m.5/2(e)</p>

                  <p className="mt-2">
                    Bir hakkın tesisi, kullanılması veya korunması için veri
                    işlemenin zorunlu olması.
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                  <p className="font-semibold text-zinc-950">KVKK m.5/2(f)</p>

                  <p className="mt-2">
                    İlgili kişinin temel hak ve özgürlüklerine zarar vermemek
                    kaydıyla, veri sorumlusunun meşru menfaatleri için veri
                    işlenmesinin zorunlu olması.
                  </p>
                </div>
              </div>

              <p className="mt-5">
                Bir kişisel veri işleme faaliyetinin yukarıdaki veya Kanun'da
                öngörülen diğer işleme şartlarından birine dayandırılamaması ve
                açık rıza gerektirmesi halinde, ilgili kişiden açık rıza ayrıca
                ve ilgili işlem özelinde talep edilir.
              </p>
            </section>

            {/* 5 */}
            <section>
              <h2 className="text-xl font-semibold text-zinc-950">
                5. KVKK'nın 11. Maddesi Kapsamındaki Haklarınız
              </h2>

              <p className="mt-4">
                6698 sayılı Kanun'un 11. maddesi uyarınca veri sorumlusuna
                başvurarak kişisel verilerinizle ilgili olarak:
              </p>

              <ol className="mt-5 list-[lower-alpha] space-y-3 pl-6">
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>

                <li>
                  Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme,
                </li>

                <li>
                  Kişisel verilerinizin işlenme amacını ve bunların amacına
                  uygun kullanılıp kullanılmadığını öğrenme,
                </li>

                <li>
                  Yurt içinde veya yurt dışında kişisel verilerinizin
                  aktarıldığı üçüncü kişileri bilme,
                </li>

                <li>
                  Kişisel verilerinizin eksik veya yanlış işlenmiş olması
                  halinde bunların düzeltilmesini isteme,
                </li>

                <li>
                  Kanun'da öngörülen şartlar çerçevesinde kişisel verilerinizin
                  silinmesini veya yok edilmesini isteme,
                </li>

                <li>
                  Düzeltme, silme veya yok etme işlemlerinin kişisel
                  verilerinizin aktarıldığı üçüncü kişilere bildirilmesini
                  isteme,
                </li>

                <li>
                  İşlenen verilerinizin münhasıran otomatik sistemler
                  aracılığıyla analiz edilmesi suretiyle kişinin kendisi
                  aleyhine bir sonucun ortaya çıkmasına itiraz etme,
                </li>

                <li>
                  Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle
                  zarara uğramanız halinde zararın giderilmesini talep etme
                  haklarına sahipsiniz.
                </li>
              </ol>
            </section>

            {/* 6 */}
            <section>
              <h2 className="text-xl font-semibold text-zinc-950">
                6. Veri Sorumlusuna Başvuru Yöntemi
              </h2>

              <p className="mt-4">
                KVKK kapsamındaki haklarınıza ilişkin taleplerinizi, Veri
                Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ'e uygun
                biçimde Bilal Başol'a iletebilirsiniz.
              </p>

              <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-5">
                <p>
                  <strong>Veri Sorumlusu:</strong> Bilal Başol
                </p>

                <p className="mt-2">
                  <strong>E-posta:</strong>{" "}
                  <span className="text-zinc-500">[Daha sonra eklenecek]</span>
                </p>

                <p className="mt-2">
                  <strong>Başvuru Adresi:</strong>{" "}
                  <span className="text-zinc-500">[Daha sonra eklenecek]</span>
                </p>
              </div>

              <p className="mt-5">
                Başvurular, talebin niteliğine göre en kısa sürede ve en geç
                otuz gün içinde sonuçlandırılır.
              </p>

              <p className="mt-4">
                Başvurunun reddedilmesi, verilen cevabın yetersiz bulunması veya
                süresinde cevap verilmemesi halinde, ilgili kişi veri
                sorumlusunun cevabını öğrendiği tarihten itibaren otuz gün ve
                her halde başvuru tarihinden itibaren altmış gün içinde Kişisel
                Verileri Koruma Kuruluna şikâyette bulunabilir.
              </p>

              <p className="mt-4">
                Veri sorumlusuna başvuru yolu tüketilmeden Kurula şikâyet yoluna
                başvurulamaz.
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="text-xl font-semibold text-zinc-950">
                7. Aydınlatma Metninin Güncellenmesi
              </h2>

              <p className="mt-4">
                İnternet sitesinde sunulan hizmetlerin, kişisel veri işleme
                faaliyetlerinin, kullanılan teknik hizmet sağlayıcıların veya
                ilgili mevzuatın değişmesi halinde işbu Aydınlatma Metni gözden
                geçirilerek güncellenebilir.
              </p>
            </section>

            {/* SON */}
            <section className="border-t border-zinc-200 pt-8">
              <p className="text-sm text-zinc-500">
                Kişisel verilerinizin korunmasına önem veriyor ve internet
                sitesini kullanırken gizliliğiniz konusunda şeffaf bir yaklaşım
                benimsemeyi amaçlıyoruz.
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
