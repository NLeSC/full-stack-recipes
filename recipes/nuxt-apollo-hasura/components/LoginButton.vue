<template>
  <div>
    <v-menu v-if="loggedIn && !!user" transition="slide-y-transition" bottom>
      <template v-slot:activator="{ on }">
        <v-avatar size="36" v-on="on">
          <v-img :src="user.picture" />
        </v-avatar>
      </template>
      <v-list>
        <v-list-item to="/profile">
          <v-list-item-icon><v-icon> mdi-account</v-icon></v-list-item-icon>

          <v-list-item-title>Profile</v-list-item-title>
        </v-list-item>
        <v-list-item @click="logout">
          <v-list-item-icon><v-icon> mdi-exit-run</v-icon></v-list-item-icon>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-dialog v-else v-model="_loginDialog" width="350">
      <template v-slot:activator="{ on }">
        <v-btn outlined v-on="on"
          >Log in <span class="hidden-xs-only">/ Sign up</span>
        </v-btn>
      </template>

      <v-card class="dialog-login" color="grey lighten-3" min-height="200">
        <v-card-title class="headline" primary-title>
          Getting access
        </v-card-title>

        <v-card-text class="body-2">
          <h4>
            Somewhere, something incredible is waiting to be known.
          </h4>
          <h5>Carl Sagan</h5>
        </v-card-text>

        <div class="d-flex flex-column pa-4">
          <v-btn
            color="white"
            rounded
            depressed
            @click="showEmailLinkBox = !showEmailLinkBox"
          >
            <v-icon left>mdi-email-outline</v-icon>
            Email link
          </v-btn>
          <v-sheet class="mt-3 mb-3">
            <v-sheet
              v-if="linkSent"
              v-show="showEmailLinkBox"
              color="success"
              class="pa-3 white--text text-center"
            >
              <v-icon class="mr-2" color="white">mdi-check-bold</v-icon>
              Check your email to login.
            </v-sheet>
            <v-container v-else v-show="showEmailLinkBox">
              <h4>Get access link to your inbox.</h4>
              <v-form
                ref="form"
                v-model="valid"
                lazy-validation
                @submit.prevent="validateEmailLink"
              >
                <v-text-field
                  v-model="email"
                  :rules="emailRules"
                  label="E-mail"
                  required
                />

                <v-row no-gutters justify="end">
                  <v-btn
                    :disabled="!valid || email === ''"
                    color="primary"
                    rounded
                    depressed
                    @click="validateEmailLink"
                  >
                    Send access link
                    <v-icon right>mdi-send</v-icon>
                  </v-btn>
                </v-row>
              </v-form>
            </v-container>
          </v-sheet>
          <div v-if="!showEmailLinkBox && !linkSent" class="d-flex flex-column">
            <v-row no-gutters>
              <v-col class="pb-2 pr-2">
                <v-btn
                  style="width: 100%;"
                  color="white"
                  rounded
                  depressed
                  @click="loginWithGoogle"
                >
                  <v-icon left>mdi-google</v-icon>
                  Google
                </v-btn>
              </v-col>
              <v-col>
                <v-btn
                  style="width: 100%;"
                  color="white"
                  rounded
                  depressed
                  @click="loginWithGithub"
                >
                  <v-icon left>mdi-github</v-icon>
                  Github
                </v-btn>
              </v-col>
            </v-row>
            <v-divider />
            <v-btn
              disabled
              color="orange"
              class="mt-3"
              rounded
              depressed
              @click="showEmailLinkBox = !showEmailLinkBox"
            >
              <v-icon left>mdi-chart-bubble</v-icon>
              Login with Surf
            </v-btn>
            <v-btn
              disabled
              color="orange"
              class="mt-3"
              rounded
              depressed
              @click="showEmailLinkBox = !showEmailLinkBox"
            >
              <v-icon left>mdi-sticker-circle-outline</v-icon>
              Login with AARC
            </v-btn>
          </div>
        </div>

        <v-card-actions>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'LoginButton',
  data() {
    return {
      showEmailLinkBox: false,

      valid: false,
      linkSent: false,
      email: '',
      emailRules: [
        (v) => !!v || v.length === 0 || 'E-mail is required',
        (v) => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
      password: '',
      confirmPassword: '',
      passwordRules: [(v) => !!v || 'Password is Required'],
    }
  },
  computed: {
    ...mapState('login', ['loginDialog']),
    ...mapState('user', ['user', 'loggedIn']),
    // Open this login dialog from every part of the application
    _loginDialog: {
      get() {
        return this.loginDialog
      },
      set() {
        this.toggleDialogLogin()
      },
    },
  },

  methods: {
    // ...mapActions('userData', ['LOGIN_WITH_GOOGLE', 'LOGOUT_USER', 'TOGGLE_LOGIN_DIALOG_USER']),
    ...mapActions({
      loginWithEmailLInk: 'login/LOGIN_WITH_EMAIL_LINK',
      loginWithGoogle: 'login/LOGIN_WITH_GOOGLE',
      loginWithGithub: 'login/LOGIN_WITH_GITHUB',
      logout: 'login/LOGOUT_USER',
      toggleDialogLogin: 'login/TOGGLE_LOGIN_DIALOG_USER',
    }),

    toProfile() {
      this.$router.push({ name: 'profile' })
    },

    validateEmailLink() {
      if (this.$refs.form.validate()) {
        this.linkSent = true
        this.loginWithEmailLInk({ email: this.email })
      }
    },

    reset() {
      this.$refs.form.reset()
    },
  },
}
</script>

<style lang="scss" scoped>
.v-avatar {
  margin-left: 8px;
  cursor: pointer;
  transition: opacity 200ms ease;
  &:hover {
    opacity: 0.8;
  }
  img {
    min-width: 32px;
    height: auto;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
