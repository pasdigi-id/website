import { jsxRenderer } from 'hono/jsx-renderer'

export default jsxRenderer(({ children, title }) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 font-sans">
      {/* Sidebar Member (Statis & Konsisten) */}
      <aside className="w-full md:w-64 bg-gray-900 text-white p-6 flex flex-col shrink-0">
        <div className="font-extrabold text-2xl mb-10 text-blue-400 tracking-tight">Client Portal.</div>
        <nav className="flex-grow space-y-2">
          <a href="/member/dashboard" className="block px-4 py-3 hover:bg-gray-800 rounded-lg transition font-medium">Dashboard Proyek</a>
          <a href="/member/profile" className="block px-4 py-3 hover:bg-gray-800 rounded-lg transition font-medium">Profil Saya</a>
        </nav>
        <button 
          className="mt-auto w-full text-left px-4 py-3 text-red-400 font-bold hover:bg-gray-800 rounded-lg transition" 
          onclick="document.cookie='auth_token=; Max-Age=0; path=/'; window.location.href='/login';"
        >
          Keluar Sesi
        </button>
      </aside>

      {/* Konten Utama Dinamis */}
      <div className="flex-grow flex flex-col min-w-0">
        {children}
      </div>
    </div>
  )
})
