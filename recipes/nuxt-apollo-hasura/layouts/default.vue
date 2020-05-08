<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
      :width="220"
      mobile-break-point="759"
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-toolbar-title class="ml-4" v-text="title" />
      <v-spacer />
      <login-button />
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer app class="flex">
      <img
        src="https://www.esciencecenter.nl/wp-content/themes/raadhuis/dist/assets/img/favicons/apple-touch-icon.png"
        width="20"
        class="mr-3"
      />
      <small>eScience Center &copy; {{ new Date().getFullYear() }}</small>
      <v-spacer></v-spacer>
      <small>App version {{ version }}</small>
    </v-footer>
  </v-app>
</template>

<script>
import { version } from '~/package.json'
import LoginButton from '~/components/LoginButton'
export default {
  components: { LoginButton },
  data() {
    return {
      clipped: true,
      drawer: true,
      miniVariant: true,
      items: [
        {
          icon: 'mdi-home-outline',
          title: 'Home',
          to: '/',
        },
        {
          icon: 'mdi-database-sync',
          title: 'CRUD Database',
          to: '/crud',
        },
        {
          icon: 'mdi-file-lock-outline',
          title: 'Secret Page',
          to: '/secret',
        },
      ],
      title: 'Nuxt Apollo Hasura',
    }
  },
  computed: {
    version: () => version,
  },
}
</script>
