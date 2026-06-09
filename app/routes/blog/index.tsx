import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  const db = c.env.DB;

  // SSR: Ambil artikel blog yang statusnya 'published'
  const query = `
    SELECT b.title, b.slug, b.cover_image_url, b.published_at, b.seo_description, c.name as category_name, u.email as author_email
    FROM blogs b 
    LEFT JOIN categories c ON b.category_id = c.id 
    LEFT JOIN users u ON b.author_id = u.id
    WHERE b.status = 'published'
    ORDER BY b.published_at DESC
  `;
  const { results: blogs } = await db.prepare(query).all();

  return c.render(
    <main className="bg-white font-sans text-gray-900">
      {/* Header Halaman Blog */}
      <section className="bg-blue-50 py-20 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-blue-900 tracking-tight mb-4">Blog & Wawasan</h1>
          <p className="text-lg text-blue-700 max-w-2xl mx-auto">
            Temukan berita terbaru, wawasan industri, dan panduan ahli seputar transformasi digital dari tim kami.
          </p>
        </div>
      </section>

      {/* Grid Artikel */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {blogs.length === 0 ? (
            <div className="text-center text-gray-500 py-20">
              <p className="text-xl font-medium">Belum ada artikel yang diterbitkan saat ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {blogs.map((b: any) => (
                <article key={b.slug} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full group">
                  <a href={`/blog/${b.slug}`} className="block relative aspect-video bg-gray-100 overflow-hidden">
                    {b.cover_image_url ? (
                      <img src={b.cover_image_url} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <span className="text-xs font-bold uppercase tracking-widest">No Image</span>
                      </div>
                    )}
                    {b.category_name && (
                      <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                        {b.category_name}
                      </span>
                    )}
                  </a>
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-3 font-medium">
                      <span>{new Date(b.published_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                      <a href={`/blog/${b.slug}`} className="hover:text-blue-600 transition-colors">
                        {b.title}
                      </a>
                    </h2>
                    <p className="text-gray-600 mb-6 flex-1 line-clamp-3 text-sm leading-relaxed">
                      {b.seo_description || 'Baca selengkapnya untuk menemukan wawasan menarik terkait topik ini...'}
                    </p>
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <a href={`/blog/${b.slug}`} className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1">
                        Baca Selengkapnya <span aria-hidden="true">&rarr;</span>
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>,
    { 
      title: 'Blog & Wawasan - Pasdigi',
    }
  )
})
