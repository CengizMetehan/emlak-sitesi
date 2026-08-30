import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  icons: {
    icon: "/bilal-favicon.png?v=2",
    shortcut: "/bilal-favicon.png?v=2",
    apple: "/bilal-favicon.png?v=2",
  },

  metadataBase: new URL("https://www.bilalbasol.com"),

  title: {
    default: "Bilal Başol | Eskişehir Gayrimenkul Danışmanı",
    template: "%s | Bilal Başol",
  },

  description:
    "Bilal Başol ile Eskişehir'de satılık, kiralık, ticari ve yatırım amaçlı gayrimenkul portföylerini inceleyin. Profesyonel gayrimenkul danışmanlığı ve portföy hizmetleri.",

  keywords: [
    "Bilal Başol",
    "Bilal Basol",
    "Eskişehir gayrimenkul",
    "Eskişehir emlak danışmanı",
    "Eskişehir gayrimenkul danışmanı",
    "Eskişehir satılık daire",
    "Eskişehir kiralık daire",
    "Eskişehir ticari gayrimenkul",
    "Eskişehir arsa",
    "gayrimenkul yatırımı",
  ],

  authors: [
    {
      name: "Bilal Başol",
      url: "https://www.bilalbasol.com",
    },
  ],

  creator: "Bilal Başol",
  publisher: "Bilal Başol Gayrimenkul Danışmanlığı",

  alternates: {
    canonical: "https://www.bilalbasol.com",
  },

  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://www.bilalbasol.com",
    siteName: "Bilal Başol Gayrimenkul Danışmanlığı",
    title: "Bilal Başol | Eskişehir Gayrimenkul Danışmanı",
    description:
      "Eskişehir'de satılık, kiralık, ticari ve yatırım amaçlı gayrimenkul portföyleri.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Bilal Başol | Eskişehir Gayrimenkul Danışmanı",
    description:
      "Eskişehir'de satılık, kiralık, ticari ve yatırım amaçlı gayrimenkul portföyleri.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://www.bilalbasol.com/#bilal-basol",
      name: "Bilal Başol",
      url: "https://www.bilalbasol.com",
      jobTitle: "Gayrimenkul Danışmanı",
      description:
        "Eskişehir'de konut, ticari gayrimenkul, arsa ve yatırım amaçlı gayrimenkuller konusunda danışmanlık hizmeti sunan gayrimenkul danışmanı.",
      image: "https://www.bilalbasol.com/bilal-basol.png",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Eskişehir",
        addressCountry: "TR",
      },
      knowsAbout: [
        "Gayrimenkul",
        "Emlak Danışmanlığı",
        "Gayrimenkul Yatırımı",
        "Konut",
        "Ticari Gayrimenkul",
        "Arsa",
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://www.bilalbasol.com/#business",
      name: "Bilal Başol Gayrimenkul Danışmanlığı",
      url: "https://www.bilalbasol.com",
      image: "https://www.bilalbasol.com/bilal-basol.png",
      description:
        "Eskişehir'de satılık, kiralık, ticari ve yatırım amaçlı gayrimenkuller için profesyonel danışmanlık hizmetleri.",
      areaServed: {
        "@type": "City",
        name: "Eskişehir",
      },
      founder: {
        "@id": "https://www.bilalbasol.com/#bilal-basol",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://www.bilalbasol.com/#website",
      url: "https://www.bilalbasol.com",
      name: "Bilal Başol Gayrimenkul Danışmanlığı",
      inLanguage: "tr-TR",
      publisher: {
        "@id": "https://www.bilalbasol.com/#business",
      },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />

        {children}
      </body>
    </html>
  );
}
