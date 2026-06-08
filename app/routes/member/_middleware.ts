import { createRoute } from 'honox/factory'
import { getCookie } from 'hono/cookie'

export default createRoute(async (c, next) => {
  // Pengecekan cookie di sisi Server-Side Rendering (SSR)
  const token = getCookie(c, 'auth_token');

  // Jika tidak ada token sama sekali di browser, langsung tendang ke beranda/login
  if (!token) {
    // Catatan: Anda bisa mengubah '/' menjadi '/login' jika halaman login sudah dibuat
    return c.redirect('/');
  }

  // Jika token ada, biarkan lanjut merender halaman (Dashboard).
  // Validasi sah atau tidaknya token (HS256) akan dilakukan oleh API saat Dashboard mengambil data.
  await next();
});
