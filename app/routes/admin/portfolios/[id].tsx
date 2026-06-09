import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  
  const item = await db.prepare("SELECT * FROM portfolios WHERE id = ?").bind(id).first();
  if (!item) return c.notFound();

  const { results: categories } = await db.prepare("SELECT id, name FROM categories WHERE type = 'portfolio'").all();

  return c.render(
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
        <header className="mb-8">
          <a href="/admin/portfolios" className="text-blue-600 font-semibold text-sm hover:underline mb-2 inline-block">&larr; Batal & Kembali</a>
          <h1 className="text-3xl font-extrabold text-gray-900">Edit Portofolio</h1>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form id="form-edit-portfolio" className="space-y-6">
            <input type="hidden" id="item_id" value={item.id} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Judul</label>
                <input type="text" id="title" defaultValue={item.title as string} required className="w-full border border-gray-200 rounded-xl p-3 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">URL Slug</label>
                <input type="text" id="slug" defaultValue={item.slug as string} required className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Kategori</label>
              <select id="category_id" defaultValue={item.category_id as string} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 outline-none">
                <option value="">-- Tanpa Kategori --</option>
                {categories.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Konten Detail</label>
              <textarea id="content" rows={10} defaultValue={item.content as string} className="w-full border border-gray-200 rounded-xl p-3 font-mono text-sm outline-none"></textarea>
            </div>

            <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700 mb-1">Status Publikasi</label>
                <select id="status" defaultValue={item.status as string} className="w-48 border border-gray-200 rounded-lg p-2 text-sm outline-none">
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <button type="submit" className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition">
                Perbarui Data
              </button>
            </div>
          </form>
        </div>
      </main>

      <script dangerouslySetInnerHTML={{
        __html: `
          document.getElementById('form-edit-portfolio').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            btn.innerText = 'Memperbarui...'; btn.disabled = true;

            const id = document.getElementById('item_id').value;
            const payload = {
              title: document.getElementById('title').value,
              slug: document.getElementById('slug').value,
              category_id: document.getElementById('category_id').value || null,
              content: document.getElementById('content').value,
              status: document.getElementById('status').value
            };

            try {
              const res = await fetch(\`/api/admin/cms/content/portfolio/\${id}\`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });
              if(res.ok) window.location.href = '/admin/portfolios';
              else alert('Gagal memperbarui data.');
            } catch (err) { alert('Server error'); }
            finally { btn.innerText = 'Perbarui Data'; btn.disabled = false; }
          });
        `
      }} />
    </div>,
    { title: `Edit - ${item.title}` }
  )
})
