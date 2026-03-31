import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

/**
 * Generates a QR code PNG for a tournament registration URL.
 * GET /api/tournament-qr?tournamentId=5
 * Returns the QR code as a PNG image.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tournamentId = searchParams.get("tournamentId");

  if (!tournamentId) {
    return NextResponse.json({ error: "tournamentId is required" }, { status: 400 });
  }

  const proto = req.headers.get("x-forwarded-proto") || "https";
  const host = req.headers.get("host") || "pichess.net";
  const registrationUrl = `${proto}://${host}/register/${tournamentId}`;

  try {
    const qrDataUrl = await QRCode.toDataURL(registrationUrl, {
      width: 512,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
      errorCorrectionLevel: "M",
    });

    return NextResponse.json({
      dataUrl: qrDataUrl,
      registrationUrl,
      tournamentId: Number(tournamentId),
    });
  } catch {
    return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 });
  }
}
