import router from './index.js'
import store from '../store'
if (localStorage.getItem('token')) {
  store.commit('set_token', localStorage.getItem('token'))
}
router.beforeEach((to, from, next) => {
  if (to.matched.some(r => r.meta.requireAuth)) {
    if (store.state.token) {
      next()
    } else {
      next({
        path: '/login'
      })
    }
  } else {
    next()
  }
})
