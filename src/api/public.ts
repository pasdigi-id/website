import { Hono } from 'hono'
import type { Env } from '../index'
import { generateWibTrackingId } from '../utils/time'
import { sendEmail } from '../services/brevo'
import { verifyTurnstileToken } from '../services/turnstile'

const publicApi = new Hono<{ Bindings: Env }>();

// 1. Endpoint Menerima Pesan Kontak Baru
publicApi.post('/contact', async (c) => {
  const db = c.env.DB;
  const turnstileSecret = c.env.TURNSTILE_SECRET_KEY;
  
  const body = await c.req.json();
  const { name, email, subject, message, turnstile_token } = body;

  // A. Validasi Turnstile
  const clientIp = c.req.header('CF-Connecting-IP');
  const isHuman = await verifyTurnstileToken(turnstile_token, turnstileSecret, clientIp);

  if (!isHuman) {
    return c.json({ 
      success: false, 
      error: 'Validasi keamanan gagal. Sistem mendeteksi aktivitas mencurigakan.' 
    }, 400);
  }

  // B. Proses Input Data
  const id = crypto.randomUUID();
  const trackingId = generateWibTrackingId();

  // Simpan ke D1 Database
  await db.prepare(
    `INSERT INTO contacts (id, tracking_id, name, email, subject, message, status) VALUES (?, ?, ?, ?, ?, ?, 'unread')`
  ).bind(id, trackingId, name, email, subject, message).run();

  // C. Kirim Auto-Reply via Brevo
  const autoReplyHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h3>Halo ${name},</h3>
      <p>Terima kasih telah menghubungi kami. Pesan Anda telah kami terima dengan aman.</p>
      <p>Gunakan ID Pelacakan berikut untuk mengecek status pesan Anda di website kami:</p>
      <div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 12px; margin: 20px 0;">
        <h2 style="margin: 0; color: #1e3a8a;">${trackingId}</h2>
      </div>
      <p>Kami akan membalas pesan Anda secepatnya.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
      <p style="font-size: 12px; color: #888;">Pesan ini dihasilkan secara otomatis, mohon tidak membalas email ini.</p>
    </div>
  `;
  
  // Gunakan waitUntil agar respons API tidak tertahan oleh proses kirim email
  c.executionCtx.waitUntil(sendEmail(c.env, email, `[Tiket Diterima] ${subject}`, autoReplyHtml));

  return c.json({ 
    success: true, 
    tracking_id: trackingId,
    message: 'Pesan berhasil dikirim.' 
  });
});

// 2. Endpoint Melacak Status Pesan
publicApi.get('/contact/track/:tracking_id', async (c) => {
  const db = c.env.DB;
  const trackingId = c.req.param('tracking_id');

  // Ambil data status dari D1
  const record = await db.prepare(
    `SELECT tracking_id, status, admin_reply, updated_at FROM contacts WHERE tracking_id = ?`
  ).bind(trackingId).first();

  if (!record) {
    return c.json({ error: 'Tracking ID tidak ditemukan. Periksa kembali ID Anda.' }, 404);
  }

  return c.json({
    tracking_id: record.tracking_id,
    status: record.status, // Akan mengembalikan: 'unread', 'read', atau 'replied'
    admin_reply: record.status === 'replied' ? record.admin_reply : null,
    last_updated: record.updated_at
  });
});

export { publicApi };
