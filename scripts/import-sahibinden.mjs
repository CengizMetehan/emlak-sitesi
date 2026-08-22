import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, "..");

const importDir = path.join(
  projectRoot,
  "sahibinden-import",
  "latest"
);

const publicMediaDir = path.join(
  projectRoot,
  "public",
  "sahibinden"
);

const outputFile = path.join(
  projectRoot,
  "src",
  "data",
  "properties.generated.ts"
);

// ------------------------------------------------------
// JSON DOSYASINI BUL
// ------------------------------------------------------

function findJsonFile(directory) {
  const files = fs.readdirSync(directory);

  const jsonFile = files.find((file) =>
    file.toLowerCase().endsWith(".json")
  );

  if (!jsonFile) {
    throw new Error(
      "sahibinden-import/latest içerisinde JSON dosyası bulunamadı."
    );
  }

  return path.join(directory, jsonFile);
}

// ------------------------------------------------------
// MEDYA KLASÖRÜNÜ BUL
// ------------------------------------------------------

function findMediaDirectory(directory) {
  const entries = fs.readdirSync(directory, {
    withFileTypes: true,
  });

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const fullPath = path.join(
      directory,
      entry.name
    );

    if (
      entry.name
        .toLowerCase()
        .includes("medya")
    ) {
      return fullPath;
    }

    const nestedEntries = fs.readdirSync(
      fullPath,
      {
        withFileTypes: true,
      }
    );

    const nestedMedia =
      nestedEntries.find(
        (nestedEntry) =>
          nestedEntry.isDirectory() &&
          nestedEntry.name
            .toLowerCase()
            .includes("medya")
      );

    if (nestedMedia) {
      return path.join(
        fullPath,
        nestedMedia.name
      );
    }
  }

  throw new Error(
    "MedyaBilgileri klasörü bulunamadı."
  );
}

// ------------------------------------------------------
// TÜM MEDYA DOSYALARINI İNDEKSLE
// ------------------------------------------------------

function walkDirectory(
  directory,
  result = new Map()
) {
  const entries = fs.readdirSync(
    directory,
    {
      withFileTypes: true,
    }
  );

  for (const entry of entries) {
    const fullPath = path.join(
      directory,
      entry.name
    );

    if (entry.isDirectory()) {
      walkDirectory(
        fullPath,
        result
      );

      continue;
    }

    const key = entry.name
      .trim()
      .toLowerCase();

    if (result.has(key)) {
      console.warn("");
      console.warn(
        "⚠ AYNI DOSYA ADI BİRDEN FAZLA YERDE BULUNDU:"
      );
      console.warn(
        "Dosya:",
        entry.name
      );
      console.warn(
        "İlk konum:",
        result.get(key)
      );
      console.warn(
        "İkinci konum:",
        fullPath
      );
      console.warn("");
    } else {
      result.set(
        key,
        fullPath
      );
    }
  }

  return result;
}

// ------------------------------------------------------
// FİYAT
// ------------------------------------------------------

function parsePrice(priceText) {
  if (!priceText) {
    return undefined;
  }

  const numeric = priceText.replace(
    /[^\d]/g,
    ""
  );

  if (!numeric) {
    return undefined;
  }

  return Number(numeric);
}

// ------------------------------------------------------
// SAYISAL DEĞER
// ------------------------------------------------------

function parseNumber(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return undefined;
  }

  const numeric = String(value)
    .replace(",", ".")
    .replace(/[^\d.]/g, "");

  if (!numeric) {
    return undefined;
  }

  return Number(numeric);
}

// ------------------------------------------------------
// KONUM TEMİZLE
// ------------------------------------------------------

function cleanLocationPart(value = "") {
  return value
    .trim()
    .replace(/\s+Mh\.?$/i, "")
    .replace(/\s+Mah\.?$/i, "")
    .replace(/\s+Mahallesi$/i, "")
    .replace(/\s+Köyü$/i, "");
}

function parseAddress(address = "") {
  const parts = address
    .split("/")
    .map((part) =>
      cleanLocationPart(part)
    );

  return {
    city: parts[0] || "",
    district: parts[1] || "",
    neighborhood: parts[2] || "",
  };
}

// ------------------------------------------------------
// SATILIK / KİRALIK
// ------------------------------------------------------

function getCategory(listing) {
  const categories =
    listing["Kategoriler"] || "";

  const type =
    listing["Özellikler"]?.[
      "Emlak Tipi"
    ] || "";

  if (
    categories.includes("Kiralık") ||
    type.includes("Kiralık")
  ) {
    return "Kiralık";
  }

  return "Satılık";
}

// ------------------------------------------------------
// GAYRİMENKUL TİPİ
// ------------------------------------------------------

function getPropertyType(listing) {
  const categories =
    listing["Kategoriler"] || "";

  const features =
    listing["Özellikler"] || {};

  const combined = `
    ${categories}
    ${features["Emlak Tipi"] || ""}
    ${features["Kategori"] || ""}
    ${features["Türü"] || ""}
  `;

  if (combined.includes("Arsa")) {
    return "Arsa";
  }

  if (combined.includes("Villa")) {
    return "Villa";
  }

  if (
    combined.includes("İş Yeri") ||
    combined.includes("Dükkan") ||
    combined.includes("Depo") ||
    combined.includes("Ofis") ||
    combined.includes("Mağaza") ||
    combined.includes("Antrepo")
  ) {
    return "Ticari";
  }

  return "Daire";
}

// ------------------------------------------------------
// KOORDİNATLAR
// ------------------------------------------------------

function parseCoordinates(
  coordinates = ""
) {
  const [lat, lng] = coordinates
    .split(",")
    .map((value) =>
      Number(value.trim())
    );

  return {
    latitude:
      Number.isFinite(lat)
        ? lat
        : undefined,

    longitude:
      Number.isFinite(lng)
        ? lng
        : undefined,
  };
}

// ------------------------------------------------------
// İLANA AİT MEDYALARI PUBLIC'E KOPYALA
// ------------------------------------------------------

function copyMediaFiles(
  listing,
  mediaIndex,
  listingDirectory
) {
  fs.mkdirSync(
    listingDirectory,
    {
      recursive: true,
    }
  );

  const images = [];
  const videos = [];

  const imageFiles =
    listing[
      "Aktif Görsel Listesi"
    ] || [];

  const videoFiles =
    listing["Video Listesi"] || [];

  for (const filename of imageFiles) {
    const source =
      mediaIndex.get(
        filename
          .trim()
          .toLowerCase()
      );

    if (!source) {
      console.warn(
        `⚠ Görsel bulunamadı: ${filename}`
      );

      continue;
    }

    const destination =
      path.join(
        listingDirectory,
        filename
      );

    fs.copyFileSync(
      source,
      destination
    );

    images.push(filename);
  }

  for (const filename of videoFiles) {
    const source =
      mediaIndex.get(
        filename
          .trim()
          .toLowerCase()
      );

    if (!source) {
      console.warn(
        `⚠ Video bulunamadı: ${filename}`
      );

      continue;
    }

    const destination =
      path.join(
        listingDirectory,
        filename
      );

    fs.copyFileSync(
      source,
      destination
    );

    videos.push(filename);
  }

  return {
    images,
    videos,
  };
}

// ======================================================
// IMPORT BAŞLAT
// ======================================================

console.log("");
console.log(
  "Sahibinden import işlemi başlatılıyor..."
);

const jsonPath =
  findJsonFile(importDir);

const mediaDirectory =
  findMediaDirectory(importDir);

const jsonContent =
  fs.readFileSync(
    jsonPath,
    "utf8"
  );

const rawData =
  JSON.parse(jsonContent);

const listings =
  rawData["İlan Listesi"];

if (!Array.isArray(listings)) {
  throw new Error(
    'JSON içerisinde "İlan Listesi" bulunamadı.'
  );
}

console.log(
  `${listings.length} ilan bulundu.`
);

// ------------------------------------------------------
// SADECE SAHİBİNDEN IMPORT MEDYASINI TEMİZLE
// ------------------------------------------------------
//
// OWNER tarafından ileride yüklenen görseller
// public/property-uploads içerisinde tutulacak.
// Bu nedenle bu işlem onları etkilemeyecek.
//

fs.rmSync(
  publicMediaDir,
  {
    recursive: true,
    force: true,
  }
);

fs.mkdirSync(
  publicMediaDir,
  {
    recursive: true,
  }
);

const mediaIndex =
  walkDirectory(
    mediaDirectory
  );

// ------------------------------------------------------
// İLANLARI DÖNÜŞTÜR
// ------------------------------------------------------

const properties =
  listings.map(
    (listing, index) => {
      const sahibindenId =
        String(
          listing["İlan no"] || ""
        );

      if (!sahibindenId) {
        throw new Error(
          "İlan numarası olmayan bir kayıt bulundu."
        );
      }

      const address =
        parseAddress(
          listing["Adres"]
        );

      const coordinates =
        parseCoordinates(
          listing["Konum"]
        );

      const features =
        listing["Özellikler"] ||
        {};

      const listingMediaDirectory =
        path.join(
          publicMediaDir,
          sahibindenId
        );

      const media =
        copyMediaFiles(
          listing,
          mediaIndex,
          listingMediaDirectory
        );

      const imagePaths =
        media.images.map(
          (filename) =>
            `/sahibinden/${sahibindenId}/${filename}`
        );

      const videoPaths =
        media.videos.map(
          (filename) =>
            `/sahibinden/${sahibindenId}/${filename}`
        );

      const propertyType =
        getPropertyType(
          listing
        );

      const grossArea =
        parseNumber(
          features["m² (Brüt)"]
        ) ??
        parseNumber(
          features["m²"]
        );

      const netArea =
        parseNumber(
          features["m² (Net)"]
        );

      const rooms =
        features["Oda Sayısı"] ||
        features[
          "Bölüm & Oda Sayısı"
        ] ||
        undefined;

      return {
        id: sahibindenId,

        sahibindenId,

        title:
          listing["Başlık"] ||
          "Gayrimenkul İlanı",

        category:
          getCategory(listing),

        propertyType,

        city:
          address.city,

        district:
          address.district,

        neighborhood:
          address.neighborhood,

        price:
          parsePrice(
            listing["Fiyat"]
          ),

        priceText:
          listing["Fiyat"] ||
          "Fiyat için iletişim",

        rooms,

        grossArea,

        netArea,

        // Şimdilik JSON'daki ilk fotoğraf kullanılır.
        // OWNER paneli kurulduktan sonra manuel
        // seçilen kapak bunun üzerine yazılacak.
        image:
          imagePaths[0] ||
          "/property-placeholder.jpg",

        images:
          imagePaths,

        videos:
          videoPaths,

        description:
          listing["Açıklama"] ||
          "",

        features,

        latitude:
          coordinates.latitude,

        longitude:
          coordinates.longitude,

        featured:
          index < 6,
      };
    }
  );

// ------------------------------------------------------
// TYPESCRIPT DOSYASI ÜRET
// ------------------------------------------------------

const fileContent = `
// BU DOSYA OTOMATİK OLUŞTURULMUŞTUR.
// ELLE DÜZENLEMEYİN.
// Kaynak: Sahibinden ilan transfer dosyası.

import type { Property } from "./properties";

export const properties: Property[] = ${JSON.stringify(
  properties,
  null,
  2
)};
`;

fs.writeFileSync(
  outputFile,
  fileContent,
  "utf8"
);

// ------------------------------------------------------
// SONUÇ
// ------------------------------------------------------

console.log("");
console.log(
  "✅ Sahibinden import tamamlandı."
);

console.log(
  `✅ ${properties.length} ilan oluşturuldu.`
);

console.log(
  "✅ Görseller public/sahibinden içerisine aktarıldı."
);

console.log(
  "✅ properties.generated.ts oluşturuldu."
);

console.log("");