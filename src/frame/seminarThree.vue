<template>
  <Layout>
    <Sider hide-trigger :style="{background: '#fff'}">
      <Menu active-name="1-1" theme="light" width="auto" :open-names="['1']">
        <MenuItem name="1-1" to = '/select'>选择活动</MenuItem>
      </Menu>
    </Sider>
    <Layout :style="{padding: '0 24px 24px'}">
        <Breadcrumb :style="{margin: '24px 0'}">
          <BreadcrumbItem to="/select">
            <Icon type="ios-home-outline"></Icon> Home
          </BreadcrumbItem>
          <BreadcrumbItem onclick = "$router.history.go(-1)">
            <Icon type="logo-buffer"></Icon> Components
          </BreadcrumbItem >
        </Breadcrumb>
      <i-content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">

        <transition :name="transitionName">
          <router-view class="child-view"></router-view>
        </transition>

      </i-content>
    </Layout>
  </Layout>
</template>

<script>
export default {
  name: 'toSignUp',
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
