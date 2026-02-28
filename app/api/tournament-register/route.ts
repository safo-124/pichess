import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "pichessacademy@gmail.com";
const ADMIN_WHATSAPP = process.env.ADMIN_WHATSAPP || "233554534646";
const FROM_EMAIL = process.env.FROM_EMAIL || "PiChess <onboarding@resend.dev>";

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tournamentId, fullName, email, phone, whatsApp, age, rating, notes } = body;

    if (!tournamentId || !fullName || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields: fullName, email, phone" },
        { status: 400 }
      );
    }

    // Get tournament details + check spots
    const tournament = await (prisma as any).tournament.findUnique({
      where: { id: Number(tournamentId) },
      include: { registrations: { where: { status: "CONFIRMED" } } },
    });

    if (!tournament) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
    }

    if (tournament.status === "COMPLETED") {
      return NextResponse.json({ error: "This tournament/event has already ended" }, { status: 400 });
    }

    // Check if already registered with this email
    const existing = tournament.registrations.find(
      (r: any) => r.email.toLowerCase() === email.toLowerCase()
    );
    if (existing) {
      return NextResponse.json(
        { error: "You are already registered for this tournament/event" },
        { status: 409 }
      );
    }

    // Check capacity
    const confirmedCount = tournament.registrations.length;
    const isFull = tournament.maxSpots && confirmedCount >= tournament.maxSpots;
    const regStatus = isFull ? "WAITLISTED" : "CONFIRMED";

    // Create registration
    const registration = await (prisma as any).tournament_Registration.create({
      data: {
        tournamentId: Number(tournamentId),
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        whatsApp: whatsApp?.trim() || phone.trim(),
        age: age ? Number(age) : null,
        rating: rating?.trim() || null,
        notes: notes?.trim() || null,
        status: regStatus,
      },
    });

    const spotsLeft = tournament.maxSpots
      ? Math.max(0, tournament.maxSpots - confirmedCount - (regStatus === "CONFIRMED" ? 1 : 0))
      : null;

    const eventDate = new Date(tournament.date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const typeLabel = tournament.type === "EVENT" ? "event" : "tournament";

    // ─── Send confirmation e-mail to registrant ───────────
    if (resend) {
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject: `✅ Registration ${regStatus === "WAITLISTED" ? "Waitlisted" : "Confirmed"} — ${tournament.title}`,
          html: buildRegistrantEmail({
            name: fullName,
            tournament: tournament.title,
            date: eventDate,
            location: `${tournament.location}${tournament.venue ? ` · ${tournament.venue}` : ""}`,
            type: typeLabel,
            status: regStatus,
            spotsLeft,
          }),
        });
      } catch (emailErr) {
        console.error("Failed to send registrant email:", emailErr);
      }

      // ─── Send notification to admin ─────────────────────
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: ADMIN_EMAIL,
          subject: `🎯 New Registration: ${fullName} → ${tournament.title}`,
          html: buildAdminEmail({
            name: fullName,
            email,
            phone,
            whatsApp: whatsApp || phone,
            age,
            rating,
            notes,
            tournament: tournament.title,
            date: eventDate,
            status: regStatus,
            totalRegistered: confirmedCount + (regStatus === "CONFIRMED" ? 1 : 0),
            maxSpots: tournament.maxSpots,
          }),
        });
      } catch (emailErr) {
        console.error("Failed to send admin email:", emailErr);
      }
    }

    // Build WhatsApp confirmation links
    const userWhatsAppNum = (whatsApp || phone).replace(/\D/g, "");
    const userWhatsAppMsg = encodeURIComponent(
      `✅ Hi ${fullName}! Your registration for *${tournament.title}* is ${regStatus === "WAITLISTED" ? "WAITLISTED" : "CONFIRMED"}.\n\n` +
        `📅 ${eventDate}\n📍 ${tournament.location}${tournament.venue ? ` · ${tournament.venue}` : ""}\n\n` +
        (spotsLeft !== null ? `🎯 ${spotsLeft} spot${spotsLeft !== 1 ? "s" : ""} remaining\n\n` : "") +
        `Thank you for registering with PiChess! ♟️`
    );

    const adminWhatsAppMsg = encodeURIComponent(
      `🎯 *New Registration Alert*\n\n` +
        `📋 *${tournament.title}*\n` +
        `👤 ${fullName}\n` +
        `📧 ${email}\n` +
        `📱 ${phone}\n` +
        (age ? `🎂 Age: ${age}\n` : "") +
        (rating ? `⭐ Rating: ${rating}\n` : "") +
        `\n✅ Status: ${regStatus}\n` +
        (tournament.maxSpots
          ? `📊 ${confirmedCount + (regStatus === "CONFIRMED" ? 1 : 0)}/${tournament.maxSpots} spots filled`
          : `📊 ${confirmedCount + (regStatus === "CONFIRMED" ? 1 : 0)} total registrations`)
    );

    return NextResponse.json({
      success: true,
      registration: {
        id: registration.id,
        status: regStatus,
        spotsLeft,
      },
      whatsApp: {
        userLink: `https://wa.me/${userWhatsAppNum}?text=${userWhatsAppMsg}`,
        adminLink: `https://wa.me/${ADMIN_WHATSAPP}?text=${adminWhatsAppMsg}`,
      },
    });
  } catch (err) {
    console.error("Registration failed:", err);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}

/* ─── Email Templates ──────────────────────────────────── */

function buildRegistrantEmail(data: {
  name: string;
  tournament: string;
  date: string;
  location: string;
  type: string;
  status: string;
  spotsLeft: number | null;
}) {
  const isWaitlisted = data.status === "WAITLISTED";
  return `
    <div style="max-width:600px;margin:0 auto;font-family:'Segoe UI',Arial,sans-serif;background:#0a0a0a;color:#fff;border-radius:16px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#c9a84c,#b8942f);padding:32px 24px;text-align:center;">
        <h1 style="margin:0;font-size:28px;color:#000;">♟️ PiChess</h1>
        <p style="margin:8px 0 0;font-size:14px;color:#000;opacity:0.7;">Registration ${isWaitlisted ? "Waitlisted" : "Confirmed"}</p>
      </div>
      <div style="padding:32px 24px;">
        <h2 style="font-size:22px;margin:0 0 8px;">Hi ${data.name}! ${isWaitlisted ? "⏳" : "🎉"}</h2>
        <p style="color:#aaa;font-size:14px;line-height:1.7;margin:0 0 24px;">
          ${isWaitlisted
            ? `You have been <strong style="color:#f59e0b;">waitlisted</strong> for the following ${data.type}. We'll notify you if a spot opens up!`
            : `Your registration for the following ${data.type} has been <strong style="color:#22c55e;">confirmed</strong>!`
          }
        </p>
        <div style="background:#111;border:1px solid #222;border-radius:12px;padding:20px;margin-bottom:24px;">
          <h3 style="margin:0 0 12px;font-size:18px;color:#c9a84c;">${data.tournament}</h3>
          <p style="margin:4px 0;font-size:14px;color:#888;">📅 ${data.date}</p>
          <p style="margin:4px 0;font-size:14px;color:#888;">📍 ${data.location}</p>
          ${data.spotsLeft !== null ? `<p style="margin:8px 0 0;font-size:13px;color:#666;">🎯 ${data.spotsLeft} spot${data.spotsLeft !== 1 ? "s" : ""} remaining</p>` : ""}
        </div>
        <p style="color:#666;font-size:13px;line-height:1.6;">
          If you have any questions, reply to this email or contact us on WhatsApp. We look forward to seeing you!
        </p>
      </div>
      <div style="background:#050505;padding:20px 24px;text-align:center;border-top:1px solid #1a1a1a;">
        <p style="margin:0;font-size:12px;color:#444;">© ${new Date().getFullYear()} PiChess Academy · Ghana's Premier Chess Platform</p>
      </div>
    </div>
  `;
}

function buildAdminEmail(data: {
  name: string;
  email: string;
  phone: string;
  whatsApp: string;
  age?: number;
  rating?: string;
  notes?: string;
  tournament: string;
  date: string;
  status: string;
  totalRegistered: number;
  maxSpots: number | null;
}) {
  return `
    <div style="max-width:600px;margin:0 auto;font-family:'Segoe UI',Arial,sans-serif;background:#fafafa;border-radius:16px;overflow:hidden;border:1px solid #e5e5e5;">
      <div style="background:#1a1a1a;padding:24px;text-align:center;">
        <h1 style="margin:0;font-size:20px;color:#c9a84c;">🎯 New Registration</h1>
        <p style="margin:4px 0 0;font-size:13px;color:#888;">${data.tournament}</p>
      </div>
      <div style="padding:24px;">
        <div style="background:#fff;border:1px solid #eee;border-radius:12px;padding:16px;margin-bottom:16px;">
          <h3 style="margin:0 0 12px;font-size:16px;color:#333;">Registrant Details</h3>
          <table style="width:100%;font-size:14px;color:#555;">
            <tr><td style="padding:4px 0;font-weight:600;">Name:</td><td>${data.name}</td></tr>
            <tr><td style="padding:4px 0;font-weight:600;">Email:</td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
            <tr><td style="padding:4px 0;font-weight:600;">Phone:</td><td>${data.phone}</td></tr>
            <tr><td style="padding:4px 0;font-weight:600;">WhatsApp:</td><td>${data.whatsApp}</td></tr>
            ${data.age ? `<tr><td style="padding:4px 0;font-weight:600;">Age:</td><td>${data.age}</td></tr>` : ""}
            ${data.rating ? `<tr><td style="padding:4px 0;font-weight:600;">Rating:</td><td>${data.rating}</td></tr>` : ""}
            ${data.notes ? `<tr><td style="padding:4px 0;font-weight:600;">Notes:</td><td>${data.notes}</td></tr>` : ""}
          </table>
        </div>
        <div style="background:#fff;border:1px solid #eee;border-radius:12px;padding:16px;">
          <p style="margin:0 0 4px;font-size:14px;">
            <strong>Status:</strong>
            <span style="color:${data.status === "WAITLISTED" ? "#f59e0b" : "#22c55e"};font-weight:600;">
              ${data.status}
            </span>
          </p>
          <p style="margin:0;font-size:14px;">
            <strong>Total Registered:</strong> ${data.totalRegistered}${data.maxSpots ? ` / ${data.maxSpots}` : ""}
          </p>
        </div>
      </div>
    </div>
  `;
}
