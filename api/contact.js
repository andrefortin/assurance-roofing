import nodemailer from "nodemailer";

const RECIPIENT_EMAIL = "calvinbuysandsells@gmail.com";
const TEST_EMAIL = "twindual@gmail.com";

/**
 * POST /api/contact — sends contact form submission via email
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, phone, service, message } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  try {
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpPort = parseInt(process.env.SMTP_PORT || "587");

    let transporter;

    if (smtpHost && smtpUser && smtpPass) {
      transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });
    } else {
      // Fallback to Ethereal for testing
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });
    }

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #E8890C; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Assurance Roofing</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 4px 0 0; font-size: 14px;">New Contact Form Submission</p>
        </div>
        <div style="background: #f9f9f9; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e5e5; border-top: none;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666; font-size: 14px; width: 35%;">Name</td><td style="padding: 8px 0; font-weight: bold; font-size: 14px;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #666; font-size: 14px;">Email</td><td style="padding: 8px 0; font-weight: bold; font-size: 14px;">${email}</td></tr>
            <tr><td style="padding: 8px 0; color: #666; font-size: 14px;">Phone</td><td style="padding: 8px 0; font-weight: bold; font-size: 14px;">${phone || "—"}</td></tr>
            <tr><td style="padding: 8px 0; color: #666; font-size: 14px;">Service</td><td style="padding: 8px 0; font-weight: bold; font-size: 14px;">${service || "—"}</td></tr>
            <tr><td style="padding: 8px 0; color: #666; font-size: 14px;">Message</td><td style="padding: 8px 0; font-weight: bold; font-size: 14px;">${message || "—"}</td></tr>
          </table>
          <div style="margin-top: 20px; padding: 12px; background: #fff8f0; border-radius: 6px; border-left: 4px solid #E8890C;">
            <p style="margin: 0; font-size: 13px; color: #666;">Form submitted via assuranceroofingus.com. Please respond within 2 hours.</p>
          </div>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"Assurance Roofing" <noreply@assuranceroofingus.com>`,
      to: RECIPIENT_EMAIL,
      bcc: TEST_EMAIL,
      subject: `New Roofing Inquiry: ${name} — ${phone || "No phone"} — ${service || "Unspecified service"}`,
      html: htmlBody,
    });

    console.log("[Email] Contact notification sent:", info.messageId);

    return res.status(200).json({
      success: true,
      message: "Your request has been received. We'll contact you within 2 hours.",
    });
  } catch (err) {
    console.error("[Email] Failed to send:", err);
    return res.status(500).json({
      error: "Failed to send your request. Please call us at (919) 520-8118 instead.",
    });
  }
}
