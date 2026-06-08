import { Hono } from 'hono'
import type { Env } from '../index'
import { protectRoute } from '../middleware/auth'

const adminCmsApi = new Hono<{ Bindings: Env }>();
adminCmsApi.use('*', protectRoute('admin'));

// ----------------------------------------------------
// A. MANAJEMEN KONTEN MODULAR
// ----------------------------------------------------
adminCmsApi.post('/content/:type', async (c) => {
  const db = c.env.DB;
  const kv = c.env.CACHE_KV;
  const type = c.req.param('type'); // 'page', 'blog', 'service', 'portfolio'
  const body = await c.req.json();
  const id = crypto.randomUUID();

  try {
    switch (type) {
      case 'page':
        await db.prepare(
          `INSERT INTO pages (id, title, slug, content, seo_title, seo_description, status) VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).bind(id, body.title, body.slug, body.content, body.seo_title, body.seo_description, body.status).run();
        break;

      case 'blog':
        const payload = c.get('jwtPayload'); // Ambil ID penulis dari token JWT
        await db.prepare(
          `INSERT INTO blogs (id, category_id, title, slug, content, cover_image_url, author_id, seo_title, seo_description, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(id, body.category_id || null, body.title, body.slug, body.content, body.cover_image_url, payload.sub, body.seo_title, body.seo_description, body.status).run();
        break;

      case 'service':
        await db.prepare(
          `INSERT INTO services (id, category_id, title, slug, short_description, icon_name, content, benefits_json, cta_text, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(id, body.category_id || null, body.title, body.slug, body.short_description, body.icon_name, body.content, JSON.stringify(body.benefits || []), body.cta_text, body.status).run();
        break;

      case 'portfolio':
        await db.prepare(
          `INSERT INTO portfolios (id, category_id, title, slug, client_name, completion_date, website_url, cover_image_url, content, gallery_json, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(id, body.category_id || null, body.title, body.slug, body.client_name, body.completion_date, body.website_url, body.cover_image_url, body.content, JSON.stringify(body.gallery || []), body.status).run();
        break;

      default:
        return c.json({ error: 'Tipe konten tidak dikenali.' }, 400);
    }

    // Bersihkan List Cache
    c.executionCtx.waitUntil(kv.delete(`public_list_${type}`));

    return c.json({ success: true, message: `${type} berhasil disimpan.` });
  } catch (error) {
    return c.json({ error: 'Gagal menyimpan. Pastikan slug belum digunakan.' }, 400);
  }
});

// Update Widget Area
adminCmsApi.post('/widget', async (c) => {
  const db = c.env.DB;
  const { area, type, title, content, sort_order, is_active } = await c.req.json();
  const id = crypto.randomUUID();

  await db.prepare(
    `INSERT INTO widgets (id, area, type, title, content, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, area, type, title, JSON.stringify(content), sort_order || 0, is_active ?? 1).run();

  // Bersihkan cache widget spesifik
  c.executionCtx.waitUntil(c.env.CACHE_KV.delete(`widget_area_${area}`));

  return c.json({ success: true, message: 'Widget berhasil ditambahkan.' });
});

export { adminCmsApi };
