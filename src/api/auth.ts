import { Hono } from 'hono'
import { sign } from 'hono/jwt'
import { setCookie } from 'hono/cookie'
import type { Env } from '../index'
import { verifyPassword } from '../services/crypto'

const authApi = new Hono<{ Bindings: Env }>();

// Endpoint Login
authApi.post('/login', async (c) => {
  const db = c.env.DB;
  const jwtSecret = c.env.JWT_SECRET;
  
  const { email, password } = await c.req.json();

  if (!email || !password) {
    return c.json({ error: 'Email dan kata sandi wajib diisi.' }, 400);
  }

  // 1. Cari pengguna di Database
  const user = await db.prepare(
    'SELECT id, password_hash, role FROM users WHERE email = ?'
  ).bind(email).first();

  if (!user) {
    return c.json({ error: 'Email atau kata sandi salah.' }, 401);
  }

  // 2. Verifikasi Kata Sandi (PBKDF2)
  const isValid = await verifyPassword(password, user.password_hash as string);
  
  if (!isValid) {
    return c.json({ error: 'Email atau kata sandi salah.' }, 401);
  }

  // 3. Buat Payload JWT
  const payload = {
    sub: user.id,
    role: user.role, // 'admin' atau 'member'
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // Kadaluarsa dalam 24 Jam
  };

  // 4. Tanda tangani token secara eksplisit dengan HS256
  const token = await sign(payload, jwtSecret, 'HS256');

  // 5. Simpan ke Cookie dengan pengamanan maksimal
  setCookie(c, 'auth_token', token, {
    path: '/',
    secure: true,       // Wajib HTTPS
    httpOnly: true,     // Tidak bisa dibaca via document.cookie di Javascript
    sameSite: 'Strict', // Mencegah serangan CSRF
    maxAge: 86400,      // 24 Jam
  });

  return c.json({ 
    success: true, 
    role: user.role,
    message: 'Login berhasil.'
  });
});

// Endpoint Logout
authApi.post('/logout', (c) => {
  // Hapus cookie dengan mengatur maxAge ke 0
  setCookie(c, 'auth_token', '', { path: '/', maxAge: 0 });
  return c.json({ success: true, message: 'Berhasil keluar.' });
});

export { authApi };
