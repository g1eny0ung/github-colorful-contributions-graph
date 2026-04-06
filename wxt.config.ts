import tailwindcss from '@tailwindcss/vite'
import { type UserManifest, defineConfig } from 'wxt'

export const manifest: UserManifest = {
  name: '__MSG_extName__',
  description: '__MSG_extDescription__',
  version: '6.1.0',
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
      js: [
        '/js/obelisk.min.js',
        '/js/browser-polyfill.min.js',
        '/js/content_script.js',
      ],
    },
  ],
}

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  outDir: 'dist',
  modules: ['@wxt-dev/module-svelte'],
  manifest,
  vite: () => ({
    plugins: [tailwindcss()],
  }),
})
