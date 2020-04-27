<template>
  <div>
  <Layout class="layout">
    <Header>
      <Menu mode="horizontal" theme="dark" active-name="1">
        <Icon size=40 type="ios-contacts-outline" class="layout-logo"/>
        <div class="layout-nav">
          <MenuItem name="1" to = "/seminar1">
            <Icon  type="ios-navigate"></Icon>
            研讨一
          </MenuItem>
          <MenuItem name="2" to = "/seminar3">
            <Icon type="ios-keypad"></Icon>
            研讨三
          </MenuItem>
          <MenuItem name="2" to = "/seminar4">
            <Icon type="ios-keypad"></Icon>
            研讨四
          </MenuItem>
          <MenuItem name="4">
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
          this.$Message.success('Success: Log out!')
          this.$router.push({path: '/login'})
          document.querySelector('body').removeAttribute('style')// 恢复背景
        } else {
          this.$Message.error('Fail! ' + r.errorMsg)
        }
      })
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
    background: #f5f7f9;
    border-radius: 100px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
  }
  .layout-nav{
    width: 500px;
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
