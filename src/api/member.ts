import { Hono } from 'hono'
import type { Env } from '../index'
import { protectRoute } from '../middleware/auth'
import { hashPassword } from '../services/crypto'

const memberApi = new Hono<{ Bindings: Env }>();

memberApi.use('*', protectRoute('member'));

// -------------------------------------------------------------------
// 1. ENDPOINT: MENGAMBIL DAFTAR PROYEK & PROGRESS
// -------------------------------------------------------------------
memberApi.get('/my-projects', async (c) => {
  const db = c.env.DB;
  const kv = c.env.CACHE_KV;
  const payload = c.get('jwtPayload');
  const clientId = payload.sub;
  const cacheKey = `project_client_${clientId}`;

  const cachedData = await kv.get(cacheKey, 'json');
  if (cachedData) return c.json(cachedData);

  const query = `
    SELECT 
      p.id as project_id, p.title, p.status as project_status, p.end_date,
      pt.id as track_id, pt.title as task_title, pt.progress_percentage, pt.status as task_status, pt.notes_for_client
    FROM projects p
    LEFT JOIN project_tracks pt ON p.id = pt.project_id
    WHERE p.client_id = ?
    ORDER BY p.created_at DESC, pt.updated_at ASC
  `;
  
  const { results } = await db.prepare(query).bind(clientId).all();

  const formattedProjects = results.reduce((acc: any, row: any) => {
    let project = acc.find((p: any) => p.id === row.project_id);
    if (!project) {
      project = {
        id: row.project_id,
        title: row.title,
        status: row.project_status,
        end_date: row.end_date,
        tasks: []
      };
      acc.push(project);
    }
    if (row.track_id) {
      project.tasks.push({
        id: row.track_id,
        title: row.task_title,
        progress: row.progress_percentage,
        status: row.task_status,
        notes: row.notes_for_client
      });
    }
    return acc;
  }, []);

  c.executionCtx.waitUntil(kv.put(cacheKey, JSON.stringify(formattedProjects), { expirationTtl: 300 }));
  return c.json(formattedProjects);
});

// -------------------------------------------------------------------
// 2. ENDPOINT: MENGAMBIL DATA PROFIL SAYA
// -------------------------------------------------------------------
memberApi.get('/profile', async (c) => {
  const db = c.env.DB;
  const payload = c.get('jwtPayload');
  const userId = payload.sub;

  const user = await db.prepare(
    `SELECT email, role, crm_data FROM users WHERE id = ?`
  ).bind(userId).first();

  if (!user) return c.json({ error: 'Pengguna tidak ditemukan.' }, 404);
  return c.json(user);
});

// -------------------------------------------------------------------
// 3. ENDPOINT: MEMPERBARUI PROFIL & PASSWORD
// -------------------------------------------------------------------
memberApi.put('/profile', async (c) => {
  const db = c.env.DB;
  const payload = c.get('jwtPayload');
  const userId = payload.sub;
  
  // Tangkap semua field yang dikirim dari form frontend
  const { password, name, company, phone, address } = await c.req.json();

  try {
    // 1. Ambil data CRM lama untuk digabungkan dengan yang baru
    const user = await db.prepare("SELECT crm_data FROM users WHERE id = ?").bind(userId).first();
    let crmData: any = {};
    if (user && user.crm_data) {
      try { crmData = JSON.parse(user.crm_data as string); } catch(e){}
    }

    // 2. Perbarui nilai CRM jika ada inputan baru
    if (name !== undefined) crmData.name = name;
    if (company !== undefined) crmData.company = company;
    if (phone !== undefined) crmData.phone = phone;
    if (address !== undefined) crmData.address = address;

    const crmDataString = JSON.stringify(crmData);

    // 3. Simpan ke database (Cek apakah user ganti password juga atau hanya update profil)
    if (password) {
      const hashedPw = await hashPassword(password);
      await db.prepare(
        `UPDATE users SET password_hash = ?, crm_data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
      ).bind(hashedPw, crmDataString, userId).run();
    } else {
      await db.prepare(
        `UPDATE users SET crm_data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
      ).bind(crmDataString, userId).run();
    }
    
    return c.json({ success: true, message: 'Profil Anda berhasil diperbarui.' });
  } catch (error) {
    return c.json({ error: 'Gagal memperbarui profil. Terjadi kesalahan server.' }, 500);
  }
});

export { memberApi };
