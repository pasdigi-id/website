// Fungsi untuk membuat Tracking ID Kontak dengan format: PM-YYYYMMDDHHmmss
export function generateWibTrackingId(): string {
  const now = new Date();
  
  // Waktu standar adalah UTC. Tambahkan 7 jam (dalam milidetik) untuk mengkonversi ke WIB (UTC+7)
  const wibTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
  
  // Mengambil komponen waktu
  const year = wibTime.getUTCFullYear();
  
  // getUTCMonth dimulai dari 0 (Januari = 0), jadi ditambah 1. padStart memastikan format 2 digit (misal: 05)
  const month = String(wibTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(wibTime.getUTCDate()).padStart(2, '0');
  
  const hours = String(wibTime.getUTCHours()).padStart(2, '0');
  const minutes = String(wibTime.getUTCMinutes()).padStart(2, '0');
  const seconds = String(wibTime.getUTCSeconds()).padStart(2, '0');
  
  // Merangkai hasil akhir
  return `PM-${year}${month}${day}${hours}${minutes}${seconds}`;
}
