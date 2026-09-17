/**
 * SMS provider abstraction.
 * Default adapter: Kavenegar. Swap `getSmsProvider()` to change providers later.
 */

export type SmsMessage = {
  to: string;
  text: string;
};

export interface SmsProvider {
  readonly name: string;
  send(message: SmsMessage): Promise<void>;
}

class ConsoleSmsProvider implements SmsProvider {
  readonly name = "console";
  async send(message: SmsMessage): Promise<void> {
    console.log(`[Mizoon DEV SMS] to=${message.to}\n${message.text}`);
  }
}

class KavenegarSmsProvider implements SmsProvider {
  readonly name = "kavenegar";
  constructor(
    private apiKey: string,
    private sender?: string
  ) {}

  async send(message: SmsMessage): Promise<void> {
    const url = `https://api.kavenegar.com/v1/${this.apiKey}/sms/send.json`;
    const body = new URLSearchParams({
      receptor: message.to,
      message: message.text,
      ...(this.sender ? { sender: this.sender } : {}),
    });
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Kavenegar error: ${res.status} ${text}`);
    }
  }
}

export function getSmsProvider(): SmsProvider {
  const apiKey = process.env.SMS_API_KEY || process.env.KAVENEGAR_API_KEY;
  const sender = process.env.SMS_SENDER || process.env.KAVENEGAR_SENDER;
  if (!apiKey) return new ConsoleSmsProvider();
  return new KavenegarSmsProvider(apiKey, sender || undefined);
}

export function smsInDevMode() {
  return getSmsProvider().name === "console";
}

export async function sendOtpSms(phone: string, code: string): Promise<void> {
  const brand = process.env.APP_NAME || "روان‌سنج";
  await getSmsProvider().send({
    to: phone,
    text: `کد ورود ${brand}: ${code}`,
  });
}

/** Generic transactional SMS (invites, etc.) — not OTP-prefixed */
export async function sendTransactionalSms(phone: string, text: string): Promise<void> {
  await getSmsProvider().send({ to: phone, text });
}
