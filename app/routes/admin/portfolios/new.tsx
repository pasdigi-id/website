import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  const db = c.env.DB;
  const { results: categories } = await db.prepare("SELECT id, name FROM categories WHERE type = 'portfolio'").all();

  return c.render(
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
        <header className="mb-8">
          <a href="/admin/portfolios" className="text-blue-600 font-semibold text-sm hover:underline mb-2 inline-block">&larr; Kembali ke Daftar Portofolio</a>
          <h1 className="text-3xl font-extrabold text-gray-900">Tambah Portofolio Baru</h1>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form id="form-new-portfolio" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Judul Proyek / Portofolio</label>
                <input type="text" id="title" required className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">URL Slug</label>
                <input type="text" id="slug" required className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Kategori</label>
                <select id="category_id" className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 outline-none">
                  <option value="">-- Tanpa Kategori --</option>
                  {categories.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nama Klien (Opsional)</label>
                <input type="text" id="client_name" className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Misal: PT Inovasi Digital" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Konten Detail (HTML / Deskripsi Studi Kasus)</label>
              <textarea id="content" rows={10} className="w-full border border-gray-200 rounded-xl p-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
            </div>

            <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700 mb-1">Status Publikasi</label>
                <select id="status" className="w-48 border border-gray-200 rounded-lg p-2 text-sm outline-none">
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <button type="submit" className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 transition">
                Simpan Portofolio
              </button>
            </div>
          </form>
        </div>
      </main>

      <script dangerouslySetInnerHTML={{
        __html: `
          document.getElementById('title').addEventListener('input', (e) => {
            document.getElementById('slug').value = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
          });

          document.getElementById('form-new-portfolio').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            btn.innerText = 'Menyimpan...'; btn.disabled = true;

            const payload = {
              title: document.getElementById('title').value,
              slug: document.getElementById('slug').value,
              category_id: document.getElementById('category_id').value || null,
              content: document.getElementById('content').value,
              status: document.getElementById('status').value
            };

            // Tambahkan field khusus jika diperlukan oleh schema Anda (misal client_name)
            const clientName = document.getElementById('client_name').value;
            if(clientName) payload.client_name = clientName;

            try {
              const res = await fetch('/api/admin/cms/content/portfolio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });
              if(res.ok) window.location.href = '/admin/portfolios';
              else alert('Gagal menyimpan. Slug mungkin sudah dipakai.');
            } catch (err) { alert('Server error'); }
            finally { btn.innerText = 'Simpan Portofolio'; btn.disabled = false; }
          });
        `
      }} />
    </div>,
    { title: 'Tambah Portofolio Baru' }
  )
})
