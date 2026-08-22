export type Property = {
  id: string;

  sahibindenId: string;

  title: string;

  category: "Satılık" | "Kiralık";

  propertyType:
    | "Daire"
    | "Villa"
    | "Arsa"
    | "Ticari";

  city: string;
  district: string;
  neighborhood: string;

  price?: number;
  priceText: string;

  rooms?: string;

  grossArea?: number;
  netArea?: number;

  // Kartta gösterilecek ana fotoğraf
  image: string;

  // İlan detayındaki tüm fotoğraflar
  images: string[];

  // Sahibinden'den gelen videolar
  videos: string[];

  // İlan açıklaması
  description: string;

  // Sahibinden'den gelen tüm özellikler
  features: Record<string, string | null>;

  // Harita konumu
  latitude?: number;
  longitude?: number;

  featured: boolean;
};

export { properties } from "./properties.generated";