import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  const db = c.env.DB;
  const userId = c.req.param('id');
  
  const user = await db.prepare("SELECT * FROM users WHERE id = ?").bind(userId).first();
  if (!user) return c.notFound();

  let crmData: any = {};
  try { crmData = user.crm_data ? JSON.parse(user.crm_data as string) : {}; } catch(e){}

  return c.render(
    <div className="p-6 md:p-10 max-w-4xl mx-auto w-full">
      <header className="mb-8">
        <a href="/admin/crm" className="text-blue-600 font-semibold text-sm hover:underline mb-2 inline-block">&larr; Kembali ke Daftar Klien</a>
        <h1 className="text-3xl font-extrabold text-gray-900">Profil Klien</h1>
        <p className="text-gray-500 mt-1 font-mono text-sm">ID: {user.id}</p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <form id="form-edit-user" className="space-y-6">
          <input type="hidden" id="user_id" value={user.id} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Login (Tidak bisa diubah)</label>
              <input type="text" disabled defaultValue={user.email as string} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-100 text-gray-500 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Hak Akses (Role)</label>
              <select id="role" defaultValue={user.role as string} className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="member">Member / Klien</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900 pt-2">Data Perusahaan (CRM)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap PIC</label>
              <input type="text" id="crm_name" defaultValue={crmData.name || ''} className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nomor WhatsApp / Telepon</label>
              <input type="text" id="crm_phone" defaultValue={crmData.phone || ''} className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nama Perusahaan / Institusi</label>
            <input type="text" id="crm_company" defaultValue={crmData.company || ''} className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Alamat Penagihan / Operasional</label>
            <textarea id="crm_address" rows={3} defaultValue={crmData.address || ''} className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
          document.getElementById('form-edit-user').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            btn.innerText = 'Menyimpan...'; btn.disabled = true;

            const id = document.getElementById('user_id').value;
            const payload = {
              role: document.getElementById('role').value,
              crm_data: {
                name: document.getElementById('crm_name').value,
                phone: document.getElementById('crm_phone').value,
                company: document.getElementById('crm_company').value,
                address: document.getElementById('crm_address').value
              }
            };

            try {
              const res = await fetch(\`/api/admin/users/\${id}\`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });
              if(res.ok) {
                alert('Data berhasil diperbarui.');
                window.location.reload();
              } else alert('Gagal memperbarui data.');
            } catch (err) { alert('Server error'); }
            finally { btn.innerText = 'Simpan Perubahan'; btn.disabled = false; }
          });
        `
      }} />
    </div>,
    { title: `Detail Klien - ${user.email}` }
  )
})
