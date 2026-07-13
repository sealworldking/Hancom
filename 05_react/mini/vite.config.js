import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // ODsay는 브라우저 직접호출 시 CORS 막힘 → dev 프록시로 우회
    proxy: {
      '/odsay': {
        target: 'https://api.odsay.com',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/odsay/, ''),
      },
    },
  },
})
