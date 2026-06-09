import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  const db = c.env.DB;

  const query = `
    SELECT p.title, p.slug, p.cover_image_url, p.client_name, c.name as category_name
    FROM portfolios p 
    LEFT JOIN categories c ON p.category_id = c.id 
    WHERE p.status = 'published'
    ORDER BY p.updated_at DESC
  `;
  const { results: portfolios } = await db.prepare(query).all();

  return c.render(
    <main className="bg-white font-sans text-gray-900">
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">Studi Kasus & Portofolio</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Jejak rekam keberhasilan kami dalam membantu berbagai perusahaan bertransformasi dan mencapai target bisnis mereka melalui teknologi.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {portfolios.length === 0 ? (
            <div className="text-center text-gray-500 py-10">Belum ada portofolio yang dipublikasikan.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {portfolios.map((p: any) => (
                <a key={p.slug} href={`/portfolio/${p.slug}`} className="group block">
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gray-200 mb-6 shadow-md group-hover:shadow-xl transition-all duration-300">
                    {p.cover_image_url ? (
                      <img src={p.cover_image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <svg className="w-16 h-16 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                      </div>
                    )}
                    
                    {/* Overlay Gradient Soft */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="px-2">
                    <div className="flex items-center gap-3 text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
                      {p.category_name && <span className="text-blue-600">{p.category_name}</span>}
                      {p.category_name && p.client_name && <span>•</span>}
                      {p.client_name && <span>{p.client_name}</span>}
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {p.title}
                    </h2>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>,
    { title: 'Studi Kasus & Portofolio - Pasdigi' }
  )
})
