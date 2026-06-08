import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  const slug = c.req.param('slug');
  const kv = c.env.CACHE_KV;
  
  let data = await kv.get(`public_page_${slug}`, 'json');
  if (!data) {
    data = await c.env.DB.prepare(
      `SELECT * FROM pages WHERE slug = ? AND status = 'published'`
    ).bind(slug).first();
    
    if (!data) return c.notFound();
    c.executionCtx.waitUntil(kv.put(`public_page_${slug}`, JSON.stringify(data), { expirationTtl: 86400 }));
  }

  return c.render(
    <div className="bg-gray-50 min-h-screen py-16">
      <head>
        <title>{data.seo_title || data.title}</title>
      </head>

      <main className="max-w-3xl mx-auto px-6">
        <article className="bg-white p-8 md:p-16 rounded-3xl shadow-sm border border-gray-100">
          <header className="mb-10 border-b border-gray-100 pb-10 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{data.title}</h1>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-widest">
              Terakhir diperbarui: {new Date(data.updated_at).toLocaleDateString('id-ID')}
            </p>
          </header>

          <div 
            className="prose prose-lg prose-gray max-w-none text-gray-700 leading-relaxed prose-headings:text-gray-900 prose-a:text-blue-600" 
            dangerouslySetInnerHTML={{ __html: data.content }} 
          />
        </article>
      </main>
    </div>
  )
})
