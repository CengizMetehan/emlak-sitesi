"use server";

import { auth } from "@/lib/auth";
import {
  clearPropertyPriceOverride,
  clearPropertyTitleOverride,
  upsertPropertyOverride,
} from "@/lib/property-overrides";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updatePropertyPrice(
  propertyId: string,
  formData: FormData,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Yetkisiz işlem");
  }

  const rawPrice = formData.get("price");

  if (typeof rawPrice !== "string") {
    throw new Error("Geçersiz fiyat");
  }

  const cleanedPrice = rawPrice.replace(/[^\d]/g, "");

  const price = Number(cleanedPrice);

  if (!Number.isFinite(price) || price <= 0) {
    throw new Error("Geçerli bir fiyat giriniz");
  }

  const priceText = new Intl.NumberFormat("tr-TR").format(price) + " TL";

  await upsertPropertyOverride(propertyId, {
    price,
    priceText,
  });

  revalidatePath(`/admin/ilanlar/${propertyId}`);
  revalidatePath("/admin/ilanlar");
}

export async function resetPropertyPrice(propertyId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Yetkisiz işlem");
  }

  await clearPropertyPriceOverride(propertyId);

  revalidatePath(`/admin/ilanlar/${propertyId}`);
  revalidatePath("/admin/ilanlar");
  revalidatePath("/");
  revalidatePath(`/portfoy/${propertyId}`);
}
export async function updatePropertyCoverImage(
  propertyId: string,
  formData: FormData,
) {
  const coverImage = String(formData.get("coverImage") ?? "").trim();
  const imageOrder = String(formData.get("imageOrder") ?? "").trim();

  if (!coverImage) {
    return;
  }

  await upsertPropertyOverride(propertyId, {
    coverImage,
    imageOrder: imageOrder || null,
  });

  revalidatePath(`/admin/ilanlar/${propertyId}`);
  revalidatePath(`/portfoy/${propertyId}`);
  revalidatePath("/");
}

export async function updatePropertyImageOrder(
  propertyId: string,
  formData: FormData,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Yetkisiz işlem");
  }

  const imageOrderRaw = formData.get("imageOrder");

  if (typeof imageOrderRaw !== "string" || !imageOrderRaw) {
    throw new Error("Geçersiz galeri sırası");
  }

  let imageOrder: string[];

  try {
    imageOrder = JSON.parse(imageOrderRaw);
  } catch {
    throw new Error("Galeri sırası okunamadı");
  }

  if (!Array.isArray(imageOrder)) {
    throw new Error("Geçersiz galeri sırası");
  }

  await upsertPropertyOverride(propertyId, {
    imageOrder: JSON.stringify(imageOrder),
  });

  revalidatePath(`/admin/ilanlar/${propertyId}`);
  revalidatePath("/admin/ilanlar");
  revalidatePath("/");
  revalidatePath(`/portfoy/${propertyId}`);
}

export async function updatePropertyTitle(
  propertyId: string,
  formData: FormData,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Yetkisiz işlem");
  }

  const titleRaw = formData.get("title");

  if (typeof titleRaw !== "string") {
    throw new Error("Geçersiz başlık");
  }

  const title = titleRaw.trim();

  if (!title) {
    throw new Error("Başlık boş bırakılamaz");
  }

  await upsertPropertyOverride(propertyId, {
    title,
  });

  revalidatePath(`/admin/ilanlar/${propertyId}`);
  revalidatePath("/admin/ilanlar");
  revalidatePath("/");
  revalidatePath(`/portfoy/${propertyId}`);
}

export async function resetPropertyTitle(propertyId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Yetkisiz işlem");
  }

  await clearPropertyTitleOverride(propertyId);

  revalidatePath(`/admin/ilanlar/${propertyId}`);
  revalidatePath("/admin/ilanlar");
  revalidatePath("/");
  revalidatePath(`/portfoy/${propertyId}`);
}

export async function updatePropertySahibindenNo(
  propertyId: string,
  formData: FormData,
) {
  const rawValue = String(formData.get("sahibindenNo") ?? "").trim();

  const sahibindenNo = rawValue.replace(/\D/g, "");

  if (!sahibindenNo) {
    return;
  }

  await upsertPropertyOverride(propertyId, {
    sahibindenNo,
  });

  revalidatePath(`/admin/ilanlar/${propertyId}`);
  revalidatePath(`/portfoy/${propertyId}`);
  revalidatePath("/");
}
