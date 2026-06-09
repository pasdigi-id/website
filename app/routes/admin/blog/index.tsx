import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  const db = c.env.DB;
  
  // Mengambil daftar artikel beserta nama kategori dan email penulisnya
  const query = `
    SELECT b.id, b.title, b.slug, b.status, c.name as category_name, u.email as author_email
    FROM blogs b 
    LEFT JOIN categories c ON b.category_id = c.id 
    LEFT JOIN users u ON b.author_id = u.id
    ORDER BY b.created_at DESC
  `;
  const { results: blogs } = await db.prepare(query).all();

  return c.render(
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
      <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Manajemen Blog & Artikel</h1>
          <p className="text-gray-500 mt-1">Kelola publikasi, berita perusahaan, dan wawasan industri.</p>
        </div>
        <div className="flex gap-3">
          <a href="/admin/blog/categories" className="bg-white border border-gray-200 px-6 py-2.5 rounded-xl font-bold hover:bg-gray-50 text-gray-700 transition shadow-sm">
            Kategori
          </a>
          <a href="/admin/blog/new" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-sm">
            + Tulis Artikel
          </a>
        </div>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
            <tr>
              <th className="p-4 font-bold">Judul Artikel</th>
              <th className="p-4 font-bold">Kategori</th>
              <th className="p-4 font-bold">Penulis</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {blogs.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-400">Belum ada artikel yang diterbitkan.</td></tr>
            ) : (
              blogs.map((b: any) => (
                <tr key={b.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-semibold text-gray-900">{b.title}</td>
                  <td className="p-4 text-gray-600 text-sm">{b.category_name || '-'}</td>
                  <td className="p-4 text-gray-500 text-sm">{b.author_email || 'Sistem'}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${b.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <a href={`/admin/blog/${b.id}`} className="text-blue-600 font-bold text-sm hover:underline">Edit</a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>,
    { title: 'Manajemen Blog - Admin' }
  )
})
