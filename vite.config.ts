import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { resolve } from 'path'
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(),vuetify({ autoImport: true }),],
  server: {
    port: 3000,
    host: 'localhost',
    open: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
