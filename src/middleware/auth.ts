import { jwt } from 'hono/jwt'
import type { Context, Next } from 'hono'
import type { Env } from '../index'

// Middleware dinamis berdasarkan role (Level Akses)
export const protectRoute = (requiredRole: 'admin' | 'member') => {
  return async (c: Context<{ Bindings: Env }>, next: Next) => {
    // Ambil Secret Key dari Environment Cloudflare
    const jwtSecret = c.env.JWT_SECRET; 

    // Middleware JWT bawaan Hono
    const jwtMiddleware = jwt({
      secret: jwtSecret,
      cookie: 'auth_token', // Membaca token secara otomatis dari cookie browser
      alg: 'HS256',         // KUNCI KEAMANAN: Wajib Algoritma SHA-256
    });

    // Jalankan pengecekan token
    await jwtMiddleware(c, async () => {
      // Jika token valid, Hono otomatis menyimpan data isinya di 'jwtPayload'
      const payload = c.get('jwtPayload');
      
      // Validasi Level Akses (Role-Based Access Control)
      if (requiredRole === 'admin' && payload.role !== 'admin') {
        return c.json({ error: 'Akses Ditolak. Anda memerlukan hak akses Admin.' }, 403);
      }
      
      // Jika butuh akses member, admin juga tetap bisa masuk
      if (requiredRole === 'member' && !['admin', 'member'].includes(payload.role)) {
        return c.json({ error: 'Akses Ditolak. Anda memerlukan hak akses Member.' }, 403);
      }
      
      // Jika lolos semua, lanjutkan ke fungsi API utama
      await next();
    });
  }
}
