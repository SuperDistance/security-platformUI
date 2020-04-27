import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    username: '',
    token: ''
  },
  mutations: {
    set_token (state, token) {
      state.token = token
      localStorage.setItem('token', 'bearer ' + token)
    },
    del_token (state) {
      state.token = ''
      localStorage.removeItem('token')
    },
    setUserInfo (state, username) {
      state.username = username
    }
  }
})

export default store
