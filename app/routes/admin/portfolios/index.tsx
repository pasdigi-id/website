import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  const db = c.env.DB;
  const { results: items } = await db.prepare("SELECT id, title, slug, status FROM portfolios ORDER BY id DESC").all();

  return c.render(
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Manajemen Portofolio</h1>
          <p className="text-gray-500 mt-1">Studi kasus dan proyek terpilih.</p>
        </div>
        <div className="flex gap-3">
          <a href="/admin/portfolios/categories" className="bg-white border border-gray-200 px-6 py-2.5 rounded-xl font-bold hover:bg-gray-50 text-gray-700">Kategori</a>
          <a href="/admin/portfolios/new" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition">+ Tambah Portofolio</a>
        </div>
      </header>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-sm uppercase">
            <tr>
              <th className="p-4 font-bold">Judul</th>
              <th className="p-4 font-bold">Slug</th>
              <th className="p-4 font-bold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((item: any) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-4 font-semibold">{item.title}</td>
                <td className="p-4 text-sm text-gray-500">{item.slug}</td>
                <td className="p-4 text-right">
                  <a href={`/admin/portfolios/${item.id}`} className="text-blue-600 font-bold hover:underline">Edit</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>,
    { title: 'Portofolio - Admin' }
  )
})
