import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  const kv = c.env.CACHE_KV;
  let landingData = null;
  
  try {
    landingData = await kv.get('landing_page_data', 'json');
  } catch (e) {
    // Fallback
  }

  const data = landingData || {
    hero_title: "Kelola Bisnis Tanpa Batas, ",
    hero_title_highlight: "Lebih Cepat & Cerdas.",
    hero_subtitle: "Tinggalkan cara manual. Bangun alur kerja yang mulus, satukan tim Anda, dan pantau progres proyek secara real-time dalam satu platform terpadu ala enterprise.",
    seo_title: "Pasdigi - Solusi CRM & Manajemen Proyek",
  };

  return c.render(
    <div className="flex flex-col min-h-screen bg-[#FAFBFF] font-sans selection:bg-blue-200 selection:text-blue-900 overflow-x-hidden">
      
      {/* Navbar Glassmorphism */}
      <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {/* Logo Icon Faux */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-gray-900">Pasdigi<span className="text-blue-600">.</span></span>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center">
            <a href="/" className="text-sm font-semibold text-gray-900">Platform</a>
            <a href="/contact" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition">Solusi</a>
            <a href="/track" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition">Lacak Tiket</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a href="/login" className="text-sm font-bold text-gray-600 hover:text-gray-900">Masuk</a>
            <a href="/login" className="bg-gray-900 text-white text-sm px-5 py-2.5 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-md hover:shadow-blue-200">
              Coba Gratis &rarr;
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section dengan Faux Dashboard UI */}
      <main className="flex-grow pt-32 pb-20 px-6 relative">
        {/* Background Blobs (Modern Aesthetic) */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute -top-[10%] -right-[5%] w-[500px] h-[500px] rounded-full bg-blue-100/50 blur-3xl opacity-60"></div>
          <div className="absolute top-[20%] -left-[10%] w-[400px] h-[400px] rounded-full bg-indigo-100/50 blur-3xl opacity-60"></div>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Kolom Kiri: Copywriting & CTA */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              Platform Enterprise v2.0
            </div>
            
            <h1 className="text-5xl md:text-[4rem] font-extrabold tracking-tight text-gray-900 leading-[1.1] mb-6">
              {data.hero_title} <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                {data.hero_title_highlight}
              </span>
            </h1>
            
            <p className="text-lg text-gray-500 mb-10 leading-relaxed max-w-xl font-medium">
              {data.hero_subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/contact" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 group">
                Jadwalkan Demo
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </a>
              <a href="/track" className="bg-white text-gray-800 border-2 border-gray-100 px-8 py-4 rounded-xl font-bold hover:border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                Lacak Tiket Proyek
              </a>
            </div>

            <div className="mt-10 flex items-center gap-4 text-sm text-gray-500 font-medium">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200"></div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-300"></div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-400"></div>
              </div>
              <p>Dipercaya oleh <strong className="text-gray-900">500+</strong> perusahaan di Indonesia.</p>
            </div>
          </div>

          {/* Kolom Kanan: Visual Mockup UI ala Monday.com */}
          <div className="relative lg:h-[600px] flex items-center justify-center perspective-1000">
            {/* Dekorasi Belakang */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-purple-50 rounded-[3rem] transform rotate-3 scale-105 opacity-50"></div>
            
            {/* Jendela Aplikasi Utama */}
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col transform transition-transform hover:-translate-y-2 duration-500">
              {/* Header Mac-style */}
              <div className="h-10 bg-gray-50 border-b border-gray-100 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              
              <div className="flex flex-1 p-4 gap-4">
                {/* Sidebar Mini */}
                <div className="w-16 hidden sm:flex flex-col gap-4 border-r border-gray-100 pr-4">
                  <div className="w-full h-8 bg-blue-100 rounded-lg"></div>
                  <div className="w-full h-8 bg-gray-100 rounded-lg"></div>
                  <div className="w-full h-8 bg-gray-100 rounded-lg"></div>
                </div>

                {/* Main Content Area Faux */}
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-center mb-6">
                    <div className="h-6 w-32 bg-gray-200 rounded-md"></div>
                    <div className="h-8 w-24 bg-blue-600 rounded-lg"></div>
                  </div>

                  {/* Faux Table Rows ala Monday Board */}
                  {[
                    { color: 'bg-emerald-500', width: 'w-full', status: 'Done' },
                    { color: 'bg-yellow-500', width: 'w-3/4', status: 'Working' },
                    { color: 'bg-gray-300', width: 'w-1/2', status: 'Stuck' }
                  ].map((row, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className={`w-1 h-8 rounded-full ${row.color}`}></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-24 bg-gray-200 rounded-full"></div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full ${row.color} ${row.width}`}></div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 text-[10px] font-bold text-white rounded-md ${row.color}`}>
                        {row.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Float Element (Notification Faux) */}
            <div className="absolute -bottom-6 -left-8 bg-white p-4 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 flex items-center gap-4 animate-bounce-slow">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">Proyek Selesai!</div>
                <div className="text-xs text-gray-500">Website e-commerce diluncurkan.</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Social Proof / Brands Section */}
      <section className="border-y border-gray-100 bg-white py-10">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Digunakan oleh tim inovatif</p>
          <div className="flex flex-wrap justify-center gap-10 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Text pengganti logo */}
             <span className="font-bold text-2xl">Acme Corp</span>
             <span className="font-bold text-2xl font-serif">Globex</span>
             <span className="font-bold text-2xl italic">Soylent</span>
             <span className="font-bold text-2xl uppercase">Initech</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-bold text-xl tracking-tight text-gray-900">Pasdigi<span className="text-blue-600">.</span></div>
          <p className="text-gray-400 text-sm font-medium">&copy; {new Date().getFullYear()} Hak Cipta Dilindungi.</p>
        </div>
      </footer>
    </div>,
    { title: data.seo_title }
  )
})