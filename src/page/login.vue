<template>
    <div class="login-box">
      <h1>login</h1>
      <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
        <FormItem prop="user" class="textbox">
              <i class="fa fa-user" aria-hidden="true"></i>
              <input type="text" v-model="formInline.user" placeholder="Username" />
            </FormItem>

            <FormItem prop="password" class="textbox">
              <i class="fa fa-lock" aria-hidden="true"></i>
              <input type="password" v-model="formInline.password" placeholder="Password" />
            </FormItem>
          <FormItem>
            <input class="btn" type="button" @click="handleSubmit('formInline')" value="Login" />
          </FormItem>
        <FormItem>
          <input class="btn" type="button" @click="handleVisitor" value="Visitor" />
        </FormItem>
      </Form>
    </div>
</template>

<script>
import '../style/scss/login.css'
export default {
  name: 'login',
  data () {
    return {
      formInline: {
        user: '',
        password: ''
      },
      ruleInline: {
        user: [
          {required: true, message: 'Please fill in the user name', trigger: 'blur'}
        ],
        password: [
          {required: true, message: 'Please fill in the password.', trigger: 'blur'},
          {type: 'string', min: 6, message: 'The password length cannot be less than 6 bits', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.login(undefined)
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    login (form) {
      if (form === undefined) {
        form = {username: this.formInline.user, password: this.formInline.password}
      }
      console.log('data to post: ' + form)
      this.$api.post('/login', form, r => {
        console.log('frontend: ')
        console.log(r)
        if (r.data.success === true) {
          document.querySelector('body').setAttribute('style', 'background:#fff')// 背景变白
          this.$store.commit('set_token', r.headers.authorization)
          // this.$store.commit('setUserInfo', r.data.username)
          if (this.$store.state.token !== '') {
            this.$router.push({path: '/base'})
            this.$Message.success('Success!')
          }
        } else {
          this.$Message.error('Fail! ' + r.errorMsg)
          this.$router.replace({path: '/login'})
        }
      })
    },
    handleVisitor () {
      this.login({username: 'user1', password: '123456'})
    }
  }
}
</script>
