import { Hono } from 'hono'
import type { Env } from '../index'
import { protectRoute } from '../middleware/auth'

const memberApi = new Hono<{ Bindings: Env }>();

// Lindungi semua endpoint di bawah rute ini (Minimal harus login sebagai member)
memberApi.use('*', protectRoute('member'));

// Endpoint: Mengambil daftar proyek beserta progress milestone milik klien
memberApi.get('/my-projects', async (c) => {
  const db = c.env.DB;
  const kv = c.env.CACHE_KV;
  
  // payload.sub berisi user_id yang di-inject oleh token JWT saat login
  const payload = c.get('jwtPayload');
  const clientId = payload.sub;

  const cacheKey = `project_client_${clientId}`;

  // 1. Cek Data di KV Cache Terlebih Dahulu (Super Cepat)
  const cachedData = await kv.get(cacheKey, 'json');
  if (cachedData) {
    return c.json(cachedData);
  }

  // 2. Jika Cache Kosong, Ambil dari D1 Database
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

  // 3. Format Data Flat SQL menjadi JSON Tree / Bersarang
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
    // Jika proyek memiliki milestone (track_id tidak null)
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

  // 4. Simpan ke KV Cache selama 5 menit (300 detik) menggunakan waitUntil 
  // agar proses penyimpanan tidak menahan response ke klien
  c.executionCtx.waitUntil(
    kv.put(cacheKey, JSON.stringify(formattedProjects), { expirationTtl: 300 })
  );

  return c.json(formattedProjects);
});

export { memberApi };
