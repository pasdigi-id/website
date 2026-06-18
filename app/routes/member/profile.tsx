import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  const db = c.env.DB;
  const payload = c.get('jwtPayload');
  
  if (!payload || !payload.sub) {
    return c.redirect('/login');
  }

  const userId = payload.sub;
  
  // Mengambil data user langsung dari database (tanpa fetch internal loopback)
  const user = await db.prepare(
    "SELECT email, role, crm_data FROM users WHERE id = ?"
  ).bind(userId).first() || {};

  let crmData: any = {};
  try { crmData = user.crm_data ? JSON.parse(user.crm_data as string) : {}; } catch(e){}

  return c.render(
    <div className="max-w-3xl mx-auto">
      <header className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Akun & Profil Saya</h1>
        <p className="text-slate-500 mt-2 text-sm">Kelola informasi kontak dan pengaturan keamanan akun Anda.</p>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <form id="form-profile" className="space-y-8">
          
          <div className="pb-8 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Informasi Dasar</h3>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Login</label>
              <input type="email" disabled defaultValue={user.email as string} className="w-full border border-slate-200 rounded-lg p-3 bg-slate-50 text-slate-500 cursor-not-allowed shadow-inner" />
              <p className="text-xs text-slate-400 mt-2">Email digunakan sebagai akses utama. Hubungi Administrator kami jika terjadi perubahan email perusahaan.</p>
            </div>
          </div>

          <div className="pb-8 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Data Institusi / Kontak (CRM)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Representatif</label>
                <input type="text" disabled defaultValue={crmData.name || '-'} className="w-full border border-slate-200 rounded-lg p-3 bg-slate-50 text-slate-700 shadow-inner" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Perusahaan</label>
                <input type="text" disabled defaultValue={crmData.company || '-'} className="w-full border border-slate-200 rounded-lg p-3 bg-slate-50 text-slate-700 shadow-inner" />
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2">Data resmi ini dikelola oleh tim Sales kami berdasarkan kontrak yang berjalan.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 text-red-600">Keamanan</h3>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Ganti Kata Sandi (Password)</label>
            <input type="password" id="new_password" placeholder="Ketik kata sandi baru untuk mengubahnya..." className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition" />
            <p className="text-xs text-slate-400 mt-2">Biarkan kosong jika Anda tidak ingin mengubah kata sandi.</p>
          </div>

          <div className="pt-2 flex justify-end">
            <button type="submit" id="btn-submit" className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-600 transition shadow-md shadow-slate-200">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
          // Form submission di sisi Client tetap menggunakan fetch API internal,
          // karena ini berjalan di browser, BUKAN di server SSR. Ini 100% aman.
          document.getElementById('form-profile').addEventListener('submit', async (e) => {
            e.preventDefault();
            const password = document.getElementById('new_password').value;
            if(!password) {
              alert('Anda belum mengetikkan password baru.');
              return;
            }

            const btn = document.getElementById('btn-submit');
            btn.innerText = 'Memperbarui Keamanan...'; btn.disabled = true;

            try {
              const res = await fetch('/api/member/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: password })
              });
              
              const data = await res.json();
              if(res.ok) {
                alert('Password berhasil diperbarui.');
                document.getElementById('new_password').value = '';
              } else {
                alert(data.error || 'Gagal memperbarui profil.');
              }
            } catch (err) {
              alert('Terjadi kesalahan jaringan.');
            } finally {
              btn.innerText = 'Simpan Perubahan'; btn.disabled = false;
            }
          });
        `
      }} />
    </div>,
    { title: 'Profil & Keamanan - Client Portal' }
  )
})
