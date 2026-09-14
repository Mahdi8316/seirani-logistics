"use server";

import { createSubmission } from "@/lib/content";

export type ContactState = { ok: boolean; message: string } | null;

/** ثبت درخواست فرم تماس در دیتابیس (قابل مشاهده در پنل ادمین). */
export async function submitContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const service = String(formData.get("service") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!name || !phone) {
    return { ok: false, message: "نام و شماره تماس الزامی است." };
  }

  createSubmission({ name, phone, service, description });
  return {
    ok: true,
    message: "درخواست شما ثبت شد ✓ کارشناسان ما به‌زودی تماس می‌گیرند.",
  };
}
