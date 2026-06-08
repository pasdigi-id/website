import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  const slug = c.req.param('slug');
  const kv = c.env.CACHE_KV;
  
  // Ambil langsung dari KV Cache untuk efisiensi ekstrim
  let data = await kv.get(`public_portfolio_${slug}`, 'json');

  if (!data) {
    // Fallback D1 jika cache hilang
    data = await c.env.DB.prepare(
      `SELECT p.*, c.name as category_name FROM portfolios p LEFT JOIN categories c ON p.category_id = c.id WHERE p.slug = ? AND p.status = 'published'`
    ).bind(slug).first();
    
    if (!data) return c.notFound();
    c.executionCtx.waitUntil(kv.put(`public_portfolio_${slug}`, JSON.stringify(data), { expirationTtl: 86400 }));
  }

  // Parse JSON Galeri
  const gallery = data.gallery_json ? JSON.parse(data.gallery_json) : [];

  return c.render(
    <div className="bg-white min-h-screen">
      <head>
        <title>{data.title} - Portfolio Kami</title>
      </head>

      {/* Hero Section Spesifik Portfolio */}
      <section className="relative w-full h-[60vh] bg-gray-900 flex items-end pb-12">
        {data.cover_image_url && (
          <img src={data.cover_image_url} alt={data.title} className="absolute inset-0 w-full h-full object-cover opacity-40" />
        )}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          {data.category_name && <span className="text-blue-400 font-bold tracking-widest uppercase text-sm mb-4 block">{data.category_name}</span>}
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">{data.title}</h1>
        </div>
      </section>

      {/* Detail Proyek & Studi Kasus */}
      <main className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row gap-16">
        {/* Spesifikasi Klien (Karakter unik Portfolio) */}
        <aside className="md:w-1/4 space-y-8 border-t-4 border-gray-900 pt-6">
          <div>
            <h4 className="text-sm font-bold text-gray-400 uppercase">Klien</h4>
            <p className="text-lg font-semibold text-gray-900">{data.client_name || '-'}</p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-400 uppercase">Tanggal Selesai</h4>
            <p className="text-lg font-semibold text-gray-900">{data.completion_date ? new Date(data.completion_date).getFullYear() : '-'}</p>
          </div>
          {data.website_url && (
            <div>
              <a href={data.website_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 font-bold hover:underline">
                Kunjungi Website &rarr;
              </a>
            </div>
          )}
        </aside>

        {/* Konten Studi Kasus & Galeri */}
        <div className="md:w-3/4">
          <div className="prose prose-lg prose-gray max-w-none mb-16" dangerouslySetInnerHTML={{ __html: data.content }} />
          
          {/* Galeri Masonry */}
          {gallery.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {gallery.map((imgUrl: string, idx: number) => (
                <img key={idx} src={imgUrl} alt={`Gallery ${idx}`} className="rounded-xl w-full h-auto shadow-sm hover:shadow-md transition" />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
})
