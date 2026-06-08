import { createApp } from 'honox/server'
import { apiRouter } from '../src/index'

// Inisialisasi aplikasi HonoX
const app = createApp()

// Menyambungkan semua rute backend ke awalan /api
app.route('/api', apiRouter)

// Middleware penanganan error global
app.onError((err, c) => {
  console.error(`[Server Error]`, err)
  return c.text('Terjadi kesalahan internal server.', 500)
})

export default app