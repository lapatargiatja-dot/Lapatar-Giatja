import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Memuat environment variables dari file .env atau sistem host (Netlify)
  // Parameter ketiga '' berarti memuat semua variabel, tidak hanya yang berawalan VITE_
  // Fix: Use '.' instead of process.cwd() to prevent TS error "Property 'cwd' does not exist on type 'Process'"
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
    },
    define: {
      // Mengganti process.env.API_KEY di dalam kode menjadi nilai string sebenarnya saat build
      // Prioritas mengambil dari VITE_API_KEY, lalu API_KEY
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || env.API_KEY)
    }
  };
});