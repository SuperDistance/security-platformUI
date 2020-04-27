<template>
  <div>
    <div style="height: 30px;">
      <Progress :percent="progress" :stroke-color="['#108ee9', '#87d068']" :stroke-width="20" status="active" hide-info/>
    </div>
    <h2>前端</h2>
    <Form ref="messageInfo" :model="messageInfo" label-position="left" :label-width="100">
      <FormItem label="输入命令:">
          <AutoComplete
            v-model="value4"
            icon="ios-search"
            placeholder="input here"
            style="width:300px">
            <div class="demo-auto-complete-item" v-for="item in data4" :key="item">
              <div class="demo-auto-complete-group">
                <span>{{ item.title }}</span>
                <a href="https://www.google.com/search?q=iView" target="_blank">更多</a>
              </div>
              <Option v-for="option in item.children" :value="option.title" :key="option.title">
                <span class="demo-auto-complete-title">{{ option.title }}</span>
                <span class="demo-auto-complete-count">{{ option.count }} 人关注</span>
              </Option>
            </div>
            <a href="https://www.google.com/search?q=iView" target="_blank" class="demo-auto-complete-more">查看所有结果</a>
          </AutoComplete>
      </FormItem>
      <FormItem>
        <i-button type="success" @click = "handleSubmit(messageInfo)">Submit</i-button>
        <i-button type="error" @click = "handleReset('messageInfo')">RESET</i-button>
      </FormItem>
    </Form>
    <Divider> </Divider>
    <h2>后端</h2>
    <Tag color="primary" v-if = "feedbackMessage === ''">Haven't Submit</Tag>
    <Tag color="success" v-else-if = "status === 1">Success</Tag>
    <Tag color="error" v-else>Error</Tag>
    <Form ref="feedbackMessage" :model="feedbackMessage" label-position="left" :label-width="100" inline>
      <FormItem label="执行结果">
        <Spin size="large" v-if="loading"></Spin>
        <Input v-else v-model="feedbackMessage" type="textarea" :autosize="{minRows: 2,maxRows: 8}" placeholder="Haven't submit..." style="width: 500px" />
      </FormItem>
      <FormItem label="花费时间" v-if = "feedbackMessage !== ''">
        <Tag color="error" >{{backendTime}}ms</Tag>
      </FormItem>
    </Form>
  </div>
</template>
<script>
export default {
  name: 'SQLInjection',
  data () {
    return {
      messageInfo: {
        sql: '',
        category: ''
      },
      value4: '',
      data4: [
        {
          title: '话题',
          children: [
            {
              title: 'iView',
              count: 10000
            },
            {
              title: 'iView UI',
              count: 10600
            }
          ]
        },
        {
          title: '问题',
          children: [
            {
              title: 'iView UI 有多好',
              count: 60100
            },
            {
              title: 'iView 是啥',
              count: 30010
            }
          ]
        },
        {
          title: '文章',
          children: [
            {
              title: 'iView 是一个设计语言',
              count: 100000
            }
          ]
        }
      ],
      status: '',
      feedbackMessage: '',
      backendTime: '',
      result: '',
      progress: 0,
      loading: false
    }
  },
  created () {
  },
  methods: {
    postData () {
      this.$api.get('/seminar3/exp1', { toExcute: this.messageInfo.sql }, r => {
        if (r.sucess === true) {
          this.feedbackMessage = r.feedbackMessage
          this.status = r.status
          this.backendTime = r.backendTime
          console.log(this.feedbackMessage)
          this.$Message.success('Success!')
        } else {
          this.$Message.error('Error!')
        }
      })
    },
    handleSubmit (name) { // 带''是字符串, 不带传入Object
      console.log(name)
      this.postData()
    },
    handleReset (name) {
      this.$refs[name].resetFields()
      this.messageInfo = []
      this.status = ''
      this.feedbackMessage = ''
    }
  }
}
</script>
<style>
  .demo-auto-complete-item{
    padding: 4px 0;
    border-bottom: 1px solid #F6F6F6;
  }
  .demo-auto-complete-group{
    font-size: 12px;
    padding: 4px 6px;
  }
  .demo-auto-complete-group span{
    color: #666;
    font-weight: bold;
  }
  .demo-auto-complete-group a{
    float: right;
  }
  .demo-auto-complete-count{
    float: right;
    color: #999;
  }
  .demo-auto-complete-more{
    display: block;
    margin: 0 auto;
    padding: 4px;
    text-align: center;
    font-size: 12px;
  }
</style>
