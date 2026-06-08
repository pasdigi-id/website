import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  const db = c.env.DB;
  // SSR: Ambil daftar user dengan role 'member' untuk opsi dropdown Klien
  const { results: clients } = await db.prepare("SELECT id, email FROM users WHERE role = 'member'").all();

  return c.render(
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <main className="flex-1 p-6 md:p-10 max-w-4xl mx-auto w-full">
        <header className="mb-8">
          <a href="/admin/projects" className="text-blue-600 font-semibold text-sm hover:underline mb-2 inline-block">&larr; Kembali ke Daftar Proyek</a>
          <h1 className="text-3xl font-extrabold text-gray-900">Buat Proyek Baru</h1>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form id="form-new-project" className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Pilih Klien</label>
              <select id="client_id" required className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="">-- Pilih Akun Klien --</option>
                {clients.map((client: any) => (
                  <option key={client.id} value={client.id}>{client.email}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nama / Judul Proyek</label>
              <input type="text" id="title" required className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Misal: Redesign Website Perusahaan" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Tenggat Waktu (Target Selesai)</label>
              <input type="date" id="end_date" required className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi Awal Proyek</label>
              <textarea id="description" rows={5} className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Catatan internal atau deskripsi singkat proyek..."></textarea>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button type="submit" className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition">
                Simpan Proyek
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Eksekusi ke Jalur API secara asinkron */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.getElementById('form-new-project').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerText = 'Menyimpan...'; btn.disabled = true;

            const payload = {
              client_id: document.getElementById('client_id').value,
              title: document.getElementById('title').value,
              end_date: document.getElementById('end_date').value,
              description: document.getElementById('description').value
            };

            try {
              // Menembak ke file Backend: src/api/projects_admin.ts
              const res = await fetch('/api/admin/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });
              
              if(res.ok) {
                window.location.href = '/admin/projects';
              } else {
                const data = await res.json();
                alert('Gagal: ' + (data.error || 'Terjadi kesalahan.'));
              }
            } catch (err) {
              alert('Koneksi terputus. Gagal mencapai server API.');
            } finally {
              btn.innerText = originalText; btn.disabled = false;
            }
          });
        `
      }} />
    </div>
  )
})
