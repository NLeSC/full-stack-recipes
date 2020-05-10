import gql from 'graphql-tag'

export const state = () => ({
  loggedIn: false,
  authMessage: {},
  user: {},
})

export const getters = {
  showedName: (state) => {
    return state.user.showedName || state.user.displayName
  },
}

const UPSERT_USER_MUTATION = gql`
  mutation upset_user(
    $id: String!
    $name: String!
    $picture: String
    $email: String!
  ) {
    insert_users(
      objects: { id: $id, name: $name, picture: $picture, email: $email }
      on_conflict: { constraint: users_pkey, update_columns: updated_at }
    ) {
      affected_rows
    }
  }
`

export const actions = {
  UPSERT_USER({ commit }, { authUser, claims }) {
    if (!authUser) {
      commit('RESET_STATE_USER')
    } else {
      // you can request additional fields if they are optional (e.g. photoURL)
      const user = {
        uid: claims.user_id,
        email: claims.email,
        emailVerified: claims.emailVerified,
        name: claims.name,
        picture: claims.picture,
      }

      // Store locally
      commit('UPSERT_USER', user)

      // Store in database
      // The ApolloProvider needs to be loaded before it is called. it will take a few milliseconds,
      // so we will wait for it. The wait is asynchronous.
      setTimeout(() => {
        try {
          this.app.apolloProvider.defaultClient.mutate({
            mutation: UPSERT_USER_MUTATION,
            variables: {
              id: user.uid,
              email: user.email,
              name: user.name,
              picture: user.picture,
            },
          })
        } catch (e) {
          console.error('Not able to write user in the DB.', e)
        }
      }, 500)
    }
  },
  RESET_AUTH_MESSAGE_USER({ commit }) {
    commit('RESET_AUTH_MESSAGE_USER', null)
  },
  resetUserState({ commit }) {
    commit('RESET_STATE_USER', null)
  },
}

export const mutations = {
  /**
   * Called to check the user status when the application initiates.
   */
  UPSERT_USER(state, { uid, email, emailVerified, name, picture }) {
    state.user = {
      uid,
      email,
      emailVerified,
      name,
      picture,
      // isAdmin: claims.custom_claim,
    }
    state.loggedIn = true
  },
  RESET_STATE_USER(state) {
    state.user = null
    state.loggedIn = false
  },

  // set logged in to true or false
  SET_LOGIN_USER(state, payload) {
    state.loggedIn = payload
  },
}
