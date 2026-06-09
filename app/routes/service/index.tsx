import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  const db = c.env.DB;

  // SSR: Ambil semua layanan yang published
  const query = `
    SELECT s.title, s.slug, s.short_description, s.icon_name, s.benefits_json, c.name as category_name
    FROM services s 
    LEFT JOIN categories c ON s.category_id = c.id 
    WHERE s.status = 'published'
    ORDER BY s.id DESC
  `;
  const { results: services } = await db.prepare(query).all();

  return c.render(
    <main className="bg-white font-sans text-gray-900">
      <section className="bg-gray-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">Layanan Kami</h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Solusi digital end-to-end yang dirancang khusus untuk mengakselerasi pertumbuhan dan efisiensi bisnis Anda.
          </p>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {services.length === 0 ? (
            <div className="text-center text-gray-500 py-10">Belum ada layanan yang ditambahkan.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((svc: any) => {
                let benefits: string[] = [];
                try { benefits = svc.benefits_json ? JSON.parse(svc.benefits_json) : []; } catch(e){}

                return (
                  <div key={svc.slug} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200 hover:shadow-xl transition duration-300 flex flex-col">
                    <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                      {/* Anda bisa merender ikon dinamis berdasarkan svc.icon_name nanti */}
                      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    
                    {svc.category_name && (
                      <div className="text-sm font-bold text-blue-600 mb-2 uppercase tracking-wide">{svc.category_name}</div>
                    )}
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{svc.title}</h2>
                    <p className="text-gray-600 mb-8 flex-1">{svc.short_description}</p>
                    
                    {benefits.length > 0 && (
                      <ul className="mb-8 space-y-3">
                        {benefits.slice(0, 3).map((b, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-gray-700 font-medium">
                            <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    <a href={`/service/${svc.slug}`} className="mt-auto block w-full text-center py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-blue-600 transition">
                      Pelajari Detail
                    </a>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </main>,
    { title: 'Layanan Digital - Pasdigi' }
  )
})
