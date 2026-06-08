import { createRoute } from 'honox/factory'

export default createRoute((c) => {
  return c.render(
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <head>
        <title>Lacak Status Tiket</title>
      </head>

      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Lacak Tiket Kontak</h1>
          <p className="text-gray-500">Masukkan ID Tracking Anda (misal: PM-20240501123000) untuk melihat status balasan.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <form id="track-form" className="flex gap-3">
            <input 
              type="text" 
              id="tracking-id" 
              placeholder="PM-XXXXXXXXXXXXXX" 
              required 
              className="flex-grow border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase"
            />
            <button type="submit" className="bg-gray-900 text-white font-semibold px-6 py-3 rounded-xl hover:bg-gray-800 transition">
              Cek
            </button>
          </form>
        </div>

        {/* Area Hasil Tracking */}
        <div id="result-area" className="hidden bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900">Status Tiket:</h3>
            <span id="status-badge" className="px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wider">
              --
            </span>
          </div>
          <div id="reply-box" className="hidden mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-bold text-gray-700 mb-2">Balasan Admin:</h4>
            <div id="admin-reply" className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm whitespace-pre-wrap"></div>
          </div>
          <p id="last-update" className="text-xs text-gray-400 mt-4 text-right"></p>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
          document.getElementById('track-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const trackingId = document.getElementById('tracking-id').value.trim();
            const resultArea = document.getElementById('result-area');
            const statusBadge = document.getElementById('status-badge');
            const replyBox = document.getElementById('reply-box');
            const adminReply = document.getElementById('admin-reply');
            const lastUpdate = document.getElementById('last-update');

            try {
              const res = await fetch('/api/public/contact/track/' + trackingId);
              const data = await res.json();

              if (res.ok) {
                resultArea.classList.remove('hidden');
                
                // Warnai badge sesuai status
                statusBadge.innerText = data.status;
                statusBadge.className = 'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ';
                if (data.status === 'unread') statusBadge.className += 'bg-gray-100 text-gray-600';
                if (data.status === 'read') statusBadge.className += 'bg-yellow-100 text-yellow-700';
                if (data.status === 'replied') statusBadge.className += 'bg-green-100 text-green-700';

                // Tampilkan balasan admin jika ada
                if (data.admin_reply) {
                  replyBox.classList.remove('hidden');
                  adminReply.innerText = data.admin_reply;
                } else {
                  replyBox.classList.add('hidden');
                }

                const date = new Date(data.last_updated);
                lastUpdate.innerText = 'Terakhir diperbarui: ' + date.toLocaleString('id-ID');
              } else {
                alert(data.error || 'Tiket tidak ditemukan.');
                resultArea.classList.add('hidden');
              }
            } catch (err) {
              alert('Gagal mengambil data dari server.');
            }
          });
        `
      }} />
    </div>
  )
})
