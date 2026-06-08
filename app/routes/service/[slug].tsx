import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  const slug = c.req.param('slug');
  const kv = c.env.CACHE_KV;
  
  let data = await kv.get(`public_service_${slug}`, 'json');
  if (!data) {
    data = await c.env.DB.prepare(
      `SELECT s.*, c.name as category_name FROM services s LEFT JOIN categories c ON s.category_id = c.id WHERE s.slug = ? AND s.status = 'published'`
    ).bind(slug).first();
    
    if (!data) return c.notFound();
    c.executionCtx.waitUntil(kv.put(`public_service_${slug}`, JSON.stringify(data), { expirationTtl: 86400 }));
  }

  // Parse JSON fitur/keunggulan
  const benefits = data.benefits_json ? JSON.parse(data.benefits_json) : [];

  return c.render(
    <div className="bg-white min-h-screen font-sans">
      <head>
        <title>{data.title} - Layanan Kami</title>
      </head>

      {/* Hero Section Spesifik Layanan */}
      <section className="bg-blue-900 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {data.category_name && <span className="text-blue-300 font-bold uppercase tracking-widest text-sm mb-4 block">{data.category_name}</span>}
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">{data.title}</h1>
          <p className="text-xl text-blue-100 leading-relaxed mb-10 max-w-2xl mx-auto">
            {data.short_description || 'Kami menyediakan solusi terbaik untuk kebutuhan bisnis Anda dengan standar profesional.'}
          </p>
          <a href="/contact" className="inline-block bg-white text-blue-900 font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-gray-100 transition transform hover:-translate-y-1">
            {data.cta_text || 'Konsultasi Gratis Sekarang'}
          </a>
        </div>
      </section>

      {/* Konten Utama & Benefits */}
      <main className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row gap-16">
        
        {/* Kolom Kiri: Penjelasan Detail */}
        <div className="md:w-2/3">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Detail Layanan</h2>
          <div className="prose prose-lg prose-blue max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: data.content }} />
        </div>

        {/* Kolom Kanan: Daftar Fitur Kunci (Value Proposition) */}
        <aside className="md:w-1/3">
          <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 sticky top-8 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Keunggulan Layanan Ini</h3>
            {benefits.length > 0 ? (
              <ul className="space-y-4">
                {benefits.map((benefit: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    {/* Ikon Checkmark SVG */}
                    <svg className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">Hubungi kami untuk detail fitur lebih lanjut.</p>
            )}

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">Siap untuk memulai proyek Anda?</p>
              <a href="/contact" className="block w-full text-center bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition">
                Hubungi Tim Sales
              </a>
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
})
