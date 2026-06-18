import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  const db = c.env.DB;
  const payload = c.get('jwtPayload');
  
  if (!payload || !payload.sub) {
    return c.redirect('/login');
  }

  const userId = payload.sub;
  
  // Mengambil data user langsung dari database
  const user = await db.prepare(
    "SELECT email, role, crm_data FROM users WHERE id = ?"
  ).bind(userId).first() || {};

  let crmData: any = {};
  try { crmData = user.crm_data ? JSON.parse(user.crm_data as string) : {}; } catch(e){}

  return c.render(
    <div className="max-w-4xl mx-auto">
      <header className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Akun & Profil Saya</h1>
        <p className="text-slate-500 mt-2 text-sm">Kelola informasi kontak dan pengaturan keamanan akun Anda.</p>
      </header>

      <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-200 p-8">
        <form id="form-profile" className="space-y-8">
          
          <div className="pb-8 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Akses & Login</h3>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Akun</label>
              {/* KOREKSI: Menggunakan 'value' bukan 'defaultValue' */}
              <input type="email" disabled value={(user.email as string) || ''} className="w-full border border-slate-200 rounded-lg p-3 bg-slate-50 text-slate-500 cursor-not-allowed shadow-inner" />
              <p className="text-xs text-slate-400 mt-2">Email digunakan sebagai akses utama dan tidak dapat diubah di sini. Hubungi Administrator jika terjadi pergantian email perusahaan.</p>
            </div>
          </div>

          <div className="pb-8 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Informasi Pribadi & Perusahaan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Lengkap PIC</label>
                {/* KOREKSI: Menggunakan 'value' */}
                <input type="text" id="crm_name" value={crmData.name || ''} className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="Cth: John Doe" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Perusahaan / Institusi</label>
                <input type="text" id="crm_company" value={crmData.company || ''} className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="Cth: PT Inovasi Digital" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nomor Telepon / WhatsApp</label>
                <input type="text" id="crm_phone" value={crmData.phone || ''} className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="Cth: 08123456789" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Alamat Domisili / Penagihan</label>
                <input type="text" id="crm_address" value={crmData.address || ''} className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="Alamat lengkap..." />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 text-red-600">Keamanan</h3>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Ganti Kata Sandi (Password)</label>
            {/* Password sengaja tidak memiliki value agar selalu kosong saat dimuat */}
            <input type="password" id="new_password" placeholder="Ketik kata sandi baru untuk mengubahnya..." className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition" />
            <p className="text-xs text-slate-400 mt-2">Biarkan kosong jika Anda tidak ingin mengubah kata sandi.</p>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" id="btn-submit" className="bg-slate-900 text-white px-8 py-3.5 rounded-lg font-bold hover:bg-indigo-600 transition shadow-lg shadow-slate-200">
              Simpan Semua Perubahan
            </button>
          </div>
        </form>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
          document.getElementById('form-profile').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btn = document.getElementById('btn-submit');
            btn.innerText = 'Menyimpan Data...'; 
            btn.disabled = true;

            const payload = {
              name: document.getElementById('crm_name').value,
              company: document.getElementById('crm_company').value,
              phone: document.getElementById('crm_phone').value,
              address: document.getElementById('crm_address').value,
              password: document.getElementById('new_password').value
            };

            try {
              const res = await fetch('/api/member/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });
              
              const data = await res.json();
              if(res.ok) {
                alert(data.message || 'Profil berhasil diperbarui!');
                document.getElementById('new_password').value = ''; 
              } else {
                alert(data.error || 'Gagal memperbarui profil.');
              }
            } catch (err) {
              alert('Terjadi kesalahan jaringan.');
            } finally {
              btn.innerText = 'Simpan Semua Perubahan'; 
              btn.disabled = false;
            }
          });
        `
      }} />
    </div>,
    { title: 'Profil & Keamanan - Client Portal' }
  )
})
