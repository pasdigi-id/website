import { createRoute } from 'honox/factory'

export default createRoute((c) => {
  return c.render(
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <head>
        <title>Hubungi Kami</title>
        <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
      </head>
      
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-xl w-full">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Kirim Pesan</h1>
            <p className="text-gray-500">Tim kami akan membalas pesan Anda melalui email.</p>
          </div>
          
          <form id="contact-form" className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
              <input type="text" id="name" required className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition" placeholder="John Doe" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Aktif</label>
              <input type="email" id="email" required className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition" placeholder="john@example.com" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Subjek</label>
              <input type="text" id="subject" required className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition" placeholder="Pertanyaan Layanan" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Pesan</label>
              <textarea id="message" rows={4} required className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition" placeholder="Tuliskan detail pesan Anda di sini..."></textarea>
            </div>

            <div className="flex justify-center my-4">
              <div className="cf-turnstile" data-sitekey="1x00000000000000000000AA" data-theme="light"></div>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200">
              Kirim Pesan
            </button>
          </form>

          {/* Logic Fetch ke API Internal */}
          <script dangerouslySetInnerHTML={{
            __html: `
              document.getElementById('contact-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = e.target.querySelector('button[type="submit"]');
                const originalText = btn.innerText;
                
                const turnstileToken = document.querySelector('[name="cf-turnstile-response"]')?.value;
                if (!turnstileToken) {
                  alert('Selesaikan verifikasi keamanan (Turnstile).');
                  return;
                }

                btn.innerText = 'Mengirim...';
                btn.disabled = true;

                const payload = {
                  name: document.getElementById('name').value,
                  email: document.getElementById('email').value,
                  subject: document.getElementById('subject').value,
                  message: document.getElementById('message').value,
                  turnstile_token: turnstileToken
                };

                try {
                  const res = await fetch('/api/public/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                  });
                  
                  const data = await res.json();
                  if (res.ok) {
                    alert('Berhasil! ID Tracking Anda: ' + data.tracking_id);
                    e.target.reset();
                  } else {
                    alert('Gagal: ' + (data.error || 'Terjadi kesalahan'));
                  }
                  turnstile.reset();
                } catch (err) {
                  alert('Koneksi terputus. Coba lagi.');
                  turnstile.reset();
                } finally {
                  btn.innerText = originalText;
                  btn.disabled = false;
                }
              });
            `
          }} />
        </div>
      </div>
    </div>
  )
})
