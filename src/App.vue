<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

</script>

<template>
  <header>
    <div class="wrapper">

      <nav class="navegador">
        <RouterLink class="ruta" to="/">Home</RouterLink>
        <RouterLink class="ruta" to="/login">Login</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
  .wrapper{
    margin: 1rem;
  }

  .navegador{
    text-align: center;
  }

  .ruta{
    margin: 1em;

    color: white
  }

  .ruta:hover{
    color: lightpink;
  }
</style>
