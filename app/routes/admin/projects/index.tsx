import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  const db = c.env.DB;
  
  // Mengambil daftar proyek beserta nama kliennya dari database
  const query = `
    SELECT p.id, p.title, p.status, p.end_date, u.email as client_email 
    FROM projects p 
    LEFT JOIN users u ON p.client_id = u.id 
    ORDER BY p.created_at DESC
  `;
  const { results: projects } = await db.prepare(query).all();

  return c.render(
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <main className="flex-1 p-6 md:p-10">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Project Tracking</h1>
            <p className="text-gray-500 mt-1">Pantau dan kelola proyek klien secara keseluruhan.</p>
          </div>
          {/* Tombol ini mengarah ke file new.tsx */}
          <a href="/admin/projects/new" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition">
            + Buat Proyek Baru
          </a>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
              <tr>
                <th className="p-4 font-bold">Nama Proyek</th>
                <th className="p-4 font-bold">Klien (Email)</th>
                <th className="p-4 font-bold">Tenggat Waktu</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projects.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-400">Belum ada proyek yang berjalan.</td></tr>
              ) : (
                projects.map((proj: any) => (
                  <tr key={proj.id} className="hover:bg-gray-50">
                    <td className="p-4 font-semibold text-gray-900">{proj.title}</td>
                    <td className="p-4 text-gray-500 text-sm">{proj.client_email}</td>
                    <td className="p-4 text-gray-500 text-sm">
                      {proj.end_date ? new Date(proj.end_date).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-blue-100 text-blue-800">
                        {proj.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-4">
                      <a href={`/admin/projects/${proj.id}`} className="text-blue-600 font-bold text-sm hover:underline">Update Progress</a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
})
