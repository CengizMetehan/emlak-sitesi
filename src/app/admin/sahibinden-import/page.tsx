"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import JSZip from "jszip";
import { upload } from "@vercel/blob/client";

export default function SahibindenImportPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importMessage, setImportMessage] = useState("");
  const importAbortControllerRef = useRef<AbortController | null>(null);
  const [imageCheckDetails, setImageCheckDetails] = useState<
    {
      ilanId: string;
      title: string;
      expected: number;
      zipFound: number;
      blobFound: number;
      missing: number;
    }[]
  >([]);

  const [analysis, setAnalysis] = useState<{
    fileName: string;
    fileSize: number;
    totalFiles: number;
    jsonFileCount: number;
    imageFileCount: number;
    ilanBilgileriFound: boolean;
    medyaBilgileriFound: boolean;
    ilanBilgileriFile: string | null;
    listingCount: number | null;

    comparisonSummary: {
      newCount: number;
      updatedCount: number;
      unchangedCount: number;
      missingCount: number;
    };

    comparison: {
      id: string;
      title: string;
      status: "new" | "updated" | "unchanged" | "missing";
      changes: {
        field: string;
        oldValue: string;
        newValue: string;
      }[];
    }[];
  } | null>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".zip")) {
      setAnalyzeError("Lütfen bir .zip dosyası seçin.");
      return;
    }

    setSelectedFiles([file]);
    setAnalyzeError("");
    setAnalysis(null);
  }
  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".zip")) {
      setAnalyzeError(
        "Lütfen yalnızca .zip uzantılı Sahibinden dosyası bırakın.",
      );
      return;
    }

    setSelectedFiles([file]);
    setAnalyzeError("");
    setAnalysis(null);
  }
  async function handleAnalyze() {
    const file = selectedFiles[0];

    if (!file) {
      setAnalyzeError("Önce Sahibinden ZIP dosyasını seçin.");
      return;
    }

    setAnalyzing(true);
    setAnalyzeError("");
    setAnalysis(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/sahibinden-analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setAnalyzeError(data.error ?? "Dosya analiz edilemedi.");
        return;
      }

      setAnalysis(data);
    } catch (error) {
      console.error(error);

      setAnalyzeError("ZIP dosyası analiz edilirken hata oluştu.");
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleCheckImageMatches() {
    const file = selectedFiles[0];

    if (!file) {
      setAnalyzeError("Önce Sahibinden ZIP dosyasını seçin.");
      return;
    }

    setAnalyzeError("");
    setImageCheckDetails([]);
    setImportMessage(
      "Görseller ZIP ve mevcut Blob dosyalarıyla karşılaştırılıyor...",
    );

    try {
      const zip = await JSZip.loadAsync(file);

      const ilanJsonEntry = Object.values(zip.files).find(
        (entry) =>
          !entry.dir &&
          entry.name.toLocaleLowerCase("tr-TR").includes("ilanbilgileri") &&
          entry.name.toLowerCase().endsWith(".json"),
      );

      if (!ilanJsonEntry) {
        throw new Error(
          "ZIP içerisinde ilan bilgileri JSON dosyası bulunamadı.",
        );
      }

      const ilanJsonText = await ilanJsonEntry.async("string");
      const parsed = JSON.parse(ilanJsonText);
      const ilanListesi = parsed?.["İlan Listesi"];

      if (!Array.isArray(ilanListesi)) {
        throw new Error('"İlan Listesi" bulunamadı.');
      }

      const imageEntries = Object.values(zip.files).filter(
        (entry) => !entry.dir && /\.(jpg|jpeg|png|webp|gif)$/i.test(entry.name),
      );

      const zipImageNames = new Set(
        imageEntries.map((entry) => {
          return entry.name.replace(/\\/g, "/").split("/").pop() ?? entry.name;
        }),
      );

      const blobListResponse = await fetch("/api/admin/blob-list", {
        method: "GET",
      });

      const blobListResult = await blobListResponse.json();

      if (!blobListResponse.ok) {
        throw new Error(
          blobListResult.error ?? "Mevcut Blob görselleri kontrol edilemedi.",
        );
      }

      const blobPathnames = new Set<string>();

      for (const blob of blobListResult.blobs ?? []) {
        if (typeof blob.pathname === "string") {
          blobPathnames.add(blob.pathname);
        }
      }

      let totalExpectedImages = 0;
      let totalZipMatchedImages = 0;
      let totalBlobRecoveredImages = 0;
      let totalTrulyMissingImages = 0;

      const imageDetails: {
        ilanId: string;
        title: string;
        expected: number;
        zipFound: number;
        blobFound: number;
        missing: number;
      }[] = [];

      for (const ilan of ilanListesi) {
        const ilanId = String(ilan["İlan no"] ?? "");
        const ilanTitle = String(ilan["Başlık"] ?? "Başlıksız Portföy");

        const sahibindenImages = Array.isArray(ilan["Aktif Görsel Listesi"])
          ? ilan["Aktif Görsel Listesi"]
          : [];

        let ilanZipFound = 0;
        let ilanBlobFound = 0;
        let ilanMissing = 0;

        const trulyMissingImages: string[] = [];

        for (const fileName of sahibindenImages) {
          const normalizedFileName =
            String(fileName).replace(/\\/g, "/").split("/").pop() ??
            String(fileName);

          totalExpectedImages++;

          if (zipImageNames.has(normalizedFileName)) {
            totalZipMatchedImages++;
            ilanZipFound++;
            continue;
          }

          const blobPathname = `sahibinden/${normalizedFileName}`;

          if (blobPathnames.has(blobPathname)) {
            totalBlobRecoveredImages++;
            ilanBlobFound++;
            continue;
          }

          totalTrulyMissingImages++;
          ilanMissing++;
          trulyMissingImages.push(normalizedFileName);
        }

        if (trulyMissingImages.length > 0) {
          console.warn("Görsel gerçekten bulunamadı:", {
            ilanId,
            beklenenGorsel: sahibindenImages.length,
            bulunamayanGorsel: trulyMissingImages.length,
            eksikDosyalar: trulyMissingImages,
          });
        }

        imageDetails.push({
          ilanId,
          title: ilanTitle,
          expected: sahibindenImages.length,
          zipFound: ilanZipFound,
          blobFound: ilanBlobFound,
          missing: ilanMissing,
        });
      }

      console.log("Gelişmiş görsel kontrol özeti:", {
        toplamBeklenen: totalExpectedImages,
        zipteBulunan: totalZipMatchedImages,
        blobdanKurtarilan: totalBlobRecoveredImages,
        gercektenEksik: totalTrulyMissingImages,
        ziptekiFizikselGorsel: imageEntries.length,
      });

      setImportMessage(
        `Görsel kontrolü tamamlandı. ` +
          `JSON'da ${totalExpectedImages} görsel bekleniyor. ` +
          `${totalZipMatchedImages} görsel ZIP içinde bulundu, ` +
          `${totalBlobRecoveredImages} görsel ZIP'te yok fakat mevcut Blob'da bulundu, ` +
          `${totalTrulyMissingImages} görsel ise ne ZIP'te ne de Blob'da bulunabildi.`,
      );

      setImageCheckDetails(imageDetails);
    } catch (error) {
      console.error("Görsel eşleşme kontrolü hatası:", error);

      setAnalyzeError(
        error instanceof Error
          ? error.message
          : "Görsel eşleşmeleri kontrol edilirken hata oluştu.",
      );

      setImportMessage("");
      setImageCheckDetails([]);
    }
  }

  async function handleImport() {
    const file = selectedFiles[0];

    if (!file) {
      setAnalyzeError("Önce Sahibinden ZIP dosyasını seçin.");
      return;
    }

    setImporting(true);

    const controller = new AbortController();
    importAbortControllerRef.current = controller;

    setImportProgress(0);
    setImportMessage("");
    setAnalyzeError("");

    try {
      const zip = await JSZip.loadAsync(file);

      /*
       * 1) İLAN JSON DOSYASINI BUL
       */
      const ilanJsonEntry = Object.values(zip.files).find(
        (entry) =>
          !entry.dir &&
          entry.name.toLocaleLowerCase("tr-TR").includes("ilanbilgileri") &&
          entry.name.toLowerCase().endsWith(".json"),
      );

      if (!ilanJsonEntry) {
        throw new Error(
          "ZIP içerisinde ilan bilgileri JSON dosyası bulunamadı.",
        );
      }

      const ilanJsonText = await ilanJsonEntry.async("string");

      const parsed = JSON.parse(ilanJsonText);

      const ilanListesi = parsed?.["İlan Listesi"];

      if (!Array.isArray(ilanListesi)) {
        throw new Error('"İlan Listesi" bulunamadı.');
      }

      /*
       * 2) ZIP'TEKİ TÜM GÖRSELLERİ BUL
       */
      const zipEntries = Object.values(zip.files);

      const imageEntries = zipEntries.filter(
        (entry) => !entry.dir && /\.(jpg|jpeg|png|webp|gif)$/i.test(entry.name),
      );

      /*
       * Dosya adına göre ZIP entry haritası
       */
      const imageEntryMap = new Map<string, (typeof imageEntries)[number]>();

      for (const entry of imageEntries) {
        const fileName =
          entry.name.replace(/\\/g, "/").split("/").pop() ?? entry.name;

        imageEntryMap.set(fileName, entry);
      }

      /*
       * Blob'a yüklenen görsellerin:
       * dosyaAdı -> Blob URL
       * eşleşmesi
       */
      const uploadedImageMap = new Map<string, string>();

      /*
       * GÖRSEL EŞLEŞME KONTROLÜ
       *
       * Blob'a yükleme başlamadan önce Sahibinden JSON içindeki
       * görsel adlarının ZIP içerisindeki gerçek dosyalarla
       * eşleşip eşleşmediğini kontrol ediyoruz.
       */
      for (const ilan of ilanListesi) {
        const ilanId = String(ilan["İlan no"] ?? "");

        const sahibindenImages = Array.isArray(ilan["Aktif Görsel Listesi"])
          ? ilan["Aktif Görsel Listesi"]
          : [];

        const missingImages = sahibindenImages.filter((fileName: string) => {
          const normalizedFileName =
            String(fileName).replace(/\\/g, "/").split("/").pop() ??
            String(fileName);

          return !imageEntryMap.has(normalizedFileName);
        });

        if (missingImages.length > 0) {
          console.warn("ZIP görsel eşleşme problemi:", {
            ilanId,
            beklenenGorsel: sahibindenImages.length,
            zipteBulunamayan: missingImages.length,
            eksikDosyalar: missingImages,
          });
        }
      }

      /*
       * 3) MEVCUT VERCEL BLOB GÖRSELLERİNİ KONTROL ET
       *
       * Aynı dosya Blob'da zaten varsa gereksiz yere tekrar yüklemiyoruz.
       * Dosya adı aynı ama dosya boyutu farklıysa görsel değişmiş kabul edilip
       * yeniden yükleniyor.
       */
      setImportMessage("Mevcut Blob görselleri kontrol ediliyor...");

      const blobListResponse = await fetch("/api/admin/blob-list", {
        method: "GET",
        signal: controller.signal,
      });

      const blobListResult = await blobListResponse.json();

      if (!blobListResponse.ok) {
        throw new Error(
          blobListResult.error ?? "Mevcut Blob görselleri alınamadı.",
        );
      }

      const existingBlobMap = new Map<
        string,
        {
          pathname: string;
          url: string;
          size: number;
        }
      >();

      for (const blob of blobListResult.blobs ?? []) {
        if (typeof blob.pathname === "string" && typeof blob.url === "string") {
          existingBlobMap.set(blob.pathname, {
            pathname: blob.pathname,
            url: blob.url,
            size: Number(blob.size ?? 0),
          });
        }
      }

      /*
       * 4) SADECE YENİ VEYA DEĞİŞMİŞ GÖRSELLERİ YÜKLE
       */
      let uploadedCount = 0;
      let skippedCount = 0;
      let processedCount = 0;

      for (const entry of imageEntries) {
        const blobData = await entry.async("blob");

        const fileName =
          entry.name.replace(/\\/g, "/").split("/").pop() ?? entry.name;

        const pathname = `sahibinden/${fileName}`;

        const existingBlob = existingBlobMap.get(pathname);

        /*
         * Aynı pathname + aynı dosya boyutu varsa:
         * görsel Blob'da zaten mevcut kabul edilir.
         */
        if (existingBlob && existingBlob.size === blobData.size) {
          uploadedImageMap.set(fileName, existingBlob.url);

          skippedCount++;
          processedCount++;

          const progress = Math.round(
            (processedCount / imageEntries.length) * 80,
          );

          setImportProgress(progress);

          setImportMessage(
            `${processedCount} / ${imageEntries.length} görsel kontrol edildi. ${uploadedCount} yeni/değişmiş görsel yüklendi, ${skippedCount} mevcut görsel tekrar kullanılacak.`,
          );

          continue;
        }

        const extension = fileName.split(".").pop()?.toLowerCase();

        let contentType = "image/jpeg";

        if (extension === "png") {
          contentType = "image/png";
        } else if (extension === "webp") {
          contentType = "image/webp";
        } else if (extension === "gif") {
          contentType = "image/gif";
        }

        const imageFile = new File([blobData], fileName, {
          type: contentType,
        });

        const uploadedBlob = await upload(pathname, imageFile, {
          access: "public",
          handleUploadUrl: "/api/admin/blob-upload",
          abortSignal: controller.signal,
        });

        uploadedImageMap.set(fileName, uploadedBlob.url);

        uploadedCount++;
        processedCount++;

        const progress = Math.round(
          (processedCount / imageEntries.length) * 80,
        );

        setImportProgress(progress);

        setImportMessage(
          `${processedCount} / ${imageEntries.length} görsel kontrol edildi. ${uploadedCount} yeni/değişmiş görsel yüklendi, ${skippedCount} mevcut görsel tekrar kullanılacak.`,
        );
      }

      /*
       * 4) SAHİBİNDEN VERİLERİNİ
       *    PROPERTY NESNESİNE DÖNÜŞTÜR
       */
      const properties = ilanListesi.map(
        (ilan: {
          "İlan no": string;
          Başlık?: string;
          Açıklama?: string;
          Kategoriler?: string;
          Fiyat?: string;
          Adres?: string;
          Konum?: string;
          Özellikler?: Record<string, string | null>;
          "Aktif Görsel Listesi"?: string[];
          "Video Listesi"?: string[];
        }) => {
          const id = String(ilan["İlan no"]);

          const categories = String(ilan.Kategoriler ?? "")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);

          const category: "Satılık" | "Kiralık" = categories.includes("Kiralık")
            ? "Kiralık"
            : "Satılık";

          let propertyType: "Daire" | "Villa" | "Arsa" | "Ticari" = "Ticari";

          if (categories.includes("Daire")) {
            propertyType = "Daire";
          } else if (categories.includes("Villa")) {
            propertyType = "Villa";
          } else if (categories.includes("Arsa")) {
            propertyType = "Arsa";
          }

          /*
           * ADRES
           * Örnek:
           * Eskişehir / Odunpazarı / Büyükdere Mh.
           */
          const addressParts = String(ilan.Adres ?? "")
            .split("/")
            .map((item) => item.trim());

          const city = addressParts[0] ?? "";
          const district = addressParts[1] ?? "";

          const neighborhood = (addressParts[2] ?? "")
            .replace(/\s+Mh\.?$/i, "")
            .trim();

          /*
           * FİYAT
           */
          const priceText = String(ilan.Fiyat ?? "");

          const priceString = priceText.replace(/[^\d]/g, "");

          const price =
            priceString.length > 0 ? Number(priceString) : undefined;

          /*
           * ÖZELLİKLER
           */
          const features = ilan.Özellikler ?? {};

          const rooms = features["Oda Sayısı"] ?? undefined;

          const grossAreaValue = features["m² (Brüt)"];

          const netAreaValue = features["m² (Net)"];

          const grossArea = grossAreaValue
            ? Number(
                String(grossAreaValue)
                  .replace(",", ".")
                  .replace(/[^\d.]/g, ""),
              )
            : undefined;

          const netArea = netAreaValue
            ? Number(
                String(netAreaValue)
                  .replace(",", ".")
                  .replace(/[^\d.]/g, ""),
              )
            : undefined;

          /*
           * KONUM
           */
          let latitude: number | undefined;
          let longitude: number | undefined;

          if (ilan.Konum) {
            const coordinates = ilan.Konum.split(",").map((item) =>
              Number(item.trim()),
            );

            if (
              coordinates.length === 2 &&
              Number.isFinite(coordinates[0]) &&
              Number.isFinite(coordinates[1])
            ) {
              latitude = coordinates[0];
              longitude = coordinates[1];
            }
          }

          /*
           * GÖRSELLER
           *
           * ZIP içerisinde medya varsa yeni görselleri kullan.
           * ZIP içerisinde hiç görsel yoksa images alanını undefined bırak.
           * Böylece API mevcut ilanların Neon / Blob görsellerini koruyabilir.
           */
          const sahibindenImages = ilan["Aktif Görsel Listesi"] ?? [];

          let images: string[] | undefined;
          let image: string | undefined;
          let imageSetComplete = false;

          if (imageEntries.length > 0) {
            const matchedImages = sahibindenImages
              .map((fileName) => {
                const normalizedFileName =
                  fileName.replace(/\\/g, "/").split("/").pop() ?? fileName;

                const matchedUrl =
                  uploadedImageMap.get(normalizedFileName) ??
                  existingBlobMap.get(`sahibinden/${normalizedFileName}`)?.url;

                if (!matchedUrl) {
                  console.warn("Görsel ne ZIP'te ne de Blob'da bulundu:", {
                    ilanId: id,
                    originalFileName: fileName,
                    normalizedFileName,
                  });
                }

                return matchedUrl;
              })
              .filter((url): url is string => typeof url === "string");

            images = matchedImages;
            image = matchedImages[0] ?? "";

            imageSetComplete = sahibindenImages.length === matchedImages.length;
          }
          return {
            id,
            sahibindenId: id,

            title: ilan.Başlık?.trim() || "Başlıksız Portföy",

            category,
            propertyType,

            city,
            district,
            neighborhood,

            price,
            priceText,

            rooms,

            grossArea: Number.isFinite(grossArea) ? grossArea : undefined,

            netArea: Number.isFinite(netArea) ? netArea : undefined,

            image,
            images,
            imageSetComplete,

            videos: ilan["Video Listesi"] ?? [],

            description: ilan.Açıklama ?? "",

            features,

            latitude,
            longitude,

            featured: false,
          };
        },
      );

      /*
       * 5) NEON'A GÖNDER
       */
      setImportProgress(90);
      setImportMessage(
        `${properties.length} portföy veritabanına aktarılıyor...`,
      );

      const dbResponse = await fetch("/api/admin/sahibinden-import", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          properties,
        }),

        signal: controller.signal,
      });

      const dbResult = await dbResponse.json();

      if (!dbResponse.ok) {
        throw new Error(
          dbResult.error ?? "Portföyler veritabanına aktarılamadı.",
        );
      }

      setImportProgress(100);

      setImportMessage(
        `Aktarım tamamlandı. ` +
          `${dbResult.inserted} yeni portföy eklendi, ` +
          `${dbResult.updated} portföy güncellendi. ` +
          `${uploadedCount} yeni/değişmiş görsel Blob'a yüklendi, ` +
          `${skippedCount} mevcut görsel tekrar kullanıldı. ` +
          `${dbResult.deletedImages ?? 0} kullanılmayan eski görsel silindi.`,
      );
      /*
       * 6) ANALİZİ YENİDEN ÇALIŞTIR
       *
       * Böylece ekrandaki:
       * Güncellenecek = 0
       * Değişiklik Yok = 15
       * gibi yeni durum görülebilir.
       */
      await handleAnalyze();
    } catch (error) {
      const isAbortError =
        controller.signal.aborted ||
        (error instanceof DOMException && error.name === "AbortError") ||
        (error instanceof Error &&
          error.message.toLowerCase().includes("request was aborted"));

      if (isAbortError) {
        setImportMessage("Aktarım kullanıcı tarafından iptal edildi.");
        setAnalyzeError("");
        return;
      }

      console.error("Sahibinden import error:", error);

      setAnalyzeError(
        error instanceof Error
          ? error.message
          : "İçe aktarma sırasında hata oluştu.",
      );
    } finally {
      setImporting(false);
      importAbortControllerRef.current = null;
    }
  }

  function handleCancelImport() {
    const controller = importAbortControllerRef.current;

    if (!controller) {
      return;
    }

    controller.abort();
    setImportMessage("Aktarım iptal ediliyor...");
  }

  return (
    <main className="min-h-screen bg-[#050914] px-6 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        {/* ÜST KISIM */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-500">
              Admin Paneli
            </p>

            <h1 className="mt-3 text-3xl font-bold md:text-4xl">
              Sahibinden Import
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
              Sahibinden&apos;den alınan portföy verilerini kontrol edin,
              değişiklikleri inceleyin ve sitenize güvenli şekilde aktarın.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold transition hover:bg-white/10"
          >
            ← Admin Paneline Dön
          </Link>
        </div>

        {/* IMPORT KARTI */}
        <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <div>
            <h2 className="text-xl font-semibold">Yeni Sahibinden Aktarımı</h2>

            <p className="mt-2 text-sm text-white/50">
              Sahibinden&apos;den aldığınız güncel ilan dosyalarını buraya
              yükleyerek portföylerinizi güncelleyebilirsiniz.
            </p>
          </div>

          {/* DOSYA ALANI */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`mt-8 rounded-2xl border border-dashed p-10 text-center transition ${
              isDragging
                ? "border-blue-500 bg-blue-500/10"
                : "border-white/15 bg-black/20"
            }`}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/10 text-2xl text-blue-500">
              ↑
            </div>

            <h3 className="mt-5 text-lg font-semibold">
              Sahibinden ZIP dosyasını buraya bırakın
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/45">
              Sahibinden&apos;den indirdiğiniz TumIlanlar_....zip dosyasını
              sürükleyip bırakabilir veya bilgisayarınızdan seçebilirsiniz.
            </p>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              ZIP Dosyası Seç
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".zip"
              onChange={handleFileChange}
              className="hidden"
            />

            {selectedFiles.length > 0 && (
              <div className="mx-auto mt-6 max-w-xl text-left">
                <p className="text-sm font-semibold text-white">
                  Seçilen dosya
                </p>

                <div className="mt-3">
                  {selectedFiles.map((file) => (
                    <div
                      key={`${file.name}-${file.size}`}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white/80">
                          {file.name}
                        </p>

                        <p className="mt-1 text-xs text-white/35">
                          ZIP dosyası
                        </p>
                      </div>

                      <span className="ml-4 shrink-0 text-xs text-white/35">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedFiles.length > 0 && (
              <div className="mt-6">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {analyzing ? "ZIP Analiz Ediliyor..." : "Dosyayı Analiz Et"}
                  </button>

                  <button
                    type="button"
                    onClick={handleCheckImageMatches}
                    className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-7 py-3.5 text-sm font-semibold text-amber-300 transition hover:bg-amber-500/20"
                  >
                    Görselleri Kontrol Et
                  </button>
                </div>
              </div>
            )}

            {analyzeError && (
              <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-300">
                {analyzeError}
              </div>
            )}

            {analysis && (
              <div className="mt-8 rounded-2xl border border-green-500/20 bg-green-500/5 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/15 text-green-400">
                    ✓
                  </div>

                  <div>
                    <p className="font-semibold text-white">
                      ZIP başarıyla analiz edildi
                    </p>

                    <p className="mt-1 text-sm text-white/40">
                      {analysis.fileName}
                    </p>
                  </div>
                </div>

                {/* ZIP ANALİZ ÖZETİ */}
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs text-white/40">Portföy</p>

                    <p className="mt-2 text-2xl font-semibold">
                      {analysis.listingCount ?? "-"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs text-white/40">Görsel Dosyası</p>

                    <p className="mt-2 text-2xl font-semibold">
                      {analysis.imageFileCount}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs text-white/40">İlan Bilgileri</p>

                    <p
                      className={`mt-2 font-semibold ${
                        analysis.ilanBilgileriFound
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {analysis.ilanBilgileriFound ? "Bulundu ✓" : "Bulunamadı"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs text-white/40">Medya Bilgileri</p>

                    <p
                      className={`mt-2 font-semibold ${
                        analysis.medyaBilgileriFound
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {analysis.medyaBilgileriFound
                        ? "Bulundu ✓"
                        : "Bulunamadı"}
                    </p>
                  </div>
                </div>
                {/* DEĞİŞİKLİK DETAYLARI */}
                {analysis.comparison.some(
                  (item) => item.status === "updated",
                ) && (
                  <div className="mt-8 border-t border-white/10 pt-6">
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-white">
                        Güncellenecek Portföy Detayları
                      </p>

                      <p className="mt-1 text-sm text-white/40">
                        Sistem aşağıdaki alanlarda farklılık tespit etti.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {analysis.comparison
                        .filter((item) => item.status === "updated")
                        .map((item) => (
                          <div
                            key={item.id}
                            className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-left"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <p className="font-semibold text-white">
                                  {item.title}
                                </p>
                                <p className="mt-1 text-xs text-white/40">
                                  Sahibinden ID: {item.id}
                                </p>
                              </div>

                              <span className="rounded-lg bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
                                {item.changes.length} değişiklik
                              </span>
                            </div>

                            <div className="mt-4 space-y-2">
                              {item.changes.map((change, index) => (
                                <div
                                  key={`${item.id}-${change.field}-${index}`}
                                  className="rounded-lg border border-white/10 bg-black/20 p-3"
                                >
                                  <p className="text-sm font-semibold text-amber-300">
                                    {change.field}
                                  </p>

                                  <div className="mt-2 grid gap-2 text-xs md:grid-cols-2">
                                    <div>
                                      <span className="text-white/40">
                                        Mevcut:
                                      </span>
                                      <p className="mt-1 break-words text-white/70">
                                        {change.oldValue}
                                      </p>
                                    </div>

                                    <div>
                                      <span className="text-white/40">
                                        ZIP:
                                      </span>
                                      <p className="mt-1 break-words text-white/70">
                                        {change.newValue}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
                {/* MEVCUT SİTE İLE KARŞILAŞTIRMA */}
                <div className="mt-8 border-t border-white/10 pt-6">
                  <div className="mb-5">
                    <p className="text-sm font-semibold text-white">
                      Mevcut Site ile Karşılaştırma
                    </p>

                    <p className="mt-1 text-sm text-white/40">
                      ZIP içindeki portföyler mevcut site verileriyle
                      karşılaştırıldı.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* YENİ */}
                    <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
                      <p className="text-xs font-medium uppercase tracking-wider text-blue-300">
                        Yeni
                      </p>

                      <p className="mt-2 text-3xl font-semibold text-white">
                        {analysis.comparisonSummary.newCount}
                      </p>

                      <p className="mt-1 text-xs text-white/40">
                        Siteye eklenecek
                      </p>
                    </div>

                    {/* GÜNCELLENECEK */}
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                      <p className="text-xs font-medium uppercase tracking-wider text-amber-300">
                        Güncellenecek
                      </p>

                      <p className="mt-2 text-3xl font-semibold text-white">
                        {analysis.comparisonSummary.updatedCount}
                      </p>

                      <p className="mt-1 text-xs text-white/40">
                        Değişiklik bulundu
                      </p>
                    </div>

                    {/* DEĞİŞİKLİK YOK */}
                    <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4">
                      <p className="text-xs font-medium uppercase tracking-wider text-green-300">
                        Değişiklik Yok
                      </p>

                      <p className="mt-2 text-3xl font-semibold text-white">
                        {analysis.comparisonSummary.unchangedCount}
                      </p>

                      <p className="mt-1 text-xs text-white/40">
                        Güncel durumda
                      </p>
                    </div>

                    {/* ZIP'TE YOK */}
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                      <p className="text-xs font-medium uppercase tracking-wider text-red-300">
                        ZIP&apos;te Yok
                      </p>

                      <p className="mt-2 text-3xl font-semibold text-white">
                        {analysis.comparisonSummary.missingCount}
                      </p>

                      <p className="mt-1 text-xs text-white/40">
                        Kontrol edilmesi gereken
                      </p>
                    </div>
                  </div>
                </div>

                {/* İÇE AKTAR */}
                <div className="mt-8 border-t border-white/10 pt-6">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleImport}
                      disabled={importing}
                      className="flex-1 rounded-xl bg-blue-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {importing ? "İçe Aktarılıyor..." : "İçe Aktar"}
                    </button>

                    {importing && (
                      <button
                        type="button"
                        onClick={handleCancelImport}
                        className="rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-base font-semibold text-red-300 transition hover:bg-red-500/20 sm:min-w-[170px]"
                      >
                        İptal Et
                      </button>
                    )}
                  </div>

                  {/* YÜKLEME İLERLEMESİ */}
                  {importing && (
                    <div className="mt-5">
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-blue-600 transition-all duration-300"
                          style={{
                            width: `${importProgress}%`,
                          }}
                        />
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-4 text-sm">
                        <span className="text-white/50">{importMessage}</span>

                        <span className="shrink-0 font-semibold text-white">
                          %{importProgress}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* TAMAMLANDI / İPTAL MESAJI */}
                  {!importing && importMessage && (
                    <div
                      className={`mt-5 rounded-xl border p-4 text-sm ${
                        importMessage.toLowerCase().includes("iptal")
                          ? "border-red-500/20 bg-red-500/10 text-red-300"
                          : "border-green-500/20 bg-green-500/10 text-green-300"
                      }`}
                    >
                      {importMessage}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* İŞLEM AÇIKLAMASI */}
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
              <span className="text-sm font-semibold text-blue-400">01</span>

              <h3 className="mt-3 font-semibold">Dosyaları Yükle</h3>

              <p className="mt-2 text-sm leading-6 text-white/45">
                Güncel Sahibinden portföy dosyalarını sisteme yükleyin.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
              <span className="text-sm font-semibold text-blue-400">02</span>

              <h3 className="mt-3 font-semibold">Değişiklikleri İncele</h3>

              <p className="mt-2 text-sm leading-6 text-white/45">
                Yeni, güncellenen veya artık bulunmayan portföyleri kontrol
                edin.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
              <span className="text-sm font-semibold text-blue-400">03</span>

              <h3 className="mt-3 font-semibold">İçe Aktar</h3>

              <p className="mt-2 text-sm leading-6 text-white/45">
                Kontrol ettiğiniz değişiklikleri onaylayarak siteye aktarın.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
