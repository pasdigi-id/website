import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  // Opsi: Anda bisa query data asli di sini nanti, untuk sekarang kita pakai data statis sebagai contoh
  return c.render(
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Ikhtisar Bisnis</h1>
        <p className="text-gray-500 mt-1">Pantau seluruh aktivitas metrik website dan klien Anda.</p>
      </div>
      
      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
          <div className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">Total Member</div>
          <div className="text-4xl font-black text-gray-900">128</div>
          <div className="mt-auto pt-4 text-sm text-green-600 font-medium">+12 bulan ini</div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
          <div className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">Proyek Aktif</div>
          <div className="text-4xl font-black text-blue-600">14</div>
          <div className="mt-auto pt-4 text-sm text-gray-400 font-medium">Sedang berjalan</div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
          <div className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">Tiket Masuk</div>
          <div className="text-4xl font-black text-red-500">3</div>
          <div className="mt-auto pt-4 text-sm text-red-500 font-medium">Butuh balasan!</div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
          <div className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">Artikel Blog</div>
          <div className="text-4xl font-black text-gray-900">42</div>
          <div className="mt-auto pt-4 text-sm text-gray-400 font-medium">Telah dipublikasi</div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-8 rounded-2xl">
        <h3 className="text-lg font-bold text-blue-900 mb-2">Semua Sistem Terhubung</h3>
        <p className="text-blue-800 text-sm">Gunakan menu di sebelah kiri untuk mengelola konten CMS, meninjau portofolio, membalas tiket, atau mengatur proyek portal klien. Struktur modular Anda siap digunakan.</p>
      </div>
    </div>,
    { title: 'Dashboard - Pasdigi Workspace' }
  )
})
