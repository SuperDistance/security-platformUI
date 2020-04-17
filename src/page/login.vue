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
          document.querySelector('body').setAttribute('style', 'background:#fff')// 背景变白
          this.$Message.success('Success!')
          this.$router.push({path: '/base'})
        } else {
          this.$Message.error('Fail!')
        }
      })
    }
  }
}
</script>
