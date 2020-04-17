<style scoped>
  .layout-content{

  }
</style>

<template>
  <div class = "layout-content">
    <Progress :percent= "updatePercentage" :stroke-color="['#108ee9', '#87d068']" />
    <List item-layout="vertical">
      <ListItem v-if = "showCompleted"><h2>Haven't Rated</h2> </ListItem>
      <ListItem v-for="(item, index) in list" v-bind:key = "item.id">
        <Row span = 30>
        <Avatar :style="{background: ColorList[item.id % ColorList.length]}">{{ item.name }}</Avatar>
        {{item.cardInfo}}
        <router-link :to="'/content/' + item.id">
          {{ item.name }}
        </router-link>
            <Rate show-text allow-half v-model="item.score">
              <span style="color: #f5a623">{{ item.score }}</span>
            </Rate>
        <Button type = "primary" @click = "checkInStudent(index)" > confirm </Button>
        </Row>
      </ListItem>
    </List>
    <i-switch :value = "showCompleted" :before-change="handleBeforeChange"> </i-switch>
    <List v-if = "showCompleted" item-layout="vertical" >
      <ListItem><h2>Already Rated</h2></ListItem>
      <ListItem v-for="(item, index) in completed" v-bind:key = "item.id">
        <Row span = 50>
        <Avatar :style="{background: ColorList[item.id % ColorList.length]}">{{ item.name }}</Avatar>
        {{item.cardInfo}}
        <router-link :to="'/content/' + item.id">
          {{ item.name }}
        </router-link>
        <Rate disabled v-model="item.score" >
          <span style="color: #f5a623">{{ item.score }}</span>
        </Rate>
        <Button type = "error" @click = "reRateStudent(index)" > delete </Button>
          </Row>
      </ListItem>
    </List>
  </div>
</template>
<script>

export default {
  data () {
    return {
      list: [],
      completed: [],
      ColorList: ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'],
      showCompleted: false,
      actiId: this.$route.params.id
    }
  },
  created () {
    this.getData()
  },
  computed: {
    updatePercentage: function () {
      return Math.floor(this.completed.length / (this.list.length + this.completed.length) * 100)
    }
  },
  methods: {
    getData () {
      this.$api.get('studlist.json', {actiId: this.actiId, Unsigned: true}, r => {
        this.list = r.data
      })
      this.$api.get('studlist2.json', {actiId: this.actiId, Unsigned: false}, r => {
        this.completed = r.data
      })
    },
    // 原生javascript 点击事件绑定
    checkInStudent: function (id) {
      // post更改
      let temp = this.list[id]
      this.$api.post('/toSignUp/update', {isSigned: false, stuId: temp.id, actId: this.actiId, score: 1}, r => {
        this.success = r.success
      })
      if (this.success) { //
      }
      this.completed.splice(0, 0, temp)
      this.$Message.success(temp.name + '评分成功')
      this.list.splice(id, 1)
    },
    reRateStudent: function (id) {
      // post更改
      let temp = this.completed[id]
      temp.score = 0
      this.$api.post('/toSignUp/update', {isSigned: true, stuId: temp.id, actId: this.actiId, score: 1}, r => {
        this.success = r.success
      })
      if (this.success) { //
      }
      this.completed.splice(id, 1)
      this.list.splice(0, 0, temp)
      this.$Message.success(temp.name + '删除成功')
    },
    handleBeforeChange () {
      return new Promise((resolve) => {
        this.$Modal.confirm({
          title: '切换确认',
          content: '您确认要显示/隐藏已评分吗？',
          onOk: () => {
            this.showCompleted = ((this.showCompleted === false))
            resolve()
          }
        })
      })
    }
  }
}
</script>
<style scoped>
</style>
