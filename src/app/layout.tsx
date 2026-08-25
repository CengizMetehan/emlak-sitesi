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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
