import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'wxt'

import { manifest } from './wxt.config'

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  outDir: 'dist',
  modules: ['@wxt-dev/module-svelte'],
  manifest: {
    ...manifest,
    description: '__MSG_extDescriptionEdge__',
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
})
