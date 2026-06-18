import { createRoute } from 'honox/factory'
import { getCookie } from 'hono/cookie'

export default createRoute(async (c) => {
  const token = getCookie(c, 'auth_token');
  const apiUrl = new URL('/api/member/profile', c.req.url).toString();
  
  let profile: any = {};
  
  try {
    const res = await fetch(apiUrl, { headers: { 'Cookie': `auth_token=${token}` } });
    if (res.ok) profile = await res.json();
  } catch (e) {}

  let crmData: any = {};
  try { crmData = profile.crm_data ? JSON.parse(profile.crm_data) : {}; } catch(e){}

  return c.render(
    <main className="flex-grow p-6 md:p-10 bg-gray-50">
      <header className="mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">Profil Saya</h1>
        <p className="text-gray-500 mt-2">Kelola data keamanan dan informasi akun Anda.</p>
      </header>

      <div className="max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <form id="form-profile" className="space-y-6">
          
          <div className="pb-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Informasi Dasar</h3>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Login</label>
              <input type="email" disabled defaultValue={profile.email} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-100 text-gray-500 cursor-not-allowed" />
              <p className="text-xs text-gray-400 mt-1">Email login tidak dapat diubah. Hubungi admin jika perlu.</p>
            </div>
          </div>

          <div className="pb-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Informasi Kontak (CRM)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap</label>
                <input type="text" disabled defaultValue={crmData.name || '-'} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 text-gray-700" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Perusahaan</label>
                <input type="text" disabled defaultValue={crmData.company || '-'} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 text-gray-700" />
              </div>
            </div>
            <p className="text-xs text-gray-400">Data institusi dikelola oleh Administrator kami. Hubungi via fitur kontak untuk perubahan data.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Keamanan Akun</h3>
            <label className="block text-sm font-bold text-gray-700 mb-2">Ganti Password (Kosongkan jika tidak ingin mengubah)</label>
            <input type="password" id="new_password" placeholder="Masukkan password baru..." className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button type="submit" id="btn-submit" className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 transition shadow-md">
              Simpan Perubahan Keamanan
            </button>
          </div>
        </form>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
          document.getElementById('form-profile').addEventListener('submit', async (e) => {
            e.preventDefault();
            const password = document.getElementById('new_password').value;
            if(!password) {
              alert('Anda belum memasukkan password baru.');
              return;
            }

            const btn = document.getElementById('btn-submit');
            btn.innerText = 'Menyimpan...'; btn.disabled = true;

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
              btn.innerText = 'Simpan Perubahan Keamanan'; btn.disabled = false;
            }
          });
        `
      }} />
    </main>,
    { title: 'Profil Saya - Client Portal' }
  )
})
