// Fungsi untuk memvalidasi token Turnstile ke server Cloudflare
export const verifyTurnstileToken = async (
  token: string, 
  secretKey: string, 
  ip?: string
): Promise<boolean> => {
  // Jika tidak ada token sama sekali, langsung tolak
  if (!token) return false;

  const formData = new FormData();
  formData.append('secret', secretKey);
  formData.append('response', token);
  
  // IP opsional, namun sangat disarankan untuk akurasi deteksi bot Cloudflare
  if (ip) {
    formData.append('remoteip', ip);
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json() as { success: boolean; 'error-codes': string[] };
    
    // Kembalikan status sukses (true/false)
    return data.success;
  } catch (error) {
    console.error('Terjadi kesalahan saat memvalidasi Turnstile:', error);
    return false;
  }
}
