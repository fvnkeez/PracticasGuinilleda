import './assets/main.css'
import 'vuetify/styles' // Importa los estilos base de Vuetify

import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import App from './App.vue'

// Crea la instancia de Vuetify
const vuetify = createVuetify({
  components,
  directives,
  // Opcional: Configuración del tema
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1867C0',
          secondary: '#5CBBF6',
        },
      },
    },
  },
})

const app = createApp(App)

app.use(vuetify)
app.mount('#app')