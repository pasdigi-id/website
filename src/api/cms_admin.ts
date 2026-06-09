import { Hono } from 'hono'
import type { Env } from '../index'
import { protectRoute } from '../middleware/auth'

const adminCmsApi = new Hono<{ Bindings: Env }>();
adminCmsApi.use('*', protectRoute('admin'));

// ----------------------------------------------------
// A. CREATE: TAMBAH KONTEN BARU (POST)
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

// ----------------------------------------------------
// B. UPDATE: EDIT KONTEN (PUT)
// ----------------------------------------------------
adminCmsApi.put('/content/:type/:id', async (c) => {
  const db = c.env.DB;
  const kv = c.env.CACHE_KV;
  const type = c.req.param('type');
  const id = c.req.param('id');
  const body = await c.req.json();

  try {
    switch (type) {
      case 'page':
        await db.prepare(
          `UPDATE pages SET title=?, slug=?, content=?, seo_title=?, seo_description=?, status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`
        ).bind(body.title, body.slug, body.content, body.seo_title, body.seo_description, body.status, id).run();
        break;

      case 'blog':
        await db.prepare(
          `UPDATE blogs SET category_id=?, title=?, slug=?, content=?, cover_image_url=?, seo_title=?, seo_description=?, status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`
        ).bind(body.category_id || null, body.title, body.slug, body.content, body.cover_image_url, body.seo_title, body.seo_description, body.status, id).run();
        break;

      case 'service':
        await db.prepare(
          `UPDATE services SET category_id=?, title=?, slug=?, short_description=?, icon_name=?, content=?, benefits_json=?, cta_text=?, status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`
        ).bind(body.category_id || null, body.title, body.slug, body.short_description, body.icon_name, body.content, JSON.stringify(body.benefits || []), body.cta_text, body.status, id).run();
        break;

      case 'portfolio':
        await db.prepare(
          `UPDATE portfolios SET category_id=?, title=?, slug=?, client_name=?, completion_date=?, website_url=?, cover_image_url=?, content=?, gallery_json=?, status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`
        ).bind(body.category_id || null, body.title, body.slug, body.client_name, body.completion_date, body.website_url, body.cover_image_url, body.content, JSON.stringify(body.gallery || []), body.status, id).run();
        break;

      default:
        return c.json({ error: 'Tipe konten tidak dikenali.' }, 400);
    }

    // Bersihkan List Cache dan Cache Spesifik
    c.executionCtx.waitUntil(kv.delete(`public_list_${type}`));
    c.executionCtx.waitUntil(kv.delete(`public_${type}_${body.slug}`));

    return c.json({ success: true, message: `${type} berhasil diperbarui.` });
  } catch (error) {
    return c.json({ error: 'Gagal memperbarui data. Slug mungkin duplikat.' }, 400);
  }
});

// ----------------------------------------------------
// C. DELETE: HAPUS KONTEN (DELETE)
// ----------------------------------------------------
adminCmsApi.delete('/content/:type/:id', async (c) => {
  const db = c.env.DB;
  const kv = c.env.CACHE_KV;
  const type = c.req.param('type');
  const id = c.req.param('id');

  try {
    let tableName = '';
    if (type === 'page') tableName = 'pages';
    else if (type === 'blog') tableName = 'blogs';
    else if (type === 'service') tableName = 'services';
    else if (type === 'portfolio') tableName = 'portfolios';
    else return c.json({ error: 'Tipe konten tidak valid.' }, 400);

    // Ambil slug untuk membersihkan cache spesifik sebelum dihapus
    const item = await db.prepare(`SELECT slug FROM ${tableName} WHERE id = ?`).bind(id).first();
    
    await db.prepare(`DELETE FROM ${tableName} WHERE id = ?`).bind(id).run();

    // Bersihkan Cache
    c.executionCtx.waitUntil(kv.delete(`public_list_${type}`));
    if (item) c.executionCtx.waitUntil(kv.delete(`public_${type}_${item.slug}`));

    return c.json({ success: true, message: `${type} berhasil dihapus.` });
  } catch (error) {
    return c.json({ error: 'Gagal menghapus data.' }, 400);
  }
});

// ----------------------------------------------------
// D. MANAJEMEN WIDGET AREA
// ----------------------------------------------------
adminCmsApi.post('/widget', async (c) => {
  const db = c.env.DB;
  const { area, type, title, content, sort_order, is_active } = await c.req.json();
  const id = crypto.randomUUID();

  try {
    await db.prepare(
      `INSERT INTO widgets (id, area, type, title, content, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(id, area, type, title, JSON.stringify(content), sort_order || 0, is_active ?? 1).run();

    // Bersihkan cache widget spesifik
    c.executionCtx.waitUntil(c.env.CACHE_KV.delete(`widget_area_${area}`));

    return c.json({ success: true, message: 'Widget berhasil ditambahkan.' });
  } catch (error) {
    return c.json({ error: 'Gagal menambahkan widget.' }, 400);
  }
});

// Update Widget (Opsional untuk melengkapi)
adminCmsApi.put('/widget/:id', async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  const { area, type, title, content, sort_order, is_active } = await c.req.json();

  try {
    await db.prepare(
      `UPDATE widgets SET area=?, type=?, title=?, content=?, sort_order=?, is_active=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`
    ).bind(area, type, title, JSON.stringify(content), sort_order || 0, is_active ?? 1, id).run();

    c.executionCtx.waitUntil(c.env.CACHE_KV.delete(`widget_area_${area}`));
    return c.json({ success: true, message: 'Widget diperbarui.' });
  } catch (error) {
    return c.json({ error: 'Gagal memperbarui widget.' }, 400);
  }
});

// Hapus Widget (Opsional untuk melengkapi)
adminCmsApi.delete('/widget/:id', async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');

  try {
    const widget = await db.prepare(`SELECT area FROM widgets WHERE id = ?`).bind(id).first();
    await db.prepare(`DELETE FROM widgets WHERE id = ?`).bind(id).run();

    if (widget) c.executionCtx.waitUntil(c.env.CACHE_KV.delete(`widget_area_${widget.area}`));
    return c.json({ success: true, message: 'Widget dihapus.' });
  } catch (error) {
    return c.json({ error: 'Gagal menghapus widget.' }, 400);
  }
});

export { adminCmsApi };
