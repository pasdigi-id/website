import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  const db = c.env.DB;
  
  // Ambil HANYA kategori bertipe 'blog'
  const { results: categories } = await db.prepare(`
    SELECT * FROM categories WHERE type = 'blog' ORDER BY name ASC
  `).all();

  return c.render(
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Header (Membentang Penuh) */}
        <header className="md:col-span-3 mb-2 border-b border-gray-200 pb-6">
          <div className="flex items-center gap-4 mb-2">
            <a href="/admin/blog" className="text-blue-600 font-semibold text-sm hover:underline">Artikel Blog</a>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-bold text-sm">Kategori Blog</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Kategori Blog</h1>
          <p className="text-gray-500 mt-1">Kelola taksonomi untuk mengelompokkan artikel Anda.</p>
        </header>

        {/* Kolom Kiri: Form Tambah Kategori */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Tambah Kategori Baru</h2>
            <form id="form-category" className="space-y-4">
              {/* Tipe Kategori: Terkunci untuk 'blog' */}
              <input type="hidden" id="c-type" value="blog" />
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nama Kategori</label>
                <input type="text" id="c-name" required className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Misal: Teknologi" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">URL Slug</label>
                <input type="text" id="c-slug" required className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 outline-none" placeholder="teknologi" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Induk Kategori (Parent)</label>
                <select id="c-parent" className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 outline-none">
                  <option value="">-- Tidak Ada Induk --</option>
                  {categories.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-blue-700 transition mt-4">
                Simpan Kategori
              </button>
            </form>
          </div>
        </div>

        {/* Kolom Kanan: Tabel Daftar Kategori */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                <tr>
                  <th className="p-4 font-bold">Nama Kategori</th>
                  <th className="p-4 font-bold">Slug URL</th>
                  <th className="p-4 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.length === 0 ? (
                  <tr><td colSpan={3} className="p-8 text-center text-gray-400">Belum ada kategori blog.</td></tr>
                ) : (
                  categories.map((cat: any) => (
                    <tr key={cat.id} className="hover:bg-gray-50">
                      <td className="p-4 font-semibold text-gray-900">
                        {cat.parent_id ? <span className="text-gray-300 mr-2">↳</span> : null}
                        {cat.name}
                      </td>
                      <td className="p-4 text-gray-500 text-sm">{cat.slug}</td>
                      <td className="p-4 text-right space-x-3">
                        <button className="text-red-500 font-bold text-sm hover:underline btn-delete" data-id={cat.id}>Hapus</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <script dangerouslySetInnerHTML={{
        __html: `
          // Auto Slug Generator
          document.getElementById('c-name').addEventListener('input', (e) => {
            document.getElementById('c-slug').value = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
          });

          // AJAX Simpan Kategori Baru
          document.getElementById('form-category').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            btn.innerText = 'Menyimpan...'; btn.disabled = true;

            const payload = {
              type: document.getElementById('c-type').value,
              name: document.getElementById('c-name').value,
              slug: document.getElementById('c-slug').value,
              parent_id: document.getElementById('c-parent').value || null
            };

            try {
              const res = await fetch('/api/taxonomy/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });
              const data = await res.json();
              if(res.ok) window.location.reload();
              else alert(data.error || 'Gagal menyimpan kategori.');
            } catch (err) { alert('Server error'); }
            finally { btn.innerText = 'Simpan Kategori'; btn.disabled = false; }
          });

          // AJAX Hapus Kategori
          document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async (e) => {
              if(!confirm('Yakin ingin menghapus kategori ini?')) return;
              const id = e.target.getAttribute('data-id');
              
              try {
                const res = await fetch(\`/api/taxonomy/categories/\${id}\`, { method: 'DELETE' });
                if(res.ok) window.location.reload();
                else alert('Gagal menghapus kategori.');
              } catch (err) { alert('Server error'); }
            });
          });
        `
      }} />
    </div>,
    { title: 'Kategori Blog' }
  )
})
