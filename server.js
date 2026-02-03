const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;
const allowedOrigin = process.env.FRONTEND_ORIGIN;

if (allowedOrigin) {
  app.use(cors({ origin: allowedOrigin }));
} else {
  app.use(cors());
}

app.use(express.json());
app.use(express.static(path.join(__dirname)));

<<<<<<< HEAD
const buildEmailText = ({ name, email, message }) =>
  `Nombre: ${name}\nEmail: ${email}\n\n${message}`;

const sendWithResend = async ({ name, email, subject, message }) => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const toEmail = process.env.TO_EMAIL || process.env.RESEND_TO;

  if (!apiKey || !from || !toEmail) {
    throw new Error("Servidor sin configuracion Resend.");
  }

  if (typeof fetch !== "function") {
    throw new Error("fetch no disponible. Usa Node 18+.");
  }

  const payload = {
    from,
    to: [toEmail],
    subject: `[Portfolio] ${subject}`,
    text: buildEmailText({ name, email, message }),
    reply_to: email,
  };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMessage = data?.message || `Resend error: ${response.status}`;
    throw new Error(errorMessage);
  }
};
=======
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} origin=${req.headers.origin}`);
  next();
});
>>>>>>> 3c72633b9f9271f94c29dd82bbe331c312beaac4

app.post("/api/contact", async (req, res) => {
  console.log("CONTACT BODY:", req.body);
  const { name, email, subject, message } = req.body || {};

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: "Campos incompletos." });
  }

  try {
<<<<<<< HEAD
    await sendWithResend({ name, email, subject, message });
    return res.json({ ok: true });
  } catch (error) {
    console.error("Email send error:", error);
    return res.status(500).json({ message: error?.message || "Error enviando correo." });
=======
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

  const toEmail = process.env.TO_EMAIL || process.env.SMTP_USER;
  const fromEmail = process.env.MAIL_FROM;
if (!fromEmail) {
  return res.status(500).json({ message: "Falta MAIL_FROM." });
}

await transporter.sendMail({
  from: `Portfolio Contact <${fromEmail}>`,
  to: toEmail,
  replyTo: email,
  subject: `[Portfolio] ${subject}`,
  text: `Nombre: ${name}\nEmail: ${email}\n\n${message}`,
});

    return res.json({ ok: true });
  } catch (error) {
  console.error("Email send error:", {
    message: error?.message,
    code: error?.code,
    command: error?.command,
    response: error?.response,
    responseCode: error?.responseCode,
    errno: error?.errno,
    syscall: error?.syscall,
    address: error?.address,
    port: error?.port,
    stack: error?.stack
    });
>>>>>>> 3c72633b9f9271f94c29dd82bbe331c312beaac4
  }


app.listen(port, () => {
  console.log(`Servidor activo en http://localhost:${port}`);
  });
})