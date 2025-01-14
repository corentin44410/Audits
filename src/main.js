import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'

// Initialisation de la base de données
import { initDB } from './stores/db'

// Initialisation du service worker
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    // Vous pouvez ajouter une notification ici pour informer l'utilisateur
    if (confirm('Une nouvelle version est disponible. Voulez-vous mettre à jour ?')) {
      updateSW()
    }
  },
  onOfflineReady() {
    console.log('L\'application est prête à fonctionner hors ligne')
  },
})

// Initialiser la base de données avant de démarrer l'application
initDB().then(() => {
  const app = createApp(App)
  app.use(createPinia())
  app.use(router)
  app.mount('#app')
}).catch(error => {
  console.error('Erreur lors de l\'initialisation de la base de données:', error)
})