import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  const slug = c.req.param('slug');
  const kv = c.env.CACHE_KV;
  
  // Tarik data blog
  let data = await kv.get(`public_blog_${slug}`, 'json');
  if (!data) {
    data = await c.env.DB.prepare(
      `SELECT b.*, c.name as category_name, u.crm_data as author_data 
       FROM blogs b 
       LEFT JOIN categories c ON b.category_id = c.id 
       LEFT JOIN users u ON b.author_id = u.id 
       WHERE b.slug = ? AND b.status = 'published'`
    ).bind(slug).first();
    
    if (!data) return c.notFound();
    c.executionCtx.waitUntil(kv.put(`public_blog_${slug}`, JSON.stringify(data), { expirationTtl: 86400 }));
  }

  // Tarik data Widget khusus Sidebar Blog
  let widgets = await kv.get(`widget_area_sidebar_blog`, 'json');
  if (!widgets) {
    const wRes = await c.env.DB.prepare(`SELECT * FROM widgets WHERE area = 'sidebar_blog' AND is_active = 1 ORDER BY sort_order`).all();
    widgets = wRes.results;
    c.executionCtx.waitUntil(kv.put(`widget_area_sidebar_blog`, JSON.stringify(widgets), { expirationTtl: 86400 }));
  }

  const authorData = data.author_data ? JSON.parse(data.author_data) : { name: 'Admin' };

  return c.render(
    <div className="bg-gray-50 min-h-screen py-12">
      <head>
        <title>{data.seo_title || data.title}</title>
      </head>

      <main className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row gap-12">
        
        {/* Area Membaca (Lebar terkendali untuk ergonomi mata) */}
        <article className="lg:w-2/3 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
          <header className="mb-10 text-center">
            {data.category_name && (
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-wider mb-6">
                {data.category_name}
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
              {data.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500 font-medium">
              <span>Oleh: <strong className="text-gray-900">{authorData.name}</strong></span>
              <span>•</span>
              <span>{new Date(data.published_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </header>

          {data.cover_image_url && (
            <img src={data.cover_image_url} alt="Cover" className="w-full h-auto rounded-2xl mb-12 shadow-sm" />
          )}

          <div className="prose prose-lg prose-blue max-w-none text-gray-700 leading-loose" 
               dangerouslySetInnerHTML={{ __html: data.content }} />
        </article>

        {/* Sidebar Dinamis: Khusus Blog */}
        <aside className="lg:w-1/3 space-y-8">
          {widgets && widgets.map((widget: any) => (
            <div key={widget.id} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              {widget.title && (
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                  {widget.title}
                </h3>
              )}
              
              {/* Render Konten Widget */}
              {widget.type === 'html' && (
                <div className="text-sm text-gray-600 space-y-3" dangerouslySetInnerHTML={{ __html: JSON.parse(widget.content).html }} />
              )}
              
              {widget.type === 'categories' && (
                <ul className="space-y-3">
                  <li className="flex justify-between items-center text-sm font-semibold text-gray-600 hover:text-blue-600 cursor-pointer">
                    <span>Teknologi Web</span> <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">12</span>
                  </li>
                  <li className="flex justify-between items-center text-sm font-semibold text-gray-600 hover:text-blue-600 cursor-pointer">
                    <span>Digital Marketing</span> <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">8</span>
                  </li>
                </ul>
              )}
            </div>
          ))}
        </aside>
      </main>
    </div>
  )
})
