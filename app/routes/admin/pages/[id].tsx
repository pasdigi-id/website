import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  const db = c.env.DB;
  const pageId = c.req.param('id');
  const page = await db.prepare("SELECT * FROM pages WHERE id = ?").bind(pageId).first();
  
  if (!page) return c.notFound();

  return c.render(
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <main className="flex-1 p-6 md:p-10 max-w-4xl mx-auto w-full">
        <header className="mb-8">
          <a href="/admin/pages" className="text-blue-600 font-semibold text-sm hover:underline mb-2 inline-block">&larr; Batal & Kembali</a>
          <h1 className="text-3xl font-extrabold text-gray-900">Edit Halaman</h1>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form id="form-edit-page" className="space-y-6">
            <input type="hidden" id="page_id" value={page.id} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Judul Halaman</label>
                <input type="text" id="title" defaultValue={page.title} required className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">URL Slug</label>
                <input type="text" id="slug" defaultValue={page.slug} required className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Konten HTML Utama</label>
              <textarea id="content" rows={10} defaultValue={page.content} className="w-full border border-gray-200 rounded-xl p-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">SEO Title</label>
                <input type="text" id="seo_title" defaultValue={page.seo_title || ''} className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Status Publikasi</label>
                <select id="status" defaultValue={page.status} className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none">
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button type="submit" className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition">
                Perbarui Halaman
              </button>
            </div>
          </form>
        </div>
      </main>

      <script dangerouslySetInnerHTML={{
        __html: `
          document.getElementById('form-edit-page').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            btn.innerText = 'Memperbarui...'; btn.disabled = true;

            const id = document.getElementById('page_id').value;
            const payload = {
              title: document.getElementById('title').value,
              slug: document.getElementById('slug').value,
              content: document.getElementById('content').value,
              seo_title: document.getElementById('seo_title').value,
              status: document.getElementById('status').value
            };

            try {
              // Menembak endpoint PUT API
              const res = await fetch(\`/api/admin/cms/content/page/\${id}\`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });
              if(res.ok) window.location.href = '/admin/pages';
              else alert('Gagal memperbarui data.');
            } catch (err) { alert('Server error'); }
            finally { btn.innerText = 'Perbarui Halaman'; btn.disabled = false; }
          });
        `
      }} />
    </div>,
    { title: `Edit - ${page.title}` }
  )
})
