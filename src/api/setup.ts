import { Hono } from 'hono'
import type { Env } from '../index'
import { hashPassword } from '../services/crypto'

const setupApi = new Hono<{ Bindings: Env }>();

setupApi.post('/create-admin', async (c) => {
  const db = c.env.DB;
  const validSetupKey = c.env.SETUP_KEY; 
  
  const body = await c.req.json();
  const { setup_key, email, password, name } = body;

  // 1. Validasi Setup Key
  if (!validSetupKey || setup_key !== validSetupKey) {
    return c.json({ error: 'Akses Ditolak. Setup Key tidak valid.' }, 403);
  }

  // 2. Pastikan belum ada Admin (Hanya bisa dijalankan 1 kali)
  const existingAdmin = await db.prepare(
    "SELECT id FROM users WHERE role = 'admin' LIMIT 1"
  ).first();

  if (existingAdmin) {
    return c.json({ error: 'Akun Admin sudah ada di database.' }, 400);
  }

  if (!email || !password || !name) {
    return c.json({ error: 'Email, password, dan nama wajib diisi.' }, 400);
  }

  try {
    const id = crypto.randomUUID();
    const hashedPassword = await hashPassword(password);
    const crmData = JSON.stringify({ name: name, phone: "", company: "Internal Admin" });

    await db.prepare(
      `INSERT INTO users (id, email, password_hash, role, crm_data) VALUES (?, ?, ?, 'admin', ?)`
    ).bind(id, email, hashedPassword, crmData).run();

    return c.json({ success: true, message: 'Akun Admin pertama berhasil dibuat.' });
  } catch (error) {
    return c.json({ error: 'Terjadi kesalahan internal.' }, 500);
  }
});

export { setupApi };
