import { jsxRenderer } from 'hono/jsx-renderer'
import { Link, Script } from 'honox/server'

export default jsxRenderer(({ children, title }) => {
  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title || 'Pasdigi Dev Service'}</title>
        
        {/* CSS akan otomatis dikonversi oleh HonoX */}
        <Link href="/app/style.css" rel="stylesheet" />
        
        {/* INI YANG HILANG DI HTML ANDA: Wajib agar JavaScript interaktif berjalan! */}
        <Script src="/app/client.ts" async />
      </head>
      <body className="font-sans text-gray-800 antialiased bg-gray-50 flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  )
})