import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  resolve: {
    dedupe: ['@emotion/react', '@emotion/styled']
  },
  plugins: [react(), ],
})