const express = require("express");
const nodemailer = require("nodemailer");
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

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} origin=${req.headers.origin}`);
  next();
});

app.post("/api/contact", async (req, res) => {
  console.log("CONTACT BODY:", req.body);
  const { name, email, subject, message } = req.body || {};

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: "Campos incompletos." });
  }

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return res.status(500).json({ message: "Servidor sin configuracion SMTP." });
  }

  try {
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
    console.error("Email send error:", error);
    return res.status(500).json({ message: "Error enviando correo." });
  }
});

app.listen(port, () => {
  console.log(`Servidor activo en http://localhost:${port}`);
});
