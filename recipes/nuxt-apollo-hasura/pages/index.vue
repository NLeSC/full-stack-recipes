<template>
  <div class="d-flex justify-center align-center">
    <v-card max-width="700" width="100%">
      <v-img src="images/stack.png" :aspect-ratio="4 / 1" />

      <v-card-title class="headline">
        NuxtJs + Apollo + Hasura + Postgres template
      </v-card-title>

      <v-card-text>
        <hr class="my-3" />
        Database:
        <a href="http://localhost:4000" target="_blank">Hasura console</a>
        <br />
        <a href="https://nuxtjs.org/" target="_blank">
          Nuxt Documentation
        </a>
        <br />
        <a href="https://materialdesignicons.com/" target="_blank">
          Material Design Icons
        </a>
        <br />
        <a href="https://github.com/nuxt/nuxt.js" target="_blank">
          Nuxt GitHub
        </a>
        Nuxt modules: https://auth.nuxtjs.org/ apollo
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" nuxt to="/crud">
          CRUD and Subscriptions
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
