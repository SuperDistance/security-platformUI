
// 配置API接口地址

// var root = './static/'
import store from '../store'

var root = 'http://localhost:8090'
// build
// 引用axios
const CryptoJS = require('crypto-js')

var axios = require('axios')

axios.interceptors.request.use(
  config => {
    // add token into header
    const token = localStorage.getItem('token')
    console.log(token)
    if (token !== undefined) {
      config.headers.authorization = token
      console.log('Success!')
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// response interceptor
// put token-get process into interceptor so that it can be refreshed
axios.interceptors.response.use(
  response => {
    console.log(response)
    if (response.headers.authorization !== undefined) {
      const jwt = response.headers.authorization
      store.commit('set_token', jwt)
      // to get the username in the Payload
      console.log('jwt ' + jwt)
      const encryptedPayload = jwt.split('.')[1]
      console.log('Payload ' + encryptedPayload)
      const parsedWordArray = CryptoJS.enc.Base64.parse(encryptedPayload)
      const decryptedPayload = parsedWordArray.toString(CryptoJS.enc.Utf8)
      console.log('decrypted Payload ' + decryptedPayload)
      // payload contains: iss（issuer），exp（expired time），sub（subscribe），aud（audience），iat（issue at time）
      const userInfo = JSON.parse(decryptedPayload)
      console.log('Payload object' + encryptedPayload)
      store.commit('setUserInfo', userInfo.sub)
    }
    return response
  },
  error => {
    console.log(error)
    if (error.response) {
      switch (error.response.status) {
        case 401:
          this.$store.commit('del_token')
          this.$router.replace({
            path: '/login',
            query: { redirect: this.$router.currentRoute.fullPath } // jump to original page
          })
      }
    }
    return Promise.reject(error.response)
  }
)

// 自定义判断元素类型JS

function toType (obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

// 参数过滤函数

// eslint-disable-next-line no-unused-vars
function filterNull (o) {
  for (const key in o) {
    if (o[key] === null) {
      delete o[key]
    }

    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }

  return o
}

/*

  接口处理函数

  这个函数每个项目都是不一样的，我现在调整的是适用于

  https://cnodejs.org/api/v1 的接口，如果是其他接口

  需要根据接口的参数进行调整。参考说明文档地址：

  https://cnodejs.org/topic/5378720ed6e2d16149fa16bd

  主要是，不同的接口的成功标识和失败提示是不一致的。

  另外，不同的项目的处理方法也是不一致的，这里出错就是简单的alert

*/

function apiAxios (method, url, params, success, failure) {
  if (params) {
    // params = filterNull(params)
  }

  axios({

    method: method,

    url: url,

    data: method === 'POST' || method === 'PUT' ? params : null,

    params: method === 'GET' || method === 'DELETE' ? params : null,

    baseURL: root,

    withCredentials: false

  })

    .then(function (res) {
      console.log(res)
      if (res.status === 200) {
        if (success) {
          success(res)
        }
      } else {
        if (failure) {
          failure(res)
        } else {
          window.alert('error: ' + JSON.stringify(res.data))
        }
      }
    })

    .catch(function (err) {
      // let res = err.response
      if (err) {
        window.alert('api error, HTTP CODE: ' + err.status + '\nerror Message: ' + err.data.message)
      }
    })
}

// 返回在vue模板中的调用接口

export default {

  get: function (url, params, success, failure) {
    return apiAxios('GET', url, params, success, failure)
  },

  post: function (url, params, success, failure) {
    return apiAxios('POST', url, params, success, failure)
  },

  put: function (url, params, success, failure) {
    return apiAxios('PUT', url, params, success, failure)
  },

  delete: function (url, params, success, failure) {
    return apiAxios('DELETE', url, params, success, failure)
  }

}
