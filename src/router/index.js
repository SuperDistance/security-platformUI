import Vue from 'vue'
import VueRouter from 'vue-router'

import seminarOneBase from '@/frame/seminarOne'
import MessageDigest from '../components/MessageDigest'
import SymmetricEncryption from '../components/SymmetricEncryption'
import AsymmetricEncryption from '../components/AsymmetricEncryption'
import DigitalCertificate from '../components/DigitalCertificate'

import seminarThreeBase from '../frame/seminarThree'

import seminarFourBase from '../frame/seminarFour'

import login from '@/page/login'
import Base from '@/page/base'

Vue.use(VueRouter)

// 子路由
const seminarOneRouter = new VueRouter({
  mode: 'abstract',
  routes: [
    { path: '/exp1', component: MessageDigest },
    { path: '/exp2', component: SymmetricEncryption },
    { path: '/exp3', component: AsymmetricEncryption },
    { path: '/exp4', component: DigitalCertificate },
    { path: '/', redirect: '/exp1' }
  ]
})

const seminarThreeRouter = new VueRouter({
  mode: 'abstract',
  routes: [
    { path: '/list', component: MessageDigest },
    { path: '/', redirect: '/list' }
  ]
})

const seminarFourRouter = new VueRouter({
  mode: 'abstract',
  routes: [
    { path: '/list', component: MessageDigest },
    { path: '/', redirect: '/list' }
  ]
})

// nested-router 又套了一层
const seminarOneNested = {
  router: seminarOneRouter,
  template: `<seminarOneBase> </seminarOneBase>`,
  components: { seminarOneBase }
}

const seminarThreeNested = {
  router: seminarThreeRouter,
  template: `<seminarThreeBase> </seminarThreeBase>`,
  components: { seminarThreeBase }
}

const seminarFourNested = {
  router: seminarFourRouter,
  template: `<seminarFourBase> </seminarFourBase>`,
  components: { seminarFourBase }
}

// 总路由定义
export default new VueRouter({
  mode: 'hash',
  base: __dirname,
  routes: [
    {path: '/base',
      component: Base,
      children: [
        { path: '/', redirect: '/seminar1' },
        { path: '/seminar1', component: seminarOneNested },
        { path: '/seminar2', component: seminarThreeNested },
        { path: '/seminar3', component: seminarFourNested }
      ]
    },
    { path: '/login', component: login },
    { path: '/', redirect: '/login' }
  ]
})

/*
export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'Base',
      component: (resolve) => require(['../page/base.vue'], resolve)
    },
    {
      //动态绑定样例
      path: '/content/:id',
      name: 'Content',
      component: Content
    }
  ]
})
*/
