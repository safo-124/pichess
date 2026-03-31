import { NextRequest, NextResponse } from "next/server";
import { confirmRegistrationAndGetWhatsApp } from "@/lib/actions/admin";

/**
 * POST /api/tournament-register/confirm
 * Body: { registrationId: number }
 * Confirms a registration and returns a WhatsApp link for the admin to send.
 */
export async function POST(req: NextRequest) {
  try {
    const { registrationId } = await req.json();

    if (!registrationId) {
      return NextResponse.json({ error: "registrationId is required" }, { status: 400 });
    }

    const result = await confirmRegistrationAndGetWhatsApp(Number(registrationId));

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (err) {
    console.error("Confirm registration failed:", err);
    return NextResponse.json(
      { error: "Failed to confirm registration" },
      { status: 500 }
    );
  }
}
