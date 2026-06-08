import { Hono } from 'hono'

// Import semua API yang sudah kita buat
import { publicApi } from './api/public'
import { memberApi } from './api/member'
import { adminApi } from './api/admin'
import { authApi } from './api/auth'
import { adminCmsApi } from './api/cms_admin'
import { publicCmsApi } from './api/cms_public'
import { taxonomyApi } from './api/taxonomy'
import { setupApi } from './api/setup'

// Mendefinisikan tipe Environment Variables dari Cloudflare
export type Env = {
  DB: D1Database;
  CACHE_KV: KVNamespace;
  ASSETS_R2: R2Bucket;
  JWT_SECRET: string;
  BREVO_API_KEY: string;
  TURNSTILE_SECRET_KEY: string;
  SETUP_KEY: string;
}

// Inisialisasi router khusus API
const apiRouter = new Hono<{ Bindings: Env }>()

// Route dasar untuk mengecek status API
apiRouter.get('/ping', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

// Menyambungkan rute-rute spesifik ke jalurnya masing-masing
apiRouter.route('/public', publicApi)
apiRouter.route('/member', memberApi)
apiRouter.route('/admin', adminApi)
apiRouter.route('/auth', authApi)
apiRouter.route('/admin/cms', adminCmsApi)
apiRouter.route('/public/cms', publicCmsApi)
apiRouter.route('/taxonomy', taxonomyApi)
apiRouter.route('/setup', setupApi)

export { apiRouter }