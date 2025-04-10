import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import router from './router'
const vuetify = createVuetify({

})
createApp(App).use(router).use(vuetify).mount('#app')
