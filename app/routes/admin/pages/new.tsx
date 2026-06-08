import { createRoute } from 'honox/factory'

export default createRoute((c) => {
  return c.render(
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <main className="flex-1 p-6 md:p-10 max-w-4xl mx-auto w-full">
        <header className="mb-8">
          <a href="/admin/pages" className="text-blue-600 font-semibold text-sm hover:underline mb-2 inline-block">&larr; Kembali ke Daftar</a>
          <h1 className="text-3xl font-extrabold text-gray-900">Buat Halaman Baru</h1>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form id="form-new-page" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Judul Halaman</label>
                <input type="text" id="title" required className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">URL Slug</label>
                <input type="text" id="slug" required className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Konten HTML Utama</label>
              <textarea id="content" rows={10} className="w-full border border-gray-200 rounded-xl p-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">SEO Title</label>
                <input type="text" id="seo_title" className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Status Publikasi</label>
                <select id="status" className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none">
                  <option value="published">Published (Langsung Tayang)</option>
                  <option value="draft">Draft (Simpan Konsep)</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                Simpan Halaman
              </button>
            </div>
          </form>
        </div>
      </main>

      <script dangerouslySetInnerHTML={{
        __html: `
          // Auto slug generator
          document.getElementById('title').addEventListener('input', (e) => {
            document.getElementById('slug').value = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
          });

          document.getElementById('form-new-page').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            btn.innerText = 'Menyimpan...'; btn.disabled = true;

            const payload = {
              title: document.getElementById('title').value,
              slug: document.getElementById('slug').value,
              content: document.getElementById('content').value,
              seo_title: document.getElementById('seo_title').value,
              status: document.getElementById('status').value
            };

            try {
              const res = await fetch('/api/admin/cms/content/page', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });
              if(res.ok) window.location.href = '/admin/pages';
              else alert('Gagal menyimpan halaman. Slug mungkin sudah dipakai.');
            } catch (err) { alert('Server error'); }
            finally { btn.innerText = 'Simpan Halaman'; btn.disabled = false; }
          });
        `
      }} />
    </div>,
    { title: 'Tulis Halaman Baru' }
  )
})
