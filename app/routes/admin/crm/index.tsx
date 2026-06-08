import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  const db = c.env.DB;
  
  // Mengambil daftar pengguna dari database
  const { results: users } = await db.prepare(
    "SELECT id, email, role, created_at, crm_data FROM users ORDER BY created_at DESC"
  ).all();

  return c.render(
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Manajemen Klien & Pengguna (CRM)</h1>
          <p className="text-gray-500 mt-1">Kelola data klien, hak akses, dan detail perusahaan member.</p>
        </div>
        <button id="btn-export" className="bg-white border border-gray-200 text-gray-800 px-6 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition shadow-sm">
          Export CSV
        </button>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
            <tr>
              <th className="p-4 font-bold">Email Pengguna</th>
              <th className="p-4 font-bold">Nama / Detail (CRM)</th>
              <th className="p-4 font-bold">Hak Akses (Role)</th>
              <th className="p-4 font-bold">Terdaftar Pada</th>
              <th className="p-4 font-bold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-400">Belum ada pengguna.</td></tr>
            ) : (
              users.map((user: any) => {
                // Parse JSON CRM Data secara aman
                let crmData: any = {};
                try { crmData = user.crm_data ? JSON.parse(user.crm_data) : {}; } catch(e){}

                return (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-semibold text-gray-900">{user.email}</td>
                    <td className="p-4 text-sm text-gray-600">
                      {crmData.name ? <strong>{crmData.name}</strong> : <span className="italic text-gray-400">Belum diisi</span>}
                      {crmData.company && <div className="text-xs text-gray-500 mt-1">{crmData.company}</div>}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 text-sm">
                      {new Date(user.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="p-4 text-right">
                      <a href={`/admin/crm/${user.id}`} className="text-blue-600 font-bold text-sm hover:underline">Kelola Data</a>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>,
    { title: 'Manajemen CRM - Admin' }
  )
})
