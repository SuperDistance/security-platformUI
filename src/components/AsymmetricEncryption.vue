<template>
  <div>
    <div style="height: 30px;">
      <Progress :percent="progress" :stroke-color="['#108ee9', '#87d068']" :stroke-width="20" status="active" hide-info/>
    </div>
    <h2>前端</h2>
    <br></br>
    <Form ref="messageInfo" :model="messageInfo" label-position="left" :label-width="100" inline>
      <FormItem label="待加密信息">
        <Input v-model="messageInfo.message" maxlength="10000" show-word-limit type="textarea" placeholder="Enter something..." style="width: 500px" />
      </FormItem>
      <FormItem label="加密后信息">
        <Input v-model="frontendEncryption" maxlength="1000" show-word-limit type="textarea" placeholder="Haven't generate..." style="width: 500px" />
      </FormItem>
      <br></br>
      <FormItem label = "加密算法">
        <RadioGroup v-model = "messageInfo.category">
          <Radio label = "RSA">RSA</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label = "密钥生成">
        <Button type="primary" @click="getKey">{{showText}}</Button>
      </FormItem>
      <br></br>
      <FormItem label = "密钥" v-show="isGenerate||loading">
        <Spin size="large" v-if="loading"></Spin>
        <Input v-else v-model="publicKey" type="textarea" :autosize="{minRows: 2,maxRows: 8}" placeholder="Haven't submit..." style="width: 500px" />
      </FormItem>
      <FormItem label="加密花费时间" v-if = "frontendEncryption !== ''">
        <Tag color="error" >{{frontendTime}}ms</Tag>
      </FormItem>
      <br></br>
      <FormItem>
        <i-button type="success" @click = "handleSubmit">Submit</i-button>
        <i-button type="error" @click = "handleReset">RESET</i-button>
      </FormItem>
    </Form>
    <Divider> </Divider>
    <h2>后端</h2>
    <b/>
    <Tag color="primary" v-if = "backendDecryption === ''">Haven't Submit</Tag>
    <Tag color="success" v-else-if = "messageInfo.message === backendDecryption">Correct</Tag>
    <Tag color="error" v-else>Error</Tag>

    <Form label-position="left" :label-width="100" inline>
      <FormItem label="解密后信息">
        <Input v-model="backendDecryption" type="textarea" :autosize="{minRows: 2,maxRows: 8}" placeholder="Haven't submit..." style="width: 500px" />
      </FormItem>
      <FormItem label="解密花费时间" v-if = "backendDecryption !== ''">
        <Tag color="error" >{{backendTime}}ms</Tag>
      </FormItem>
    </Form>
  </div>
</template>
<script>
// 前端获取后端生成的加密模、公钥指数
// 通过模和公钥参数获取公钥
import { JSEncrypt } from 'jsencrypt'
export default {
  name: 'AsymmetricEncryption',
  data () {
    return {
      messageInfo: {
        message: '',
        category: 'RSA'
      },
      publicKey: '',
      showText: '点击生成',
      isGenerate: false,
      frontendEncryption: '',
      backendDecryption: '',
      backendTime: '',
      frontendTime: '',
      progress: 0,
      loading: false
    }
  },
  created () {
  },
  watch: {
    messageInfo: {
      handler (newName, oldName) {
        // 回调函数内部this指向函数本身，用箭头函数也可以解决this指向问题
        const this_ = this
        this_.progress = 0
        // 获得密钥后，才开始计算，否则不计算
        if (this_.isGenerate && oldName.message !== '' && oldName.category !== '' && oldName.message !== undefined && oldName.category !== undefined) {
          let timer
          let start
          let end
          // 借助promise对象实现异步，确保计时相对精确
          var step1 = new Promise(function (resolve, reject) {
            this_.progress = 0
            timer = new Date()
            console.log(1)
            resolve(step2)
            reject(new Error('fail1'))
          })
          var step2 = new Promise(function (resolve, reject) {
            start = timer.getTime()
            console.log(2)
            resolve(step3)
            reject(new Error('fail2'))
          })
          var step3 = new Promise(function (resolve, reject) {
            console.log(3)
            var jsencrypt = new JSEncrypt()
            jsencrypt.setPublicKey(this_.publicKey)
            if (newName.category === 'RSA') {
              this_.frontendEncryption = jsencrypt.encrypt(newName.message)
            }
            resolve(step4)
            reject(new Error('fail3'))
          })
          var step4 = new Promise(function (resolve, reject) {
            console.log(4)
            timer = new Date()
            resolve(step5)
            reject(new Error('fail4'))
          })
          var step5 = new Promise(function (resolve, reject) {
            end = timer.getTime()
            console.log(start)
            console.log(end)
            console.log(end - start)
            this_.progress = 99.999
            resolve(this_.frontendTime = end - start)
            reject(new Error('fail5'))
          })
          step1()
        } else {
          this_.progress = 0
        }
        console.log(newName)
      },
      deep: true
    },
    publicKey: {
      handler (newName, oldName) {
        let timer
        let start
        let end
        // 回调函数内部this指向函数本身，用箭头函数也可以解决this指向问题
        const this_ = this
        // 获得密钥后，才开始计算，否则不计算
        if (this_.isGenerate && this_.messageInfo.message !== '' && this_.messageInfo.category !== '' &&
          this_.messageInfo.message !== undefined && this_.messageInfo.category !== undefined) {
        // 借助promise对象实现异步，确保计时相对精确
          var step1 = new Promise(function (resolve, reject) {
            timer = new Date()
            console.log(1)
            resolve(step2)
            reject(new Error('fail1'))
          })
          var step2 = new Promise(function (resolve, reject) {
            start = timer.getTime()
            console.log(2)
            resolve(step3)
            reject(new Error('fail2'))
          })
          var step3 = new Promise(function (resolve, reject) {
            console.log(3)
            var jsencrypt = new JSEncrypt()
            jsencrypt.setPublicKey(this_.publicKey)
            if (this_.messageInfo.category === 'RSA') {
              this_.frontendEncryption = jsencrypt.encrypt(this_.messageInfo.message)
            }
            resolve(step4)
            reject(new Error('fail3'))
          })
          var step4 = new Promise(function (resolve, reject) {
            console.log(4)
            timer = new Date()
            resolve(step5)
            reject(new Error('fail4'))
          })
          var step5 = new Promise(function (resolve, reject) {
            end = timer.getTime()
            console.log(start)
            console.log(end)
            console.log(end - start)
            resolve(this_.frontendTime = end - start)
            this_.progress = 99.999
            reject(new Error('fail5'))
          })
          step1()
        } else {
          this_.progress = 0
        }
        console.log(this.messageInfo)
      }
    }
  },
  methods: {
    postData () {
      this.$api.get('/seminar1/exp32', {enc: this.frontendEncryption}, r => {
        r = r.data
        if (r.success === true) {
          this.backendDecryption = r.data[0]
          this.backendTime = r.data[1]
          this.$Message.success('Success!')
        } else {
          this.$Message.error('Fail! ' + r.errorMsg)
        }
      })
    },
    handleSubmit () { // 带''是字符串, 不带传入Object
      console.log(this.messageInfo)
      console.log(this.frontendEncryption)
      this.postData()
    },
    handleReset () {
      this.$refs['messageInfo'].resetFields()
      this.messageInfo = []
      this.frontendEncryption = ''
      this.frontendTime = ''
      this.backendTime = ''
      this.backendDecryption = ''
      this.isGenerate = false
      this.publicKey = ''
      this.progress = ''
    },
    getKey () {
      this.progress = 0
      this.loading = true
      this.$api.get('/seminar1/exp31', null, r => {
        r = r.data
        this.publicKey = r
        this.isGenerate = true
        this.loading = false
      })
      this.showText = '重新生成'
    }
  }
}
</script>
<style>
</style>
