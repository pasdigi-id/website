import { jsxRenderer } from 'hono/jsx-renderer'
import { Link, Script } from 'honox/server'

export default jsxRenderer(({ children, title }) => {
  return (
    <html lang="id" className="antialiased">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title || 'Client Workspace - Pasdigi'}</title>
        
        {/* Font Inter untuk standar Enterprise UI */}
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <Link href="/app/style.css" rel="stylesheet" />
        <Script src="/app/client.ts" async />
        <link rel="icon" href="/favicon.ico" />
      </head>
      
      <body className="bg-[#F7F9FC] text-slate-800 flex h-screen overflow-hidden" style={{ fontFamily: '"Inter", sans-serif' }}>
        
        {/* SIDEBAR */}
        <aside className="w-64 bg-[#1C1F26] text-slate-300 flex flex-col shrink-0 border-r border-[#2D313A] shadow-xl z-20">
          <div className="h-16 flex items-center px-6 border-b border-[#2D313A] mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <span className="font-bold text-lg text-white tracking-tight">Client<span className="text-indigo-400">Portal</span></span>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
            <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-2">Workspace</p>
            
            <a href="/member/dashboard" className="flex items-center gap-3 px-3 py-2.5 bg-indigo-500/10 text-indigo-400 rounded-lg transition group border border-indigo-500/20">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              <span className="font-medium text-sm">Boards & Projects</span>
            </a>

            <a href="/member/profile" className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:bg-[#2D313A] hover:text-white rounded-lg transition group">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <span className="font-medium text-sm">Akun & Profil</span>
            </a>
          </nav>

          <div className="p-4 border-t border-[#2D313A]">
            {/* KOREKSI FATAL: onClick diubah menjadi onclick (huruf kecil semua) */}
            <button 
              className="flex items-center gap-3 w-full px-3 py-2.5 text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition group"
              onclick="document.cookie='auth_token=; Max-Age=0; path=/'; window.location.href='/login';"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              <span className="font-medium text-sm">Keluar Sesi</span>
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 z-10 shrink-0 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <span className="bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">Main Workspace</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative text-slate-400 hover:text-indigo-600 transition">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              </button>
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm ring-2 ring-white shadow-sm cursor-pointer">
                ME
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto w-full relative p-8">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
})
