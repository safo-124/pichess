/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;

  if (!email) {
    return { error: "Email is required." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  try {
    await (prisma as any).subscriber.upsert({
      where: { email },
      update: { name: name || undefined, active: true },
      create: { email, name: name || null, active: true },
    });

    revalidatePath("/admin/content");
    return { success: true };
  } catch (err: any) {
    console.error("subscribeToNewsletter error:", err);
    return { error: "Failed to subscribe. Please try again." };
  }
}

export async function submitContactMessage(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { error: "Name, email and message are required." };
  }

  // For now just log — in production you'd send an email or save to DB
  console.log("Contact message received:", { name, email, subject, message });

  return { success: true };
}
