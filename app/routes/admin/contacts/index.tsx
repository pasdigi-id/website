import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  const db = c.env.DB;
  const { results: tickets } = await db.prepare("SELECT * FROM contacts ORDER BY created_at DESC").all();

  return c.render(
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <main className="flex-1 p-6 md:p-10">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Manajemen Tiket & Pesan</h1>
          <p className="text-gray-500 mt-1">Daftar pesan masuk dari halaman kontak publik.</p>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
              <tr>
                <th className="p-4 font-bold">Tracking ID</th>
                <th className="p-4 font-bold">Nama Klien</th>
                <th className="p-4 font-bold">Subjek</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tickets.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-400">Tidak ada tiket masuk.</td></tr>
              ) : (
                tickets.map((t: any) => (
                  <tr key={t.id} className={`hover:bg-gray-50 ${t.status === 'unread' ? 'bg-blue-50/30' : ''}`}>
                    <td className="p-4 font-mono text-sm text-gray-600">{t.tracking_id}</td>
                    <td className="p-4 font-semibold text-gray-900">
                      {t.name}
                      <div className="text-xs font-normal text-gray-500">{t.email}</div>
                    </td>
                    <td className="p-4 text-gray-700 text-sm truncate max-w-[200px]">{t.subject}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        t.status === 'unread' ? 'bg-blue-100 text-blue-700' : 
                        t.status === 'read' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {/* Navigasi menuju halaman Detail/Balas */}
                      <a href={`/admin/contacts/${t.id}`} className="text-blue-600 font-bold text-sm hover:underline">
                        Lihat & Balas
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>,
    { title: 'Manajemen Tiket' }
  )
})
