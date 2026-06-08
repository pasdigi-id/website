import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  const db = c.env.DB;
  const projectId = c.req.param('id');
  
  // Ambil detail proyek
  const project = await db.prepare(`
    SELECT p.*, u.email as client_email, u.crm_data 
    FROM projects p 
    LEFT JOIN users u ON p.client_id = u.id 
    WHERE p.id = ?
  `).bind(projectId).first();

  if (!project) return c.notFound();

  // Ambil history progress (tracks)
  const { results: tracks } = await db.prepare(`
    SELECT * FROM project_tracks WHERE project_id = ? ORDER BY created_at DESC
  `).bind(projectId).all();

  return c.render(
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
        <header className="mb-8">
          <a href="/admin/projects" className="text-blue-600 font-semibold text-sm hover:underline mb-2 inline-block">&larr; Kembali ke Daftar Proyek</a>
          <h1 className="text-3xl font-extrabold text-gray-900">{project.title}</h1>
          <p className="text-gray-500 mt-1">Klien: {project.client_email}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Kolom Kiri: Form Update Progress */}
          <div className="md:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-fit sticky top-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Update Progress</h2>
            <form id="form-track" className="space-y-4">
              <input type="hidden" id="project_id" value={project.id} />
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Judul Tahapan (Task)</label>
                <input type="text" id="t-title" required className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500" placeholder="Misal: Desain UI Selesai" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                <select id="t-status" className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 bg-gray-50">
                  <option value="doing">Sedang Dikerjakan (Doing)</option>
                  <option value="done">Selesai (Done)</option>
                  <option value="blocked">Terkendala (Blocked)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Persentase (%)</label>
                <input type="number" id="t-progress" required min="0" max="100" defaultValue="0" className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Catatan untuk Klien</label>
                <textarea id="t-notes" rows={3} className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500" placeholder="Catatan akan terlihat oleh klien..."></textarea>
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                Simpan & Beritahu Klien
              </button>
            </form>
          </div>

          {/* Kolom Kanan: Timeline Progress */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Riwayat Progress (Timeline)</h2>
              
              {tracks.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Belum ada progress yang dicatat untuk proyek ini.</p>
              ) : (
                <div className="space-y-6">
                  {tracks.map((track: any) => (
                    <div key={track.id} className="flex gap-4">
                      {/* Garis Timeline */}
                      <div className="flex flex-col items-center">
                        <div className={`w-4 h-4 rounded-full ${track.status === 'done' ? 'bg-green-500' : track.status === 'blocked' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                        <div className="w-0.5 bg-gray-200 h-full mt-2"></div>
                      </div>
                      
                      {/* Konten Timeline */}
                      <div className="pb-6 w-full">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-gray-900 text-lg">{track.title}</h3>
                          <span className="text-xs font-bold text-gray-500">{new Date(track.created_at).toLocaleDateString('id-ID')}</span>
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${track.status === 'done' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                            {track.status}
                          </span>
                          <span className="text-sm font-semibold text-gray-600">Progress: {track.progress_percentage}%</span>
                        </div>
                        {track.notes_for_client && (
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm text-gray-700 mt-2">
                            {track.notes_for_client}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <script dangerouslySetInnerHTML={{
        __html: `
          document.getElementById('form-track').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            btn.innerText = 'Menyimpan...'; btn.disabled = true;

            const payload = {
              project_id: document.getElementById('project_id').value,
              title: document.getElementById('t-title').value,
              status: document.getElementById('t-status').value,
              progress_percentage: parseInt(document.getElementById('t-progress').value),
              notes_for_client: document.getElementById('t-notes').value
            };

            try {
              const res = await fetch('/api/admin/projects/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });
              
              if(res.ok) window.location.reload();
              else alert('Gagal memperbarui progress.');
            } catch (err) { alert('Server error'); }
            finally { btn.innerText = 'Simpan & Beritahu Klien'; btn.disabled = false; }
          });
        `
      }} />
    </div>,
    { title: `Detail Proyek - ${project.title}` }
  )
})
