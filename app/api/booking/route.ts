import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getApiUrl } from "@/lib/api-url";

const API_URL = getApiUrl();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmails({
  name,
  email,
  scheduledAt,
}: {
  name: string;
  email: string;
  scheduledAt: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

  const formattedDate = new Date(scheduledAt).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = new Date(scheduledAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const baseTable = `width="560" cellpadding="0" cellspacing="0" style="background-color:#0d1220;border:1px solid rgba(255,255,255,0.08);border-radius:20px;overflow:hidden;"`;
  const neonBar = `<tr><td style="height:4px;background:linear-gradient(90deg,#00d4ff,#0099cc,#00d4ff);padding:0;"></td></tr>`;
  const divider = `<tr><td style="padding:0 40px;"><div style="height:1px;background:linear-gradient(90deg,transparent,rgba(0,212,255,0.4),transparent);"></div></td></tr>`;
  const footer = `
    <tr><td style="height:1px;background:linear-gradient(90deg,transparent,rgba(0,212,255,0.3),transparent);padding:0;"></td></tr>
    <tr>
      <td align="center" style="padding:28px 40px;">
        <p style="margin:0 0 4px;font-size:12px;color:rgba(255,255,255,0.2);">© ${new Date().getFullYear()} Rapture Commedy Bar & Cafe · Mon–Sat: 9AM–7PM</p>
        <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.2);">This is an automated message — please do not reply.</p>
      </td>
    </tr>`;

  // ── Customer email ──────────────────────────────────────────
  await transporter.sendMail({
    from: `"Rapture Comedy Bar & Cafe" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Appointment Request Received — Rapture Comedy Bar & Cafe",
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Appointment Received – Rapture Comedy Bar & Cafe</title></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#070b14;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#070b14;padding:40px 20px;">
    <tr><td align="center">
      <table ${baseTable}>
        ${neonBar}

        <!-- Header -->
        <tr>
          <td align="center" style="padding:48px 40px 32px;">
            <div style="width:64px;height:64px;border-radius:50%;background:rgba(0,212,255,0.12);border:1px solid rgba(255,255,255,0.15);display:inline-block;line-height:64px;text-align:center;margin-bottom:20px;">
              <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#00d4ff,#0099cc);display:inline-block;vertical-align:middle;"></div>
            </div>
            <p style="margin:0 0 4px;font-family:Georgia,serif;font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#00d4ff;">Appointment</p>
            <h1 style="margin:0 0 8px;font-family:Georgia,serif;font-size:36px;font-weight:700;color:#ffffff;letter-spacing:1px;">Rapture Commedy Bar & Cafe</h1>
            <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.4);">& Aesthetic Clinic</p>
          </td>
        </tr>

        ${divider}

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 8px;font-size:18px;font-weight:600;color:#ffffff;">Hey ${name} 👋</p>
            <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:rgba(255,255,255,0.55);">
              We've received your appointment request and we're excited to see you! Here are your booking details:
            </p>

            <!-- Details card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;margin-bottom:24px;">
              <tr><td style="padding:24px;">
                <p style="margin:0 0 16px;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.3);">Your Appointment</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:10px;border:1px solid rgba(255,255,255,0.08);border-radius:8px 0 0 0;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,0.3);width:80px;">Date</td>
                    <td style="padding:10px;border:1px solid rgba(255,255,255,0.08);font-size:14px;color:#ffffff;font-weight:600;">${formattedDate}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px;border:1px solid rgba(255,255,255,0.08);font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,0.3);">Time</td>
                    <td style="padding:10px;border:1px solid rgba(255,255,255,0.08);font-size:14px;color:#00d4ff;font-weight:700;">${formattedTime}</td>
                  </tr>
                </table>
              </td></tr>
            </table>

            <!-- Notice box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(0,212,255,0.06);border:1px solid rgba(0,212,255,0.2);border-radius:12px;">
              <tr><td style="padding:16px 20px;">
                <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#00d4ff;">📅 What's next?</p>
                <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.4);line-height:1.6;">
                  We will contact you shortly to confirm your appointment. If you need to reschedule or have any questions, simply reply to this email.
                </p>
              </td></tr>
            </table>
          </td>
        </tr>

        <!-- What to expect -->
        <tr>
          <td style="padding:0 40px 36px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;">
              <tr><td style="padding:24px;">
                <p style="margin:0 0 16px;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.3);">What to bring</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:8px 0;width:28px;font-size:16px;">🪥</td>
                    <td style="padding:8px 0;font-size:14px;color:rgba(255,255,255,0.6);">Arrive 5–10 minutes before your schedule</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;font-size:16px;">📋</td>
                    <td style="padding:8px 0;font-size:14px;color:rgba(255,255,255,0.6);">Any previous dental records if available</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;font-size:16px;">💊</td>
                    <td style="padding:8px 0;font-size:14px;color:rgba(255,255,255,0.6);">List of current medications if applicable</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;font-size:16px;">😁</td>
                    <td style="padding:8px 0;font-size:14px;color:rgba(255,255,255,0.6);">Your brightest smile — we'll make it brighter!</td>
                  </tr>
                </table>
              </td></tr>
            </table>
          </td>
        </tr>

        ${footer}
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });

  // ── Admin email ─────────────────────────────────────────────
  await transporter.sendMail({
    from: `"Rapture Commedy Bar & Cafe System" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: `New Appointment — ${name}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>New Appointment – Rapture Commedy Bar & Cafe</title></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#070b14;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#070b14;padding:40px 20px;">
    <tr><td align="center">
      <table ${baseTable}>
        ${neonBar}

        <!-- Header -->
        <tr>
          <td align="center" style="padding:48px 40px 32px;">
            <div style="width:64px;height:64px;border-radius:50%;background:rgba(0,212,255,0.12);border:1px solid rgba(255,255,255,0.15);display:inline-block;line-height:64px;text-align:center;margin-bottom:20px;">
              <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#00d4ff,#0099cc);display:inline-block;vertical-align:middle;"></div>
            </div>
            <p style="margin:0 0 4px;font-family:Georgia,serif;font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#00d4ff;">New Booking</p>
            <h1 style="margin:0 0 8px;font-family:Georgia,serif;font-size:36px;font-weight:700;color:#ffffff;letter-spacing:1px;">Rapture Commedy Bar & Cafe</h1>
            <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.4);">Admin Notification</p>
          </td>
        </tr>

        ${divider}

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 8px;font-size:18px;font-weight:600;color:#ffffff;">New appointment submitted 📬</p>
            <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:rgba(255,255,255,0.55);">
              A new booking has just come in. Review the details below and confirm with the patient.
            </p>

            <!-- Patient details -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;margin-bottom:16px;">
              <tr><td style="padding:24px;">
                <p style="margin:0 0 16px;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.3);">Patient Info</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:10px;border:1px solid rgba(255,255,255,0.08);font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,0.3);width:80px;">Name</td>
                    <td style="padding:10px;border:1px solid rgba(255,255,255,0.08);font-size:14px;color:#ffffff;font-weight:600;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px;border:1px solid rgba(255,255,255,0.08);font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,0.3);">Email</td>
                    <td style="padding:10px;border:1px solid rgba(255,255,255,0.08);font-size:14px;color:#00d4ff;">${email}</td>
                  </tr>
                </table>
              </td></tr>
            </table>

            <!-- Appointment details -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;margin-bottom:24px;">
              <tr><td style="padding:24px;">
                <p style="margin:0 0 16px;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.3);">Appointment Details</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:10px;border:1px solid rgba(255,255,255,0.08);font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,0.3);width:80px;">Date</td>
                    <td style="padding:10px;border:1px solid rgba(255,255,255,0.08);font-size:14px;color:#ffffff;font-weight:600;">${formattedDate}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px;border:1px solid rgba(255,255,255,0.08);font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,0.3);">Time</td>
                    <td style="padding:10px;border:1px solid rgba(255,255,255,0.08);font-size:14px;color:#00d4ff;font-weight:700;">${formattedTime}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px;border:1px solid rgba(255,255,255,0.08);font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,0.3);">Status</td>
                    <td style="padding:10px;border:1px solid rgba(255,255,255,0.08);">
                      <span style="background:rgba(0,212,255,0.12);border:1px solid rgba(0,212,255,0.3);color:#00d4ff;font-size:12px;font-weight:700;padding:3px 10px;border-radius:999px;letter-spacing:1px;text-transform:uppercase;">Pending</span>
                    </td>
                  </tr>
                </table>
              </td></tr>
            </table>

            <!-- Alert box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(0,212,255,0.06);border:1px solid rgba(0,212,255,0.2);border-radius:12px;">
              <tr><td style="padding:16px 20px;">
                <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#00d4ff;">⚡ Action required</p>
                <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.4);line-height:1.6;">
                  Please confirm or follow up with the patient within 24 hours of this request.
                </p>
              </td></tr>
            </table>
          </td>
        </tr>

        ${footer}
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}

async function parseBody(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const body: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      if (!(value instanceof File)) body[key] = value;
    }
    return body;
  }
  return await request.json();
}

export async function GET() {
  return NextResponse.json({ message: "Appointment booking endpoint" });
}

export async function POST(request: NextRequest) {
  try {
    const body = await parseBody(request);

    // Validate required fields matching the frontend payload
    const { name, email, phone, booking_date, notes } = body;

    if (!name || !email || !booking_date) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide name, email, and booking_date.",
        },
        { status: 400 },
      );
    }

    if (!API_URL) {
      return NextResponse.json(
        { success: false, message: "NEXT_PUBLIC_API_URL is not configured." },
        { status: 500 },
      );
    }

    // Forward to Laravel — field names match BookingController@store expectations
    const response = await fetch(`${API_URL}/api/booking`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, phone, booking_date, notes }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to create booking.",
          details: data,
        },
        { status: response.status },
      );
    }

    // Send confirmation emails
    try {
      await sendEmails({ name, email, scheduledAt: booking_date });
      console.log(`📧 Emails sent to ${email} and admin`);
    } catch (emailErr: any) {
      console.error("Email sending failed:", emailErr?.message || emailErr);
      console.error("SMTP config:", {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS ? "SET" : "NOT SET",
        admin: process.env.ADMIN_EMAIL,
      });
    }

    return NextResponse.json(
      { success: true, ...data },
      { status: response.status },
    );
  } catch (error) {
    console.error("Booking proxy error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to create booking.",
      },
      { status: 500 },
    );
  }
}
