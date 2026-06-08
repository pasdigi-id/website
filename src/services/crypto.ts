// Menghasilkan salt acak sepanjang 16 byte
function generateSalt(): string {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return btoa(String.fromCharCode(...arr));
}

// Fungsi untuk mengenkripsi kata sandi saat pembuatan akun / update password
export async function hashPassword(password: string): Promise<string> {
  const salt = generateSalt();
  const encoder = new TextEncoder();
  
  const baseKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: 100000, // Standar keamanan yang direkomendasikan
      hash: "SHA-256"
    },
    baseKey,
    256 // Panjang hash yang diinginkan
  );

  const hashArray = Array.from(new Uint8Array(derivedBits));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Format penyimpanan di database: "salt:hash"
  return `${salt}:${hashHex}`;
}

// Fungsi untuk memverifikasi kata sandi saat pengguna login
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [salt, originalHash] = storedHash.split(':');
  if (!salt || !originalHash) return false;

  const encoder = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: 100000,
      hash: "SHA-256"
    },
    baseKey,
    256
  );

  const hashArray = Array.from(new Uint8Array(derivedBits));
  const currentHashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  // Bandingkan hash yang baru dihitung dengan hash yang ada di database
  return currentHashHex === originalHash;
}
