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

type Comedian = {
  id: number;
  name: string;
  tagline?: string | null;
  image?: string | null;
};

type DayEvent = {
  id: number;
  title: string;
  event_date: string;
  start_time: string;
  end_time: string;
  color?: string | null;
  description?: string | null;
  comedians?: Comedian[];
};

function formatTimeDisplay(t: string) {
  if (!t) return "";
  const [hStr, mStr] = t.split(":");
  const h = Number(hStr),
    m = Number(mStr);
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

function normalizeEventIds(raw: unknown): number[] {
  let arr: unknown[] = [];

  if (Array.isArray(raw)) {
    arr = raw;
  } else if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed) {
      arr = [];
    } else if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        arr = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        arr = trimmed.split(",");
      }
    } else {
      arr = trimmed.split(",");
    }
  } else if (raw !== undefined && raw !== null) {
    arr = [raw];
  }

  const ids = arr
    .map((v) => Number(typeof v === "object" && v !== null ? (v as any).id : v))
    .filter((n) => Number.isInteger(n) && n > 0);

  return Array.from(new Set(ids));
}

function normalizeSelectedEvents(raw: unknown): DayEvent[] {
  let parsed: unknown = raw;

  if (typeof raw === "string") {
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = [];
    }
  }

  if (!Array.isArray(parsed)) return [];

  return parsed.filter(
    (ev): ev is DayEvent =>
      !!ev &&
      typeof ev === "object" &&
      "id" in ev &&
      "event_date" in ev &&
      "start_time" in ev &&
      "end_time" in ev,
  );
}

function generateEventsSectionHTML(selectedEvents: DayEvent[]) {
  if (!selectedEvents || selectedEvents.length === 0) {
    return "";
  }

  const eventsByDate = new Map<string, DayEvent[]>();
  selectedEvents.forEach((ev) => {
    const dateKey = ev.event_date.split("T")[0];
    if (!eventsByDate.has(dateKey)) {
      eventsByDate.set(dateKey, []);
    }
    eventsByDate.get(dateKey)!.push(ev);
  });

  // COMPACT: Reduced padding from 0 40px 36px to 0 24px 16px
  let eventsHTML = `
    <tr>
      <td style="padding:0 24px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(0,212,255,0.05);border:1px solid rgba(0,212,255,0.25);border-radius:12px;">
          <tr><td style="padding:14px 14px;">
            <p style="margin:0 0 12px;font-size:12px;font-weight:700;letter-spacing:0.5px;color:#00d4ff;">🎫 Selected Events (${selectedEvents.length})</p>`;

  Array.from(eventsByDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([dateKey, eventsForDay], dateIdx) => {
      const dateObj = new Date(dateKey + "T00:00:00");
      const formattedEventDate = dateObj.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });

      // COMPACT: Reduced margin from 18px 0 to 10px 0
      eventsHTML += `
            <p style="margin:${dateIdx === 0 ? "0" : "10px"} 0 8px;font-size:12px;font-weight:700;color:#00d4ff;">📅 ${formattedEventDate}</p>`;

      eventsForDay
        .sort((a, b) => a.start_time.localeCompare(b.start_time))
        .forEach((event) => {
          // COMPACT: Reduced padding from 16px to 12px, margin-bottom from 12px to 8px
          eventsHTML += `
            <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(0,180,255,0.08);border:1px solid rgba(0,212,255,0.25);border-radius:10px;margin-bottom:8px;">
              <tr><td style="padding:12px 12px 10px;">
                <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#ffffff;">${event.title}</p>
                <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.6);">⏱ ${formatTimeDisplay(event.start_time)} – ${formatTimeDisplay(event.end_time)}</p>`;

          if (event.comedians && event.comedians.length > 0) {
            // COMPACT: Reduced margins and padding
            eventsHTML += `
                <div style="height:1px;background:rgba(255,255,255,0.1);margin:8px 0;"></div>
                <p style="margin:0 0 8px;font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,0.4);">Performers</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>`;

            const colors = [
              "linear-gradient(135deg,#00d4ff,#0099cc)",
              "linear-gradient(135deg,#ff2d9b,#ff6b9d)",
              "linear-gradient(135deg,#22c55e,#16a34a)",
            ];

            event.comedians.forEach((comedian, idx) => {
              const initials = comedian.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase();
              const colorIndex = idx % colors.length;

              // COMPACT: Reduced size from 60px to 48px, margin from 8px to 6px
              const imageBlock = comedian.image
                ? `<img src="${comedian.image}" width="48" height="48" alt="${comedian.name}" style="display:block;width:48px;height:48px;border-radius:8px;object-fit:cover;border:1px solid rgba(0,212,255,0.35);margin:0 auto 6px;" />`
                : `<table cellpadding="0" cellspacing="0" style="margin:0 auto 6px;"><tr><td align="center" valign="middle" style="width:48px;height:48px;border-radius:8px;background:${colors[colorIndex]};border:1px solid rgba(255,255,255,0.1);"><span style="color:#fff;font-weight:700;font-size:12px;">${initials}</span></td></tr></table>`;

              eventsHTML += `
                    <td align="center" valign="top" style="padding:0 6px;">
                      ${imageBlock}
                      <span style="display:block;font-size:10px;font-weight:600;color:rgba(255,255,255,0.65);text-align:center;">${comedian.name}</span>
                    </td>`;
            });

            eventsHTML += `
                  </tr>
                </table>`;
          }

          eventsHTML += `
              </td></tr>
            </table>`;
        });
    });

  eventsHTML += `
          </td></tr>
        </table>
      </td>
    </tr>`;

  return eventsHTML;
}

async function sendEmails({
  name,
  email,
  phone,
  scheduledAt,
  selectedEvents = [],
}: {
  name: string;
  email: string;
  phone?: string;
  scheduledAt: string;
  selectedEvents?: DayEvent[];
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

  // COMPACT: Reduced width from 560px to 480px for better mobile display
  const baseTable = `width="480" cellpadding="0" cellspacing="0" style="background-color:#0d1220;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;"`;
  const neonBar = `  <tr>
                        <td style="height: 4px; background: linear-gradient(90deg, #ff2d9b, #c0157a, #ff2d9b); padding: 0;"></td>
                    </tr>`;
  const divider = `<tr><td style="padding:0 24px;"><div style="height:1px;background:linear-gradient(90deg,transparent,rgba(0,212,255,0.4),transparent);"></div></td></tr>`;
  const footer = `
    <tr><td style="height:1px;background:linear-gradient(90deg,transparent,rgba(255, 0, 204, 0.3),transparent);padding:0;"></td></tr>
    <tr>
      <td align="center" style="padding:16px 24px;">
        <p style="margin:0 0 2px;font-size:11px;color:rgba(255,255,255,0.2);">© ${new Date().getFullYear()} Rapture Comedy Bar & Cafe · Mon–Sat: 9AM–7PM</p>
        <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.2);">This is an automated message — please do not reply.</p>
      </td>
    </tr>`;

  const eventsHTML = generateEventsSectionHTML(selectedEvents);

  // ── Customer email ──────────────────────────────────────────
  await transporter.sendMail({
    from: `"Rapture Comedy Bar & Cafe" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Booking Request Received — Rapture Comedy Bar & Cafe",
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Booking Received – Rapture Comedy Bar & Cafe</title></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#070b14;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#070b14;padding:24px 16px;">
    <tr><td align="center">
      <table ${baseTable}>
        ${neonBar}

        <!-- Header -->
        <tr>
          <td align="center" style="padding:28px 24px 18px;">
            <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(255,45,155,0.12); border: 1px solid rgba(255,255,255,0.15); display: inline-block; line-height: 48px; text-align: center; margin-bottom: 14px;">
              <div style="width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #ff2d9b, #c0157a); display: inline-block; vertical-align: middle;"></div>
            </div>
            <p style="margin:0 0 2px;font-family:Georgia,serif;font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#ff2d9b;">Booking</p>
            <h1 style="margin:0 0 4px;font-family:Georgia,serif;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:1px;">Rapture Comedy Bar & Cafe</h1>
          </td>
        </tr>

        ${divider}

        <!-- Body -->
        <tr>
          <td style="padding:20px 24px;">
            <p style="margin:0 0 6px;font-size:15px;font-weight:600;color:#ffffff;">Hey ${name} 👋</p>
            <p style="margin:0 0 16px;font-size:13px;line-height:1.6;color:rgba(255,255,255,0.55);">
              We've received your booking request and we're excited to see you! Here are your booking details:
            </p>

            <!-- Details card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;margin-bottom:14px;">
              <tr><td style="padding:16px;">
                <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.3);">Your booking</p>

            ${eventsHTML}

            <!-- Notice box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(0,212,255,0.06);border:1px solid rgba(0,212,255,0.2);border-radius:10px;margin-bottom:14px;">
              <tr><td style="padding:12px 16px;">
                <p style="margin:0 0 2px;font-size:12px;font-weight:700;color:#00d4ff;">📅 What's next?</p>
                <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.4);line-height:1.5;">
                  We will contact you shortly to confirm your booking. If you need to reschedule or have any questions, simply reply to this email.
                </p>
              </td></tr>
            </table>

            <!-- Tips box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;">
              <tr><td style="padding:16px;">
                <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.3);">Pro tips for a great show</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:6px 0;width:24px;font-size:14px;">⏰</td>
                    <td style="padding:6px 0;font-size:12px;color:rgba(255,255,255,0.6);">Arrive 10–15 minutes early</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;font-size:14px;">🍿</td>
                    <td style="padding:6px 0;font-size:12px;color:rgba(255,255,255,0.6);">Pre-order drinks if available</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;font-size:14px;">📱</td>
                    <td style="padding:6px 0;font-size:12px;color:rgba(255,255,255,0.6);">Silence your phone during the show</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;font-size:14px;">😁</td>
                    <td style="padding:6px 0;font-size:12px;color:rgba(255,255,255,0.6);">Get ready to laugh — amazing show!</td>
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
    from: `"Rapture Comedy Bar & Cafe System" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: `New Booking — ${name}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>New Booking – Rapture Comedy Bar & Cafe</title></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#070b14;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#070b14;padding:24px 16px;">
    <tr><td align="center">
      <table ${baseTable}>
        ${neonBar}

        <!-- Header -->
        <tr>
          <td align="center" style="padding:28px 24px 18px;">
            <div style="width:48px;height:48px;border-radius:50%;background:rgba(0,212,255,0.12);border:1px solid rgba(255,255,255,0.15);display:inline-block;line-height:48px;text-align:center;margin-bottom:14px;">
              <div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#00d4ff,#0099cc);display:inline-block;vertical-align:middle;"></div>
            </div>
            <p style="margin:0 0 2px;font-family:Georgia,serif;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#00d4ff;">New Booking</p>
            <h1 style="margin:0 0 4px;font-family:Georgia,serif;font-size:24px;font-weight:700;color:#ffffff;letter-spacing:1px;">Rapture Comedy Bar & Cafe</h1>
            <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.4);">Admin Notification</p>
          </td>
        </tr>

        ${divider}

        <!-- Body -->
        <tr>
          <td style="padding:20px 24px;">
            <p style="margin:0 0 6px;font-size:14px;font-weight:600;color:#ffffff;">New booking submitted 📬</p>
            <p style="margin:0 0 14px;font-size:13px;line-height:1.6;color:rgba(255,255,255,0.55);">
              A new booking has just come in. Review the details below and confirm with the customer.
            </p>

            <!-- Customer details -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;margin-bottom:12px;">
              <tr><td style="padding:16px;">
                <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.3);">Customer Info</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:8px;border:1px solid rgba(255,255,255,0.08);font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,0.3);width:70px;">Name</td>
                    <td style="padding:8px;border:1px solid rgba(255,255,255,0.08);font-size:13px;color:#ffffff;font-weight:600;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px;border:1px solid rgba(255,255,255,0.08);font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,0.3);">Email</td>
                    <td style="padding:8px;border:1px solid rgba(255,255,255,0.08);font-size:13px;color:#00d4ff;">${email}</td>
                  </tr>
                  ${
                    phone
                      ? `
                  <tr>
                    <td style="padding:8px;border:1px solid rgba(255,255,255,0.08);font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,0.3);">Phone</td>
                    <td style="padding:8px;border:1px solid rgba(255,255,255,0.08);font-size:13px;color:#ffffff;">${phone}</td>
                  </tr>
                  `
                      : ""
                  }
                </table>
              </td></tr>
            </table>

            <!-- Booking details -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;margin-bottom:14px;">
              <tr><td style="padding:16px;">
                <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.3);">Booking Details</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:8px;border:1px solid rgba(255,255,255,0.08);font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,0.3);width:70px;">Date</td>
                    <td style="padding:8px;border:1px solid rgba(255,255,255,0.08);font-size:13px;color:#ffffff;font-weight:600;">${formattedDate}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px;border:1px solid rgba(255,255,255,0.08);font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,0.3);">Time</td>
                    <td style="padding:8px;border:1px solid rgba(255,255,255,0.08);font-size:13px;color:#00d4ff;font-weight:700;">${formattedTime}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px;border:1px solid rgba(255,255,255,0.08);font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,0.3);">Status</td>
                    <td style="padding:8px;border:1px solid rgba(255,255,255,0.08);">
                      <span style="background:rgba(0,212,255,0.12);border:1px solid rgba(0,212,255,0.3);color:#00d4ff;font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;letter-spacing:1px;text-transform:uppercase;">Pending</span>
                    </td>
                  </tr>
                </table>
              </td></tr>
            </table>

            ${
              selectedEvents.length > 0
                ? `
            <!-- Selected Events -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;margin-bottom:14px;">
              <tr><td style="padding:16px;">
                <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.3);">🎭 Selected Events (${selectedEvents.length})</p>
                <div style="space-y:6px;">
                  ${Array.from(
                    selectedEvents.reduce((acc, ev) => {
                      const dateKey = ev.event_date.split("T")[0];
                      if (!acc.has(dateKey)) acc.set(dateKey, []);
                      acc.get(dateKey)!.push(ev);
                      return acc;
                    }, new Map<string, DayEvent[]>()),
                  )
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([dateKey, eventsForDay]) => {
                      const dateObj = new Date(dateKey + "T00:00:00");
                      const formattedEventDate = dateObj.toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        },
                      );
                      return `
                        <div style="margin-bottom:10px;">
                          <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#00d4ff;letter-spacing:1px;">${formattedEventDate}</p>
                          ${eventsForDay
                            .sort((a, b) =>
                              a.start_time.localeCompare(b.start_time),
                            )
                            .map((event) => {
                              return `
                                <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(0,212,255,0.08);border:1px solid rgba(0,212,255,0.2);border-radius:6px;margin-bottom:6px;">
                                  <tr><td style="padding:10px;">
                                    <p style="margin:0 0 2px;font-size:11px;font-weight:700;color:#ffffff;">${event.title}</p>
                                    <p style="margin:0 0 6px;font-size:10px;color:rgba(255,255,255,0.6);">⏱️ ${formatTimeDisplay(event.start_time)} – ${formatTimeDisplay(event.end_time)}</p>
                                    ${
                                      event.comedians &&
                                      event.comedians.length > 0
                                        ? `
                                      <p style="margin:0;font-size:9px;font-weight:700;text-transform:uppercase;color:rgba(255,255,255,0.4);">Performers: ${event.comedians.map((c) => c.name).join(", ")}</p>
                                    `
                                        : ""
                                    }
                                  </td></tr>
                                </table>
                              `;
                            })
                            .join("")}
                        </div>
                      `;
                    })
                    .join("")}
                </div>
              </td></tr>
            </table>
            `
                : ""
            }

            <!-- Alert box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(0,212,255,0.06);border:1px solid rgba(0,212,255,0.2);border-radius:10px;">
              <tr><td style="padding:12px 16px;">
                <p style="margin:0 0 2px;font-size:12px;font-weight:700;color:#00d4ff;">⚡ Action required</p>
                <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.4);line-height:1.5;">
                  Please confirm or follow up with the customer within 24 hours of this request.
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
  return NextResponse.json({ message: "Booking endpoint" });
}

export async function POST(request: NextRequest) {
  try {
    const body = await parseBody(request);

    const {
      name,
      email,
      phone,
      booking_date,
      notes,
      event_ids: rawEventIds = [],
      selected_events: rawSelectedEvents = [],
    } = body;

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

    const eventIds = normalizeEventIds(rawEventIds);
    let parsedEvents: DayEvent[] = normalizeSelectedEvents(rawSelectedEvents);

    if (parsedEvents.length === 0 && eventIds.length > 0) {
      console.warn(
        "selected_events not provided — relying on Laravel's response (events.comedians) for email details.",
      );
    }

    const response = await fetch(`${API_URL}/api/booking`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        booking_date,
        notes,
        event_ids: eventIds,
      }),
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

    const eventsFromApi: DayEvent[] = Array.isArray(data?.data?.events)
      ? data.data.events
      : [];
    const finalSelectedEvents =
      eventsFromApi.length > 0 ? eventsFromApi : parsedEvents;

    try {
      await sendEmails({
        name,
        email,
        phone,
        scheduledAt: booking_date,
        selectedEvents: finalSelectedEvents,
      });
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