"use client";
import { useState } from "react";
import { properties } from "../data/properties";
import { FaInstagram, FaYoutube, FaFacebookF } from "react-icons/fa";

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/?hl=tr",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/?locale=tr_TR",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="currentColor"
      >
        <path d="M13.7 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5H17V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.4V10H7.5v3h2.8v8h3.4Z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/?app=desktop&hl=tr",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="currentColor"
      >
        <path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.7 4.6 12 4.6 12 4.6s-5.7 0-7.5.5a3 3 0 0 0-2.1 2.1C2 9 2 12 2 12s0 3 .4 4.8a3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1C22 15 22 12 22 12s0-3-.4-4.8ZM10 15.4V8.6l6 3.4-6 3.4Z" />
      </svg>
    ),
  },
  {
    name: "Sahibinden",
    href: "#",
    icon: (
      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-current">
        <span className="text-sm font-bold text-white">S</span>
      </div>
    ),
  },
];

function getYouTubeVideoId(url: string) {
  try {
    const parsedUrl = new URL(url);

    // youtube.com/watch?v=VIDEO_ID
    if (parsedUrl.hostname.includes("youtube.com")) {
      const videoId = parsedUrl.searchParams.get("v");

      if (videoId) {
        return videoId;
      }

      // youtube.com/shorts/VIDEO_ID
      if (parsedUrl.pathname.includes("/shorts/")) {
        return parsedUrl.pathname.split("/shorts/")[1].split("/")[0];
      }

      // youtube.com/embed/VIDEO_ID
      if (parsedUrl.pathname.includes("/embed/")) {
        return parsedUrl.pathname.split("/embed/")[1].split("/")[0];
      }
    }

    // youtu.be/VIDEO_ID
    if (parsedUrl.hostname.includes("youtu.be")) {
      return parsedUrl.pathname.replace("/", "").split("/")[0];
    }

    return null;
  } catch {
    return null;
  }
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("Satılık");
  const [selectedLocation, setSelectedLocation] = useState("Eskişehir");
  const [selectedPropertyType, setSelectedPropertyType] = useState("Tümü");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [searchResults, setSearchResults] = useState<typeof properties>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const goToNextPage = () => {
  if (currentPage < totalPages) {
    setSlideDirection("right");
    setCurrentPage((prev) => prev + 1);
  }
};

const goToPreviousPage = () => {
  if (currentPage > 1) {
    setSlideDirection("left");
    setCurrentPage((prev) => prev - 1);
  }
};

const goToPage = (page: number) => {
  setSlideDirection(page > currentPage ? "right" : "left");
  setCurrentPage(page);
};

  // SAYFALAMA
 const [currentPage, setCurrentPage] = useState(1);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");
  const itemsPerPage = 6;

  const handleSearch = () => {
    const filtered = properties.filter((property) => {
      // KATEGORİ FİLTRESİ
      let categoryMatches = true;

      if (selectedCategory === "Satılık") {
        categoryMatches = property.category === "Satılık";
      }

      if (selectedCategory === "Kiralık") {
        categoryMatches = property.category === "Kiralık";
      }

      if (selectedCategory === "Ticari") {
        categoryMatches = property.propertyType === "Ticari";
      }

      if (selectedCategory === "Arsa") {
        categoryMatches = property.propertyType === "Arsa";
      }

      // KONUM FİLTRESİ
      const locationMatches =
        selectedLocation === "Eskişehir"
          ? property.city === "Eskişehir"
          : property.district === selectedLocation;

      // GAYRİMENKUL TİPİ
      const propertyTypeMatches =
        selectedPropertyType === "Tümü"
          ? true
          : property.propertyType === selectedPropertyType;

      // MİNİMUM FİYAT
      const minPriceMatches =
        minPrice === ""
          ? true
          : property.price !== undefined &&
            property.price >= Number(minPrice);

      // MAKSİMUM FİYAT
      const maxPriceMatches =
        maxPrice === ""
          ? true
          : property.price !== undefined &&
            property.price <= Number(maxPrice);

      return (
        categoryMatches &&
        locationMatches &&
        propertyTypeMatches &&
        minPriceMatches &&
        maxPriceMatches
      );
    });

    setSearchResults(filtered);
    setHasSearched(true);

    // HER YENİ ARAMADA 1. SAYFADAN BAŞLA
    setCurrentPage(1);
  };

  // TOPLAM SAYFA SAYISI
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);

  // O ANKİ SAYFANIN BAŞLANGIÇ İNDEKSİ
  const startIndex = (currentPage - 1) * itemsPerPage;

  // SADECE O SAYFADA GÖSTERİLECEK 6 İLAN
  const currentResults = searchResults.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const youtubeUrl =
    "https://youtu.be/1KesPNiOmvA?si=-xUmdDCqZLdwrb6q";

  const youtubeVideoId = getYouTubeVideoId(youtubeUrl);

  const youtubeThumbnail = youtubeVideoId
    ? `https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg`
    : "/hero-emlak.jpg";

  const [youtubePlaying, setYoutubePlaying] = useState(false);

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      

      {/* ÜST MENÜ */}
      <header className="relative z-40 border-b border-zinc-100 bg-white">
        <div className="mx-auto flex h-[92px] max-w-[1440px] items-center justify-between px-8 md:px-12 lg:px-16">

          <nav className="hidden items-center gap-10 text-[15px] font-medium text-zinc-900 lg:flex">
            {["Satılık", "Kiralık", "Ticari", "Arsa"].map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => {
                  setSelectedCategory(category);

                  document.getElementById("portfoyler")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
                className="transition hover:text-[#B68A43]"
              >
                {category}
              </button>
            ))}
          </nav>

          <a
            href="/"
            className="absolute left-1/2 -translate-x-1/2 text-center"
          >
            <div className="text-2xl font-bold tracking-[0.12em] md:text-[28px]">
              BİLAL BAŞOL
            </div>

            <div className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.38em] text-[#B68A43]">
              Gayrimenkul Danışmanlığı
            </div>
          </a>

          <div className="ml-auto flex items-center gap-7">
            <nav className="hidden items-center gap-9 text-[15px] font-medium text-zinc-900 xl:flex">
              <a
                href="http://localhost:3000/hakkimda"
                className="transition hover:text-[#B68A43]"
              >
                Hakkımda
              </a>

              <a href="#iletisim" className="transition hover:text-[#B68A43]">
                İletişim
              </a>
              <a
              href="#iletisim"
              className="transition hover:text-[#B68A43]"
            >
              Randevu Al
            </a>
            <a
              href="#iletisim"
              className="rounded-full bg-[#D2A34D] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:text-black hover:shadow-lg"
            >
              Kayıt Ol
            </a>
            </nav>

            
          </div>
        </div>
      </header>

      {/* HERO + SOL SOSYAL PANEL */}
      <section className="relative min-h-[calc(100vh-88px)] ">

        {/* SOL PANEL */}
        <aside className="fixed right-4 top-1/2 z-40 hidden w-[80px] -translate-y-1/2 rounded-[28px] border border-zinc-200 bg-white/95 px-3 py-4 shadow-2xl backdrop-blur-md lg:flex lg:flex-col lg:items-center">

  {/* İMZA */}
  <a
    href="/"
    className="mb-3 flex w-[75px] items-center justify-center rounded-2xl bg-white px-2 py-2"
  >
    <img
      src="/bilal-basol-imza.png"
      alt="Bilal Başol"
      className="h-[72px] w-auto object-contain"
    />
  </a>

  {/* AYIRICI */}
  <div className="mb-3 h-px w-14 bg-zinc-200" />

  {/* SOSYAL MEDYA */}
  <div className="flex flex-col items-center gap-2">
    {socialLinks.map((social) => (
      <a
        key={social.name}
        href={social.href}
        target="_blank"
        rel="noreferrer"
        className="group flex w-[88px] flex-col items-center justify-center rounded-2xl px-3 py-3 text-zinc-500 transition duration-200 hover:bg-zinc-100 hover:text-zinc-950"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-50 transition duration-200 group-hover:scale-110 group-hover:bg-white">
          {social.icon}
        </div>

        <span className="mt-1.5 text-center text-[11px] font-medium">
          {social.name}
        </span>
      </a>
    ))}
  </div>

</aside>

        {/* HERO GÖRSELİ */}
        <div className="relative flex-1 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/arkaplan.png')" }}
          />

          {/* Öncekinden çok daha açık katman */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-black/5" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          <div className="relative z-10 flex min-h-[calc(100vh-88px)] items-center px-7 py-16 md:px-14 lg:px-20">
            <div className="w-full max-w-5xl">

              <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-white/85 md:text-sm">
                Eskişehir Gayrimenkul Danışmanlığı
              </p>

              <h1 className="max-w-5xl text-3xl font-bold leading-[1.15] tracking-tight text-white md:text-7xl xl:text-[66px]">
                Doğru Gayrimenkul.
                <br />
                Doğru Yatırım.
              </h1>

              <p className="mt-7 max-w-1xl text-base leading-7 text-white/90 md:text-lg">
                Konut, ticari gayrimenkul, arsa ve yatırım fırsatlarını
                profesyonel danışmanlıkla keşfedin.
              </p>

              {/* HERO ARAMA */}
<div className="mt-10 w-full max-w-[1400px]">

  {/* ARAMA KUTUSU */}
<div className="flex h-16 max-w-3xl items-center rounded-2xl bg-white p-1.5 shadow-2xl shadow-black/20">

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
      className="w-full bg-transparent text-base text-zinc-900 outline-none placeholder:text-zinc-400"
    />
  </div>

  <button
    type="button"
    // onClick={handleSearch}
    className="flex h-12 items-center justify-center rounded-xl bg-[#D2A34D] px-5 text-base font-semibold text-white shadow-sm transition hover:bg-[#BE913F] hover:shadow-md"
  >
    Portföy Ara
  </button>

</div>
  {/* KATEGORİ BUTONLARI */}
  <div className="mt-5 flex flex-wrap gap-2">
    {["Satılık", "Kiralık", "Ticari", "Arsa"].map(
      (category, index) => (
        <button
          key={category}
          className={`rounded-full border px-6 py-3 text-sm font-semibold backdrop-blur-md transition ${
            index === 0
              ? "border-[#D2A34D] bg-[#D2A34D] text-white shadow-md hover:bg-[#BE913F] hover:shadow-lg"
              : "border-white/50 bg-black/20 text-white hover:bg-[#BE913F] hover:shadow-lg hover:text-white"
          }`}
        >
          {category}
        </button>
      )
    )}
  </div>


  {/* GÜVEN PANELİ */}
  <div className="-ml-6 mt-5 grid w-[calc(100%+120px)] max-w-[1500px] overflow-hidden rounded-2xl border border-white/15 bg-black/65 backdrop-blur-md md:grid-cols-2 xl:grid-cols-4">

    {/* GÜVENİLİR DANIŞMANLIK */}
    <div className="flex items-center gap-4 border-b border-white/15 p-5 md:border-r xl:border-b-0">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center text-[#D2A34D]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-10 w-10"
        >
          <path d="M12 3 4.5 6v5.5c0 4.8 3.2 7.8 7.5 9.5 4.3-1.7 7.5-4.7 7.5-9.5V6L12 3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      </div>

      <div>
        <p className="font-semibold text-white">
          Güvenilir Danışmanlık
        </p>

        <p className="mt-1 text-xs leading-5 text-white/65">
          Şeffaf, dürüst ve profesyonel danışmanlık anlayışı.
        </p>
      </div>
    </div>


    {/* DOĞRU FİYAT ANALİZİ */}
    <div className="flex items-center gap-4 border-b border-white/15 px-6 py-4 xl:border-b-0 xl:border-r">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center text-[#D2A34D]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-10 w-10"
        >
          <path d="M4 20V10" />
          <path d="M9 20V14" />
          <path d="M14 20V8" />
          <path d="M19 20V4" />
          <path d="m4 8 5-4 4 3 6-5" />
        </svg>
      </div>

      <div>
        <p className="font-semibold text-white">
          Doğru Fiyat Analizi
        </p>

        <p className="mt-1 text-xs leading-5 text-white/65">
          Piyasa analizleriyle en doğru fiyat değerlendirmesi.
        </p>
      </div>
    </div>


    {/* ZAMANINDA SONUÇ */}
    <div className="flex items-center gap-4 border-b border-white/15 px-6 py-4 md:border-r xl:border-b-0">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center text-[#D2A34D]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-10 w-10"
        >
          <path d="m8 12 3 3 5-6" />
          <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0Z" />
        </svg>
      </div>

      <div>
        <p className="font-semibold text-white">
          Zamanında Sonuç
        </p>

        <p className="mt-1 text-xs leading-5 text-white/65">
          Hızlı, etkili ve sonuç odaklı çözümler.
        </p>
      </div>
    </div>


    {/* ESKİŞEHİR UZMANI */}
    <div className="flex items-center gap-4 px-6 py-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center text-[#D2A34D]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-10 w-10"
        >
          <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
          <circle cx="12" cy="10" r="2" />
        </svg>
      </div>

      <div>
        <p className="font-semibold text-white">
          Eskişehir Uzmanı
        </p>

        <p className="mt-1 text-xs leading-5 text-white/65">
          Bölgeye hakim, geniş portföy ve güçlü network.
        </p>
      </div>
    </div>

  </div>
</div>

</div>
</div>
</div>
</section>
{/* ÖNE ÇIKAN PORTFÖYLER */}
      <section className="bg-white px-6 py-24 text-zinc-950 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">

          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-blue-600">
                Öne Çıkan Portföyler
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
                Seçili gayrimenkuller
              </h2>
            </div>

            <a
              href="#portfoyler"
              className="text-sm font-semibold underline decoration-zinc-300 underline-offset-8 transition hover:decoration-black"
            >
              Tüm portföyleri görüntüle
            </a>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {properties
              .filter((property) => property.featured)
              .map((property) => (
                <article
                  key={property.id}
                  className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <a
                    href={`/portfoy/${property.id}`}
                    className="block"
                  >
                    <div className="relative h-72 overflow-hidden">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />

                      <div className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black shadow-sm">
                        {property.category}
                      </div>
                    </div>
                  </a>

                  <div className="p-6">
                    <p className="text-sm text-zinc-500">
                      {property.neighborhood} • {property.district} •{" "}
                      {property.city}
                    </p>

                    <h3 className="mt-2 text-xl font-semibold leading-snug">
                      {property.title}
                    </h3>

                    <div className="mt-5 flex flex-wrap gap-3 text-sm text-zinc-600">
                      {property.rooms && <span>{property.rooms}</span>}

                      {property.rooms && <span>•</span>}

                      <span>{property.propertyType}</span>

                      <span>•</span>

                      <span>{property.city}</span>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-zinc-200 pt-5">
                      <span className="text-lg font-semibold">
                        {property.priceText}
                      </span>

                      <a
                        href={`/portfoy/${property.id}`}
                        className="rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
                      >
                        İncele
                      </a>
                    </div>
                  </div>
                </article>
              ))}
          </div>
        </div>
      </section>
      {/* PORTFÖY ARAMA DETAYLI */}
<section
  id="portfoyler"
  className="bg-zinc-50 px-6 py-20 text-zinc-950 md:px-12 lg:px-20 "
>
  <div className="mx-auto max-w-7xl rounded-[32px] border border-zinc-200 bg-white p-5 shadow-sm md:p-8">

    {/* BAŞLIK */}
    <div className="mb-10 ">
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-blue-600 ">
        Detaylı Portföy Arama
      </p>

      <h2 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
        Bütçenize ve ihtiyaçlarınıza uygun gayrimenkulü bulun.
      </h2>

      <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600 md:text-lg">
        Konum, gayrimenkul türü ve bütçenizi belirleyin.
        Size uygun portföyleri birlikte filtreleyelim.
      </p>
    </div>

    {/* ANA ARAMA PANELİ */}
    <div className="rounded-[32px] border border-zinc-200 bg-white p-5 shadow-sm md:p-8">

      {/* KATEGORİLER */}
      <div className="mt-7 flex flex-wrap gap-3">
        {["Satılık", "Kiralık", "Ticari", "Arsa"].map((item) => {
          const isSelected = selectedCategory === item;

          return (
            <button
              key={item}
              type="button"
              onClick={() => setSelectedCategory(item)}
              className={`relative rounded-full px-7 py-3 text-sm font-semibold transition duration-300 ${
                isSelected
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                  : "border border-zinc-200 bg-white text-zinc-700 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {/* SEÇİLİ BUTON DALGALANMA EFEKTİ */}
              {isSelected && (
                <span className="pointer-events-none absolute -inset-0.5 animate-[ping_0.8s_ease-out_0] rounded-full border-2 border-blue-500/60" />
              )}

              <span className="relative z-10">
                {item}
              </span>
            </button>
          );
        })}
      </div>

      {/* FİLTRELER */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">

        {/* KONUM */}
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
            Konum
          </label>

          <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-transparent text-lg font-medium text-zinc-950 outline-none"
            >
            <option>Eskişehir</option>
            <option>Tepebaşı</option>
            <option>Odunpazarı</option>
          </select>
        </div>

        {/* GAYRİMENKUL TİPİ */}
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
            Gayrimenkul Tipi
          </label>

          <select
              value={selectedPropertyType}
              onChange={(e) => setSelectedPropertyType(e.target.value)}
              className="w-full bg-transparent text-lg font-medium text-zinc-950 outline-none"
            >
            <option>Tümü</option>
            <option>Daire</option>
            <option>Villa</option>
            <option>Ticari</option>
            <option>Arsa</option>
          </select>
        </div>

        {/* MİNİMUM FİYAT */}
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
            Minimum Fiyat
          </label>

          <select
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full bg-transparent text-lg font-medium text-zinc-950 outline-none"
            >
            <option value="">-</option>
            <option value="1000000">1.000.000 TL</option>
            <option value="2500000">2.500.000 TL</option>
            <option value="5000000">5.000.000 TL</option>
            <option value="10000000">10.000.000 TL</option>
            <option value="20000000">20.000.000 TL</option>
          </select>
        </div>

        {/* MAKSİMUM FİYAT */}
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
            Maksimum Fiyat
          </label>

          <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full bg-transparent text-lg font-medium text-zinc-950 outline-none"
            >
            <option value="">-</option>
            <option value="2500000">2.500.000 TL</option>
            <option value="5000000">5.000.000 TL</option>
            <option value="10000000">10.000.000 TL</option>
            <option value="20000000">20.000.000 TL</option>
            <option value="50000000">50.000.000 TL +</option>
          </select>
        </div>

        {/* ARAMA BUTONU */}
<button
  type="button"
  onClick={handleSearch}
  className="flex min-h-[96px] items-center justify-center rounded-2xl bg-blue-600 px-7 text-lg font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-lg"
>
  Portföy Ara
</button>
      </div>
      {/* HIZLI BÜTÇE SEÇİMİ */}
      <div className="mt-7 border-t border-zinc-200 pt-7">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

          <div>
            <p className="font-semibold text-zinc-950">
              Bütçenizi hızlıca belirleyin
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Sık kullanılan fiyat aralıklarından birini seçebilirsiniz.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
  {[
    {
      label: "0 - 5 Milyon",
      min: "",
      max: "5000000",
    },
    {
      label: "5 - 10 Milyon",
      min: "5000000",
      max: "10000000",
    },
    {
      label: "10 - 20 Milyon",
      min: "10000000",
      max: "20000000",
    },
    {
      label: "20 Milyon +",
      min: "20000000",
      max: "",
    },
  ].map((budget) => {
    const isActive =
      minPrice === budget.min &&
      maxPrice === budget.max;

    return (
      <button
        key={budget.label}
        type="button"
        onClick={() => {
          setMinPrice(budget.min);
          setMaxPrice(budget.max);
        }}
        className={`rounded-full border px-5 py-2.5 text-sm font-medium transition ${
          isActive
            ? "border-blue-600 bg-blue-600 text-white shadow-sm"
            : "border-zinc-200 bg-white text-zinc-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
        }`}
      >
        {budget.label}
      </button>
    );
  })}
</div>

        </div>
      </div>
    </div>


      {/* ARAMA SONUÇLARI */}
{hasSearched && (
  <div className="mt-8">

    {/* SONUÇ SAYISI */}
    <div className="mb-6">
      <p className="text-sm font-medium text-blue-600">
        Arama Sonuçları
      </p>

      <h3 className="mt-1 text-2xl font-semibold text-zinc-950">
        {searchResults.length} portföy bulundu.
      </h3>
    </div>

    {/* SONUÇ YOKSA */}
    {searchResults.length === 0 ? (

      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 text-center">
        <p className="text-lg font-semibold text-zinc-950">
          Aramanıza uygun portföy bulunamadı.
        </p>

        <p className="mt-2 text-sm text-zinc-500">
          Fiyat aralığını veya diğer filtreleri değiştirerek tekrar
          deneyebilirsiniz.
        </p>
      </div>

    ) : (

      <>
       {/* İLAN KARTLARI */}
<div className="relative min-h-[610px] overflow-hidden">

  <div
    key={currentPage}
    className={`grid gap-4 md:grid-cols-2 xl:grid-cols-3 ${
      slideDirection === "right"
        ? "animate-[slideInRight_0.45s_ease-out]"
        : "animate-[slideInLeft_0.45s_ease-out]"
    }`}
  >

    {currentResults.map((property) => (
      <article
        key={property.id}
        className="group flex h-[295px] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
      >

        {/* SOL GÖRSEL */}
        <div className="relative w-[42%] shrink-0 overflow-hidden">
          <img
            src={property.image}
            alt={property.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />

          {/* SATILIK / KİRALIK */}
          <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-zinc-950 shadow-sm">
            {property.category}
          </div>
        </div>

        {/* SAĞ BİLGİLER */}
        <div className="flex min-w-0 flex-1 flex-col p-4">

          {/* KONUM */}
          <p className="truncate text-[11px] font-medium text-blue-600">
            {property.neighborhood} • {property.district}
          </p>

          {/* BAŞLIK */}
          <h3 className="mt-2 line-clamp-2 text-[16px] font-semibold leading-5 text-zinc-950">
            {property.title}
          </h3>

          {/* ÖZELLİKLER */}
          <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-[12px] text-zinc-500">

            {property.rooms && (
              <span>{property.rooms}</span>
            )}

            {property.rooms && property.grossArea && (
              <span>•</span>
            )}

            {property.grossArea && (
              <span>{property.grossArea} m²</span>
            )}

            <span>•</span>

            <span>{property.propertyType}</span>

          </div>

          {/* ALT KISIM */}
          <div className="mt-auto">

            <p className="text-[17px] font-bold text-zinc-950">
              {property.priceText}
            </p>

            <a
              href={`/portfoy/${property.id}`}
              className="mt-3 block w-full rounded-lg bg-zinc-950 px-3 py-2.5 text-center text-[13px] font-semibold text-white transition hover:bg-blue-600"
            >
              Portföyü İncele
            </a>

          </div>

        </div>

      </article>
    ))}

  </div>

</div>
        {/* SAYFALAMA */}
        {totalPages > 1 && (
  <div className="mt-10 flex items-center justify-center gap-4">

    {/* SOL OK */}
    <button
      type="button"
      onClick={goToPreviousPage}
      disabled={currentPage === 1}
      className={`flex h-12 w-12 items-center justify-center rounded-full border text-xl transition ${
        currentPage === 1
          ? "cursor-not-allowed border-zinc-200 text-zinc-300"
          : "border-zinc-300 bg-white text-zinc-700 shadow-sm hover:border-blue-600 hover:text-blue-600 hover:shadow-md"
      }`}
    >
      ←
    </button>

    {/* SAYFA NUMARALARI */}
    <div className="flex items-center gap-2">
      {Array.from({ length: totalPages }, (_, index) => {
        const pageNumber = index + 1;

        return (
          <button
            key={pageNumber}
            type="button"
            onClick={() => goToPage(pageNumber)}
            className={`flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold transition ${
              currentPage === pageNumber
                ? "bg-blue-600 text-white shadow-md"
                : "bg-zinc-100 text-zinc-600 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            {pageNumber}
          </button>
        );
      })}
    </div>

    {/* SAĞ OK */}
    <button
      type="button"
      onClick={goToNextPage}
      disabled={currentPage === totalPages}
      className={`flex h-12 w-12 items-center justify-center rounded-full border text-xl transition ${
        currentPage === totalPages
          ? "cursor-not-allowed border-zinc-200 text-zinc-300"
          : "border-zinc-300 bg-white text-zinc-700 shadow-sm hover:border-blue-600 hover:text-blue-600 hover:shadow-md"
      }`}
    >
      →
    </button>

  </div>
)}

      </>
    )}

  </div>
)}
      
    {/* KİŞİSEL PORTFÖY DANIŞMANLIĞI */}
<section className="mt-10">
  <div className="overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-sm">
    <div className="grid items-stretch lg:grid-cols-2">

      {/* SOL TARAF */}
      <div className="flex flex-col justify-center px-7 py-12 md:px-12 lg:px-14 lg:py-16">

        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-blue-600">
          Size Özel Gayrimenkul Danışmanlığı
        </p>

        <h3 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight text-zinc-950 md:text-5xl">
          Ne aradığınızdan emin değil misiniz?
        </h3>

        <p className="mt-6 max-w-xl text-base leading-8 text-zinc-600 md:text-lg">
          Bütçenizi, beklentilerinizi ve yatırım hedeflerinizi paylaşın.
          Size uygun gayrimenkulleri birlikte değerlendirelim.
        </p>

        {/* GÜVEN MADDELERİ */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              ✓
            </div>

            <div>
              <p className="font-semibold text-zinc-950">
                Kişiye özel portföy
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                İhtiyaçlarınıza göre seçim
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              ✓
            </div>

            <div>
              <p className="font-semibold text-zinc-950">
                Bölge analizi
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                Eskişehir odaklı değerlendirme
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              ✓
            </div>

            <div>
              <p className="font-semibold text-zinc-950">
                Yatırım değerlendirmesi
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                Bütçenize uygun seçenekler
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              ✓
            </div>

            <div>
              <p className="font-semibold text-zinc-950">
                Doğrudan iletişim
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                Süreç boyunca danışmanlık
              </p>
            </div>
          </div>

        </div>

        {/* BUTONLAR */}
        <div className="mt-9 flex flex-wrap gap-3">

          <a
            href="#iletisim"
            className="rounded-xl bg-blue-600 px-7 py-4 font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
          >
            Bana Uygun Portföy Öner
          </a>

          <a
            href="#iletisim"
            className="rounded-xl border border-zinc-300 bg-white px-7 py-4 font-semibold text-zinc-950 transition hover:border-blue-300 hover:text-blue-600"
          >
            Danışmanla Görüş
          </a>

        </div>

        <p className="mt-5 text-sm text-zinc-400">
          Talepleriniz doğrultusunda size özel portföy seçenekleri
          hazırlanacaktır.
        </p>

      </div>

      {/* SAĞ GÖRSEL */}
      <div className="relative min-h-[420px] overflow-hidden bg-zinc-100 lg:min-h-full">

        <img
          src="/nearadiginiz.png"
          alt="Bilal Başol gayrimenkul danışmanlığı"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* GÖRSELİ HAFİF YUMUŞATAN KATMAN */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

        {/* ÜST BİLGİ KUTUSU */}
        <div className="absolute left-6 top-6 rounded-2xl bg-white/95 px-5 py-4 shadow-xl backdrop-blur-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Profesyonel Danışmanlık
          </p>

          <p className="mt-1 font-semibold text-zinc-950">
            Doğru portföyü birlikte bulalım
          </p>
        </div>

        {/* ALT BİLGİ KUTUSU */}
        <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/95 p-5 shadow-xl backdrop-blur-sm sm:right-auto sm:max-w-sm">

          <div className="flex items-start gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
              ✓
            </div>

            <div>
              <p className="font-semibold text-zinc-950">
                Size özel portföy önerileri
              </p>

              <p className="mt-1 text-sm leading-6 text-zinc-500">
                Bütçe, bölge ve beklentilerinize göre seçenekleri
                birlikte değerlendirelim.
              </p>
            </div>

          </div>
        </div>

      </div>

        </div>
  </div>
</section>

  </div>
</section>

      {/* BİLAL BAŞOL'DAN GÜNCEL */}
<section className="bg-zinc-50 px-6 py-24 text-zinc-950 md:px-12 lg:px-20">
  <div className="mx-auto max-w-7xl rounded-[32px] border border-zinc-200 bg-white p-5 shadow-sm md:p-8">

    {/* BAŞLIK */}
    <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end ">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-blue-600">
          Bilal Başol&apos;dan Güncel
        </p>

        <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
          En Yeni İçerikler
        </h2>

        <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600">
          Eskişehir gayrimenkul piyasası, yeni portföyler, yatırım
          fırsatları ve saha çalışmalarından güncel içerikleri takip edin.
        </p>
      </div>

      <a
        href="#"
        className="text-sm font-semibold underline decoration-zinc-300 underline-offset-8 transition hover:decoration-black"
      >
        Tüm paylaşımları görüntüle
      </a>
    </div>

    {/* SOSYAL MEDYA KARTLARI */}
    <div className="grid gap-7 lg:grid-cols-3">

      {/* INSTAGRAM */}
      <article className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

        <div className="relative h-80 overflow-hidden">
          <img
            src="/hero-emlak.jpg"
            alt="Bilal Başol Instagram paylaşımı"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />

          <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-zinc-950 shadow-lg backdrop-blur-sm">
  <FaInstagram className="text-[18px] text-[#E4405F]" />
  <span>Instagram</span>
</div>
        </div>

        <div className="p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Yeni Portföy
          </p>

          <h3 className="mt-3 text-2xl font-semibold">
            Eskişehir&apos;den yeni bir yatırım fırsatı
          </h3>

          <p className="mt-4 leading-7 text-zinc-600">
            Yeni portföyler, saha çalışmaları ve gayrimenkul
            dünyasından güncel gelişmeler.
          </p>

          <a
            href="#"
            className="mt-6 inline-flex items-center gap-2 font-semibold"
          >
            Instagram&apos;da Gör
            <span>→</span>
          </a>
        </div>
      </article>

      {/* YOUTUBE */}
<article className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

  <div className="relative h-80 overflow-hidden">

    {!youtubePlaying ? (
      <>
        <img
          src={youtubeThumbnail}
          alt="Bilal Başol YouTube videosu"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />

        {/* Hafif karartma */}
        <div className="absolute inset-0 bg-black/10 transition group-hover:bg-black/20" />

        {/* YOUTUBE ETİKETİ */}
        <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-zinc-950 shadow-lg backdrop-blur-sm">
          <FaYoutube className="text-[19px] text-[#FF0000]" />

          <span>YouTube</span>
        </div>

        {/* PLAY BUTONU */}
        <button
          type="button"
          onClick={() => setYoutubePlaying(true)}
          className="absolute inset-0 flex items-center justify-center"
          aria-label="Videoyu oynat"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 text-2xl text-black shadow-2xl transition duration-300 hover:scale-110">
            ▶
          </span>
        </button>
      </>
    ) : youtubeVideoId ? (
      <iframe
        src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1`}
        title="Bilal Başol YouTube videosu"
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    ) : (
      <img
        src="/hero-emlak.jpg"
        alt="YouTube videosu"
        className="h-full w-full object-cover"
      />
    )}

  </div>

  <div className="p-6">

    <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
      Gayrimenkul Rehberi
    </p>

    <h3 className="mt-3 text-2xl font-semibold">
      Gayrimenkul yatırımı yaparken nelere dikkat edilmeli?
    </h3>

    <p className="mt-4 leading-7 text-zinc-600">
      Doğru gayrimenkul seçimi, yatırım analizi ve piyasa
      değerlendirmeleri üzerine içerikler.
    </p>

    <a
      href={youtubeUrl}
      target="_blank"
      rel="noreferrer"
      className="mt-6 inline-flex items-center gap-2 font-semibold transition hover:text-[#D2A34D]"
    >
      YouTube&apos;da İzle
      <span>→</span>
    </a>

  </div>

</article>

      {/* FACEBOOK */}
      <article className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

        <div className="relative h-80 overflow-hidden">
          <img
            src="/hero-emlak.jpg"
            alt="Bilal Başol Facebook paylaşımı"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />

          <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-zinc-950 shadow-lg backdrop-blur-sm">
  <div className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#1877F2]">
    <FaFacebookF className="text-[11px] text-white" />
  </div>

  <span>Facebook</span>
</div>
        </div>

        <div className="p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Sahadan Güncel
          </p>

          <h3 className="mt-3 text-2xl font-semibold">
            Eskişehir gayrimenkul piyasasından gelişmeler
          </h3>

          <p className="mt-4 leading-7 text-zinc-600">
            Yeni satışlar, portföy çalışmaları ve bölgedeki önemli
            gayrimenkul gelişmeleri.
          </p>

          <a
            href="#"
            className="mt-6 inline-flex items-center gap-2 font-semibold"
          >
            Facebook&apos;ta Gör
            <span>→</span>
          </a>
        </div>
      </article>

    </div>



  </div>
</section>
      {/* ÜYELİK TEŞVİK BÖLÜMÜ */}
<section className="bg-white px-6 py-24 text-zinc-950 md:px-12 lg:px-20">
  <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2 rounded-[32px] border border-zinc-200 bg-white p-5 shadow-sm md:p-8">

    <div className="max-w-xl">
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-blue-600">
        Kullanıcı Dostu Deneyim
      </p>

      <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
        Size özel portföyleri keşfedin.
      </h2>

      <p className="mt-6 text-base leading-8 text-zinc-600 md:text-lg">
        Ücretsiz hesabınızı oluşturun, favori portföylerinizi kaydedin,
        yeni ilanlardan ilk siz haberdar olun ve randevu taleplerinizi
        kolayca yönetin.
      </p>

      <div className="mt-9 flex flex-wrap gap-4">
        <a
          href="/kayit"
          className="rounded-xl bg-zinc-950 px-7 py-4 font-semibold text-white transition hover:bg-zinc-800"
        >
          Ücretsiz Hesap Oluştur
        </a>

        <a
          href="/giris"
          className="rounded-xl border border-zinc-300 bg-white px-7 py-4 font-semibold text-zinc-950 transition hover:border-zinc-500"
        >
          Giriş Yap
        </a>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-4">
        <div>
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 text-xl">
            ♡
          </div>
          <p className="text-sm font-medium">Favorileri kaydedin</p>
        </div>

        <div>
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 text-xl">
            🔔
          </div>
          <p className="text-sm font-medium">Yeni ilanlardan haberdar olun</p>
        </div>

        <div>
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 text-xl">
            📅
          </div>
          <p className="text-sm font-medium">Randevu oluşturun</p>
        </div>

        <div>
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 text-xl">
            🛡️
          </div>
          <p className="text-sm font-medium">Güvenli işlem yapın</p>
        </div>
      </div>
    </div>

    <div className="relative">
      <img
        src="/uyelik-tesvik.png"
        alt="Üyelik avantajları ve kişiselleştirilmiş gayrimenkul önerileri"
        className="w-full rounded-3xl object-contain"
      />
    </div>

  </div>
</section>
    </main>
  );
}