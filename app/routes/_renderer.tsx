import { jsxRenderer } from 'hono/jsx-renderer'
import { Link, Script } from 'honox/server'

export default jsxRenderer(({ children, title }) => {
  return (
    <html lang="id" className="antialiased scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title || 'Pasdigi - Solusi Transformasi Digital Enterprise'}</title>
        
        {/* Menggunakan font Inter standar SaaS Modern */}
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <Link href="/app/style.css" rel="stylesheet" />
        <Script src="/app/client.ts" async />
        <link rel="icon" href="/favicon.ico" />
      </head>
      
      <body className="font-sans text-slate-800 bg-white flex flex-col min-h-screen" style={{ fontFamily: '"Inter", sans-serif' }}>
        
        {/* NAVBAR PUBLIK GLOBAL */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">Pasdigi.</span>
            </a>
            
            <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
              <a href="/service" className="hover:text-blue-600 transition">Layanan</a>
              <a href="/portfolio" className="hover:text-blue-600 transition">Portofolio</a>
              <a href="/blog" className="hover:text-blue-600 transition">Blog</a>
              <a href="/contact" className="hover:text-blue-600 transition">Kontak</a>
            </nav>
            
            <div className="flex items-center gap-4">
              <a href="/login" className="hidden md:block text-sm font-bold text-slate-700 hover:text-blue-600 transition">Masuk</a>
              <a href="/register" className="bg-slate-900 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition shadow-md shadow-slate-200">
                Daftar Akun
              </a>
            </div>
          </div>
        </header>

        {/* AREA KONTEN HALAMAN */}
        <main className="flex-grow flex flex-col">
          {children}
        </main>

        {/* FOOTER PUBLIK GLOBAL */}
        <footer className="bg-[#0B0F19] text-slate-400 py-16 border-t border-slate-800 mt-auto">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="md:col-span-2">
              <span className="font-extrabold text-2xl tracking-tight text-white mb-4 block">Pasdigi.</span>
              <p className="text-sm max-w-sm leading-relaxed">
                Mitra teknologi enterprise Anda untuk transformasi digital yang skalabel, aman, dan inovatif.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 tracking-wide text-sm uppercase">Eksplorasi</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="/service" className="hover:text-blue-400 transition">Layanan Kami</a></li>
                <li><a href="/portfolio" className="hover:text-blue-400 transition">Studi Kasus</a></li>
                <li><a href="/blog" className="hover:text-blue-400 transition">Wawasan & Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 tracking-wide text-sm uppercase">Portal</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="/contact" className="hover:text-blue-400 transition">Hubungi Sales</a></li>
                <li><a href="/login" className="hover:text-blue-400 transition">Client Workspace</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-slate-800 text-xs flex flex-col md:flex-row justify-between items-center gap-4">
            <span>&copy; {new Date().getFullYear()} Pasdigi Workspace. All rights reserved.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
            </div>
          </div>
        </footer>

      </body>
    </html>
  )
})
