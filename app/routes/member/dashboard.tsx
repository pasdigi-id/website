import { createRoute } from 'honox/factory'
import { getCookie } from 'hono/cookie'

export default createRoute(async (c) => {
  const token = getCookie(c, 'auth_token');
  const apiUrl = new URL('/api/member/my-projects', c.req.url).toString();
  
  let projects = [];
  let errorMsg = null;

  try {
    const res = await fetch(apiUrl, { headers: { 'Cookie': `auth_token=${token}` } });
    if (res.ok) projects = await res.json();
    else errorMsg = "Gagal memuat data proyek. Sesi Anda mungkin telah berakhir.";
  } catch (e) {
    errorMsg = "Terjadi kesalahan koneksi ke server internal.";
  }

  return c.render(
    <main className="flex-grow p-6 md:p-10 bg-gray-50">
      <header className="mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">Project Tracking</h1>
        <p className="text-gray-500 mt-2">Pantau perkembangan pekerjaan Anda secara real-time.</p>
      </header>

      {errorMsg ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 font-bold">{errorMsg}</div>
      ) : projects.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-gray-200 text-center shadow-sm">
          <p className="text-gray-500 mb-4">Belum ada proyek yang terdaftar di akun Anda saat ini.</p>
          <a href="/contact" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition inline-block">
            Hubungi Tim Kami
          </a>
        </div>
      ) : (
        <div className="space-y-8">
          {projects.map((project: any) => (
            <div key={project.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-white border-b border-gray-100 px-6 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{project.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">Target Selesai: {project.end_date ? new Date(project.end_date).toLocaleDateString('id-ID') : 'Belum ditentukan'}</p>
                </div>
                <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide bg-blue-100 text-blue-800 border border-blue-200">
                  {project.status}
                </span>
              </div>

              <div className="p-6 bg-gray-50/50">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Milestones & Progress</h3>
                <div className="divide-y divide-gray-100 bg-white border border-gray-100 rounded-xl px-4">
                  {project.tasks.length === 0 ? (
                    <p className="text-sm text-gray-500 py-4 text-center">Belum ada tahapan pekerjaan yang dicatat.</p>
                  ) : (
                    project.tasks.map((task: any) => (
                      <div key={task.id} className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800">{task.title}</h4>
                          {task.notes && <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-3 rounded-lg border border-gray-100">{task.notes}</p>}
                        </div>
                        
                        <div className="w-full md:w-64 shrink-0">
                          <div className="flex justify-between text-xs font-bold mb-2">
                            <span className={task.progress === 100 ? "text-green-600" : "text-blue-600"}>
                              {task.status.toUpperCase()}
                            </span>
                            <span className="text-gray-700">{task.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden border border-gray-200">
                            <div 
                              className={`h-full transition-all duration-1000 ${task.progress === 100 ? 'bg-green-500' : 'bg-blue-600'}`}
                              style={{ width: `${task.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>,
    { title: 'Dashboard Proyek - Client Portal' }
  )
})
