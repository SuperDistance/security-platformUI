<template>
  <div>
    <Button @click="test1">Test1!</Button>
    <Button @click="test2">Test2!</Button>
    <h2>{{text}}</h2>
  <Modal v-model="Open" width="500" draggable scrollable :closable="true">
    <p slot="header" style="color:#2f7bff;text-align:center">
      <span>用户信息</span>
    </p>
    <Form label-position="left" :label-width="100">
      <FormItem label="账号:">
        <Avatar :style="{background: ColorList[2]}">{{ userInfo.account}}</Avatar>
      </FormItem>
      <FormItem label="用户名:" >
        <Avatar :style="{background: ColorList[userInfo.username % ColorList.length]}">User</Avatar> <span>{{ userInfo.username }}</span>
      </FormItem>
      <FormItem label="本次登录时间">
        <DatePicker v-model = "userInfo.loginTime" type="date" disabled></DatePicker>
      </FormItem>
      <FormItem label="注册时间">
        <DatePicker v-model = "userInfo.registerTime" type="date" disabled></DatePicker>
      </FormItem>
      <FormItem label="权限">
        <Input v-model="userInfo.right" type="textarea" placeholder="Enter something..." style="width: 300px" />
      </FormItem>
    </Form>
    <div slot="footer"></div>
  </Modal>
  </div>
</template>

<script>
export default {
  name: 'userInfo',
  data () {
    return {
      userInfo: {
        account: '',
        username: '',
        loginTime: '',
        registerTime: '',
        right: ''
      },
      Open: false,
      text: '',
      ColorList: ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae']
    }
  },
  methods: {
    test1 () {
      this.$api.get('/test', null, r => {
        this.text = r.data
      })
    },
    test2 () {
      this.$api.get('/getUser', null, r => {
        this.text = r.data
      })
    }
  }
}
</script>

<style scoped>

</style>
