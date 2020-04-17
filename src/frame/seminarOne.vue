<template>
  <Layout>
    <Sider hide-trigger :style="{background: '#fff'}">
      <Menu active-name="1-1" theme="light" width="auto" :open-names="['1']">
        <MenuItem name="1-1" to = '/exp1'>消息摘要</MenuItem>
        <MenuItem name="1-2" to = '/exp2'>对称加密</MenuItem>
        <MenuItem name="1-3" to = '/exp3'>非对称加密</MenuItem>
        <MenuItem name="1-4" to = '/exp4'>数字证书</MenuItem>
      </Menu>
    </Sider>
    <Layout :style="{padding: '0 24px 24px'}">
      <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">

        <transition :name="transitionName">

          <router-view class="child-view"></router-view>

        </transition>

      </Content>
    </Layout>
  </Layout>
</template>

<script>
export default {
  name: 'seminarOne',
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
