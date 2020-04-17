<template>
  <Layout>
    <Sider hide-trigger :style="{background: '#fff'}">
      <Menu active-name="1-0" theme="light" width="auto" :open-names="['1']">
        <MenuItem name="1-0" to = '/adminlist'>教师列表</MenuItem>
        <MenuItem name="1-1" to = '/adminadd'>添加教师</MenuItem>
        <MenuItem name="1-2" to = '/stulist'>学生列表</MenuItem>
        <MenuItem name="1-3" to = '/stuadd' >添加学生</MenuItem>
      </Menu>
    </Sider>
    <Layout :style="{padding: '0 24px 24px'}">
      <Breadcrumb :style="{margin: '24px 0'}">
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Components</BreadcrumbItem>
        <BreadcrumbItem>Layout</BreadcrumbItem>
      </Breadcrumb>
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
