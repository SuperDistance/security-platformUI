<template>
  <Layout>
    <Sider hide-trigger :style="{background: '#fff'}">
      <Menu active-name="1" theme="light" width="auto" :open-names="['1']">
      </Menu>
    </Sider>
    <Layout :style="{padding: '0 24px 24px'}">
      <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">

        <router-view></router-view>

      </Content>
    </Layout>
  </Layout>
</template>

<script>
export default {
  name: 'accounts'
}
</script>

<style scoped>

</style>
