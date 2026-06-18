import { createRoute } from 'honox/factory'

export default createRoute((c) => {
  return c.render(
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-blue-200 mb-6">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Buat Akun Klien</h2>
          <p className="mt-2 text-sm text-slate-500">
            Sudah memiliki akses? <a href="/login" className="font-bold text-blue-600 hover:text-blue-700 transition">Masuk ke Portal</a>
          </p>
        </div>

        <form id="register-form" className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Nama Lengkap</label>
            <input id="name" type="text" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition sm:text-sm" placeholder="Contoh: John Doe" />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Nama Perusahaan / Institusi</label>
            <input id="company" type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition sm:text-sm" placeholder="Contoh: PT Inovasi Digital (Opsional)" />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Email Klien</label>
            <input id="email" type="email" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition sm:text-sm" placeholder="nama@perusahaan.com" />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Kata Sandi Akses</label>
            <input id="password" type="password" required minLength={6} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition sm:text-sm" placeholder="Minimal 6 karakter" />
          </div>

          <div className="pt-2">
            <button type="submit" id="btn-submit" className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-slate-900 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition shadow-md">
              Daftar Sekarang &rarr;
            </button>
          </div>
          
          <div id="error-message" className="text-red-600 text-sm font-bold text-center hidden bg-red-50 p-3 rounded-xl border border-red-100"></div>
        </form>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
          // Script menggunakan 'onclick' dan 'addEventListener' bawaan Vanilla JS (Aman dari SSR crash)
          document.getElementById('register-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('btn-submit');
            const errorMsg = document.getElementById('error-message');
            
            btn.innerText = 'Memproses Pendaftaran...';
            btn.disabled = true;
            errorMsg.classList.add('hidden');

            const payload = {
              email: document.getElementById('email').value,
              password: document.getElementById('password').value,
              name: document.getElementById('name').value,
              company: document.getElementById('company').value
            };

            try {
              const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });
              
              const data = await res.json();
              
              if (res.ok && data.success) {
                alert('Registrasi berhasil! Anda akan dialihkan ke halaman login.');
                window.location.href = '/login';
              } else {
                errorMsg.innerText = data.error || 'Gagal mendaftar. Email mungkin sudah digunakan.';
                errorMsg.classList.remove('hidden');
              }
            } catch (err) {
              errorMsg.innerText = 'Terjadi kesalahan jaringan. Periksa koneksi Anda.';
              errorMsg.classList.remove('hidden');
            } finally {
              btn.innerText = 'Daftar Sekarang →';
              btn.disabled = false;
            }
          });
        `
      }} />
    </div>,
    { title: 'Daftar Client Portal - Pasdigi' }
  )
})
