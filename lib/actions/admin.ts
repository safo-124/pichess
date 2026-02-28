"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ─── TOURNAMENTS ────────────────────────────────────────────────────────────

export async function createTournament(fd: FormData) {
  const tags = (fd.get("tags") as string ?? "").split(",").map(t => t.trim()).filter(Boolean);
  await (prisma as any).tournament.create({
    data: {
      title: fd.get("title") as string,
      description: (fd.get("description") as string) || null,
      date: new Date(fd.get("date") as string),
      location: fd.get("location") as string,
      venue: (fd.get("venue") as string) || null,
      registrationLink: (fd.get("registrationLink") as string) || null,
      tags,
      status: (fd.get("status") as string) || "UPCOMING",
      featured: fd.get("featured") === "true",
    },
  });
  revalidatePath("/admin/tournaments");
  revalidatePath("/tournaments");
  revalidatePath("/");
}

export async function updateTournament(fd: FormData) {
  const id = Number(fd.get("id"));
  const tags = (fd.get("tags") as string ?? "").split(",").map(t => t.trim()).filter(Boolean);
  await (prisma as any).tournament.update({
    where: { id },
    data: {
      title: fd.get("title") as string,
      description: (fd.get("description") as string) || null,
      date: new Date(fd.get("date") as string),
      location: fd.get("location") as string,
      venue: (fd.get("venue") as string) || null,
      registrationLink: (fd.get("registrationLink") as string) || null,
      tags,
      status: fd.get("status") as string,
      featured: fd.get("featured") === "true",
    },
  });
  revalidatePath("/admin/tournaments");
  revalidatePath("/tournaments");
  revalidatePath("/");
}

export async function deleteTournament(fd: FormData) {
  const id = Number(fd.get("id"));
  await (prisma as any).tournament.delete({ where: { id } });
  revalidatePath("/admin/tournaments");
  revalidatePath("/tournaments");
  revalidatePath("/");
}

// ─── PRODUCTS ───────────────────────────────────────────────────────────────

export async function createProduct(fd: FormData) {
  await (prisma as any).product.create({
    data: {
      name: fd.get("name") as string,
      description: (fd.get("description") as string) || null,
      price: parseFloat(fd.get("price") as string),
      image: (fd.get("image") as string) || null,
      inStock: fd.get("inStock") === "true",
      featured: fd.get("featured") === "true",
      categoryId: Number(fd.get("categoryId")),
    },
  });
  revalidatePath("/admin/shop");
  revalidatePath("/shop");
  revalidatePath("/");
}

export async function updateProduct(fd: FormData) {
  const id = Number(fd.get("id"));
  await (prisma as any).product.update({
    where: { id },
    data: {
      name: fd.get("name") as string,
      description: (fd.get("description") as string) || null,
      price: parseFloat(fd.get("price") as string),
      image: (fd.get("image") as string) || null,
      inStock: fd.get("inStock") === "true",
      featured: fd.get("featured") === "true",
      categoryId: Number(fd.get("categoryId")),
    },
  });
  revalidatePath("/admin/shop");
  revalidatePath("/shop");
  revalidatePath("/");
}

export async function deleteProduct(fd: FormData) {
  const id = Number(fd.get("id"));
  await (prisma as any).product.delete({ where: { id } });
  revalidatePath("/admin/shop");
  revalidatePath("/shop");
  revalidatePath("/");
}

export async function createCategory(fd: FormData) {
  const name = fd.get("name") as string;
  const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  await (prisma as any).category.create({
    data: { name, slug, image: (fd.get("image") as string) || null },
  });
  revalidatePath("/admin/shop");
  revalidatePath("/shop");
}

export async function deleteCategory(fd: FormData) {
  const id = Number(fd.get("id"));
  await (prisma as any).category.delete({ where: { id } });
  revalidatePath("/admin/shop");
  revalidatePath("/shop");
}

// ─── CONTENT POSTS ──────────────────────────────────────────────────────────

export async function createPost(fd: FormData) {
  const title = fd.get("title") as string;
  const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const tags = (fd.get("tags") as string ?? "").split(",").map(t => t.trim()).filter(Boolean);
  await (prisma as any).content_Post.create({
    data: {
      title,
      slug,
      content: fd.get("content") as string,
      excerpt: (fd.get("excerpt") as string) || null,
      image: (fd.get("image") as string) || null,
      tags,
      published: fd.get("published") === "true",
    },
  });
  revalidatePath("/admin/content");
  revalidatePath("/news");
}

export async function updatePost(fd: FormData) {
  const id = Number(fd.get("id"));
  const tags = (fd.get("tags") as string ?? "").split(",").map(t => t.trim()).filter(Boolean);
  await (prisma as any).content_Post.update({
    where: { id },
    data: {
      title: fd.get("title") as string,
      content: fd.get("content") as string,
      excerpt: (fd.get("excerpt") as string) || null,
      image: (fd.get("image") as string) || null,
      tags,
      published: fd.get("published") === "true",
    },
  });
  revalidatePath("/admin/content");
  revalidatePath("/news");
}

export async function deletePost(fd: FormData) {
  const id = Number(fd.get("id"));
  await (prisma as any).content_Post.delete({ where: { id } });
  revalidatePath("/admin/content");
  revalidatePath("/news");
}

export async function deleteSubscriber(fd: FormData) {
  const id = Number(fd.get("id"));
  await (prisma as any).subscriber.delete({ where: { id } });
  revalidatePath("/admin/content");
}

// ─── ACADEMY ────────────────────────────────────────────────────────────────

export async function updateLeadStatus(fd: FormData) {
  const id = Number(fd.get("id"));
  await (prisma as any).academy_Lead.update({
    where: { id },
    data: { status: fd.get("status") as string },
  });
  revalidatePath("/admin/academy");
}

export async function deleteLead(fd: FormData) {
  const id = Number(fd.get("id"));
  await (prisma as any).academy_Lead.delete({ where: { id } });
  revalidatePath("/admin/academy");
}

export async function createTeamMember(fd: FormData) {
  await (prisma as any).academy_Team.create({
    data: {
      name: fd.get("name") as string,
      role: fd.get("role") as string,
      bio: (fd.get("bio") as string) || null,
      image: (fd.get("image") as string) || null,
      order: Number(fd.get("order") || 0),
      published: fd.get("published") !== "false",
    },
  });
  revalidatePath("/admin/academy");
  revalidatePath("/academy/team");
}

export async function deleteTeamMember(fd: FormData) {
  const id = Number(fd.get("id"));
  await (prisma as any).academy_Team.delete({ where: { id } });
  revalidatePath("/admin/academy");
  revalidatePath("/academy/team");
}

export async function createTestimonial(fd: FormData) {
  await (prisma as any).academy_Testimonial.create({
    data: {
      name: fd.get("name") as string,
      content: fd.get("content") as string,
      rating: Number(fd.get("rating") || 5),
      image: (fd.get("image") as string) || null,
      program: (fd.get("program") as string) || null,
      published: fd.get("published") === "true",
    },
  });
  revalidatePath("/admin/academy");
  revalidatePath("/academy");
}

export async function deleteTestimonial(fd: FormData) {
  const id = Number(fd.get("id"));
  await (prisma as any).academy_Testimonial.delete({ where: { id } });
  revalidatePath("/admin/academy");
  revalidatePath("/academy");
}

// ─── NGO ────────────────────────────────────────────────────────────────────

export async function updateApplicationStatus(fd: FormData) {
  const id = Number(fd.get("id"));
  await (prisma as any).nGO_Application.update({
    where: { id },
    data: { status: fd.get("status") as string },
  });
  revalidatePath("/admin/ngo");
}

export async function deleteApplication(fd: FormData) {
  const id = Number(fd.get("id"));
  await (prisma as any).nGO_Application.delete({ where: { id } });
  revalidatePath("/admin/ngo");
}

export async function updateVolunteerStatus(fd: FormData) {
  const id = Number(fd.get("id"));
  await (prisma as any).nGO_Volunteer.update({
    where: { id },
    data: { status: fd.get("status") as string },
  });
  revalidatePath("/admin/ngo");
}

export async function deleteVolunteer(fd: FormData) {
  const id = Number(fd.get("id"));
  await (prisma as any).nGO_Volunteer.delete({ where: { id } });
  revalidatePath("/admin/ngo");
}

export async function deleteDonation(fd: FormData) {
  const id = Number(fd.get("id"));
  await (prisma as any).nGO_Donation.delete({ where: { id } });
  revalidatePath("/admin/ngo");
}

export async function createNGOStory(fd: FormData) {
  await (prisma as any).nGO_Story.create({
    data: {
      title: fd.get("title") as string,
      content: fd.get("content") as string,
      image: (fd.get("image") as string) || null,
      published: fd.get("published") === "true",
    },
  });
  revalidatePath("/admin/ngo");
  revalidatePath("/ngo");
}

export async function deleteNGOStory(fd: FormData) {
  const id = Number(fd.get("id"));
  await (prisma as any).nGO_Story.delete({ where: { id } });
  revalidatePath("/admin/ngo");
  revalidatePath("/ngo");
}

// ─── PARTNERS ───────────────────────────────────────────────────────────────

export async function createPartner(fd: FormData) {
  await (prisma as any).partner.create({
    data: {
      name: fd.get("name") as string,
      logo: (fd.get("logo") as string) || null,
      website: (fd.get("website") as string) || null,
      order: Number(fd.get("order") || 0),
    },
  });
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deletePartner(fd: FormData) {
  const id = Number(fd.get("id"));
  await (prisma as any).partner.delete({ where: { id } });
  revalidatePath("/admin");
  revalidatePath("/");
}

// ─── DAILY PUZZLE ───────────────────────────────────────────────────────────

export async function createPuzzle(fd: FormData) {
  await (prisma as any).daily_Puzzle.create({
    data: {
      title: (fd.get("title") as string) || null,
      fen: fd.get("fen") as string,
      solution: fd.get("solution") as string,
      difficulty: (fd.get("difficulty") as string) || "MEDIUM",
      description: (fd.get("description") as string) || null,
      published: fd.get("published") === "true",
    },
  });
  revalidatePath("/admin");
  revalidatePath("/learning-tools");
}

export async function deletePuzzle(fd: FormData) {
  const id = Number(fd.get("id"));
  await (prisma as any).daily_Puzzle.delete({ where: { id } });
  revalidatePath("/admin");
  revalidatePath("/learning-tools");
}
