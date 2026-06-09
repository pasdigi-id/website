import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  
  const blog = await db.prepare("SELECT * FROM blogs WHERE id = ?").bind(id).first();
  if (!blog) return c.notFound();

  const { results: categories } = await db.prepare("SELECT id, name FROM categories WHERE type = 'blog'").all();

  return c.render(
    <div className="p-6 md:p-10 max-w-5xl mx-auto w-full">
      <header className="mb-8">
        <a href="/admin/blog" className="text-blue-600 font-semibold text-sm hover:underline mb-2 inline-block">&larr; Batal & Kembali</a>
        <h1 className="text-3xl font-extrabold text-gray-900">Edit Artikel</h1>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <form id="form-edit-blog" className="space-y-6">
          <input type="hidden" id="item_id" value={blog.id} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Judul Artikel</label>
              <input type="text" id="title" defaultValue={blog.title as string} required className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">URL Slug</label>
              <input type="text" id="slug" defaultValue={blog.slug as string} required className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Kategori</label>
            <select id="category_id" defaultValue={blog.category_id as string} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 outline-none">
              <option value="">-- Tanpa Kategori --</option>
              {categories.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>

          {/* ========================================== */}
          {/* UPLOADER R2 (MENAMPILKAN GAMBAR LAMA JIKA ADA) */}
          {/* ========================================== */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Gambar Sampul (Cover Image)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-500 transition relative group bg-gray-50/50">
              <input type="file" id="cover_file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-20" />
              
              <div id="upload-placeholder" className={`space-y-2 py-4 ${blog.cover_image_url ? 'hidden' : ''}`}>
                <svg className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm font-semibold text-gray-600">Ganti gambar (Seret atau Klik)</p>
              </div>

              <div id="upload-preview" className={`${blog.cover_image_url ? '' : 'hidden'} w-full max-h-64 rounded-xl overflow-hidden relative z-30 bg-black`}>
                <img id="preview-img" src={(blog.cover_image_url as string) || ''} className="w-full max-h-64 object-contain mx-auto" />
                <button type="button" id="btn-remove-file" className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition z-40 font-bold text-sm">
                  Hapus
                </button>
              </div>
            </div>
            <input type="hidden" id="cover_image_url" defaultValue={(blog.cover_image_url as string) || ''} />
            <span id="upload-status" className="text-xs font-bold mt-2 block text-gray-500"></span>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Konten Artikel (HTML)</label>
            <textarea id="content" rows={12} required defaultValue={blog.content as string} className="w-full border border-gray-200 rounded-xl p-4 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">SEO Title</label>
              <input type="text" id="seo_title" defaultValue={blog.seo_title as string} className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">SEO Description</label>
              <textarea id="seo_description" rows={2} defaultValue={blog.seo_description as string} className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none"></textarea>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-1">Status Publikasi</label>
              <select id="status" defaultValue={blog.status as string} className="w-48 border border-gray-200 rounded-lg p-2 text-sm outline-none bg-white">
                <option value="published">Tayang (Published)</option>
                <option value="draft">Konsep (Draft)</option>
              </select>
            </div>
            <button type="submit" id="btn-submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-md">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
          const fileInput = document.getElementById('cover_file');
          const hiddenUrlInput = document.getElementById('cover_image_url');
          const placeholder = document.getElementById('upload-placeholder');
          const previewBox = document.getElementById('upload-preview');
          const previewImg = document.getElementById('preview-img');
          const removeBtn = document.getElementById('btn-remove-file');
          const statusText = document.getElementById('upload-status');
          const submitBtn = document.getElementById('btn-submit');

          // Upload ke R2
          fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            statusText.innerText = 'Mengunggah ke R2...';
            statusText.className = 'text-xs font-bold mt-2 block text-blue-600 animate-pulse';
            submitBtn.disabled = true;

            const formData = new FormData();
            formData.append('file', file);

            try {
              const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
              const data = await res.json();
              
              if (res.ok && data.success) {
                hiddenUrlInput.value = data.url;
                previewImg.src = data.url;
                placeholder.classList.add('hidden');
                previewBox.classList.remove('hidden');
                statusText.innerText = '✓ Gambar berhasil diganti.';
                statusText.className = 'text-xs font-bold mt-2 block text-green-600';
              } else {
                alert(data.error || 'Gagal mengunggah.');
                statusText.innerText = '✕ Gagal.';
                statusText.className = 'text-xs font-bold mt-2 block text-red-600';
              }
            } catch (err) {
              alert('Terjadi kesalahan jaringan.');
            } finally {
              submitBtn.disabled = false;
            }
          });

          removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            hiddenUrlInput.value = '';
            fileInput.value = '';
            previewBox.classList.add('hidden');
            placeholder.classList.remove('hidden');
            statusText.innerText = 'Gambar telah dihapus.';
          });

          // Submit Form Edit API
          document.getElementById('form-edit-blog').addEventListener('submit', async (e) => {
            e.preventDefault();
            submitBtn.innerText = 'Menyimpan...';
            submitBtn.disabled = true;

            const id = document.getElementById('item_id').value;
            const payload = {
              title: document.getElementById('title').value,
              slug: document.getElementById('slug').value,
              category_id: document.getElementById('category_id').value || null,
              cover_image_url: hiddenUrlInput.value || null,
              content: document.getElementById('content').value,
              seo_title: document.getElementById('seo_title').value,
              seo_description: document.getElementById('seo_description').value,
              status: document.getElementById('status').value
            };

            try {
              const res = await fetch(\`/api/admin/cms/content/blog/\${id}\`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });
              
              if (res.ok) window.location.href = '/admin/blog';
              else alert('Gagal menyimpan perubahan. Slug mungkin duplikat.');
            } catch (err) {
              alert('Koneksi terputus.');
            } finally {
              submitBtn.innerText = 'Simpan Perubahan';
              submitBtn.disabled = false;
            }
          });
        `
      }} />
    </div>,
    { title: `Edit - ${blog.title}` }
  )
})
