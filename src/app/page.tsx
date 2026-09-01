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

  const [selectedCategory, setSelectedCategory] = useState("Hepsi");
  const [selectedLocation, setSelectedLocation] = useState("Eskişehir");
  const [isSocialMenuOpen, setIsSocialMenuOpen] = useState(false);
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

  const scrollToPortfolioTop = () => {
    window.setTimeout(() => {
      const element = document.getElementById("portfoy-listesi");

      if (!element) return;

      const targetPosition =
        element.getBoundingClientRect().top + window.scrollY - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }, 50);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setSlideDirection("right");
      setCurrentPage((prev) => prev + 1);
      scrollToPortfolioTop();
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setSlideDirection("left");
      setCurrentPage((prev) => prev - 1);
      scrollToPortfolioTop();
    }
  };

  const goToPage = (page: number) => {
    setSlideDirection(page > currentPage ? "right" : "left");
    setCurrentPage(page);
    scrollToPortfolioTop();
  };

  // SAYFALAMA
  const [currentPage, setCurrentPage] = useState(1);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "right",
  );
  const itemsPerPage = 10;

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

  // ARAMA YAPILMADIYSA TÜM PORTFÖYLERİ GÖSTER
  const displayedProperties = hasSearched ? searchResults : properties;

  // SIRALAMA
  const sortedSearchResults = [...displayedProperties].sort((a, b) => {
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

  // SAYFALAMA
  const totalPages = Math.ceil(sortedSearchResults.length / itemsPerPage);

  const currentResults = sortedSearchResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
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

            <div className="mt-1.5 text-[10px] font-medium font-semibold uppercase tracking-[0.38em] text-blue-600">
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
      {/* SAĞ ALT SOSYAL MEDYA MENÜSÜ */}
      {isSocialMenuOpen && (
        <button
          type="button"
          aria-label="Sosyal medya menüsünü kapat"
          onClick={() => setIsSocialMenuOpen(false)}
          className="fixed inset-0 z-[55] cursor-default bg-transparent"
        />
      )}

      <div className="fixed bottom-3 right-3 z-[60] flex flex-col items-center">
        {/* AÇILAN SOSYAL MEDYA ŞERİDİ */}
        <div
          className={`mb-2 overflow-hidden rounded-[22px] border border-zinc-200 bg-white/95 shadow-xl backdrop-blur-md transition-all duration-300 ${
            isSocialMenuOpen
              ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
              : "pointer-events-none translate-y-3 scale-95 opacity-0"
          }`}
        >
          <div className="flex flex-col items-center divide-y divide-zinc-100">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsSocialMenuOpen(false)}
                aria-label={social.name}
                title={social.name}
                className="group flex h-12 w-12 items-center justify-center text-zinc-500 transition hover:bg-zinc-50 hover:text-blue-600"
              >
                <div className="flex h-8 w-8 items-center justify-center transition duration-200 group-hover:scale-110">
                  {social.icon}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ANA İMZA BUTONU */}
        <button
          type="button"
          onClick={() => setIsSocialMenuOpen((prev) => !prev)}
          aria-label={
            isSocialMenuOpen
              ? "Sosyal medya menüsünü kapat"
              : "Sosyal medya bağlantılarını aç"
          }
          className="flex h-[58px] w-[58px] items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.16)] transition duration-300 hover:scale-105 hover:shadow-[0_10px_28px_rgba(0,0,0,0.20)]"
        >
          <img
            src="/bilal-basol-imza.png"
            alt="Bilal Başol"
            className="h-[48px] w-[48px] object-contain"
          />
        </button>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#F3F0EA]">
        {/* HERO ANA ALAN */}
        <div className="relative min-h-[500px] overflow-hidden lg:min-h-[560px]">
          {/* ARKA PLAN GÖRSELİ */}
          <div
            className="
    absolute inset-0
    bg-cover
    bg-[78%_center]
    sm:bg-[74%_center]
    md:bg-[70%_center]
    lg:bg-center
  "
            style={{
              backgroundImage: "url('/arkaplan.png')",
            }}
          />

          {/* GENEL YUMUŞATMA */}
          <div className="absolute inset-0 bg-white/10" />

          {/* SOL TARAFI BEYAZA YUMUŞAT */}
          <div
            className="
        absolute inset-0
        bg-gradient-to-r
        from-white
        via-white/95
        to-white/30
        lg:via-white/50
        lg:to-transparent
      "
          />

          {/* ALT GEÇİŞ */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#F3F0EA] via-[#F3F0EA]/45 to-transparent" />

          {/* İÇERİK */}
          <div className="relative z-10 mx-auto flex min-h-[500px] max-w-[1500px] items-center px-6 py-12 md:px-12 lg:min-h-[560px] lg:px-20">
            {/* SOL METİN */}
            <div className="relative z-20 w-full max-w-[720px] pb-6 md:pb-20 lg:w-[58%] lg:pb-0">
              {/* ÜST ETİKET */}
              <div className="mb-5 flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />

                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-zinc-600 md:text-xs">
                  Eskişehir Gayrimenkul Danışmanlığı
                </p>
              </div>

              {/* BAŞLIK */}
              <h1
                className="
            max-w-[700px]
text-[39px]
sm:text-5xl
md:text-6xl
lg:text-[68px]
            font-semibold
            leading-[1.02]
            tracking-[-0.035em]
            text-zinc-950
            sm:text-5xl
            md:text-6xl
            lg:text-[68px]
          "
              >
                Doğru Gayrimenkul.
                <br />
                <span className="text-zinc-800">Doğru Yatırım.</span>
              </h1>

              {/* AÇIKLAMA */}
              <p className="mt-6 max-w-[590px] text-sm leading-7 text-zinc-600 sm:text-base md:text-lg">
                Konut, ticari gayrimenkul, arsa ve yatırım fırsatlarını
                profesyonel danışmanlıkla keşfedin.
              </p>

              {/* HERO ARAMA - MOBİLDE GİZLİ */}
              <div className="mt-8 hidden w-full max-w-[950px] md:block">
                <div className="grid overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_16px_45px_rgba(0,0,0,0.12)] md:grid-cols-[1fr_1fr_1fr_1fr_auto]">
                  {/* KONUM */}
                  <div className="flex min-h-[78px] flex-col justify-center border-b border-zinc-200 px-5 md:border-b-0 md:border-r">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                      Konum
                    </span>

                    <div className="mt-1.5 flex items-center gap-2">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-4 w-4 shrink-0 text-blue-600"
                      >
                        <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
                        <circle cx="12" cy="10" r="2" />
                      </svg>

                      <select
                        className="w-full cursor-pointer bg-transparent text-sm font-medium text-zinc-950 outline-none"
                        defaultValue="Eskişehir"
                      >
                        <option>Eskişehir</option>
                      </select>
                    </div>
                  </div>

                  {/* GAYRİMENKUL TİPİ */}
                  <div className="flex min-h-[78px] flex-col justify-center border-b border-zinc-200 px-5 md:border-b-0 md:border-r">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                      Gayrimenkul Tipi
                    </span>

                    <div className="mt-1.5 flex items-center gap-2">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-4 w-4 shrink-0 text-blue-600"
                      >
                        <path d="M4 20V8l8-5 8 5v12" />
                        <path d="M9 20v-6h6v6" />
                      </svg>

                      <select
                        className="w-full cursor-pointer bg-transparent text-sm font-medium text-zinc-950 outline-none"
                        defaultValue="Tümü"
                      >
                        <option>Tümü</option>
                        <option>Daire</option>
                        <option>Villa</option>
                        <option>Arsa</option>
                        <option>Ticari</option>
                      </select>
                    </div>
                  </div>

                  {/* MİNİMUM FİYAT */}
                  <div className="flex min-h-[78px] flex-col justify-center border-b border-zinc-200 px-5 md:border-b-0 md:border-r">
                    <label
                      htmlFor="hero-min-price"
                      className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500"
                    >
                      Minimum Fiyat
                    </label>

                    <input
                      id="hero-min-price"
                      type="text"
                      inputMode="numeric"
                      placeholder="Örn. 2.500.000 TL"
                      className="mt-1.5 w-full bg-transparent text-sm font-medium text-zinc-950 outline-none placeholder:font-normal placeholder:text-zinc-400"
                    />
                  </div>

                  {/* MAKSİMUM FİYAT */}
                  <div className="flex min-h-[78px] flex-col justify-center border-b border-zinc-200 px-5 md:border-b-0 md:border-r">
                    <label
                      htmlFor="hero-max-price"
                      className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500"
                    >
                      Maksimum Fiyat
                    </label>

                    <input
                      id="hero-max-price"
                      type="text"
                      inputMode="numeric"
                      placeholder="Örn. 10.000.000 TL"
                      className="mt-1.5 w-full bg-transparent text-sm font-medium text-zinc-950 outline-none placeholder:font-normal placeholder:text-zinc-400"
                    />
                  </div>

                  {/* PORTFÖY ARA */}
                  <div className="flex items-center justify-center p-2.5">
                    <button
                      type="button"
                      onClick={handleHeroSearch}
                      className="flex h-[58px] w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold whitespace-nowrap text-white shadow-sm transition duration-200 hover:bg-blue-700 hover:shadow-md md:w-auto"
                    >
                      Portföy Ara
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-4 w-4"
                      >
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-4-4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* SAĞ BİLAL BAŞOL GÖRSELİ */}
            <div
              className="
    pointer-events-none
    absolute
    bottom-0
    right-[155px]
    z-10
    hidden
    h-full
    w-[65%]
    items-end
    justify-center
    lg:flex
  "
            >
              {/* PORTRE ARKASI HAFİF IŞIK */}

              <div className="absolute bottom-0 right-[100%] h-[78%] w-[72%] rounded-full bg-white/30 blur-3xl" />

              <img
                src="/bilal-basol.png"
                alt="Bilal Başol Gayrimenkul Danışmanı"
                className="
      absolute
      bottom-[-20px]
      right-[-50px]
      h-[550px]
      w-auto
      max-w-none
      object-contain
      object-bottom
      drop-shadow-[0_22px_28px_rgba(0,0,0,0.18)]
    "
              />
            </div>

            {/* TABLET PORTRE */}
            <div className="pointer-events-none absolute bottom-0 right-[-55px] z-10 hidden md:block lg:hidden">
              <img
                src="/bilal-basol.png"
                alt=""
                className="max-h-[380px] w-auto object-contain object-bottom opacity-90"
              />
            </div>
          </div>
        </div>

        {/* GÜVEN PANELİ */}
        <div className="relative z-20 -mt-32 bg-transparent px-4 pb-6 md:-mt-5 md:bg-[#F3F0EA] md:px-12 lg:px-20">
          <div
            className="
        mx-auto
        grid
        max-w-[1500px]
        overflow-hidden
        rounded-[26px]
        border
        border-zinc-200
        bg-white
        shadow-[0_12px_35px_rgba(15,23,42,0.07)]
        sm:grid-cols-2
        xl:grid-cols-4
      "
          >
            {/* GÜVENİLİR DANIŞMANLIK */}
            <div className="flex items-center gap-4 border-b border-zinc-200 p-5 sm:border-r xl:border-b-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center text-blue-600">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-9 w-9"
                >
                  <path d="M12 3 4.5 6v5.5c0 4.8 3.2 7.8 7.5 9.5 4.3-1.7 7.5-4.7 7.5-9.5V6L12 3Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>

              <div>
                <p className="text-sm font-semibold text-zinc-950">
                  Güvenilir Danışmanlık
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  Şeffaf, dürüst ve profesyonel danışmanlık anlayışı.
                </p>
              </div>
            </div>

            {/* DOĞRU FİYAT ANALİZİ */}
            <div className="flex items-center gap-4 border-b border-zinc-200 p-5 xl:border-b-0 xl:border-r">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center text-blue-600">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-9 w-9"
                >
                  <path d="M4 20V10" />
                  <path d="M9 20V14" />
                  <path d="M14 20V8" />
                  <path d="M19 20V4" />
                  <path d="m4 8 5-4 4 3 6-5" />
                </svg>
              </div>

              <div>
                <p className="text-sm font-semibold text-zinc-950">
                  Doğru Fiyat Analizi
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  Piyasa analizleriyle en doğru fiyat değerlendirmesi.
                </p>
              </div>
            </div>

            {/* ZAMANINDA SONUÇ */}
            <div className="flex items-center gap-4 border-b border-zinc-200 p-5 sm:border-r sm:border-b-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center text-blue-600">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-9 w-9"
                >
                  <path d="m8 12 3 3 5-6" />
                  <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0Z" />
                </svg>
              </div>

              <div>
                <p className="text-sm font-semibold text-zinc-950">
                  Zamanında Sonuç
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  Hızlı, etkili ve sonuç odaklı çözümler.
                </p>
              </div>
            </div>

            {/* ESKİŞEHİR UZMANI */}
            <div className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center text-blue-600">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-9 w-9"
                >
                  <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
                  <circle cx="12" cy="10" r="2" />
                </svg>
              </div>

              <div>
                <p className="text-sm font-semibold text-zinc-950">
                  Eskişehir Uzmanlığı
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  Bölgeye hakim, geniş portföy ve güçlü network.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ÖNE ÇIKAN PROJELER */}
      <section className="bg-[#F3F0EA] px-6 py-8 md:px-12 lg:px-20">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-blue-600">
                Öne Çıkan Projeler
              </p>

              <h2 className="mt-2 max-w-3xl text-2xl font-semibold tracking-tight text-zinc-950 md:text-4xl">
                Öne Çıkan Projeler
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 md:text-base">
                Bilal Başol danışmanlığında seçilmiş proje fırsatlarını
                inceleyin, güncel satış seçenekleri ve ödeme koşulları hakkında
                doğrudan bilgi alın.
              </p>
            </div>

            <a
              href="tel:+905XXXXXXXXX"
              className="inline-flex w-fit items-center justify-center rounded-full border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:border-blue-600 hover:text-blue-600"
            >
              Projeler hakkında bilgi al
            </a>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {/* WM PRIME */}
            <article className="group relative min-h-[430px] overflow-hidden rounded-[30px] bg-zinc-950 shadow-sm">
              <img
                src="/wm-prime.jpg"
                alt="WM Prime Eskişehir"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/10" />

              <div className="absolute left-5 top-5 z-10 flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-600 px-3 py-1.5 text-[11px] font-semibold text-white">
                  ESKİŞEHİR
                </span>

                <span className="rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-zinc-950 backdrop-blur">
                  YENİ PROJE
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-300">
                  Odunpazarı · 71 Evler
                </p>

                <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                  WM Prime
                </h3>

                <p className="mt-3 max-w-xl text-sm leading-6 text-white/75">
                  1+1 rezidans ve ofis seçenekleriyle Eskişehir’de topraktan
                  yatırım fırsatını değerlendirin.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white backdrop-blur">
                    1+1 Rezidans
                  </span>

                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white backdrop-blur">
                    Ofis
                  </span>

                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white backdrop-blur">
                    Topraktan Yatırım
                  </span>
                </div>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="/projeler/wm-prime"
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Projeyi İncele
                  </a>

                  <a
                    href="https://wa.me/905XXXXXXXXX?text=WM%20Prime%20projesi%20hakkinda%20bilgi%20almak%20istiyorum."
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white hover:text-zinc-950"
                  >
                    Bilgi Al
                  </a>
                </div>
              </div>
            </article>

            {/* ANKAPORT */}
            <article className="group relative min-h-[430px] overflow-hidden rounded-[30px] bg-zinc-950 shadow-sm">
              <img
                src="/ankaport.jpg"
                alt="AnkaPort Saray"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/10" />

              <div className="absolute left-5 top-5 z-10 flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-600 px-3 py-1.5 text-[11px] font-semibold text-white">
                  ANKARA
                </span>

                <span className="rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-zinc-950 backdrop-blur">
                  KARMA YAŞAM PROJESİ
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-300">
                  Pursaklar · Saray
                </p>

                <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                  AnkaPort Saray
                </h3>

                <p className="mt-3 max-w-xl text-sm leading-6 text-white/75">
                  Konut, ticari alan, AVM ve otel konseptini tek projede
                  buluşturan yeni nesil yatırım ve yaşam merkezi.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white backdrop-blur">
                    Konut
                  </span>

                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white backdrop-blur">
                    AVM
                  </span>

                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white backdrop-blur">
                    Ticari Alan
                  </span>

                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white backdrop-blur">
                    Otel
                  </span>
                </div>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="/projeler/ankaport"
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Projeyi İncele
                  </a>

                  <a
                    href="https://wa.me/905XXXXXXXXX?text=AnkaPort%20Saray%20projesi%20hakkinda%20bilgi%20almak%20istiyorum."
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white hover:text-zinc-950"
                  >
                    Bilgi Al
                  </a>
                </div>
              </div>
            </article>
          </div>

          <div className="mt-5 grid gap-3 rounded-[22px] border border-zinc-200 bg-white p-4 md:grid-cols-3 md:p-5">
            <div className="px-3 py-2">
              <p className="text-sm font-semibold text-zinc-950">
                Güncel satış bilgisi
              </p>
              <p className="mt-1 text-xs leading-5 text-zinc-500">
                Projelere ait güncel daire ve yatırım seçeneklerini birlikte
                değerlendirin.
              </p>
            </div>

            <div className="border-zinc-200 px-3 py-2 md:border-l">
              <p className="text-sm font-semibold text-zinc-950">
                Kişisel yatırım analizi
              </p>
              <p className="mt-1 text-xs leading-5 text-zinc-500">
                Bütçenize ve yatırım hedefinize uygun seçenekleri karşılaştırın.
              </p>
            </div>

            <div className="border-zinc-200 px-3 py-2 md:border-l">
              <p className="text-sm font-semibold text-zinc-950">
                Bilal Başol ile doğrudan iletişim
              </p>
              <p className="mt-1 text-xs leading-5 text-zinc-500">
                Proje detayları, ödeme planı ve uygun seçenekler için hızlıca
                bilgi alın.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PORTFÖYLER + DETAYLI ARAMA */}
      <section
        id="portfoyler"
        className="bg-[#F3F0EA] px-6 py-6 text-zinc-950 md:px-12 lg:px-20"
      >
        <div className="mx-auto max-w-[1500px] rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
          {/* KOMPAKT BAŞLIK */}
          <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-blue-600">
                Detaylı Portföy Arama
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                Size uygun gayrimenkulü bulun.
              </h2>
            </div>
          </div>

          {/* KOMPAKT ARAMA PANELİ */}
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            {/* FİLTRELER */}
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto]">
              {/* İLAN TÜRÜ */}
              <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  İlan Türü
                </label>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="mt-1 w-full bg-transparent text-sm font-medium text-zinc-950 outline-none"
                >
                  <option value="Hepsi">Hepsi</option>
                  <option value="Satılık">Satılık</option>
                  <option value="Kiralık">Kiralık</option>
                </select>
              </div>
              {/* KONUM */}
              <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  Konum
                </label>

                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="mt-1 w-full bg-transparent text-sm font-medium text-zinc-950 outline-none"
                >
                  <option>Eskişehir</option>
                  <option>Tepebaşı</option>
                  <option>Odunpazarı</option>
                </select>
              </div>

              {/* GAYRİMENKUL TİPİ */}
              <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  Gayrimenkul Tipi
                </label>

                <select
                  value={selectedPropertyType}
                  onChange={(e) => setSelectedPropertyType(e.target.value)}
                  className="mt-1 w-full bg-transparent text-sm font-medium text-zinc-950 outline-none"
                >
                  <option>Tümü</option>
                  <option>Daire</option>
                  <option>Villa</option>
                  <option>Ticari</option>
                  <option>Arsa</option>
                </select>
              </div>

              {/* MİNİMUM FİYAT */}
              <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  Minimum Fiyat
                </label>

                <div className="mt-1 flex items-center">
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
                    placeholder="2.500.000"
                    className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-zinc-400"
                  />

                  <span className="ml-2 text-xs text-zinc-400">TL</span>
                </div>
              </div>

              {/* MAKSİMUM FİYAT */}
              <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  Maksimum Fiyat
                </label>

                <div className="mt-1 flex items-center">
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
                    placeholder="10.000.000"
                    className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-zinc-400"
                  />

                  <span className="ml-2 text-xs text-zinc-400">TL</span>
                </div>
              </div>

              {/* ARA */}
              <button
                type="button"
                onClick={handleSearch}
                className="rounded-xl bg-blue-600 px-7 py-4 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Portföy Ara
              </button>
            </div>
          </div>

          {/* TÜM PORTFÖYLER */}
          <div id="arama-sonuclari" className="mt-10 scroll-mt-24">
            <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div id="portfoy-listesi">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-blue-600">
                  Portföyler
                </p>

                <h3 className="mt-1 text-2xl font-semibold">
                  {hasSearched
                    ? `${displayedProperties.length} portföy bulundu`
                    : `Tüm portföyler (${properties.length})`}
                </h3>
              </div>

              {displayedProperties.length > 1 && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-zinc-500">Sırala</span>

                  <select
                    value={sortOption}
                    onChange={(e) => {
                      setSortOption(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium outline-none"
                  >
                    <option value="default">Önerilen</option>
                    <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
                    <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
                  </select>
                </div>
              )}
            </div>

            {propertiesLoading ? (
              <div className="py-16 text-center text-zinc-500">
                Portföyler yükleniyor...
              </div>
            ) : currentResults.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-10 text-center">
                Aramanıza uygun portföy bulunamadı.
              </div>
            ) : (
              <>
                {/* 10 PORTFÖY */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-3 xl:grid-cols-5">
                  {currentResults.map((property) => {
                    const coverImage = getDisplayCoverImage(
                      property.id,
                      property.image,
                    );

                    return (
                      <article
                        key={property.id}
                        className="group grid min-w-0 grid-cols-[115px_1fr] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:shadow-lg sm:flex sm:flex-col sm:rounded-2xl"
                      >
                        <a href={`/portfoy/${property.id}`}>
                          <div className="relative h-full min-h-[125px] overflow-hidden sm:h-36 sm:min-h-0 lg:h-44">
                            {coverImage ? (
                              <img
                                src={coverImage}
                                alt={getDisplayTitle(
                                  property.id,
                                  property.title,
                                )}
                                loading="lazy"
                                decoding="async"
                                fetchPriority="low"
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                onError={(e) => {
                                  const image = e.currentTarget;

                                  image.style.display = "none";

                                  const fallback =
                                    image.nextElementSibling as HTMLElement | null;

                                  if (fallback) {
                                    fallback.style.display = "flex";
                                  }
                                }}
                              />
                            ) : null}

                            <div
                              className="hidden h-full items-center justify-center bg-zinc-100 px-4 text-center text-xs text-zinc-400"
                              style={{
                                display: coverImage ? "none" : "flex",
                              }}
                            >
                              Görsel yakında
                            </div>

                            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-semibold shadow-sm">
                              {property.category}
                            </span>
                          </div>
                        </a>

                        <div className="flex flex-1 flex-col p-2 sm:p-3 lg:p-4">
                          <a href={`/portfoy/${property.id}`} className="block">
                            <p className="truncate text-[11px] font-medium text-blue-600">
                              {property.neighborhood} • {property.district}
                            </p>

                            <h3 className="mt-2 line-clamp-2 text-xs font-semibold leading-4 transition hover:text-blue-600 lg:text-sm lg:leading-5">
                              {getDisplayTitle(property.id, property.title)}
                            </h3>

                            <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-zinc-500">
                              {property.rooms && <span>{property.rooms}</span>}
                              {property.rooms && <span>•</span>}

                              {property.grossArea && (
                                <span>{property.grossArea} m²</span>
                              )}

                              {property.grossArea && <span>•</span>}

                              <span>{property.propertyType}</span>
                            </div>
                          </a>

                          <div className="mt-auto border-t border-zinc-100 pt-4">
                            <a
                              href={`/portfoy/${property.id}`}
                              className="block text-sm font-bold transition hover:text-blue-600 lg:text-base"
                            >
                              {getDisplayPrice(property.id, property.priceText)}
                            </a>

                            <a
                              href={`/portfoy/${property.id}`}
                              className="mt-2 block rounded-md bg-zinc-700 px-1 py-2 text-center text-[9px] font-semibold text-white transition hover:bg-blue-600 sm:mt-3 sm:rounded-lg sm:px-3 sm:py-2.5 sm:text-xs"
                            >
                              Portföyü İncele
                            </a>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {/* SAYFALAMA */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className="rounded-full border border-zinc-200 px-4 py-2 text-sm disabled:opacity-30"
                    >
                      ←
                    </button>

                    <span className="text-sm font-medium text-zinc-600">
                      {currentPage} / {totalPages}
                    </span>

                    <button
                      type="button"
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className="rounded-full border border-zinc-200 px-4 py-2 text-sm disabled:opacity-30"
                    >
                      →
                    </button>
                  </div>
                )}
              </>
            )}
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
                <p className="text-[7px] font-medium uppercase leading-3 tracking-[0.08em] text-zinc-400 sm:text-[9px] lg:text-xs">
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
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-3 lg:gap-7">
            {/* INSTAGRAM */}
            <article className="group grid h-[120px] grid-cols-[115px_1fr] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:shadow-md lg:flex lg:h-full lg:flex-col lg:rounded-3xl lg:hover:-translate-y-1 lg:hover:shadow-xl">
              <div className="relative h-full overflow-hidden lg:h-80">
                <img
                  src="/hero-emlak.jpg"
                  alt="Bilal Başol Instagram paylaşımı"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[8px] font-semibold text-zinc-950 shadow-lg backdrop-blur-sm lg:left-5 lg:top-5 lg:gap-2 lg:px-4 lg:py-2 lg:text-xs">
                  <FaInstagram className="text-[14px] text-[#E4405F] lg:text-[18px]" />
                  <span>Instagram</span>
                </div>
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-center p-3 lg:p-6">
                <p className="text-[8px] font-medium uppercase leading-3 tracking-[0.08em] text-zinc-400 lg:text-xs">
                  Yeni Portföy
                </p>

                <h3 className="mt-1 line-clamp-2 text-[11px] font-semibold leading-4 lg:mt-3 lg:text-2xl lg:leading-7">
                  Eskişehir&apos;den yeni bir yatırım fırsatı
                </h3>

                <p className="mt-1 line-clamp-2 text-[8px] leading-3 text-zinc-600 lg:mt-4 lg:line-clamp-3 lg:text-base lg:leading-7">
                  Yeni portföyler, saha çalışmaları ve gayrimenkul dünyasından
                  güncel gelişmeler.
                </p>

                <a
                  href="INSTAGRAM_LINKI_BURAYA"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-[8px] font-semibold leading-3 transition hover:text-blue-600 lg:mt-auto lg:gap-2 lg:pt-6 lg:text-base"
                >
                  Instagram&apos;da Gör
                  <span>→</span>
                </a>
              </div>
            </article>

            {/* YOUTUBE */}
            <article className="group grid h-[120px] grid-cols-[115px_1fr] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:shadow-md lg:flex lg:h-full lg:flex-col lg:rounded-3xl lg:hover:-translate-y-1 lg:hover:shadow-xl">
              <div className="relative h-full overflow-hidden lg:h-80">
                {youtubeLoading ? (
                  <div className="flex h-full w-full items-center justify-center bg-zinc-100 px-2 text-center text-[8px] text-zinc-400 lg:text-sm">
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

                    <div className="absolute inset-0 bg-black/10 transition group-hover:bg-black/20" />

                    <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[8px] font-semibold text-zinc-950 shadow-lg backdrop-blur-sm lg:left-5 lg:top-5 lg:gap-2 lg:px-4 lg:py-2 lg:text-xs">
                      <FaYoutube className="text-[15px] text-[#FF0000] lg:text-[19px]" />
                      <span>YouTube</span>
                    </div>

                    {latestYouTubeVideo?.videoId && (
                      <button
                        type="button"
                        onClick={() => setYoutubePlaying(true)}
                        className="absolute inset-0 flex items-center justify-center"
                        aria-label="Videoyu oynat"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[10px] text-black shadow-xl transition duration-300 hover:scale-110 lg:h-20 lg:w-20 lg:text-2xl">
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

              <div className="flex min-w-0 flex-1 flex-col justify-center p-3 lg:p-6">
                <p className="text-[8px] font-medium uppercase leading-3 tracking-[0.08em] text-zinc-400 lg:text-xs">
                  En Güncel YouTube Videosu
                </p>

                <h3 className="mt-1 line-clamp-2 text-[11px] font-semibold leading-4 lg:mt-3 lg:text-2xl lg:leading-7">
                  {latestYouTubeVideo?.title ?? "Gayrimenkul içerikleri"}
                </h3>

                <p className="mt-1 line-clamp-2 text-[8px] leading-3 text-zinc-600 lg:mt-4 lg:line-clamp-3 lg:text-base lg:leading-7">
                  {latestYouTubeVideo?.description ||
                    "Gayrimenkul yatırımı, piyasa değerlendirmeleri ve güncel portföyler üzerine içerikler."}
                </p>

                {latestYouTubeVideo?.url && (
                  <a
                    href={latestYouTubeVideo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-[8px] font-semibold leading-3 transition hover:text-blue-600 lg:mt-auto lg:gap-2 lg:pt-6 lg:text-base"
                  >
                    YouTube&apos;da İzle
                    <span>→</span>
                  </a>
                )}
              </div>
            </article>

            {/* FACEBOOK */}
            <article className="group grid h-[120px] grid-cols-[115px_1fr] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:shadow-md lg:flex lg:h-full lg:flex-col lg:rounded-3xl lg:hover:-translate-y-1 lg:hover:shadow-xl">
              <div className="relative h-full overflow-hidden lg:h-80">
                <img
                  src="/hero-emlak.jpg"
                  alt="Bilal Başol Facebook paylaşımı"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[8px] font-semibold text-zinc-950 shadow-lg backdrop-blur-sm lg:left-5 lg:top-5 lg:gap-2 lg:px-4 lg:py-2 lg:text-xs">
                  <div className="flex h-[15px] w-[15px] items-center justify-center rounded-full bg-[#1877F2] lg:h-[18px] lg:w-[18px]">
                    <FaFacebookF className="text-[9px] text-white lg:text-[11px]" />
                  </div>

                  <span>Facebook</span>
                </div>
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-center p-3 lg:p-6">
                <p className="text-[8px] font-medium uppercase leading-3 tracking-[0.08em] text-zinc-400 lg:text-xs">
                  Sahadan Güncel
                </p>

                <h3 className="mt-1 line-clamp-2 text-[11px] font-semibold leading-4 lg:mt-3 lg:text-2xl lg:leading-7">
                  Eskişehir gayrimenkul piyasasından gelişmeler
                </h3>

                <p className="mt-1 line-clamp-2 text-[8px] leading-3 text-zinc-600 lg:mt-4 lg:line-clamp-3 lg:text-base lg:leading-7">
                  Yeni satışlar, portföy çalışmaları ve bölgedeki önemli
                  gayrimenkul gelişmeleri.
                </p>

                <a
                  href="FACEBOOK_LINKI_BURAYA"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-[8px] font-semibold leading-3 transition hover:text-blue-600 lg:mt-auto lg:gap-2 lg:pt-6 lg:text-base"
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
