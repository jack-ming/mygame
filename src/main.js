import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Game from './Game.vue'
import Admin from './Admin.vue'
import './style.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Game },
    { path: '/admin', component: Admin },
  ],
})

createApp(App)
  .use(router)
  .mount('#app')
