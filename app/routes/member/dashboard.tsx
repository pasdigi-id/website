import { createRoute } from 'honox/factory'
import { getCookie } from 'hono/cookie'

export default createRoute(async (c) => {
  // 1. Lakukan Server-Side Fetch ke API internal kita
  // Karena ini SSR, kita harus menyertakan cookie auth_token secara manual ke header fetch
  const token = getCookie(c, 'auth_token');
  const apiUrl = new URL('/api/member/my-projects', c.req.url).toString();
  
  let projects = [];
  let errorMsg = null;

  try {
    const res = await fetch(apiUrl, {
      headers: {
        'Cookie': `auth_token=${token}`
      }
    });

    if (res.ok) {
      projects = await res.json();
    } else {
      errorMsg = "Gagal memuat data proyek. Sesi Anda mungkin telah berakhir.";
    }
  } catch (e) {
    errorMsg = "Terjadi kesalahan koneksi ke server internal.";
  }

  // 2. Render antarmuka Dashboard
  return c.render(
    <div className="flex-grow flex flex-col md:flex-row min-h-screen">
      {/* Sidebar Member */}
      <aside className="w-full md:w-64 bg-gray-900 text-white p-6 flex flex-col">
        <div className="font-extrabold text-2xl mb-10 text-blue-400">Client Portal</div>
        <nav className="flex-grow space-y-2">
          <a href="/member/dashboard" className="block px-4 py-3 bg-gray-800 rounded-lg font-medium">Dashboard Proyek</a>
          <a href="/member/profile" className="block px-4 py-3 hover:bg-gray-800 rounded-lg transition">Profil Saya</a>
        </nav>
        <button className="mt-auto w-full text-left px-4 py-3 text-red-400 hover:bg-gray-800 rounded-lg transition" 
                onclick="document.cookie='auth_token=; Max-Age=0; path=/'; window.location.href='/';">
          Keluar
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-10 bg-gray-50">
        <header className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-900">Project Tracking</h1>
          <p className="text-gray-500 mt-2">Pantau perkembangan pekerjaan Anda secara real-time.</p>
        </header>

        {errorMsg ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">{errorMsg}</div>
        ) : projects.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl border border-gray-200 text-center shadow-sm">
            <p className="text-gray-500 mb-4">Belum ada proyek yang terdaftar di akun Anda.</p>
            <a href="/contact" className="text-blue-600 font-semibold hover:underline">Hubungi Tim Kami</a>
          </div>
        ) : (
          <div className="space-y-8">
            {projects.map((project: any) => (
              <div key={project.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header Proyek */}
                <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{project.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">Target Selesai: {project.end_date ? new Date(project.end_date).toLocaleDateString('id-ID') : 'Belum ditentukan'}</p>
                  </div>
                  <span className="px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide bg-blue-100 text-blue-800">
                    {project.status}
                  </span>
                </div>

                {/* List Tasks / Milestones */}
                <div className="p-6">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Milestones & Progress</h3>
                  <div className="divide-y divide-gray-100">
                    {project.tasks.length === 0 ? (
                      <p className="text-sm text-gray-500 py-2">Belum ada tahapan pekerjaan yang dicatat.</p>
                    ) : (
                      project.tasks.map((task: any) => (
                        <div key={task.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{task.title}</h4>
                            {task.notes && <p className="text-sm text-gray-500 mt-1">{task.notes}</p>}
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="w-full md:w-64">
                            <div className="flex justify-between text-xs font-bold mb-1">
                              <span className={task.progress === 100 ? "text-green-600" : "text-blue-600"}>
                                {task.status.toUpperCase()}
                              </span>
                              <span className="text-gray-600">{task.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                              <div 
                                className={`h-2.5 rounded-full transition-all duration-700 ${task.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
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
      </main>
    </div>
  )
})
