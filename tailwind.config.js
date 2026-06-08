/** @type {import('tailwindcss').Config} */
export default {
  // Mode Just-In-Time (JIT) otomatis aktif di Tailwind v3+
  content: [
    // Pindai semua file UI SSR dan komponen
    "./app/**/*.tsx",
    "./app/**/*.ts",
    // Pindai file backend (Penting karena kita menyimpan template HTML email Brevo di /src)
    "./src/**/*.ts"
  ],
  theme: {
    extend: {
      // Anda bisa menambahkan kustomisasi warna khusus perusahaan di sini
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb', // Warna primer standar
          900: '#1e3a8a',
        }
      },
      fontFamily: {
        sans: [
          'Inter', 
          'ui-sans-serif', 
          'system-ui', 
          '-apple-system', 
          'BlinkMacSystemFont', 
          'Segoe UI', 
          'Roboto', 
          'Helvetica Neue', 
          'Arial', 
          'sans-serif'
        ],
      }
    },
  },
  plugins: [
    // Tambahkan plugin Tailwind resmi di sini jika nanti diperlukan (misal: @tailwindcss/forms)
  ],
}
