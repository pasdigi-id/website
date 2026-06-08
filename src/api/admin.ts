import { Hono } from 'hono'
import type { Env } from '../index'
import { protectRoute } from '../middleware/auth'
import { sendEmail } from '../services/brevo'
import { uploadFileToR2 } from '../services/r2'

const adminApi = new Hono<{ Bindings: Env }>();

// Wajibkan level akses 'admin'
adminApi.use('*', protectRoute('admin'));

// 1. Endpoint: Tandai Pesan Kontak sebagai "Read"
adminApi.put('/contact/:id/read', async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');

  await db.prepare(
    `UPDATE contacts SET status = 'read', updated_at = CURRENT_TIMESTAMP WHERE id = ? AND status = 'unread'`
  ).bind(id).run();

  return c.json({ success: true, message: 'Status tiket diperbarui menjadi read.' });
});

// 2. Endpoint: Balas Pesan Kontak (Otomatis memicu Brevo)
adminApi.post('/contact/:id/reply', async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  const { reply_message } = await c.req.json();

  // Cek apakah tiket ada
  const ticket = await db.prepare(
    `SELECT tracking_id, name, email, subject FROM contacts WHERE id = ?`
  ).bind(id).first();

  if (!ticket) return c.json({ error: 'Data tiket tidak ditemukan' }, 404);

  // Update status di D1
  await db.prepare(
    `UPDATE contacts SET status = 'replied', admin_reply = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
  ).bind(reply_message, id).run();

  // Template Email Balasan
  const replyHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h3>Halo ${ticket.name},</h3>
      <p>Berikut adalah balasan untuk tiket Anda (<strong>${ticket.tracking_id}</strong>):</p>
      <div style="background: #f9fafb; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0; font-size: 14px;">
        ${reply_message.replace(/\n/g, '<br>')}
      </div>
      <p>Salam hangat,<br>Tim Pasdigi</p>
    </div>
  `;
  
  // Kirim secara asynchronous
  c.executionCtx.waitUntil(sendEmail(c.env, ticket.email as string, `Re: ${ticket.subject}`, replyHtml));

  return c.json({ success: true, message: 'Balasan berhasil dikirim via Email.' });
});

// 3. Endpoint: Unggah Gambar ke CDN R2 (Untuk Blog/Produk CMS)
adminApi.post('/upload', async (c) => {
  const body = await c.req.parseBody();
  const file = body['file']; // Field form-data bernama 'file'

  if (!(file instanceof File)) {
    return c.json({ error: 'File tidak valid atau tidak ditemukan.' }, 400);
  }

  // Panggil layanan R2
  const publicUrl = await uploadFileToR2(c.env, file, 'cms-assets');

  if (!publicUrl) {
    return c.json({ error: 'Terjadi kesalahan saat mengunggah file ke CDN.' }, 500);
  }

  return c.json({ 
    success: true, 
    url: publicUrl, 
    message: 'File berhasil diunggah.' 
  });
});

export { adminApi };
