<template>
  <div>
      <div style="height: 30px;">
        <Progress :percent="progress" :stroke-color="['#108ee9', '#87d068']" :stroke-width="20" status="active" hide-info/>
      </div>
    <h2>前端</h2>
    <Form ref="messageInfo" :model="messageInfo" label-position="left" :label-width="100">
      <FormItem label="待加密信息">
        <Input v-model="messageInfo.message" maxlength="1000" show-word-limit type="textarea" placeholder="Enter something..." style="width: 500px" />
      </FormItem>
      <FormItem label = "加密算法">
        <RadioGroup v-model = "messageInfo.category">
          <Radio label = "MD5">MD5</Radio>
          <Radio label = "SHA-1">SHA-128</Radio>
          <Radio label = "SHA-256">SHA-256</Radio>
          <Radio label = "SHA-512">SHA-512</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="消息摘要">
        <Input v-model="localDigest" maxlength="1000" show-word-limit type="textarea" placeholder="Haven't generate..." style="width: 500px" />
      </FormItem>
      <FormItem>
      <i-button type="success" @click = "handleSubmit(messageInfo)">Submit</i-button>
      <i-button type="error" @click = "handleReset('messageInfo')">RESET</i-button>
      </FormItem>
    </Form>
    <Divider> </Divider>
    <h2>后端</h2>
    <Tag color="primary" v-if = "digest === ''">Haven't Submit</Tag>
    <Tag color="success" v-else-if = "localDigest === digest">Correct</Tag>
    <Tag color="error" v-else>Error</Tag>

    <Form ref="digest" :model="digest" label-position="left" :label-width="100" inline>
      <FormItem label="解密后信息">
        <Input v-model="digest" type="textarea" :autosize="{minRows: 2,maxRows: 8}" placeholder="Haven't submit..." style="width: 500px" />
      </FormItem>
      </Form>
  </div>
</template>
<script>
var CryptoJS = require('crypto-js')

export default {
  name: 'MessageDigest',
  data () {
    return {
      messageInfo: {
        message: '',
        category: ''
      },
      localDigest: '',
      digest: '',
      result: '',
      progress: 0
    }
  },
  created () {
  },
  watch: {
    messageInfo: {
      handler (newName, oldName) {
        const this_ = this
        if (oldName.message !== '' && oldName.category !== '' && oldName.message !== undefined && oldName.category !== undefined) {
          const step1 = new Promise(function (resolve, reject) {
            this_.progress = 0
            console.log(1)
            resolve(step2)
          })
          const step2 = new Promise(function (resolve, reject) {
            if (newName.category === 'MD5') { // md5加密
              this_.localDigest = CryptoJS.MD5(newName.message).toString()
            } else if (newName.category === 'SHA-1') {
              this_.localDigest = CryptoJS.SHA1(newName.message).toString()
            } else if (newName.category === 'SHA-256') {
              this_.localDigest = CryptoJS.SHA256(newName.message).toString()
            } else if (newName.category === 'SHA-512') {
              this_.localDigest = CryptoJS.SHA512(newName.message).toString()
            }
            console.log(2)
            resolve(this_.progress = 99.999)
          })
          console.log('category' + newName.category)
          step1()
        } else {
          this_.progress = 0
        }
        console.log(this.messageInfo)
      },
      deep: true
    }
  },
  methods: {
    postData () {
      this.$api.get('/seminar1/exp1', { toEncry: this.messageInfo.message, method: this.messageInfo.category }, r => {
        this.digest = r
        console.log(this.digest)
        this.$Message.success('Success!')
      })
    },
    handleSubmit (name) { // 带''是字符串, 不带传入Object
      console.log(name)
      this.postData()
    },
    handleReset (name) {
      this.$refs[name].resetFields()
      this.messageInfo = []
      this.localDigest = ''
      this.digest = ''
    }
  }
}
</script>
