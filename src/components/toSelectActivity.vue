<template>
  <div>
      <Card class = "activityCard" style="width:350px" v-for = "(item, index) in randomActivityList" v-bind:key = 'index'
            :to = "{name: 'activityIndex', params: {actiId: item.actId}}">
        <p slot="title">
          <Icon type="ios-film-outline"></Icon>
          {{ item.name }}
        </p>
        <a href="#" slot="extra" @click.prevent="selectThisActivity(index)">
          <Icon type="ios-loop-strong"></Icon>
          选择
        </a>
        <ul>
          <h3>
            时间： {{ item.holdTime }}
          </h3>
          <h3>
            人数： {{ item.studentsNum }} 出勤率： {{ item.attendance }}
          </h3>
        </ul>
      </Card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 后续通过getAPI获得
      activityList: [
        {name: '主题团日', holdTime: '2020-3-1', studentsNum: 90, attendance: 0.8, actId: 465},
        {name: '大国方略', holdTime: '2019-9-2', studentsNum: 90, attendance: 0.91, actId: 4684},
        {name: '系列讲座', holdTime: '2019-11-31', studentsNum: 90, attendance: 0.76, actId: 546},
        {name: '主题教育', holdTime: '2020-10-1', studentsNum: 90, attendance: 0.90, actId: 54698},
        {name: '首日教育', holdTime: '2019-10-31', studentsNum: 90, attendance: 0.69, actId: 46486}
      ],
      randomActivityList: []
    }
  },
  methods: {
    changeLimit () {
      function getArrayItems (arr, num) {
        const tempArray = []
        for (let index in arr) {
          tempArray.push(arr[index])
        }
        const returnArray = []
        for (let i = 0; i < num; i++) {
          if (tempArray.length > 0) {
            const arrIndex = Math.floor(Math.random() * tempArray.length)
            returnArray[i] = tempArray[arrIndex]
            tempArray.splice(arrIndex, 1)
          } else {
            break
          }
        }
        return returnArray
      }
      this.randomActivityList = getArrayItems(this.activityList, 5)
    },
    selectThisActivity (activityId) {
      // 动态路由
      this.$router.push({name: 'activityIndex', params: {actiId: activityId}}) // 动态路由参数不能使用path传递  需要在路由定义中指定name
    }
  },
  mounted () {
    this.changeLimit()
  }
}
</script>
<style scoped>
.activityCard {
  display: inline-block;
  margin: 10px 10px;
  color: black;
}
</style>
