<template>
  <div>
    <Row>
      <Col span="20">
    <Steps :current="currentStep" :status="currentStatus" style="{float: left}">
      <Step title="开始" content="填写发起方信息"></Step>
      <Step title="提交" content="获得证书发送消息"></Step>
      <Step title="结果" content="反馈校验结果"></Step>
    </Steps>
      </Col>
    </Row>
    <Divider/>

    <div v-if = "currentStep === 0">
      <Form ref="userInfo" :model="userInfo" label-position="left" :label-width="100">
        <FormItem label="用户" prop = "name">
          <Input v-model="userInfo.publisher" maxlength="20" show-word-limit></Input>
        </FormItem>
        <FormItem label="Start Time" prop = "date">
          <DatePicker :value="Certificate.startTime" v-model="Certificate.startTime" format="yyyy-MM-dd" placement="bottom-end" placeholder="Select start date" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="Current Time">
          <DatePicker :value="currentDate" format="yyyy-MM-dd" placement="bottom-end" style="width: 200px" disabled></DatePicker>
          <TimePicker :value="currentTime" format="HH:mm:ss" placeholder="Select time" style="width: 168px" disabled></TimePicker>
        </FormItem>
        <FormItem label="End Time" prop = "date">
          <DatePicker :value="Certificate.endTime" v-model="Certificate.endTime" format="yyyy-MM-dd" placement="bottom-end" placeholder="Select end date" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="用户公钥">
          <Input v-model="userInfo.publicKey"></Input>
        </FormItem>
        <FormItem label="加密方式">
          <h3>{{userInfo.encryptMethod}}</h3>
        </FormItem>
        <i-button type="success" @click = "handleVerify" long>Save & Next</i-button>
        <br><br>
        <i-button type="error" @click = "handleReset" long>RESET</i-button>
      </Form>
    </div>

    <div v-else-if="currentStep === 1">
      <Form ref="toEncryText" :model="toEncryText" label-position="left" :label-width="150">
        <FormItem label="证书数字签名">
          <Button v-if="!isFetched" type = "info" @click="getData">获得数字签名</Button>
          <Tag v-else-if="isFetched" color="magenta" >{{signatureOfCir}}</Tag>
        </FormItem>
        <FormItem label="数字证书">
          <Button @click="judgeExpired" type = "primary" :disabled="!isFetched">查看证书</Button>
        </FormItem>
        <FormItem label="CA公钥">
          <Input v-model="CAPublicKey"></Input>
        </FormItem>
        <FormItem label="加密方式">
          <h3>{{Certificate.encryptMethod}}</h3>
        </FormItem>
        <FormItem label="信息">
          <Row gutter=8>
            <Col span=16>
          <Input v-model="toEncryText" maxlength="10000" show-word-limit type="textarea" placeholder="Enter something..." style="width: 500px" />
            </Col>
            <Col span=4>
          <Button @click="getTextSignature" type = "info" :disabled = "!isFetched">{{buttonText}}</Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem v-if="textSignatureIsFetched" label="消息数字签名">
          <Tag color="magenta" >{{this.signatureOfText}}</Tag>
        </FormItem>
        <i-button type="success" @click = "handleSubmit" long :disabled = "!textSignatureIsFetched">Submit & Verify</i-button>
        <br><br>
        <i-button type="error" @click = "handleReset" long>RESET</i-button>
      </Form>
    </div>

    <div v-else-if="currentStep === 2">
      <h1>结果：{{this.result}}</h1>
      <br></br>
      <i-button :type="finalButton" @click = "handleReset">RESTART</i-button>
    </div>

    <Modal v-model="Open" width="500" draggable scrollable :closable="true">
      <p slot="header" style="color:#2f7bff;text-align:center">
        <span>数字证书</span>
      </p>
      <Form label-position="left" :label-width="100">
        <FormItem label="颁布者:">
          <Avatar :style="{background: ColorList[2]}">{{ Certificate.publisher}}</Avatar>
        </FormItem>
        <FormItem label="用户:" >
          <Avatar :style="{background: ColorList[userInfo.publisher % ColorList.length]}">User</Avatar> <span>{{ userInfo.publisher }}</span>
        </FormItem>
        <FormItem label="开始时间">
          <DatePicker v-model = "Certificate.startTime" type="date" disabled></DatePicker>
        </FormItem>
        <FormItem label="结束时间">
          <DatePicker v-model = "Certificate.endTime" type="date" disabled></DatePicker>
        </FormItem>
        <FormItem label="用户公钥">
          <Input v-model="userInfo.publicKey" type="textarea" placeholder="Enter something..." style="width: 300px" />
        </FormItem>
        <FormItem label="加密方式">
          <h4>{{userInfo.encryptMethod}}</h4>
        </FormItem>
      </Form>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'DigitalCertificate',
  data () {
    const validateDateRange = (rule, value, callback) => {
      if (value[0] === '') {
        callback(new Error('Please select Date'))
      } else {
        callback()
      }
    }
    return {
      Certificate: {
        publisher: 'CA',
        startTime: '',
        endTime: '',
        encryptMethod: 'RSA'
      },
      userInfo: {
        publisher: '',
        encryptMethod: 'RSA',
        publicKey: ''
      },
      CAPublicKey: '',
      currentStep: 0,
      currentStatus: 'process',
      toEncryText: '',
      signatureOfCir: '',
      signatureOfText: '',
      isFetched: false,
      textSignatureIsFetched: false,
      Open: false,
      result: '',
      buttonText: '点击获得',
      current: new Date(),
      finalButton: 'success',
      ColorList: ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'],
      ruleInline: {
        name: [
          { required: true, message: 'Please fill in the activity name', trigger: 'blur' }
        ],
        date: [
          { validator: validateDateRange, trigger: 'change' }
        ],
        memo: [
          {required: false}
        ]
      }
    }
  },
  created () {
    this.getKeys()
  },
  mounted () {
    let _this = this // 声明一个变量指向Vue实例this，保证作用域一致
    this.timer = setInterval(() => {
      _this.current = new Date() // 修改数据date
    }, 1000)
  },
  beforeDestroy () {
    if (this.timer) {
      clearInterval(this.timer) // 在Vue实例销毁前，清除我们的定时器
    }
  },
  computed: {
    currentDate: function () {
      const y = this.current.getFullYear()
      let m = this.current.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = this.current.getDate()
      d = d < 10 ? ('0' + d) : d
      return y + '-' + m + '-' + d
    },
    currentTime: function () {
      let h = this.current.getHours()
      h = h < 10 ? ('0' + h) : h
      let minute = this.current.getMinutes()
      minute = minute < 10 ? ('0' + minute) : minute
      let second = this.current.getSeconds()
      second = second < 10 ? ('0' + second) : second
      return h + ':' + minute + ':' + second
    }
  },
  methods: {
    handleVerify () {
      this.$refs['userInfo'].validate((valid) => {
        if (valid) {
          this.$Message.success('Success!')
          this.next()
        } else {
          this.$Message.error('Error!')
          console.log('error')
        }
      })
    },
    handleSubmit () {
      this.$api.get('/seminar1/exp44', {
        contents: this.toEncryText,
        issuer: this.userInfo.publisher,
        startTime: this.Certificate.startTime,
        endTime: this.Certificate.endTime,
        encryMethod: this.userInfo.encryptMethod,
        publicKey: this.userInfo.publicKey,
        cirtiSign: this.signatureOfCir,
        signature: this.signatureOfText}, r => {
        this.result = r
        this.next()
        if (this.result.indexOf('未') === -1) {
          this.currentStatus = 'error'
          this.finalButton = 'error'
          this.$Message.error('Error!')
        } else {
          this.currentStatus = 'finish'
          this.finalButton = 'success'
          this.$Message.success('Success!')
        }
      })
    },
    handleReset (name) {
      this.getKeys()
      this.currentStep = 0
      this.currentStatus = 'process'
      this.userInfo.publisher = ''
      this.Certificate.startTime = ''
      this.Certificate.endTime = ''
      this.toEncryText = ''
      this.signatureOfCir = ''
      this.signatureOfText = ''
      this.isFetched = false
      this.textSignatureIsFetched = false
      this.Open = false
      this.result = ''
      this.buttonText = '点击获得'
    },
    next () {
      this.currentStep += 1
    },
    getData () {
      this.$api.get('/seminar1/exp42', {issuer: this.userInfo.publisher,
        startTime: this.Certificate.startTime,
        endTime: this.Certificate.endTime,
        encryMethod: this.Certificate.encryptMethod,
        publicKey: this.userInfo.publicKey}, r => {
        this.signatureOfCir = r
        this.isFetched = !this.isFetched
      })
    },
    getKeys () {
      this.$api.get('/seminar1/exp41', null, r => {
        this.userInfo.publicKey = r[0]
        this.CAPublicKey = r[1]
      })
    },
    getTextSignature () {
      this.textSignatureIsFetched = true
      this.buttonText = '点击重新生成'
      this.$api.get('/seminar1/exp43', {contents: this.toEncryText}, r => {
        this.signatureOfText = r
      })
    },
    judgeExpired () {
      const this_ = this
      console.log(this.Certificate.startTime)
      console.log(this.Certificate.endTime)
      console.log(this.current)
      if (this.Certificate.startTime <= this_.current && this_.current <= this.Certificate.endTime) {
        this.Open = !this.Open
      } else {
        this_.currentStatus = 'error'
        this_.isFetched = false
        return new Promise((resolve) => {
          this.$Modal.error({
            title: '证书过期',
            content: '当前: ' + this_.currentDate + '  ' + this_.currentTime,
            onOk: () => {
              this.showCompleted = ((this.showCompleted === false))
              resolve()
            }
          })
        })
      }
    }
  }
}
</script>
