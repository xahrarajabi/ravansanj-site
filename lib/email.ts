export async function sendEmail(opts: {
  to: string;
  subject: string;
  text: string;
}) {
  const host = process.env.EMAIL_HOST;
  if (!host) {
    console.log(`[Mizoon DEV EMAIL] to=${opts.to} subject=${opts.subject}\n${opts.text}`);
    return;
  }

  // Minimal SMTP via raw fetch isn't available; use nodemailer-less console + optional API
  // For production, install nodemailer when EMAIL_HOST is set — stub uses console until package added.
  console.log(
    `[Mizoon EMAIL via ${host}] to=${opts.to} from=${process.env.EMAIL_FROM} subject=${opts.subject}`
  );
}
