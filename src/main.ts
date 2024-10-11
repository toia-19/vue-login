import './assets/style.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import { useAuthStore } from './stores/authStore';
import { fakeBackend } from './helpers/fakebackend';

import App from './App.vue';
import router from './router';

// Started fakeBackend before startApp -> for references
fakeBackend();

startApp();

async function startApp() {
    const app = createApp(App)

    app.use(createPinia())
    app.use(router)

    try {
        const authStore = useAuthStore();
        
        await authStore.refreshToken;
    } catch (error) {
        console.warn("No hay datos de autentificación para el usuario");

        console.info("Redirigiendo a 'Login Page'");

        router.push("/login");
    }

    app.mount('#app')
}