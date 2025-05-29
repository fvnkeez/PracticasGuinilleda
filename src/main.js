import './assets/main.css'
import 'vuetify/styles' // Importa los estilos base de Vuetify
import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import App from './App.vue'

// Crea la instancia de Vuetify
const vuetify = createVuetify({
  components,
  directives,
    icons: {
    defaultSet: 'mdi',
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#333446',
          secondary: '#7F8CAA',
          terciary: '#B8CFCE',
          cuaternary: '#EAEFEF'
        },
      },
    },
  },
})

const app = createApp(App)

app.use(vuetify)
app.mount('#app')