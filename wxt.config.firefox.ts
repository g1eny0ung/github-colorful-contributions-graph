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
    permissions: ['storage', 'scripting'],
    browser_specific_settings: {
      gecko: {
        id: 'github-colorful-contributions@app.g1en.dev',
        data_collection_permissions: {
          required: ['none'],
        },
      },
    },
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
})
