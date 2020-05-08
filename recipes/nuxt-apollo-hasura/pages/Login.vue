<template>
  <v-content>
    <v-container>
      <h1>Welcome</h1>
      <h4>Your API token is: {{ $route.query.apiKey }}</h4>

      <h4>Mode: {{ $route.query.mode }}</h4>
      <h4>Lang: {{ $route.query.lang }}</h4>
    </v-container>
  </v-content>
</template>

<script>
export default {
  name: 'Login',
}
</script>
