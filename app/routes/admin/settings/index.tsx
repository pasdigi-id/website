import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  const kv = c.env.CACHE_KV;
  
  // Mengambil konfigurasi saat ini dari KV
  let settings: any = {};
  try {
    const data = await kv.get('landing_page_data', 'json');
    if (data) settings = data;
  } catch (e) {}

  return c.render(
    <div className="p-6 md:p-10 max-w-4xl mx-auto w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Pengaturan Global</h1>
        <p className="text-gray-500 mt-1">Atur informasi fundamental yang akan ditampilkan di halaman publik.</p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <form id="form-settings" className="space-y-6">
          
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Identitas & SEO (Tag Header)</h3>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Meta Title Utama (SEO)</label>
            <input type="text" id="seo_title" defaultValue={settings.seo_title || 'Pasdigi - Solusi Digital'} required className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Meta Description Utama (SEO)</label>
            <textarea id="seo_desc" rows={3} defaultValue={settings.seo_description || ''} className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
          </div>

          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 pt-4">Teks Landing Page (Beranda)</h3>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Judul Utama (Hero Title)</label>
            <input type="text" id="hero_title" defaultValue={settings.hero_title || 'Transformasi Digital Perusahaan Anda'} className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Kata Kunci Highlight (Hero Highlight)</label>
            <input type="text" id="hero_title_highlight" defaultValue={settings.hero_title_highlight || 'Lebih Cepat & Cerdas.'} className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
            <p className="text-xs text-gray-500 mt-1">Teks ini akan diberi warna gradien khusus di halaman depan.</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi Sub-Judul (Hero Subtitle)</label>
            <textarea id="hero_subtitle" rows={3} defaultValue={settings.hero_subtitle || ''} className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button type="submit" className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 transition">
              Simpan Pengaturan
            </button>
          </div>
        </form>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
          document.getElementById('form-settings').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            btn.innerText = 'Menyimpan...'; btn.disabled = true;

            const payload = {
              seo_title: document.getElementById('seo_title').value,
              seo_description: document.getElementById('seo_desc').value,
              hero_title: document.getElementById('hero_title').value,
              hero_title_highlight: document.getElementById('hero_title_highlight').value,
              hero_subtitle: document.getElementById('hero_subtitle').value
            };

            try {
              // Kita buat endpoint ini di file src/api/admin.ts
              const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });
              if(res.ok) {
                alert('Pengaturan Global berhasil diperbarui! Perubahan akan langsung terlihat di Landing Page.');
              } else alert('Gagal menyimpan pengaturan.');
            } catch (err) { alert('Server error'); }
            finally { btn.innerText = 'Simpan Pengaturan'; btn.disabled = false; }
          });
        `
      }} />
    </div>,
    { title: 'Pengaturan Global - Admin' }
  )
})
