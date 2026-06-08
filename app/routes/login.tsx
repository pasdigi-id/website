import { createRoute } from 'honox/factory'

export default createRoute((c) => {
  return c.render(
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6">
      <head>
        <title>Login - Area Akses</title>
      </head>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-8">
          <div className="font-extrabold text-2xl text-blue-600 mb-2">CompanyLogo</div>
          <h1 className="text-xl font-bold text-gray-900">Masuk ke Akun Anda</h1>
          <p className="text-sm text-gray-500 mt-1">Silakan login untuk mengakses dasbor Anda.</p>
        </div>

        <form id="login-form" className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              id="email" 
              required 
              className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition" 
              placeholder="email@perusahaan.com" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Kata Sandi</label>
            <input 
              type="password" 
              id="password" 
              required 
              className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition" 
              placeholder="••••••••" 
            />
          </div>

          <div id="error-msg" className="hidden text-red-600 text-sm font-medium text-center bg-red-50 py-2 rounded-lg"></div>

          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-200">
            Masuk
          </button>
        </form>

        <script dangerouslySetInnerHTML={{
          __html: `
            document.getElementById('login-form').addEventListener('submit', async (e) => {
              e.preventDefault();
              const btn = e.target.querySelector('button[type="submit"]');
              const errorMsg = document.getElementById('error-msg');
              
              btn.innerText = 'Memverifikasi...';
              btn.disabled = true;
              errorMsg.classList.add('hidden');

              const payload = {
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
              };

              try {
                const res = await fetch('/api/auth/login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload)
                });
                
                const data = await res.json();
                
                if (res.ok) {
                  // Arahkan berdasarkan role yang diterima dari API
                  if (data.role === 'admin') {
                    window.location.href = '/admin/dashboard';
                  } else {
                    window.location.href = '/member/dashboard';
                  }
                } else {
                  errorMsg.innerText = data.error || 'Terjadi kesalahan.';
                  errorMsg.classList.remove('hidden');
                  btn.innerText = 'Masuk';
                  btn.disabled = false;
                }
              } catch (err) {
                errorMsg.innerText = 'Gagal terhubung ke server.';
                errorMsg.classList.remove('hidden');
                btn.innerText = 'Masuk';
                btn.disabled = false;
              }
            });
          `
        }} />
      </div>
    </div>
  )
})
