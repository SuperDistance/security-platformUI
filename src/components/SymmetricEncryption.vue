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
          <Radio label = "DES">DES (ECB Mode)</Radio>
          <Radio label = "AES">AES(CBC Mode)</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label = "密钥">
        <Tag color="primary">{{publicKey}}</Tag>
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
var CryptoJS = require('crypto-js')
// 在实现的时候，由于AES加密的方式很多
// 确定好采用的 AES 的 vi (初始变量)、key(秘钥)、mode(加密模式)、padding(填充方式)。这样在实现多端加解密的时候才都正确
export default {
  name: 'SymmetricEncryption',
  data () {
    return {
      messageInfo: {
        message: '',
        category: ''
      },
      publicKey: '3132333435363738393041424344454631323334353637383930414243444566',
      iv: '30313233343536373839414243444546',
      frontendEncryption: '',
      backendDecryption: '',
      backendTime: '',
      frontendTime: '',
      progress: 0
    }
  },
  created () {
  },
  watch: {
    messageInfo: {
      handler (newName, oldName) {
        // 回调函数内部this指向函数本身，用箭头函数也可以解决this指向问题
        const this_ = this
        // 选择算法后，才开始计算，否则不计算
        if (oldName.message !== '' && oldName.category !== '' && oldName.message !== undefined && oldName.category !== undefined) {
          let timer
          let start
          let end
          // 借助promise对象实现异步，确保计时相对精确
          var step1 = new Promise(function (resolve, reject) {
            timer = new Date()
            console.log(1)
            this_.progress = 0
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
            if (newName.category === 'DES') {
              this_.DESECBencry(newName.message)
            } else if (newName.category === 'AES') {
              this_.AESCBCEncrypt(newName.message)
              this_.AESCBCDecrypt(this_.frontendEncryption)
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
          console.log('newName.message' + newName.message)
          console.log('newName.category' + newName.category)
          step1()
        } else {
          this_.progress = 0
          console.log('this_.progress' + this_.progress)
        }
        console.log(this.messageInfo)
      },
      deep: true
    }
  },
  methods: {
    postData () {
      this.$api.get('/seminar1/exp2', {method: this.messageInfo.category, enc: this.frontendEncryption, iv: this.iv, key: this.publicKey}, r => {
        this.backendDecryption = r[0]
        this.backendTime = r[1]
        this.$Message.success('Success!')
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
      this.progress = 0
    },
    AESCBCEncrypt (text) {
      this.frontendEncryption = CryptoJS.AES.encrypt(text, CryptoJS.enc.Hex.parse(this.publicKey), {
        iv: CryptoJS.enc.Hex.parse(this.iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }).ciphertext.toString() // 从base64再转为hex格式，传给后端
      console.log('Word:' + CryptoJS.enc.Hex.parse(this.publicKey))
      console.log('Hex:' + CryptoJS.enc.Hex.stringify(this.publicKey))
    },
    AESCBCDecrypt (text) {
      let decrypted = CryptoJS.AES.decrypt(CryptoJS.format.Hex.parse(text), CryptoJS.enc.Hex.parse(this.publicKey), {
        iv: CryptoJS.enc.Hex.parse(this.iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      })
      console.log('解密:' + CryptoJS.enc.Utf8.stringify(decrypted))
    },
    // DES加密
    DESECBencry (message) { // 传入加密的内容
      // 把私钥转换成16进制的字符串
      // 模式为ECB padding为Pkcs7
      this.frontendEncryption = CryptoJS.DES.encrypt(message, CryptoJS.enc.Hex.parse(this.publicKey), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }).ciphertext.toString()
      // 加密出来是一个16进制的字符串
    }

  }
}
</script>
