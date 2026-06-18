import { jsxRenderer } from 'hono/jsx-renderer'
import { Link, Script } from 'honox/server'

export default jsxRenderer(({ children, title }) => {
  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title || 'Admin Panel - Pasdigi'}</title>
        <Link href="/app/style.css" rel="stylesheet" />
        <Script src="/app/client.ts" async />
        <link rel="icon" href="/favicon.ico" />
      </head>
      
      {/* Container Utama Selayar Penuh */}
      <body className="font-sans text-gray-800 antialiased bg-gray-100 flex h-screen overflow-hidden">
        
        {/* ========================================== */}
        {/* SIDEBAR GLOBAL ADMIN */}
        {/* ========================================== */}
        <aside className="w-64 bg-gray-900 text-white flex-col hidden md:flex flex-shrink-0">
          <div className="h-16 flex items-center px-6 border-b border-gray-800 font-bold text-xl text-blue-400 tracking-tight">
            Pasdigi<span className="text-white">Workspace.</span>
          </div>
          
          <div className="flex-grow overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-4 px-2">Menu Utama</div>
            <a href="/admin/dashboard" className="block px-4 py-2.5 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition">Dashboard</a>
            
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-6 px-2">CMS Content</div>
            <a href="/admin/pages" className="block px-4 py-2.5 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition">Static Pages</a>
            <a href="/admin/blog" className="block px-4 py-2.5 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition">Blog & Artikel</a>
            
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-6 px-2">Katalog Bisnis</div>
            <a href="/admin/services" className="block px-4 py-2.5 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition">Layanan B2B</a>
            <a href="/admin/portfolios" className="block px-4 py-2.5 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition">Portofolio</a>
            <a href="/admin/products" className="block px-4 py-2.5 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition">Katalog Produk</a>

            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-6 px-2">Portal Klien</div>
            <a href="/admin/crm" className="block px-4 py-2.5 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition">Users & CRM</a>
            <a href="/admin/projects" className="block px-4 py-2.5 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition">Project Tracking</a>
            <a href="/admin/contacts" className="block px-4 py-2.5 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition">Kontak & Tiket</a>

            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-6 px-2">Sistem</div>
            <a href="/admin/menus" className="block px-4 py-2.5 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition">Navigasi Header</a>
            <a href="/admin/settings" className="block px-4 py-2.5 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition">Pengaturan Global</a>
          </div>

          <div className="p-4 border-t border-gray-800">
            {/* LOGIKA LOGOUT YANG BENAR (Panggil Backend) */}
            <button 
              className="w-full bg-gray-800 text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-red-600 hover:text-white transition"
              onclick="fetch('/api/auth/logout', { method: 'POST' }).finally(() => { window.location.href='/login'; });"
            >
              Keluar Sesi
            </button>
          </div>
        </aside>

        {/* ========================================== */}
        {/* KONTEN KANAN (Topbar + Halaman Dinamis) */}
        {/* ========================================== */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50">
          
          {/* Topbar Global */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 z-10 shadow-sm">
            <div className="font-semibold text-gray-800">Administrator Panel</div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-500">Super Admin</span>
              <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold shadow-md">
                A
              </div>
            </div>
          </header>

          {/* Area Render Dinamis */}
          <div className="flex-1 overflow-y-auto w-full relative">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
})
