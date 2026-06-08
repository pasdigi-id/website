import type { Env } from '../index'

// Fungsi modular untuk mengirim email transaksional
export const sendEmail = async (env: Env, to: string, subject: string, htmlContent: string): Promise<boolean> => {
  const BREVO_API_KEY = env.BREVO_API_KEY;

  if (!BREVO_API_KEY) {
    console.error("API Key Brevo tidak ditemukan di environment variables.");
    return false;
  }

  const payload = {
    sender: { name: 'Pasdigi Support', email: 'noreply@pasdigi.id' },
    to: [{ email: to }],
    subject: subject,
    htmlContent: htmlContent
  };

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Brevo API Error:', errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Gagal menghubungi Brevo API:', error);
    return false;
  }
}
