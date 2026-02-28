/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitAcademyLead(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const program = formData.get("program") as string;
  const age_group = formData.get("age_group") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !phone) {
    return { error: "Name, email and phone are required." };
  }

  try {
    await (prisma as any).academy_Lead.create({
      data: {
        name,
        email,
        phone,
        program: program || null,
        age_group: age_group || null,
        message: message || null,
        status: "new",
      },
    });

    revalidatePath("/admin/academy");
    return { success: true };
  } catch (err: any) {
    console.error("submitAcademyLead error:", err);
    return { error: "Failed to submit enquiry. Please try again." };
  }
}
