import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  outDir: 'dist',
  modules: ['@wxt-dev/module-svelte'],
  manifest: {
    name: '__MSG_extName__',
    description: '__MSG_extDescription__',
    version: '5.0.2',
    default_locale: 'en',
    permissions: ['declarativeContent', 'storage', 'scripting'],
    host_permissions: ['https://github.com/*'],
    action: {
      // @ts-ignore
      default_state: 'disabled',
    },
    content_scripts: [
      {
        matches: ['https://github.com/*'],
        js: ['/js/obelisk.min.js', '/js/content_script.js'],
      },
    ],
    browser_specific_settings: {
      gecko: {
        id: 'github-colorful-contributions@app.g1en.dev',
        // https://github.com/wxt-dev/wxt/issues/1975
        // @ts-ignore
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
