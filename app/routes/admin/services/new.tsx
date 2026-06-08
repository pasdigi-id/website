import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  const db = c.env.DB;
  const { results: categories } = await db.prepare("SELECT id, name FROM categories WHERE type = 'service'").all();

  return c.render(
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
        <header className="mb-8">
          <a href="/admin/services" className="text-blue-600 font-semibold text-sm hover:underline mb-2 inline-block">&larr; Kembali ke Katalog Layanan</a>
          <h1 className="text-3xl font-extrabold text-gray-900">Buat Layanan Baru</h1>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form id="form-new-service" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nama Layanan</label>
                <input type="text" id="title" required className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Kategori Induk</label>
                <select id="category_id" className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 outline-none">
                  <option value="">-- Tanpa Kategori --</option>
                  {categories.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi Header (Singkat)</label>
              <textarea id="short_desc" rows={2} className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Teks yang muncul besar di header layanan..."></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-blue-50 rounded-xl border border-blue-100">
              <div>
                <label className="block text-sm font-bold text-blue-900 mb-2">Daftar Keunggulan</label>
                <input type="text" id="benefits" placeholder="Misal: Cepat, Garansi 1 Tahun, Bantuan 24/7" className="w-full border border-blue-200 rounded-xl p-3 outline-none" />
                <p className="text-xs text-blue-600 mt-1">*Pisahkan dengan koma</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-blue-900 mb-2">Teks Tombol CTA</label>
                <input type="text" id="cta_text" defaultValue="Konsultasi Gratis Sekarang" className="w-full border border-blue-200 rounded-xl p-3 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Penjelasan Detail (HTML)</label>
              <textarea id="content" rows={8} className="w-full border border-gray-200 rounded-xl p-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                Terbitkan Layanan
              </button>
            </div>
          </form>
        </div>
      </main>

      <script dangerouslySetInnerHTML={{
        __html: `
          document.getElementById('form-new-service').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            btn.innerText = 'Menyimpan...'; btn.disabled = true;
            
            const title = document.getElementById('title').value;
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            const benefitsRaw = document.getElementById('benefits').value;
            const benefitsArray = benefitsRaw ? benefitsRaw.split(',').map(s => s.trim()) : [];

            const payload = {
              title: title,
              slug: slug,
              category_id: document.getElementById('category_id').value || null,
              short_description: document.getElementById('short_desc').value,
              benefits: benefitsArray,
              cta_text: document.getElementById('cta_text').value,
              content: document.getElementById('content').value,
              status: 'published'
            };

            try {
              const res = await fetch('/api/admin/cms/content/service', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });
              if(res.ok) window.location.href = '/admin/services';
              else alert('Gagal menyimpan layanan.');
            } catch (err) { alert('Server error'); }
            finally { btn.innerText = 'Terbitkan Layanan'; btn.disabled = false; }
          });
        `
      }} />
    </div>,
    { title: 'Tambah Layanan Baru' }
  )
})
