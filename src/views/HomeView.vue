<script setup lang="ts">
// Import of store: "user"
import { useUserStore } from '@/stores/user';

// Computed: Permite definir propiedades dinámicas que dependen de otras propiedades
import { computed } from 'vue';

// Constant in charge of obtaining the status of the "user" store
const userStore = useUserStore();

// Computed "user" constant that will display the user's current status in store
const user = computed(() => userStore.user);

</script>

<template>
  <main class="cont-principal">
    <h1 class="titulo">¡Bienvenido/ a, {{user.username}}!</h1>

    <ion-icon name="accessibility-outline"></ion-icon>
    <ion-icon name="accessibility-outline"></ion-icon>
    <ion-icon name="accessibility-outline"></ion-icon>

    <p class="informacion">
      Contraseña ingresada: {{ user.password }} <br>
      ¿Recordar información?: {{ user.remember }}
    </p>
  </main>
</template>

<style scoped>
  .cont-principal{
    text-align: center;
    justify-content: space-around;
  }

  .titulo{
    font-size: 2em;
    font-weight: 400;

    color: white;
  }

  ion-icon{
    font-size: 2rem;

    color: white;

    padding: 1rem;
  }

  .informacion{
    text-align: center;
    color: white;
  }
</style>