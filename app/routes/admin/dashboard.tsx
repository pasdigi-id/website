import { createRoute } from 'honox/factory'

export default createRoute((c) => {
  return c.render(
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* TAG <head> DIHAPUS DARI SINI UNTUK MENCEGAH CSS RUSAK */}

      {/* Sidebar Admin */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-800 font-bold text-xl text-blue-400">
          AdminPanel.
        </div>
        
        <div className="flex-grow overflow-y-auto py-6 px-4 space-y-1">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-4 px-2">Menu Utama</div>
          <a href="/admin/dashboard" className="block px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium">Dashboard</a>
          
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-6 px-2">CMS</div>
          <a href="/admin/pages" className="block px-4 py-2.5 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition">Pages & Landing</a>
          <a href="/admin/blog" className="block px-4 py-2.5 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition">Blog & Kategori</a>
          <a href="/admin/menus" className="block px-4 py-2.5 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition">Menu Management</a>

          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-6 px-2">Business</div>
          <a href="/admin/crm" className="block px-4 py-2.5 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition">Users & CRM</a>
          <a href="/admin/projects" className="block px-4 py-2.5 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition">Project Tracking</a>
          <a href="/admin/contacts" className="block flex justify-between items-center px-4 py-2.5 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition">
            <span>Kontak & Tiket</span>
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">3</span>
          </a>

          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-6 px-2">System</div>
          <a href="/admin/settings" className="block px-4 py-2.5 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition">Pengaturan Global</a>
        </div>

        <div className="p-4 border-t border-gray-800">
          <button className="w-full bg-gray-800 text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-red-600 hover:text-white transition"
            onclick="document.cookie='auth_token=; Max-Age=0; path=/'; window.location.href='/';">
            Keluar
          </button>
        </div>
      </aside>

      {/* Area Konten Utama */}
      <main className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="font-semibold text-gray-800">Ikhtisar Sistem</div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Mode Admin</span>
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">A</div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 flex-grow overflow-y-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Selamat Datang, Admin</h1>
          
          {/* Kartu Statistik */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="text-sm text-gray-500 mb-1">Total Klien / Member</div>
              <div className="text-3xl font-bold text-gray-900">128</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="text-sm text-gray-500 mb-1">Proyek Aktif</div>
              <div className="text-3xl font-bold text-gray-900">14</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="text-sm text-gray-500 mb-1">Tiket Belum Dibaca</div>
              <div className="text-3xl font-bold text-red-600">3</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="text-sm text-gray-500 mb-1">Artikel Blog</div>
              <div className="text-3xl font-bold text-gray-900">42</div>
            </div>
          </div>

          {/* Area Kosong untuk Modul Selanjutnya */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center">
            <p className="text-gray-500">Pilih menu di samping untuk mulai mengelola data sistem.</p>
          </div>
        </div>
      </main>
    </div>,
    // Title dipindahkan ke parameter render di sini
    { title: 'Admin Panel - Dashboard' }
  )
})
