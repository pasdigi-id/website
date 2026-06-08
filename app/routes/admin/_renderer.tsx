import { jsxRenderer } from 'hono/jsx-renderer'
import { Link, Script } from 'honox/server'

export default jsxRenderer(({ children, title }) => {
  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title || 'Admin Panel - Pasdigi'}</title>
        
        {/* Wajib agar CSS Tailwind dan interaksi Klien berjalan di area Admin */}
        <Link href="/app/style.css" rel="stylesheet" />
        <Script src="/app/client.ts" async />
        
        <link rel="icon" href="/favicon.ico" />
      </head>
      {/* Hapus flex-col min-h-screen di sini jika sudah ada di struktur layout admin */}
      <body className="font-sans text-gray-800 antialiased bg-gray-100">
        {children}
      </body>
    </html>
  )
})
