<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-img :src="'images/stack.png'" />
      <v-card>
        <v-card-title class="headline">
          NuxtJs + Apollo + Hasura + Postgres template
        </v-card-title>
        <v-card-text>
          <h3>Data from database</h3>
          <p>
            <a
              href="http://localhost:4000/console/data/schema/public"
              target="_blank"
              >Create a table</a
            >
            called list on the database with 3 columns, id, name and
            description.
          </p>

          <div v-for="item in list" :key="item.id">
            {{ item.title }} - {{ item.description }}
          </div>

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
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" nuxt to="/inspire">
            Continue
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import gql from 'graphql-tag'

export default {
  components: {},
  apollo: {
    list: {
      prefetch: true,
      query: gql`
        query list {
          list {
            title
            id
            description
          }
        }
      `,
    },
  },
}
</script>
