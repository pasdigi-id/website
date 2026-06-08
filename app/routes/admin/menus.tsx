import { createRoute } from 'honox/factory'

export default createRoute((c) => {
  return c.render(
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <head>
        <title>Admin - Manajemen Menu Navigasi</title>
      </head>

      <main className="flex-1 p-6 md:p-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Menu Navigasi</h1>
          <p className="text-gray-500 mt-1">Atur tautan yang muncul di header website Anda (mendukung Parent/Child).</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form Tambah Menu */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit lg:col-span-1">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Tambah Tautan Baru</h2>
            <form id="menu-form" className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Induk Menu (Parent)</label>
                <select id="m-parent" className="w-full border rounded-xl p-3 bg-gray-50">
                  <option value="">-- Root (Menu Utama) --</option>
                  <option value="id_layanan">Layanan</option>
                  <option value="id_perusahaan">Perusahaan</option>
                  {/* Option ini harusnya ditarik dari API via JS */}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Label Teks</label>
                <input type="text" id="m-label" required className="w-full border rounded-xl p-3" placeholder="Misal: Tentang Kami" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">URL / Tautan</label>
                <input type="text" id="m-url" required className="w-full border rounded-xl p-3" placeholder="/page/tentang-kami" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Urutan Tampil</label>
                <input type="number" id="m-sort" defaultValue="0" className="w-full border rounded-xl p-3" />
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition">
                Tambahkan ke Menu
              </button>
            </form>
          </div>

          {/* Visualisasi Struktur Menu */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-700">Struktur Saat Ini</h3>
              </div>
              <div className="p-6">
                
                {/* Contoh Tampilan Struktur (Nanti dirender JS dari /api/taxonomy/menus) */}
                <ul className="space-y-3">
                  {/* Root Item */}
                  <li className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex justify-between items-center">
                    <div>
                      <span className="font-bold text-gray-800">Beranda</span>
                      <span className="text-xs text-gray-400 ml-2">(/)</span>
                    </div>
                    <button className="text-red-500 text-sm font-bold">Hapus</button>
                  </li>

                  {/* Root Item dengan Child */}
                  <li className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex flex-col gap-3">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                      <div>
                        <span className="font-bold text-gray-800">Layanan Kami</span>
                        <span className="text-xs text-gray-400 ml-2">(/services)</span>
                      </div>
                      <button className="text-red-500 text-sm font-bold">Hapus</button>
                    </div>
                    
                    {/* Sub-menu (Children) */}
                    <ul className="pl-8 space-y-2">
                      <li className="bg-white border border-gray-100 p-3 rounded-lg flex justify-between items-center relative before:content-[''] before:absolute before:-left-4 before:top-1/2 before:w-4 before:border-t-2 before:border-gray-200">
                        <div>
                          <span className="font-semibold text-gray-700">Web Development</span>
                          <span className="text-xs text-gray-400 ml-2">(/service/web-dev)</span>
                        </div>
                        <button className="text-red-500 text-xs font-bold">Hapus</button>
                      </li>
                      <li className="bg-white border border-gray-100 p-3 rounded-lg flex justify-between items-center relative before:content-[''] before:absolute before:-left-4 before:top-1/2 before:w-4 before:border-t-2 before:border-gray-200">
                        <div>
                          <span className="font-semibold text-gray-700">SEO Optimization</span>
                          <span className="text-xs text-gray-400 ml-2">(/service/seo)</span>
                        </div>
                        <button className="text-red-500 text-xs font-bold">Hapus</button>
                      </li>
                    </ul>
                  </li>

                </ul>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
})
