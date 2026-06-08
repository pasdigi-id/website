import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  const db = c.env.DB;
  const query = `
    SELECT s.id, s.title, s.slug, s.status, c.name as category_name 
    FROM services s 
    LEFT JOIN categories c ON s.category_id = c.id 
    ORDER BY s.id DESC
  `;
  const { results: services } = await db.prepare(query).all();

  return c.render(
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <main className="flex-1 p-6 md:p-10">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-900">Manajemen Layanan (Services)</h1>
            <p className="text-gray-500 mt-1">Kelola katalog layanan B2B perusahaan Anda.</p>
          </div>
          <a href="/admin/services/new" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition">
            + Tambah Layanan
          </a>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
              <tr>
                <th className="p-4 font-bold">Layanan</th>
                <th className="p-4 font-bold">Kategori</th>
                <th className="p-4 font-bold">URL</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {services.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-400">Belum ada layanan yang ditawarkan.</td></tr>
              ) : (
                services.map((svc: any) => (
                  <tr key={svc.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-semibold text-gray-900">{svc.title}</td>
                    <td className="p-4 text-gray-600 text-sm">{svc.category_name || '-'}</td>
                    <td className="p-4 text-gray-500 text-sm">/service/{svc.slug}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${svc.status === 'published' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                        {svc.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <a href={`/admin/services/${svc.id}`} className="text-blue-600 font-bold text-sm hover:underline">Edit</a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>,
    { title: 'Manajemen Services' }
  )
})
