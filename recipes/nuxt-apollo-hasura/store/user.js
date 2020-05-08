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

export const actions = {
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
  ON_AUTH_STATE_CHANGED_MUTATION(state, { authUser, claims }) {
    if (!authUser) {
      state.user = null
      state.loggedIn = false
    } else {
      // you can request additional fields if they are optional (e.g. photoURL)
      const { user_id: uid, email, emailVerified, name, picture } = claims
      state.user = {
        uid,
        email,
        emailVerified,
        name,
        picture,
        // isAdmin: claims.custom_claim,
      }
      state.loggedIn = true
    }
  },
  // set logged in to true or false
  SET_LOGIN_USER(state, payload) {
    state.loggedIn = payload
  },
}
