import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config
export default defineConfig({
    server: {
        port: 5173,                 //фронт будет на http://localhost:5173
        proxy: {
            '/api': {
                target: 'http://localhost:5195', //бэкэнд здесь
                changeOrigin: true,
                secure: false
            }
        }
    },
    plugins: [react()],
})
