import type { Env } from '../index'

// Fungsi untuk mengunggah file ke Cloudflare R2
export const uploadFileToR2 = async (env: Env, file: File, folder: string = 'uploads'): Promise<string | null> => {
  try {
    // Buat nama file unik untuk menghindari bentrok nama
    const fileExtension = file.name.split('.').pop() || 'bin';
    const uniqueFileName = `${folder}/${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;
    
    // Konversi file ke ArrayBuffer untuk diunggah
    const arrayBuffer = await file.arrayBuffer();

    // Lakukan operasi PUT ke R2 Bucket
    await env.ASSETS_R2.put(uniqueFileName, arrayBuffer, {
      httpMetadata: {
        contentType: file.type || 'application/octet-stream',
        // Set Cache-Control agar gambar di-cache oleh browser/CDN selama 1 Tahun
        cacheControl: 'public, max-age=31536000, immutable',
      }
    });

    // Sesuaikan domain publik R2 Anda. 
    // Anda bisa mengaturnya di dashboard Cloudflare (R2 -> Settings -> Custom Domains)
    const PUBLIC_R2_URL = 'https://assets.namadomainanda.com'; 
    return `${PUBLIC_R2_URL}/${uniqueFileName}`;
  } catch (error) {
    console.error('Gagal mengunggah ke R2:', error);
    return null;
  }
}
