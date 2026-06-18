import { jsxRenderer } from 'hono/jsx-renderer'
import { Link, Script } from 'honox/server'

export default jsxRenderer(({ children, title }) => {
  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title || 'Client Portal - Pasdigi'}</title>
        
        {/* INI BAGIAN FATAL YANG SAYA LEWATKAN: Memanggil Tailwind CSS */}
        <Link href="/app/style.css" rel="stylesheet" />
        <Script src="/app/client.ts" async />
        
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-sans text-gray-800 antialiased bg-gray-50 flex flex-col md:flex-row min-h-screen">
        
        {/* Sidebar Member (Statis & Konsisten) */}
        <aside className="w-full md:w-64 bg-gray-900 text-white p-6 flex flex-col shrink-0">
          <div className="font-extrabold text-2xl mb-10 text-blue-400 tracking-tight">Client Portal.</div>
          <nav className="flex-grow space-y-2">
            <a href="/member/dashboard" className="block px-4 py-3 hover:bg-gray-800 rounded-lg transition font-medium">Dashboard Proyek</a>
            <a href="/member/profile" className="block px-4 py-3 hover:bg-gray-800 rounded-lg transition font-medium">Profil Saya</a>
          </nav>
          <button 
            className="mt-auto w-full text-left px-4 py-3 text-red-400 font-bold hover:bg-gray-800 rounded-lg transition" 
            dangerouslySetInnerHTML={{ __html: 'Keluar Sesi' }}
            onClick="document.cookie='auth_token=; Max-Age=0; path=/'; window.location.href='/login';"
          >
          </button>
        </aside>

        {/* Konten Utama Dinamis (Dashboard & Profil masuk ke sini) */}
        <div className="flex-grow flex flex-col min-w-0 bg-gray-50">
          {children}
        </div>
        
      </body>
    </html>
  )
})
