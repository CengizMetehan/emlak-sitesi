export type Property = {
  id: string;
  title: string;
  category: "Satılık" | "Kiralık";
  propertyType: "Daire" | "Villa" | "Arsa" | "Ticari";
  city: string;
  district: string;
  neighborhood: string;

  price?: number;
  priceText: string;

  rooms?: string;
  grossArea?: number;
  netArea?: number;

  image: string;
  featured: boolean;
  sahibindenId?: string;
};

export const properties: Property[] = [
  {
    id: "moorlife-4-1",
    title: "Moorlife Sitesi'nde 4+1 Satılık Daire",
    category: "Satılık",
    propertyType: "Daire",

    city: "Eskişehir",
    district: "Tepebaşı",
    neighborhood: "Batıkent",

    price: 6500000,
    priceText: "6.500.000 TL",

    rooms: "4+1",
    grossArea: 190,
    netArea: 165,

    image: "/hero-emlak.jpg",

    featured: true,
    sahibindenId: "1330152005",
  },

  {
    id: "test-portfoy-2",
    title: "Batıkent'te Geniş 3+1 Satılık Daire",
    category: "Satılık",
    propertyType: "Daire",

    city: "Eskişehir",
    district: "Tepebaşı",
    neighborhood: "Batıkent",

    price: 4200000,
    priceText: "4.200.000 TL",

    rooms: "3+1",
    grossArea: 150,
    netArea: 135,

    image: "/hero-emlak.jpg",

    featured: false,
  },

  {
    id: "test-portfoy-3",
    title: "Hoşnudiye'de Merkezi Konumda 2+1 Daire",
    category: "Satılık",
    propertyType: "Daire",

    city: "Eskişehir",
    district: "Tepebaşı",
    neighborhood: "Hoşnudiye",

    price: 3750000,
    priceText: "3.750.000 TL",

    rooms: "2+1",
    grossArea: 120,
    netArea: 105,

    image: "/hero-emlak.jpg",

    featured: false,
  },

  {
    id: "test-portfoy-4",
    title: "Çamlıca'da Ferah 3+1 Satılık Daire",
    category: "Satılık",
    propertyType: "Daire",

    city: "Eskişehir",
    district: "Tepebaşı",
    neighborhood: "Çamlıca",

    price: 4850000,
    priceText: "4.850.000 TL",

    rooms: "3+1",
    grossArea: 160,
    netArea: 140,

    image: "/hero-emlak.jpg",

    featured: false,
  },

  {
    id: "test-portfoy-5",
    title: "Sazova Yakınında Modern 4+1 Daire",
    category: "Satılık",
    propertyType: "Daire",

    city: "Eskişehir",
    district: "Tepebaşı",
    neighborhood: "Sazova",

    price: 7200000,
    priceText: "7.200.000 TL",

    rooms: "4+1",
    grossArea: 205,
    netArea: 180,

    image: "/hero-emlak.jpg",

    featured: false,
  },

  {
    id: "test-portfoy-6",
    title: "Vişnelik'te Yatırımlık 2+1 Satılık Daire",
    category: "Satılık",
    propertyType: "Daire",

    city: "Eskişehir",
    district: "Odunpazarı",
    neighborhood: "Vişnelik",

    price: 3950000,
    priceText: "3.950.000 TL",

    rooms: "2+1",
    grossArea: 115,
    netArea: 100,

    image: "/hero-emlak.jpg",

    featured: false,
  },

  {
    id: "test-portfoy-7",
    title: "Büyükdere'de 3+1 Satılık Daire",
    category: "Satılık",
    propertyType: "Daire",

    city: "Eskişehir",
    district: "Odunpazarı",
    neighborhood: "Büyükdere",

    price: 4500000,
    priceText: "4.500.000 TL",

    rooms: "3+1",
    grossArea: 145,
    netArea: 128,

    image: "/hero-emlak.jpg",

    featured: false,
  },
];