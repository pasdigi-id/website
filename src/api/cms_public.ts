import { Hono } from 'hono'
import type { Env } from '../index'

const publicCmsApi = new Hono<{ Bindings: Env }>();

// Fungsi Helper untuk memetakan Tipe ke Tabel yang tepat
const getTableName = (type: string) => {
  switch(type) {
    case 'page': return 'pages';
    case 'blog': return 'blogs';
    case 'service': return 'services';
    case 'portfolio': return 'portfolios';
    default: return null;
  }
}

// 1. Ambil List Konten (Untuk halaman Archive)
publicCmsApi.get('/list/:type', async (c) => {
  const db = c.env.DB;
  const kv = c.env.CACHE_KV;
  const type = c.req.param('type');
  
  const tableName = getTableName(type);
  if (!tableName) return c.json({ error: 'Tipe konten tidak valid.' }, 400);

  const cacheKey = `public_list_${type}`;
  const cachedList = await kv.get(cacheKey, 'json');
  if (cachedList) return c.json(cachedList);

  // Menggunakan pemilihan kolom secara dinamis sesuai ketersediaan tabel
  let query = '';
  if (type === 'blog' || type === 'portfolio') {
    query = `SELECT id, title, slug, cover_image_url FROM ${tableName} WHERE status = 'published' ORDER BY id DESC LIMIT 20`;
  } else {
    query = `SELECT id, title, slug FROM ${tableName} WHERE status = 'published' ORDER BY id DESC LIMIT 20`;
  }

  const { results } = await db.prepare(query).all();
  c.executionCtx.waitUntil(kv.put(cacheKey, JSON.stringify(results), { expirationTtl: 3600 })); 

  return c.json(results);
});

// 2. Ambil Area Widget (Tetap mengarah ke tabel widgets)
publicCmsApi.get('/widgets/:area', async (c) => {
  const db = c.env.DB;
  const kv = c.env.CACHE_KV;
  const area = c.req.param('area');

  const cacheKey = `widget_area_${area}`;
  const cachedWidgets = await kv.get(cacheKey, 'json');
  if (cachedWidgets) return c.json(cachedWidgets);

  const { results } = await db.prepare(
    `SELECT type, title, content FROM widgets WHERE area = ? AND is_active = 1 ORDER BY sort_order ASC`
  ).bind(area).all();

  c.executionCtx.waitUntil(kv.put(cacheKey, JSON.stringify(results), { expirationTtl: 86400 }));
  return c.json(results);
});

export { publicCmsApi };
