// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ViewUI from 'view-design'
import './style/scss/index.less'
import 'view-design/dist/styles/iview.css'
import Qs from 'qs'

// 引用API文件
import api from './api/index.js'
// 将API方法绑定到全局
Vue.prototype.$api = api
Vue.prototype.qs = Qs

Vue.config.productionTip = false

//  全局注册组件
Vue.use(ViewUI)

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
