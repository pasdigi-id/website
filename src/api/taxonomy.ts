import { Hono } from 'hono'
import type { Env } from '../index'
import { protectRoute } from '../middleware/auth'

const taxonomyApi = new Hono<{ Bindings: Env }>();

// GET API ini dibiarkan publik/cepat untuk SSR Frontend Header/Footer
taxonomyApi.get('/menus', async (c) => {
  const kv = c.env.CACHE_KV;
  const cachedMenus = await kv.get('public_navigation_menus', 'json');
  if (cachedMenus) return c.json(cachedMenus);

  const { results } = await c.env.DB.prepare(`SELECT * FROM menus ORDER BY parent_id, sort_order ASC`).all();
  
  // Format menjadi Parent-Child bersarang (Tree)
  const menuTree = results.filter((m: any) => !m.parent_id).map((parent: any) => ({
    ...parent,
    children: results.filter((m: any) => m.parent_id === parent.id).sort((a: any, b: any) => a.sort_order - b.sort_order)
  }));

  c.executionCtx.waitUntil(kv.put('public_navigation_menus', JSON.stringify(menuTree), { expirationTtl: 86400 }));
  return c.json(menuTree);
});

// Endpoint di bawah ini wajib dilindungi untuk Admin
taxonomyApi.use('*', protectRoute('admin'));

// Tambah Kategori
taxonomyApi.post('/categories', async (c) => {
  const db = c.env.DB;
  const { parent_id, name, slug, type } = await c.req.json();
  const id = crypto.randomUUID();

  await db.prepare(
    `INSERT INTO categories (id, parent_id, name, slug, type) VALUES (?, ?, ?, ?, ?)`
  ).bind(id, parent_id || null, name, slug, type).run();

  return c.json({ success: true, message: 'Kategori berhasil ditambahkan.' });
});

// Tambah Menu Navigasi
taxonomyApi.post('/menus', async (c) => {
  const db = c.env.DB;
  const { parent_id, label, url, sort_order } = await c.req.json();
  const id = crypto.randomUUID();

  await db.prepare(
    `INSERT INTO menus (id, parent_id, label, url, sort_order) VALUES (?, ?, ?, ?, ?)`
  ).bind(id, parent_id || null, label, url, sort_order || 0).run();

  // Invalidate Cache Header Frontend
  c.executionCtx.waitUntil(c.env.CACHE_KV.delete('public_navigation_menus'));

  return c.json({ success: true, message: 'Menu berhasil ditambahkan.' });
});

export { taxonomyApi };
