/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitNGOApplication(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const age = formData.get("age") as string;
  const school = formData.get("school") as string;
  const chess_level = formData.get("chess_level") as string;
  const essay = formData.get("essay") as string;
  const guardian_name = formData.get("guardian_name") as string;
  const guardian_phone = formData.get("guardian_phone") as string;
  const region = formData.get("region") as string;

  if (!name || !email || !phone) {
    return { error: "Name, email and phone are required." };
  }

  try {
    await (prisma as any).nGO_Application.create({
      data: {
        name,
        email,
        phone,
        age: age ? parseInt(age, 10) : null,
        school: school || null,
        chess_level: chess_level || null,
        essay: essay || null,
        guardian_name: guardian_name || null,
        guardian_phone: guardian_phone || null,
        region: region || null,
        status: "pending",
      },
    });

    revalidatePath("/admin/ngo");
    return { success: true };
  } catch (err: any) {
    console.error("submitNGOApplication error:", err);
    return { error: "Failed to submit application. Please try again." };
  }
}

export async function submitVolunteer(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const occupation = formData.get("occupation") as string;
  const skills = formData.get("skills") as string;
  const availability = formData.get("availability") as string;
  const motivation = formData.get("motivation") as string;

  if (!name || !email) {
    return { error: "Name and email are required." };
  }

  try {
    await (prisma as any).nGO_Volunteer.create({
      data: {
        name,
        email,
        phone: phone || null,
        occupation: occupation || null,
        skills: skills || null,
        availability: availability || null,
        motivation: motivation || null,
        status: "pending",
      },
    });

    revalidatePath("/admin/ngo");
    return { success: true };
  } catch (err: any) {
    console.error("submitVolunteer error:", err);
    return { error: "Failed to submit volunteer form. Please try again." };
  }
}

export async function submitDonation(formData: FormData) {
  const donor_name = formData.get("donor_name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const amount = formData.get("amount") as string;
  const method = formData.get("method") as string;
  const message = formData.get("message") as string;
  const anonymous = formData.get("anonymous") === "true";

  if (!amount || !method) {
    return { error: "Amount and payment method are required." };
  }

  try {
    await (prisma as any).nGO_Donation.create({
      data: {
        donor_name: anonymous ? "Anonymous" : (donor_name || "Anonymous"),
        email: email || null,
        phone: phone || null,
        amount: parseFloat(amount),
        method: method,
        message: message || null,
        anonymous,
        status: "pending",
      },
    });

    revalidatePath("/admin/ngo");
    return { success: true };
  } catch (err: any) {
    console.error("submitDonation error:", err);
    return { error: "Failed to record donation. Please try again." };
  }
}
