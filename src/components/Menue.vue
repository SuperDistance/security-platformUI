<template>
  <div>
  <Layout class="layout">
    <Header>
      <Menu mode="horizontal" theme="dark" :active-name="1" :open-names="['1']">
        <MenuItem name="0" to = "/manage">
          <Icon size=40 type="ios-contacts-outline" class="layout-logo">管理</Icon>
        </MenuItem>
        <div class="layout-nav">
          <MenuItem name="1" to = "/seminar1">
            <Icon  type="ios-navigate"></Icon>
            研讨一
          </MenuItem>
          <MenuItem name="2" to = "/seminar3">
            <Icon type="ios-keypad"></Icon>
            研讨三
          </MenuItem>
          <MenuItem name="3" to = "/seminar4">
            <Icon type="logo-buffer" />
            研讨四
          </MenuItem>
          <MenuItem name="4" to = "/manage">
            <Icon type="md-contacts" />
            管理
          </MenuItem>
          <MenuItem name="5">
            <Icon  size=30 type="md-log-out" class="layout-exit" @click = "handleLogout">Exit</Icon>
          </MenuItem>
        </div>
      </Menu>
    </Header>
  </Layout>
  </div>
</template>
<script>
export default {
  name: 'Menue',
  methods: {
    handleLogout () {
      this.$api.post('/logout', null, r => {
        r = r.data
        console.log(r)
        if (r.success === true) {
          this.$store.commit('del_token')
          this.$store.commit('delUserInfo')
          this.$Message.success('Success: Log out!')
          this.$router.replace('/login')
          document.querySelector('body').removeAttribute('style')// 恢复背景
        } else {
          this.$Message.error('Fail! ' + r.errorMsg)
        }
      })
    },
    handleManage () {
      this.$router.push({ path: '/manage' })
    }
  }
}
</script>
<style scoped>
  .layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }
  .layout-logo{
    width: 40px;
    height: 40px;
    border-radius: 100px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
  }
  .layout-nav{
    width: 600px;
    margin: 0 auto;
    margin-right: 20px;
  }
  .layout-exit{
    width: 40px;
    height: 40px;
    float: right;
    position: relative;
    top: 15px;
    left: 20px;
  }
</style>
