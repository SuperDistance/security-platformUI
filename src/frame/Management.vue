<template>
  <Layout>
    <Sider hide-trigger :style="{background: '#fff'}">
      <Menu active-name="1" theme="light" width="auto">
        <MenuItem name="1" to = '/user'>用户管理</MenuItem>
        <MenuItem name="2" to = '/role'>角色管理</MenuItem>
        <MenuItem name="3" to = '/permission'>权限管理</MenuItem>
        <MenuItem name="4" to = '/path'>路径管理</MenuItem>
      </Menu>
    </Sider>
    <Layout :style="{padding: '0 24px 24px'}">
      <i-content :style="{padding: '24px', minHeight: '280px', background: '#fff', height: '800px'}">

        <transition :name="transitionName">
          <router-view class="child-view"></router-view>
        </transition>

      </i-content>
    </Layout>
  </Layout>
</template>

<script>
export default {
  name: 'Management',
  data () {
    return {
      transitionName: 'slide-left'
    }
  },
  methods: {
    beforeRouteUpdate (to, from, next) {
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
      next()
    }
  }
}
</script>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s ease;
  }
  .fade-enter, .fade-leave-active {
    opacity: 0;
  }
  .child-view {
    transition: all .5s cubic-bezier(.55,0,.1,1);
  }
  .slide-left-enter, .slide-right-leave-active {
    opacity: 0;
    -webkit-transform: translate(30px, 0);
    transform: translate(30px, 0);
  }
  .slide-left-leave-active, .slide-right-enter {
    opacity: 0;
    -webkit-transform: translate(-30px, 0);
    transform: translate(-30px, 0);
  }
</style>
