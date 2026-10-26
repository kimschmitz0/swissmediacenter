import nodemailer from "nodemailer";

// Sends contact-form messages through the site's own mailbox. The recipient address and
// credentials live only in server environment variables, never in the page sent to visitors.

const LIMITS = { name: 100, email: 200, messageMin: 10, messageMax: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  // Honeypot: the field is hidden from people, so only bots fill it. Pretend success.
  if (data.company) return Response.json({ ok: true });

  const name = String(data.name ?? "").replace(/[\r\n]+/g, " ").trim();
  const email = String(data.email ?? "").trim();
  const message = String(data.message ?? "").trim();

  if (
    !name ||
    name.length > LIMITS.name ||
    email.length > LIMITS.email ||
    !EMAIL_RE.test(email) ||
    message.length < LIMITS.messageMin ||
    message.length > LIMITS.messageMax
  ) {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_TO) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[contact] SMTP not configured; message not sent:", { name, email, message });
      return Response.json({ ok: true });
    }
    console.error("[contact] SMTP is not configured");
    return Response.json({ error: "unavailable" }, { status: 503 });
  }

  const port = Number(SMTP_PORT || 465);
  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  try {
    await transport.sendMail({
      from: { name: "Swiss Media Center – formularz", address: SMTP_USER },
      to: CONTACT_TO,
      replyTo: { name, address: email },
      subject: `Nowa wiadomość ze strony od: ${name}`,
      text: `Imię: ${name}\nE-mail: ${email}\n\n${message}`,
    });
  } catch (err) {
    console.error("[contact] sending failed", err);
    return Response.json({ error: "send" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
