import { NextRequest, NextResponse } from "next/server";

interface BookingPayload {
  name: string;
  email: string;
  phone: string;
  address: string;
  preferredDate?: string;
  notes?: string;
  estimate: {
    surface: string;
    area: string;
    areaSqFt?: number;
    dimensions?: string;
    condition: string;
    service: string;
    costLow: number;
    costHigh: number;
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: BookingPayload = await req.json();

    if (!body.name || !body.email || !body.phone || !body.address) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const emailBody = [
      `NEW BOOKING REQUEST — New Day Power Wash`,
      ``,
      `CUSTOMER INFO`,
      `Name: ${body.name}`,
      `Email: ${body.email}`,
      `Phone: ${body.phone}`,
      `Address: ${body.address}`,
      body.preferredDate ? `Preferred Date: ${body.preferredDate}` : null,
      body.notes ? `Notes: ${body.notes}` : null,
      ``,
      `AI ESTIMATE DETAILS`,
      `Surface: ${body.estimate.surface}`,
      `Area: ${body.estimate.area}${body.estimate.dimensions ? ` (${body.estimate.dimensions})` : ""}`,
      `Condition: ${body.estimate.condition}`,
      `Service: ${body.estimate.service}`,
      `Estimated Cost: $${body.estimate.costLow} – $${body.estimate.costHigh}`,
    ]
      .filter(Boolean)
      .join("\n");

    const htmlBody = `
      <h2>New Booking Request</h2>
      <h3>Customer Info</h3>
      <table style="border-collapse:collapse;font-family:sans-serif;">
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Name</td><td>${body.name}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Email</td><td><a href="mailto:${body.email}">${body.email}</a></td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Phone</td><td><a href="tel:${body.phone}">${body.phone}</a></td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Address</td><td>${body.address}</td></tr>
        ${body.preferredDate ? `<tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Preferred Date</td><td>${body.preferredDate}</td></tr>` : ""}
        ${body.notes ? `<tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Notes</td><td>${body.notes}</td></tr>` : ""}
      </table>
      <h3>AI Estimate</h3>
      <table style="border-collapse:collapse;font-family:sans-serif;">
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Surface</td><td>${body.estimate.surface}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Area</td><td>${body.estimate.area}${body.estimate.dimensions ? ` (${body.estimate.dimensions})` : ""}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Condition</td><td>${body.estimate.condition}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Service</td><td>${body.estimate.service}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Est. Cost</td><td><strong>$${body.estimate.costLow} – $${body.estimate.costHigh}</strong></td></tr>
      </table>
    `;

    const ZOHO_SEND_URL = "https://mail.zoho.com/api/accounts/self/messages";
    const zohoToken = process.env.ZOHO_MAIL_TOKEN;

    if (zohoToken) {
      await fetch(ZOHO_SEND_URL, {
        method: "POST",
        headers: {
          Authorization: `Zoho-oauthtoken ${zohoToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromAddress: "info@newdaypowerwash.com",
          toAddress: "info@newdaypowerwash.com",
          subject: `Booking Request — ${body.estimate.surface} (${body.estimate.area}) — ${body.name}`,
          content: htmlBody,
          askReceipt: "no",
        }),
      });
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "New Day Power Wash <bookings@newdaypowerwash.com>",
          to: ["info@newdaypowerwash.com"],
          subject: `Booking Request — ${body.estimate.surface} (${body.estimate.area}) — ${body.name}`,
          html: htmlBody,
          text: emailBody,
        }),
      });
    }

    if (!zohoToken && !resendKey) {
      console.log("=== BOOKING REQUEST (no email provider configured) ===");
      console.log(emailBody);
      console.log("======================================================");
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Booking API error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
