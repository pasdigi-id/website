import { Hono } from 'hono'
import { sign } from 'hono/jwt'
import { setCookie, deleteCookie } from 'hono/cookie' // KOREKSI: Import deleteCookie
import type { Env } from '../index'
import { verifyPassword, hashPassword } from '../services/crypto'

const authApi = new Hono<{ Bindings: Env }>();

// ----------------------------------------------------
// 1. ENDPOINT REGISTRASI
// ----------------------------------------------------
authApi.post('/register', async (c) => {
  const db = c.env.DB;
  const { email, password, name, company } = await c.req.json();

  if (!email || !password) {
    return c.json({ error: 'Email dan password wajib diisi.' }, 400);
  }

  try {
    const existingUser = await db.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
    if (existingUser) {
      return c.json({ error: 'Email tersebut sudah terdaftar di sistem kami.' }, 400);
    }

    const id = crypto.randomUUID();
    const hashedPassword = await hashPassword(password);
    
    const crmData = JSON.stringify({ name, company });

    await db.prepare(
      "INSERT INTO users (id, email, password_hash, role, crm_data) VALUES (?, ?, ?, ?, ?)"
    ).bind(id, email, hashedPassword, 'member', crmData).run();

    return c.json({ success: true, message: 'Registrasi berhasil. Silakan login.' });
  } catch (err) {
    return c.json({ error: 'Terjadi kesalahan internal.' }, 500);
  }
});

// ----------------------------------------------------
// 2. ENDPOINT LOGIN
// ----------------------------------------------------
authApi.post('/login', async (c) => {
  const db = c.env.DB;
  const jwtSecret = c.env.JWT_SECRET;
  
  const { email, password } = await c.req.json();

  if (!email || !password) {
    return c.json({ error: 'Email dan kata sandi wajib diisi.' }, 400);
  }

  const user = await db.prepare(
    'SELECT id, password_hash, role FROM users WHERE email = ?'
  ).bind(email).first();

  if (!user) {
    return c.json({ error: 'Email atau kata sandi salah.' }, 401);
  }

  const isValid = await verifyPassword(password, user.password_hash as string);
  
  if (!isValid) {
    return c.json({ error: 'Email atau kata sandi salah.' }, 401);
  }

  const payload = {
    sub: user.id,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, 
  };

  const token = await sign(payload, jwtSecret, 'HS256');

  setCookie(c, 'auth_token', token, {
    path: '/',
    secure: true,       
    httpOnly: true,     
    sameSite: 'Strict', 
    maxAge: 86400,      
  });

  return c.json({ 
    success: true, 
    role: user.role,
    message: 'Login berhasil.'
  });
});

// ----------------------------------------------------
// 3. ENDPOINT LOGOUT (KOREKSI MUTLAK)
// ----------------------------------------------------
authApi.post('/logout', (c) => {
  // Wajib menyertakan secure dan sameSite yang identik dengan saat login
  // agar peramban (Chrome/Safari/Edge) mengizinkan penghancuran cookie ini.
  deleteCookie(c, 'auth_token', { 
    path: '/',
    secure: true,
    sameSite: 'Strict'
  });
  
  return c.json({ success: true, message: 'Berhasil keluar dan sesi dihancurkan.' });
});

export { authApi };
