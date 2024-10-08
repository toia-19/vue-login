<script setup lang="ts">
// Import of "user" interface as type
import type { User } from '@/models/UserModel';

// Import of "user" store
import { useUserStore } from '@/stores/user';

// Import of "vue-router" for route management
import { useRouter } from 'vue-router';

// Constant "userStore" for store reference "user"
const userStore = useUserStore();

// Constant defined to use the "useRoute" method -> reactive object
const router = useRouter();

// Constant defined to receive the form data
const credenciales: User = ({
    id: 1,
    firstname: '',
    lastname: '',
    username: '',
    password: '',
    remember: false,
    isAdmin: true,
    jwtToken: '', // optional
    refreshTokens: []
})

// Arrow function to send via parameter the credentials obtained to store -> executed when sending the form data
const onSubmit = () => {
    userStore.setUser(credenciales);

    // Redirects to the root view ("Home")
    router.push({path: '/home'});
}

</script>

<template>
    <div class="wrapper">
        <!-- @submit.prevent: Prevents the default behavior of the form. Calls the "handleSubmit" method -->
        <form id="loginForm" @submit.prevent="onSubmit">
            <h1>Inicio de Sesión</h1>
            <div class="input-bx">
                <!-- v-model: Captures and sends form data bidirectionally -->
                <input v-model="credenciales.username" name="username" type="text" placeholder="Ingrese su nombre de usuario..." required>
                <ion-icon class="icon" name="person-circle"></ion-icon>
            </div>
            <div class="input-bx">
                <input v-model="credenciales.password" name="password" type="password" placeholder="Ingrese su contraseña..." required>
                <ion-icon class="icon" name="lock-closed"></ion-icon>
            </div>
            <div class="remember-forgot">
                <label><input v-model="credenciales.remember" type="checkbox" name="remember">Recordarme</label>
                <a href="#">Olvidaste tu contraseña</a>
            </div>
            <button type="submit" class="btn">Ingresar</button>
        </form>
    </div>
</template>

<style scoped>
/* Styles of the component */
.wrapper {
    width: 400px;
    background: transparent;
    border: 2px solid rgba(255, 255, 255, .2);
    backdrop-filter: blur(20px);
    box-shadow: 0 0 10px rgba(0,0,0,.2);
    color: #fff;
    padding: 30px 40px;
    border-radius: 15px;
}

.wrapper h1 {
    font-size: 2.5em;
    text-align: center;
}

.wrapper .input-bx {
    position: relative;
    width: 100%;
    height: 50px;
    margin: 30px 0;
}

.wrapper .input-bx input {
    width: 100%;
    height: 100%;
    background: transparent;
    border: none;
    outline: none;
    border: 2px solid rgba(255, 255, 255, .2);
    border-radius: 15px;
    color: #fff;
    padding: 20px 45px 20px 20px;
}

.wrapper .input-bx input::placeholder {
    color: #fff;
}

.wrapper .input-bx .icon {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.5em;
}

.wrapper .remember-forgot {
    display: flex;
    justify-content: space-between;
    font-size: 1.2em;
    margin: -15px 0 15px;
}

.wrapper .remember-forgot label input {
    accent-color: #fff;
    margin-right: 3px;
}

.wrapper .remember-forgot a {
    color: #fff;
    text-decoration: none;
}

.wrapper .remember-forgot a:hover {
    text-decoration: underline;
}

.wrapper button {
    width: 100%;
    height: 50px;
    border-radius: 15px;
    border: none;
    outline: none;
    box-shadow: 0 0 10px rgba(0,0,0,.1);
    cursor: pointer;
    font-size: 1.2em;
    font-weight: 600;
    color: #333;
}
</style>