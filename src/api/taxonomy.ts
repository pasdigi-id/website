import { Hono } from 'hono'
import type { Env } from '../index'
import { protectRoute } from '../middleware/auth'

const taxonomyApi = new Hono<{ Bindings: Env }>();

// GET API ini dibiarkan publik untuk SSR Frontend Header/Footer
taxonomyApi.get('/menus', async (c) => {
  const kv = c.env.CACHE_KV;
  const cachedMenus = await kv.get('public_navigation_menus', 'json');
  if (cachedMenus) return c.json(cachedMenus);

  const { results } = await c.env.DB.prepare(`SELECT * FROM menus ORDER BY parent_id, sort_order ASC`).all();
  const menuTree = results.filter((m: any) => !m.parent_id).map((parent: any) => ({
    ...parent,
    children: results.filter((m: any) => m.parent_id === parent.id).sort((a: any, b: any) => a.sort_order - b.sort_order)
  }));
  c.executionCtx.waitUntil(kv.put('public_navigation_menus', JSON.stringify(menuTree), { expirationTtl: 86400 }));
  return c.json(menuTree);
});

// ==========================================
// AREA ADMIN: MANAJEMEN KATEGORI & MENU
// ==========================================
taxonomyApi.use('*', protectRoute('admin'));

// 1. CREATE: Tambah Kategori
taxonomyApi.post('/categories', async (c) => {
  const db = c.env.DB;
  const { parent_id, name, slug, type } = await c.req.json();
  const id = crypto.randomUUID();

  try {
    await db.prepare(
      `INSERT INTO categories (id, parent_id, name, slug, type) VALUES (?, ?, ?, ?, ?)`
    ).bind(id, parent_id || null, name, slug, type).run();
    return c.json({ success: true, message: 'Kategori berhasil ditambahkan.' });
  } catch (err) {
    return c.json({ error: 'Gagal. Slug mungkin sudah digunakan.' }, 400);
  }
});

// 2. UPDATE: Edit Kategori
taxonomyApi.put('/categories/:id', async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  const { parent_id, name, slug } = await c.req.json();

  try {
    await db.prepare(
      `UPDATE categories SET parent_id = ?, name = ?, slug = ? WHERE id = ?`
    ).bind(parent_id || null, name, slug, id).run();
    return c.json({ success: true, message: 'Kategori berhasil diperbarui.' });
  } catch (err) {
    return c.json({ error: 'Gagal memperbarui kategori.' }, 400);
  }
});

// 3. DELETE: Hapus Kategori
taxonomyApi.delete('/categories/:id', async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  await db.prepare(`DELETE FROM categories WHERE id = ?`).bind(id).run();
  return c.json({ success: true, message: 'Kategori berhasil dihapus.' });
});

export { taxonomyApi };
