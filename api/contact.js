const RESEND_ENDPOINT = "https://api.resend.com/emails";
const RECIPIENT_EMAIL = "crownpitch2006@gmail.com";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "CrownClean <onboarding@resend.dev>";

function clean(value, maxLength = 2000) {
  return String(value || "").trim().slice(0, maxLength);
}

function escapeHtml(value) {
  return clean(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDetails(fields = {}) {
  return Object.entries(fields)
    .filter(([key]) => !["name", "phone", "message"].includes(key))
    .map(([key, value]) => `${key}: ${clean(value, 500)}`)
    .filter((line) => !line.endsWith(":"))
    .join("\n");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: "Email service is not configured" });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const fields = body.fields && typeof body.fields === "object" ? body.fields : {};
  const name = clean(body.name || fields.name, 160);
  const phone = clean(body.phone || fields.phone, 80);
  const message = clean(body.message || fields.message, 2000);
  const source = clean(body.source, 240);
  const extraDetails = formatDetails(fields);

  if (!name || !phone || !message || !source) {
    return res.status(400).json({ error: "Name, phone, message and source are required" });
  }

  const text = [
    "New CrownClean Enquiry",
    "",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Message: ${message}`,
    `Source: ${source}`,
    extraDetails ? `\nAdditional details:\n${extraDetails}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <h2>New CrownClean Enquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
    <p><strong>Message:</strong><br>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
    <p><strong>Source:</strong> ${escapeHtml(source)}</p>
    ${
      extraDetails
        ? `<h3>Additional details</h3><pre style="font-family:Arial,sans-serif;white-space:pre-wrap">${escapeHtml(extraDetails)}</pre>`
        : ""
    }
  `;

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "User-Agent": "crownclean-static-site/1.0",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [RECIPIENT_EMAIL],
      subject: "New CrownClean Enquiry",
      html,
      text,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    return res.status(502).json({
      error: "Failed to send enquiry",
      detail: data.message || data.error || "Resend rejected the request",
    });
  }

  return res.status(200).json({ ok: true });
}
