"use client";
import { authClient } from "@/lib/auth-client";
import Footer from "@/components/Footer";
import ContactModal from "@/components/ContactModal";
import { useEffect, useState } from "react";
import { FaInstagram, FaYoutube, FaFacebookF } from "react-icons/fa";
import { getPropertyOverride } from "@/lib/property-overrides";
import type { Property } from "@/data/properties";
type PropertyOverride = {
  property_id: string;
  title: string | null;
  price_text: string | null;
  cover_image: string | null;
};
const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/bilalbasol.kw/",
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
    href: "https://www.facebook.com/bilalbasol.kw/",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
        <path d="M13.7 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5H17V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.4V10H7.5v3h2.8v8h3.4Z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/channel/UCq2dK7UZSTDFzmL-rdDir7g",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
        <path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.7 4.6 12 4.6 12 4.6s-5.7 0-7.5.5a3 3 0 0 0-2.1 2.1C2 9 2 12 2 12s0 3 .4 4.8a3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1C22 15 22 12 22 12s0-3-.4-4.8ZM10 15.4V8.6l6 3.4-6 3.4Z" />
      </svg>
    ),
  },
  {
    name: "Sahibinden",
    href: "https://alles.sahibinden.com/emlak?sorting=storeShowcase&userId=aHx5rZiAsMa_tISTVblhhVw",
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
  const [propertyOverrides, setPropertyOverrides] = useState<
    PropertyOverride[]
  >([]);

  useEffect(() => {
    async function loadPropertyOverrides() {
      try {
        const response = await fetch("/api/property-overrides");

        if (!response.ok) {
          return;
        }

        const data: PropertyOverride[] = await response.json();
        setPropertyOverrides(data);
      } catch (error) {
        console.error("Property overrides yüklenemedi:", error);
      }
    }

    loadPropertyOverrides();
  }, []);

  useEffect(() => {
    async function loadProperties() {
      try {
        const response = await fetch("/api/properties", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Portföyler alınamadı.");
        }

        const data: Property[] = await response.json();

        setProperties(data);
      } catch (error) {
        console.error("Portföy yükleme hatası:", error);
      } finally {
        setPropertiesLoading(false);
      }
    }

    loadProperties();
  }, []);

  useEffect(() => {
    async function loadLatestYouTubeVideo() {
      try {
        const response = await fetch("/api/youtube-latest");

        if (!response.ok) {
          return;
        }

        const data: LatestYouTubeVideo = await response.json();

        setLatestYouTubeVideo(data);
      } catch (error) {
        console.error("YouTube videosu yüklenemedi:", error);
      } finally {
        setYoutubeLoading(false);
      }
    }

    loadLatestYouTubeVideo();
  }, []);

  function getDisplayPrice(propertyId: string, originalPrice: string) {
    const override = propertyOverrides.find(
      (item) => item.property_id === propertyId,
    );

    return override?.price_text ?? originalPrice;
  }

  function getDisplayCoverImage(propertyId: string, originalImage: string) {
    const override = propertyOverrides.find(
      (item) => item.property_id === propertyId,
    );

    return override?.cover_image ?? originalImage;
  }

  function getDisplayTitle(propertyId: string, originalTitle: string) {
    const override = propertyOverrides.find(
      (item) => item.property_id === propertyId,
    );

    return override?.title ?? originalTitle;
  }

  const [selectedCategory, setSelectedCategory] = useState("Satılık");
  const [selectedLocation, setSelectedLocation] = useState("Eskişehir");
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [selectedPropertyType, setSelectedPropertyType] = useState("Tümü");
  const [heroSearch, setHeroSearch] = useState("");
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchResults, setSearchResults] = useState<typeof properties>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [sortOption, setSortOption] = useState("default");
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  type LatestYouTubeVideo = {
    videoId: string;
    title: string;
    description: string;
    publishedAt: string;
    thumbnail: string;
    url: string;
  };

  const [latestYouTubeVideo, setLatestYouTubeVideo] =
    useState<LatestYouTubeVideo | null>(null);

  const [youtubeLoading, setYoutubeLoading] = useState(true);

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
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "right",
  );
  const itemsPerPage = 6;

  const handleHeroSearch = () => {
    const query = heroSearch.trim().toLocaleLowerCase("tr-TR");

    const filtered = properties.filter((property) => {
      if (!query) {
        return true;
      }

      const searchableText = [
        property.title,
        property.city,
        property.district,
        property.neighborhood,
        property.propertyType,
        property.category,
        property.rooms,
        property.grossArea?.toString(),
        property.sahibindenId,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("tr-TR");

      return searchableText.includes(query);
    });

    setSearchResults(filtered);
    setHasSearched(true);
    setCurrentPage(1);

    setTimeout(() => {
      const element = document.getElementById("arama-sonuclari");

      if (!element) return;

      const targetPosition =
        element.getBoundingClientRect().top + window.scrollY - 80;

      const startPosition = window.scrollY;
      const distance = targetPosition - startPosition;
      const duration = 900;
      let startTime: number | null = null;

      const easeInOutCubic = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const animateScroll = (currentTime: number) => {
        if (startTime === null) {
          startTime = currentTime;
        }

        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeInOutCubic(progress);

        window.scrollTo(0, startPosition + distance * easedProgress);

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    }, 100);
  };

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
          : property.price !== undefined && property.price >= Number(minPrice);

      // MAKSİMUM FİYAT
      const maxPriceMatches =
        maxPrice === ""
          ? true
          : property.price !== undefined && property.price <= Number(maxPrice);

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

    setTimeout(() => {
      const element = document.getElementById("arama-sonuclari");

      if (!element) return;

      const targetPosition =
        element.getBoundingClientRect().top + window.scrollY - 80;

      const startPosition = window.scrollY;
      const distance = targetPosition - startPosition;
      const duration = 900;
      let startTime: number | null = null;

      const easeInOutCubic = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const animateScroll = (currentTime: number) => {
        if (startTime === null) {
          startTime = currentTime;
        }

        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeInOutCubic(progress);

        window.scrollTo(0, startPosition + distance * easedProgress);

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    }, 100);
  };

  // TOPLAM SAYFA SAYISI
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);

  // O ANKİ SAYFANIN BAŞLANGIÇ İNDEKSİ
  const startIndex = (currentPage - 1) * itemsPerPage;

  // SADECE O SAYFADA GÖSTERİLECEK 6 İLAN
  const sortedSearchResults = [...searchResults].sort((a, b) => {
    if (sortOption === "price-asc") {
      const priceA =
        Number(getDisplayPrice(a.id, a.priceText).replace(/[^\d]/g, "")) || 0;

      const priceB =
        Number(getDisplayPrice(b.id, b.priceText).replace(/[^\d]/g, "")) || 0;

      return priceA - priceB;
    }

    if (sortOption === "price-desc") {
      const priceA =
        Number(getDisplayPrice(a.id, a.priceText).replace(/[^\d]/g, "")) || 0;

      const priceB =
        Number(getDisplayPrice(b.id, b.priceText).replace(/[^\d]/g, "")) || 0;

      return priceB - priceA;
    }

    return 0;
  });

  const currentResults = sortedSearchResults.slice(
    (currentPage - 1) * 6,
    currentPage * 6,
  );

  //const youtubeUrl = "https://youtu.be/1KesPNiOmvA?si=-xUmdDCqZLdwrb6q";

  //const youtubeVideoId = getYouTubeVideoId(youtubeUrl);

  //const youtubeThumbnail = youtubeVideoId
  //  ? `https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg`
  //  : "/hero-emlak.jpg";

  const [youtubePlaying, setYoutubePlaying] = useState(false);

  return (
    <main className="min-h-screen bg-[#F3F0EA] text-zinc-950">
      {/* ÜST MENÜ */}
      <header className="relative z-40 border-b border-zinc-100 bg-[#F3F0EA]">
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
                className="transition hover:text-blue-600"
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

            <div className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.38em] text-blue-600">
              Gayrimenkul Danışmanlığı
            </div>
          </a>

          <div className="ml-auto flex items-center gap-7">
            <nav className="hidden items-center gap-9 text-[15px] font-medium text-zinc-900 xl:flex">
              <a
                href="http://localhost:3000/hakkimda"
                className="transition hover:text-blue-600"
              >
                Hakkımda
              </a>

              <button
                type="button"
                onClick={() => setIsContactOpen(true)}
                className="transition hover:text-blue-600"
              >
                İletişim
              </button>

              <div className="flex items-center gap-3">
                <a
                  href="#portfoyler"
                  className="rounded-full bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-lg"
                >
                  Portföyleri İncele
                </a>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* HERO + SOL SOSYAL PANEL */}
      <section className="relative min-h-[602px] overflow-hidden bg-[#F3F0EA]">
        {/* SOL PANEL */}
        <aside className="fixed right-4 top-[52%] z-40 hidden w-[72px] -translate-y-1/2 rounded-[24px] border border-zinc-200 bg-white/95 px-2 py-3 shadow-xl backdrop-blur-md lg:flex lg:flex-col lg:items-center">
          <a
            href="/"
            className="mb-2 flex w-[64px] items-center justify-center rounded-2xl bg-white px-2 py-1"
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
                className="group flex w-[68px] flex-col items-center justify-center rounded-xl px-2 py-2 text-zinc-500 transition duration-200 hover:bg-zinc-100 hover:text-zinc-950"
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
            className="absolute inset-0 bg-cover bg-center max-h-[460px]"
            style={{ backgroundImage: "url('/arkaplan.png')" }}
          />

          {/* Daha açık ve ferah katmanlar */}
          <div className="" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

          <div className="relative z-10 flex max-h-[460px] items-center px-7 py-12 md:px-14 lg:px-20">
            <div className="w-full max-w-[760px]">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-slate-700 md:text-sm">
                Eskişehir Gayrimenkul Danışmanlığı
              </p>

              <h1 className="max-w-[760px] text-4xl font-bold leading-[1.05] tracking-tight text-slate-950 md:text-6xl xl:text-[64px]">
                Doğru Gayrimenkul.
                <br />
                Doğru Yatırım.
              </h1>

              <p className="mt-6 max-w-[620px] text-base leading-7 text-slate-800 md:text-lg">
                Konut, ticari gayrimenkul, arsa ve yatırım fırsatlarını
                profesyonel danışmanlıkla keşfedin.
              </p>

              {/* HERO ARAMA */}
              <div className="mt-8 w-full max-w-[700px]">
                <div className="flex min-h-16 items-center rounded-2xl bg-white p-2 shadow-xl shadow-black/10">
                  <div className="flex flex-1 items-center px-4">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="mr-3 h-5 w-5 shrink-0 text-slate-600"
                    >
                      <circle cx="11" cy="11" r="7" />
                      <path d="m20 20-4-4" />
                    </svg>

                    <input
                      type="text"
                      value={heroSearch}
                      onChange={(e) => setHeroSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleHeroSearch();
                        }
                      }}
                      placeholder="Mahalle, ilçe veya portföy ara..."
                      className="w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleHeroSearch}
                    className="flex h-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 px-6 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
                  >
                    Portföy Ara
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GÜVEN PANELİ */}
        <div className="bg-[#F3F0EA] px-6 py-6 md:px-12 lg:px-20">
          <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-sm md:grid-cols-2 xl:grid-cols-4">
            {" "}
            {/* GÜVENİLİR DANIŞMANLIK */}
            <div className="flex items-center gap-4 border-b border-slate-200 p-5 md:border-r x2:border-b-0">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center text-blue-600">
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
                <p className="font-semibold text-slate-950">
                  Güvenilir Danışmanlık
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Şeffaf, dürüst ve profesyonel danışmanlık anlayışı.
                </p>
              </div>
            </div>
            {/* DOĞRU FİYAT ANALİZİ */}
            <div className="flex items-center gap-4 border-b border-slate-200 px-6 py-4 xl:border-b-0 xl:border-r">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center text-blue-600">
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
                <p className="font-semibold text-slate-950">
                  Doğru Fiyat Analizi
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Piyasa analizleriyle en doğru fiyat değerlendirmesi.
                </p>
              </div>
            </div>
            {/* ZAMANINDA SONUÇ */}
            <div className="flex items-center gap-4 border-b border-slate-200 px-6 py-4 md:border-r xl:border-b-0">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center text-blue-600">
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
                <p className="font-semibold text-slate-950">Zamanında Sonuç</p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Hızlı, etkili ve sonuç odaklı çözümler.
                </p>
              </div>
            </div>
            {/* ESKİŞEHİR UZMANI */}
            <div className="flex items-center gap-4 px-6 py-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center text-blue-600">
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
                <p className="font-semibold text-slate-950">Eskişehir Uzmanı</p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Bölgeye hakim, geniş portföy ve güçlü network.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PORTFÖY ARAMA DETAYLI */}
      <section
        id="portfoyler"
        className="bg-[#F3F0EA] px-6 py-6 text-zinc-950 md:px-12 lg:px-20"
      >
        <div className="mx-auto max-w-7xl rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm md:p-10">
          {/* BAŞLIK */}
          <div className="mb-10 ">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-blue-600 ">
              Detaylı Portföy Arama
            </p>

            <div className="grid items-center gap-8 lg:grid-cols-[1.35fr_0.65fr]">
              {/* SOL - BAŞLIK VE AÇIKLAMA */}
              <div>
                <h2 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
                  Bütçenize ve ihtiyaçlarınıza uygun gayrimenkulü bulun.
                </h2>

                <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600 md:text-lg">
                  Konum, gayrimenkul türü ve bütçenizi belirleyin. Size uygun
                  portföyleri birlikte filtreleyelim.
                </p>
              </div>

              {/* SAĞ - PORTFÖY ARAMA GÖRSELİ */}
              <div className="hidden items-center justify-center lg:flex">
                <img
                  src="/portfoy-arama.png"
                  alt="Gayrimenkul portföy arama"
                  className="h-auto w-full max-w-[300px] object-contain"
                />
              </div>
            </div>
          </div>

          {/* ANA ARAMA PANELİ */}
          <div className="rounded-[32px] border border-zinc-200 bg-white p-5 shadow-sm md:p-8">
            {/* KATEGORİLER */}
            <div className="mt-7 flex flex-wrap gap-1 py-2">
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

                    <span className="relative z-10">{item}</span>
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

              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-6 py-5">
                <label className="block text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Minimum Fiyat
                </label>

                <div className="mt-2 flex items-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={minPriceInput}
                    onChange={(e) => {
                      const onlyNumbers = e.target.value.replace(/\D/g, "");

                      setMinPriceInput(
                        onlyNumbers
                          ? Number(onlyNumbers).toLocaleString("tr-TR")
                          : "",
                      );

                      setMinPrice(onlyNumbers);
                    }}
                    placeholder="Örn. 2.500.000"
                    className="w-full bg-transparent text-xl font-medium text-zinc-950 outline-none placeholder:text-zinc-400"
                  />

                  <span className="ml-2 shrink-0 text-sm font-medium text-zinc-500">
                    TL
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-6 py-5">
                <label className="block text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Maksimum Fiyat
                </label>

                <div className="mt-2 flex items-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={maxPriceInput}
                    onChange={(e) => {
                      const onlyNumbers = e.target.value.replace(/\D/g, "");

                      setMaxPriceInput(
                        onlyNumbers
                          ? Number(onlyNumbers).toLocaleString("tr-TR")
                          : "",
                      );

                      setMaxPrice(onlyNumbers);
                    }}
                    placeholder="Örn. 10.000.000"
                    className="w-full bg-transparent text-xl font-medium text-zinc-950 outline-none placeholder:text-zinc-400"
                  />

                  <span className="ml-2 shrink-0 text-sm font-medium text-zinc-500">
                    TL
                  </span>
                </div>
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
                      minPrice === budget.min && maxPrice === budget.max;

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
            <div id="arama-sonuclari" className="mt-8 scroll-mt-24">
              {/* SONUÇ SAYISI + SIRALAMA */}
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">
                    Arama Sonuçları
                  </p>

                  <h3 className="mt-1 text-2xl font-semibold text-zinc-950">
                    {searchResults.length} portföy bulundu.
                  </h3>
                </div>

                {searchResults.length > 1 && (
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="property-sort"
                      className="text-sm font-medium text-zinc-900"
                    >
                      Sırala:
                    </label>

                    <select
                      id="property-sort"
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-800 outline-none transition hover:border-zinc-300 focus:border-blue-500"
                    >
                      <option value="default">Önerilen</option>
                      <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
                      <option value="price-desc">
                        Fiyat: Yüksekten Düşüğe
                      </option>
                    </select>
                  </div>
                )}
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
                            {getDisplayCoverImage(
                              property.id,
                              property.image,
                            ) ? (
                              <img
                                src={getDisplayCoverImage(
                                  property.id,
                                  property.image,
                                )}
                                alt={getDisplayTitle(
                                  property.id,
                                  property.title,
                                )}
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full w-full flex-col items-center justify-center bg-zinc-100 px-4 text-center">
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  className="h-9 w-9 text-zinc-400"
                                >
                                  <rect
                                    x="3"
                                    y="4"
                                    width="18"
                                    height="16"
                                    rx="2"
                                  />
                                  <circle cx="8.5" cy="9" r="1.5" />
                                  <path d="m21 15-5-5L5 20" />
                                </svg>

                                <p className="mt-2 text-xs font-medium text-zinc-500">
                                  Görsel yakında eklenecek
                                </p>
                              </div>
                            )}

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
                              {getDisplayTitle(property.id, property.title)}
                            </h3>

                            {/* ÖZELLİKLER */}
                            <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-[12px] text-zinc-500">
                              {property.rooms && <span>{property.rooms}</span>}

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
                                {getDisplayPrice(
                                  property.id,
                                  property.priceText,
                                )}
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
        </div>
      </section>

      {/* ÖNE ÇIKAN PORTFÖYLER */}
      <section className="bg-[#F3F0EA] px-6 py-6 text-zinc-950 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm md:p-10">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-blue-600">
                Öne Çıkan Portföyler
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
                Seçili gayrimenkuller
              </h2>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {properties
              .filter((property) => property.featured)
              .map((property) => (
                <article
                  key={property.id}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <a href={`/portfoy/${property.id}`} className="block">
                    <div className="relative h-72 overflow-hidden">
                      {getDisplayCoverImage(property.id, property.image) ? (
                        <img
                          src={getDisplayCoverImage(
                            property.id,
                            property.image,
                          )}
                          alt={getDisplayTitle(property.id, property.title)}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center bg-zinc-100 px-4 text-center">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="h-10 w-10 text-zinc-400"
                          >
                            <rect x="3" y="4" width="18" height="16" rx="2" />
                            <circle cx="8.5" cy="9" r="1.5" />
                            <path d="m21 15-5-5L5 20" />
                          </svg>

                          <p className="mt-2 text-xs font-medium text-zinc-500">
                            Görsel yakında eklenecek
                          </p>
                        </div>
                      )}

                      <div className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black shadow-sm">
                        {property.category}
                      </div>
                    </div>
                  </a>

                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-sm text-zinc-500">
                      {property.neighborhood} • {property.district} •{" "}
                      {property.city}
                    </p>

                    <h3 className="mt-2 text-xl font-semibold leading-snug">
                      {getDisplayTitle(property.id, property.title)}
                    </h3>

                    <div className="mt-5 flex flex-wrap gap-3 text-sm text-zinc-600">
                      {property.rooms && <span>{property.rooms}</span>}

                      {property.rooms && <span>•</span>}

                      <span>{property.propertyType}</span>

                      <span>•</span>

                      <span>{property.city}</span>
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t border-zinc-200 pt-5">
                      <span className="text-lg font-semibold">
                        {getDisplayPrice(property.id, property.priceText)}
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

      {/* KİŞİSEL PORTFÖY DANIŞMANLIĞI */}
      <section className="bg-[#F3F0EA] px-6 py-6 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-sm">
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
                    <p className="font-semibold text-zinc-950">Bölge analizi</p>
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
                <button
                  onClick={() => setIsContactOpen(true)}
                  className="rounded-xl bg-blue-600 px-7 py-4 font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
                >
                  Danışmanla Görüş
                </button>
              </div>

              <p className="mt-5 text-sm text-zinc-400">
                Talepleriniz doğrultusunda size özel portföy seçenekleri
                hazırlayacağız.
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
                      Bütçe, bölge ve beklentilerinize göre seçenekleri birlikte
                      değerlendirelim.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BİLAL BAŞOL'DAN GÜNCEL */}
      <section className="bg-[#F3F0EA] px-6 py-6 text-zinc-950 md:px-12 lg:px-20">
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
            <article className="flex h-full flex-col group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
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

              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Yeni Portföy
                </p>

                <h3 className="mt-3 text-2xl font-semibold">
                  Eskişehir&apos;den yeni bir yatırım fırsatı
                </h3>

                <p className="mt-4 leading-7 text-zinc-600">
                  Yeni portföyler, saha çalışmaları ve gayrimenkul dünyasından
                  güncel gelişmeler.
                </p>

                <a
                  href="INSTAGRAM_LINKI_BURAYA"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-auto inline-flex items-center gap-2 pt-6 font-semibold transition hover:text-blue-600"
                >
                  Instagram&apos;da Gör
                  <span>→</span>
                </a>
              </div>
            </article>

            {/* YOUTUBE */}
            <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="relative h-80 overflow-hidden">
                {youtubeLoading ? (
                  <div className="flex h-full w-full items-center justify-center bg-zinc-100 text-sm text-zinc-400">
                    YouTube içeriği yükleniyor...
                  </div>
                ) : !youtubePlaying ? (
                  <>
                    <img
                      src={latestYouTubeVideo?.thumbnail ?? "/hero-emlak.jpg"}
                      alt={
                        latestYouTubeVideo?.title ??
                        "Bilal Başol YouTube videosu"
                      }
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    {/* HAFİF KARARTMA */}
                    <div className="absolute inset-0 bg-black/10 transition group-hover:bg-black/20" />

                    {/* YOUTUBE ETİKETİ */}
                    <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-zinc-950 shadow-lg backdrop-blur-sm">
                      <FaYoutube className="text-[19px] text-[#FF0000]" />

                      <span>YouTube</span>
                    </div>

                    {/* PLAY BUTONU */}
                    {latestYouTubeVideo?.videoId && (
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
                    )}
                  </>
                ) : latestYouTubeVideo?.videoId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${latestYouTubeVideo.videoId}?autoplay=1`}
                    title={latestYouTubeVideo.title}
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

              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                  En Güncel YouTube Videosu
                </p>

                <h3 className="mt-3 text-2xl font-semibold">
                  {latestYouTubeVideo?.title ?? "Gayrimenkul içerikleri"}
                </h3>

                <p className="mt-4 line-clamp-3 leading-7 text-zinc-600">
                  {latestYouTubeVideo?.description ||
                    "Gayrimenkul yatırımı, piyasa değerlendirmeleri ve güncel portföyler üzerine içerikler."}
                </p>

                {latestYouTubeVideo?.url && (
                  <a
                    href={latestYouTubeVideo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-auto inline-flex items-center gap-2 pt-6 font-semibold transition hover:text-blue-600"
                  >
                    YouTube&apos;da İzle
                    <span>→</span>
                  </a>
                )}
              </div>
            </article>

            {/* FACEBOOK */}
            <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
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

              <div className="flex flex-1 flex-col p-6">
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
                  href="FACEBOOK_LINKI_BURAYA"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-auto inline-flex items-center gap-2 pt-6 font-semibold transition hover:text-blue-600"
                >
                  Facebook&apos;ta Gör
                  <span>→</span>
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <Footer />
    </main>
  );
}
