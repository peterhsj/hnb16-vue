/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Styles
// import '@fontsource/roboto'

// import mock
if (import.meta.env.DEV) {
  import('@/mock')
}

const app = createApp(App)

registerPlugins(app)

// Mount app
app.mount('#app')

// In development, dynamically load and connect @vue/devtools if available.
if (import.meta.env.DEV) {
  // dynamic import so it is not bundled in production
  import('@vue/devtools')
    .then(mod => {
      try {
        const devtools = (mod && (mod.default ?? mod)) as any
        if (devtools && typeof devtools.connect === 'function') {
          devtools.connect()
        }
      } catch (error) {
        console.debug('Vue DevTools connect failed:', error)
      }
    })
    .catch(() => {
      // ignore
    })
}
