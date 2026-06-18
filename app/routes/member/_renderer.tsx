import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  const db = c.env.DB;
  
  // Karena folder ini dilindungi oleh _middleware.ts, kita bisa langsung mengambil ID User dari JWT
  const payload = c.get('jwtPayload');
  
  // Keamanan ganda: Jika entah bagaimana payload kosong, tendang ke halaman login
  if (!payload || !payload.sub) {
    return c.redirect('/login');
  }

  const clientId = payload.sub;
  
  // MENGAMBIL DATA SECARA LANGSUNG DARI DATABASE (Tanpa HTTP Fetch Internal)
  const query = `
    SELECT 
      p.id as project_id, p.title, p.status as project_status, p.end_date,
      pt.id as track_id, pt.title as task_title, pt.progress_percentage, pt.status as task_status, pt.notes_for_client
    FROM projects p
    LEFT JOIN project_tracks pt ON p.id = pt.project_id
    WHERE p.client_id = ?
    ORDER BY p.created_at DESC, pt.updated_at ASC
  `;
  
  const { results } = await db.prepare(query).bind(clientId).all();

  // Format data flat dari SQL menjadi struktur berjenjang (nested)
  const projects = results.reduce((acc: any, row: any) => {
    let project = acc.find((p: any) => p.id === row.project_id);
    if (!project) {
      project = {
        id: row.project_id,
        title: row.title,
        status: row.project_status,
        end_date: row.end_date,
        tasks: []
      };
      acc.push(project);
    }
    if (row.track_id) {
      project.tasks.push({
        id: row.track_id,
        title: row.task_title,
        progress: row.progress_percentage,
        status: row.task_status,
        notes: row.notes_for_client
      });
    }
    return acc;
  }, []);

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('done') || s.includes('selesai')) return 'bg-[#00C875] text-white';
    if (s.includes('doing') || s.includes('proses')) return 'bg-[#FDAB3D] text-white';
    if (s.includes('blocked') || s.includes('kendala')) return 'bg-[#E2445C] text-white';
    return 'bg-[#C4C4C4] text-white';
  };

  return c.render(
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Project Boards</h1>
          <p className="text-sm text-slate-500 mt-1">Pantau perkembangan task dan milestone proyek Anda secara real-time.</p>
        </div>
        <a href="/contact" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm shadow-indigo-200 transition flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          Request Layanan Baru
        </a>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-16 text-center shadow-sm flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Belum Ada Proyek</h3>
          <p className="text-slate-500 text-sm mb-6 max-w-sm">Anda belum memiliki proyek yang sedang berjalan. Hubungi tim kami untuk memulai kolaborasi.</p>
          <a href="/contact" className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-2 rounded-lg text-sm font-semibold transition shadow-sm">
            Hubungi Tim Sales
          </a>
        </div>
      ) : (
        <div className="space-y-10">
          {projects.map((project: any) => (
            <div key={project.id} className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-200 overflow-hidden">
              
              <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 leading-tight">{project.title}</h2>
                    <div className="flex items-center gap-4 mt-1 text-xs font-medium text-slate-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        Tenggat: {project.end_date ? new Date(project.end_date).toLocaleDateString('id-ID') : '-'}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        {project.tasks.length} Tasks
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Status Proyek</span>
                  <span className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider ${getStatusColor(project.status)} shadow-sm`}>
                    {project.status || 'Perencanaan'}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b border-slate-200">
                      <th className="py-3 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider w-1/2">Nama Item / Task</th>
                      <th className="py-3 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider w-1/4 text-center">Status</th>
                      <th className="py-3 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider w-1/4">Progress</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {project.tasks.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-sm text-slate-400 bg-slate-50/50">
                          Timeline pekerjaan sedang disusun oleh tim.
                        </td>
                      </tr>
                    ) : (
                      project.tasks.map((task: any) => (
                        <tr key={task.id} className="hover:bg-slate-50 transition group">
                          <td className="py-4 px-6 align-top">
                            <div className="font-semibold text-sm text-slate-800">{task.title}</div>
                            {task.notes && (
                              <div className="mt-2 text-xs text-slate-500 bg-white border border-slate-200 p-2.5 rounded-lg shadow-sm flex items-start gap-2">
                                <svg className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                <span>{task.notes}</span>
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-6 align-middle text-center">
                            <div className={`inline-block px-3 py-1.5 rounded-md text-xs font-bold uppercase w-full max-w-[120px] shadow-sm ${getStatusColor(task.status)}`}>
                              {task.status}
                            </div>
                          </td>
                          <td className="py-4 px-6 align-middle">
                            <div className="flex items-center gap-3">
                              <div className="w-full bg-slate-100 rounded-full h-2.5 shadow-inner overflow-hidden border border-slate-200">
                                <div 
                                  className={`h-full rounded-full transition-all duration-1000 ${task.progress === 100 ? 'bg-[#00C875]' : 'bg-indigo-500'}`}
                                  style={{ width: `${task.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-bold text-slate-600 w-8">{task.progress}%</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>,
    { title: 'Project Boards - Client Portal' }
  )
})
