import "element-plus/dist/index.css";
import router from "@/router"

import {createApp} from 'vue'
import {createPinia} from 'pinia'
import App from './App.vue'

createApp(App)
    .use(createPinia())
    .use(router)
    .mount('#app')
