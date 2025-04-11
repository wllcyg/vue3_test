import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import router from './router'
import '@mdi/font/css/materialdesignicons.css'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { createPinia } from 'pinia'
const pinia = createPinia()

const vuetify = createVuetify({
    icons: {
       defaultSet: 'mdi',
       aliases,
       sets: {
         mdi,
       },
     },
})
createApp(App).use(pinia).use(router).use(vuetify).mount('#app')
