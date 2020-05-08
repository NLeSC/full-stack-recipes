<template>
  <div>
    <v-app-bar dense elevation="0">
      <v-btn rounded text @click="goBack">
        <v-icon left>
          mdi-arrow-left
        </v-icon>
        <span class="hidden-xs-only">Go back</span>
      </v-btn>
    </v-app-bar>
    <v-container>
      <v-row v-if="!!user" no-gutters justify="center" align="start">
        <v-card width="500" class="mx-4 pa-2">
          <div class="d-flex">
            <v-img :src="user.picture" max-width="100px" contain />
            <v-card-title primary-title>
              <div>
                <div class="headline">
                  {{ user.name }}
                </div>
                <div>{{ user.email }}</div>
              </div>
            </v-card-title>
          </div>
          <v-card-actions>
            <v-btn depressed @click="LOGOUT_USER">
              LOG OUT
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import {
  mapActions,
  // mapGetters,
  mapState,
} from 'vuex'
// import { roles } from '@/types/roles'

export default {
  name: 'App',
  data() {
    return {
      showButton: false,
    }
  },
  computed: {
    ...mapState('user', ['user', 'loggedIn']),
  },
  methods: {
    ...mapActions('login', ['LOGOUT_USER']),
    goBack() {
      this.$router.go(-1)
    },
  },
}
</script>
