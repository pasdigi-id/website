import { createRoute } from 'honox/factory'
import { getCookie } from 'hono/cookie'
import { verify } from 'hono/jwt'

export default createRoute(async (c, next) => {
  const token = getCookie(c, 'auth_token');

  // Jika tidak ada token, langsung arahkan ke login
  if (!token) {
    return c.redirect('/login');
  }

  try {
    // 1. Verifikasi dan Dekode Token JWT secara rahasia di sisi Server
    const payload = await verify(token, c.env.JWT_SECRET, 'HS256');
    
    // 2. Simpan payload ke dalam Context Hono
    // Ini WAJIB agar dashboard.tsx dan profile.tsx bisa membaca c.get('jwtPayload')
    c.set('jwtPayload', payload);

    // 3. Lanjutkan merender halaman
    await next();
  } catch (err) {
    // Jika token palsu, diubah manual, atau sudah kadaluarsa (Expired), tendang ke login
    return c.redirect('/login');
  }
});
