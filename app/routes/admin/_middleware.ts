import { createRoute } from 'honox/factory'
import { getCookie } from 'hono/cookie'

export default createRoute(async (c, next) => {
  const token = getCookie(c, 'auth_token');

  // Jika tidak ada token, tendang ke halaman login/depan
  if (!token) {
    return c.redirect('/');
  }

  try {
    // JWT terdiri dari 3 bagian: header.payload.signature
    // Kita decode bagian payload (index ke-1) yang berbentuk Base64 untuk mengecek role
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));

    // Validasi role admin di sisi SSR (Validasi kriptografi aslinya tetap ada di API /src)
    if (decodedPayload.role !== 'admin') {
      return c.redirect('/member/dashboard'); // Tendang ke area member jika bukan admin
    }
  } catch (error) {
    // Jika token tidak valid secara format, hapus cookie dan tendang
    c.header('Set-Cookie', 'auth_token=; Max-Age=0; path=/');
    return c.redirect('/');
  }

  await next();
});
