import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  const db = c.env.DB;
  const ticketId = c.req.param('id');
  
  const ticket = await db.prepare("SELECT * FROM contacts WHERE id = ?").bind(ticketId).first();
  if (!ticket) return c.notFound();

  return c.render(
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <main className="flex-1 p-6 md:p-10 max-w-4xl mx-auto w-full">
        <header className="mb-8">
          <a href="/admin/contacts" className="text-blue-600 font-semibold text-sm hover:underline mb-2 inline-block">&larr; Kembali ke Daftar Tiket</a>
          <h1 className="text-3xl font-extrabold text-gray-900">Detail Tiket</h1>
          <p className="text-gray-500 mt-1">ID: <span className="font-mono text-gray-900">{ticket.tracking_id}</span></p>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{ticket.subject}</h2>
              <p className="text-sm text-gray-500 mt-1">Dari: <strong className="text-gray-900">{ticket.name}</strong> ({ticket.email})</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${ticket.status === 'replied' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {ticket.status}
            </span>
          </div>

          <div className="prose prose-sm max-w-none text-gray-800 bg-gray-50 p-6 rounded-xl border border-gray-100 whitespace-pre-wrap">
            {ticket.message}
          </div>
        </div>

        {/* Area Balasan */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {ticket.status === 'replied' ? (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Pesan Sudah Dibalas
              </h3>
              <div className="bg-green-50 p-6 rounded-xl border border-green-100 whitespace-pre-wrap text-sm text-green-900">
                {ticket.admin_reply}
              </div>
            </div>
          ) : (
            <form id="reply-form">
              <input type="hidden" id="ticket_id" value={ticket.id} />
              <label className="block text-sm font-bold text-gray-700 mb-2">Balas ke Email Klien</label>
              <textarea id="reply_message" rows={6} required className="w-full border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 mb-4 text-sm" placeholder="Ketik balasan resmi Anda di sini. Email akan otomatis dikirim via Brevo API..."></textarea>
              <div className="flex justify-end">
                <button type="submit" className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition">
                  Kirim Balasan
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      <script dangerouslySetInnerHTML={{
        __html: `
          const form = document.getElementById('reply-form');
          if(form) {
            form.addEventListener('submit', async (e) => {
              e.preventDefault();
              const btn = e.target.querySelector('button[type="submit"]');
              const ticketId = document.getElementById('ticket_id').value;
              
              btn.innerText = 'Mengirim Email...'; btn.disabled = true;

              try {
                // Menembak endpoint balasan di src/api/admin.ts
                const res = await fetch(\`/api/admin/contact/\${ticketId}/reply\`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ reply_message: document.getElementById('reply_message').value })
                });
                
                if(res.ok) window.location.reload();
                else alert('Gagal membalas pesan. Cek log server.');
              } catch (err) { alert('Server error'); }
              finally { btn.innerText = 'Kirim Balasan'; btn.disabled = false; }
            });
          }
        `
      }} />
    </div>,
    { title: `Detail Tiket ${ticket.tracking_id}` }
  )
})
