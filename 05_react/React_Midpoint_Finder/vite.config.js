import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 개발 서버와 빌드 설정을 정하는 코드
export default defineConfig({
  plugins: [react()],
  server: {
    // ODsay는 브라우저에서 직접 부르면 CORS로 막히므로 개발 중에는 프록시로 우회한다
    proxy: {
      '/odsay': {
        target: 'https://api.odsay.com',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/odsay/, ''),
      },
    },
  },
})
