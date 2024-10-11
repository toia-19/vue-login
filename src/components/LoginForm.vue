<script setup lang="ts">
// Import of "user" store (local)
import { useUserStore } from '@/stores/user';

// Import of "vue-router" for route management (local)
import { useRouter } from 'vue-router';

// Import of "auth" store (local)
import { useAuthStore } from '@/stores/authStore';

// Import of bookstores
import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';

// Constant "userStore" for store reference "user"
const userStore = useUserStore();

// Constant "useAuth" for store reference authentication
const authStore = useAuthStore();

// Constant defined to use the "useRoute" method -> reactive object
const router = useRouter();

if (authStore.auth.data){
    router.push('/home');
}

const schema = Yup.object().shape({
    username: Yup.string().required("¡Usuario requerido!"),
    password: Yup.string().required("¡Contraseña requerida!")
})


// Arrow function to send via parameter the credentials obtained to store -> executed when sending the form data
const handleSubmit = (values: any, { setErrors }: any) => {
    const { username, password } = values;

    return authStore.login(username, password).then(() => {
        router.push("/login");
    })
    .catch(error => setErrors({ apiError: error }) )
}

</script>

<template>
    <div class="wrapper">
        <!-- <Form> -> schema (Yup) -->

        <!-- @submit.prevent: Prevents the default behavior of the form. Calls the "handleSubmit" method -->
        <Form id="loginForm" @submit.prevent="handleSubmit" :validation-schema="schema" v-slot="{ errors, isSubmitting }">
            <h1>Inicio de Sesión</h1>

            <!-- Username -->
            <div class="input-bx">
                <!-- v-model: Captures and sends form data bidirectionally -->
                <Field name="username" type="text" :class="{'is-invalid': errors.username || errors.apierror}" 
                placeholder="Ingrese su nombre de usuario..." required/>
                
                <ion-icon class="icon" name="person-circle"></ion-icon>

                <div class="invalid-feedback">{{ errors.username }}</div>
            </div>

            <!-- Password -->
            <div class="input-bx">
                <Field name="password" type="password" :class="{'is-invalid': errors.password || errors.apierror}" 
                placeholder="Ingrese su contraseña..." required/>
                
                <ion-icon class="icon" name="lock-closed"></ion-icon>

                <div class="invalid-feedback">{{ errors.password }}</div>
            </div>

            <!-- RememberMe -->
            <div class="remember-forgot">
                <label><input type="checkbox" name="remember">Recordarme</label>
                <a href="#">Olvidaste tu contraseña</a>
            </div>
            <button type="submit" class="btn">
                <!-- Spinner | v-show -> conected with boolean -->
                <span v-show="isSubmitting" class="loader"></span>

                <!-- Text boton -->
                <p v-show="!isSubmitting">Ingresar</p>
            </button>

            <!-- Error alerted -->
            <div v-if="errors.apiError" class="error-alert">{{ errors.apiError }}</div>
        </Form>
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

.wrapper button p {
    font-size: 1.2em;
    font-weight: 600;
    color: #333;
}

.loader {
    margin: auto 0;
    width: 24px;
    height: 24px;
    border: 4px solid #800080;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
}

@keyframes rotation {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* ERROR */
.wrapper .input-bx input.is-invalid {
    width: 100%;
    height: 100%;
    background: rgba(250, 150, 150, 0.1);
    border: 2px solid rgba(255, 0, 0, 0.2);
    color: #ff0000;
}

.wrapper .input-bx input.is-invalid::placeholder {
    color: #ff0000;
}

.wrapper .input-bx .invalid-feedback {
    padding: 0px 16px;
    margin: 0;
    color: #ff0000;
    font-weight: 300;
}

.error-alert{
    margin: 16px 0 0 0;
    width: 100%;
    background: transparent;
    color: #ff0000;
    text-align: center;
    font-weight: 400;
}

</style>