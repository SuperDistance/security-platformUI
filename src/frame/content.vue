<style scoped>
  .layout-content{

  }
</style>

<template>
      <div class = "layout-content">
        <Affix :offset-top="50">
        <Row :gutter = "16">
          <Col span="8">
          <Progress :percent= "updatePercentage" :stroke-color="['#108ee9', '#87d068']" />
          </Col>
          <Col span="8">
            <Button @click="readerMode=true">Reader Mode</Button>
          </Col>
          <Col span="8">
          <i-switch :value = "showCompleted" :before-change="handleBeforeChange"></i-switch>
          </Col>
        </Row>
        </Affix>
        <List item-layout="vertical">
          <ListItem v-if = "showCompleted"><h2>Haven't Check In</h2> </ListItem>
          <ListItem v-for="(item, index) in list" v-bind:key = "item.id">
            <Avatar :style="{background: ColorList[item.id % ColorList.length]}">{{ item.name }}</Avatar>
            {{item.cardInfo}}
            <router-link :to="'/content/' + item.id">
              {{ item.name }}
            </router-link>
            <Button type = "primary" :disabled = "buttonDisable" @click = "checkInStudent(index)" > click to sign in </Button>
          </ListItem>
        </List>

        <List v-if = "showCompleted" item-layout="vertical" >
          <ListItem><h2>Already Checked In</h2></ListItem>
          <ListItem v-for="(item, index) in completed" v-bind:key = "item.id">
            <Avatar :style="{background: ColorList[item.id % ColorList.length]}">{{ item.name }}</Avatar>
            {{item.cardInfo}}
            <router-link :to="'/content/' + item.id">
              {{ item.name }}
            </router-link>
            <Button type = "error" :disabled = "buttonDisable" @click = "checkOutStudent(index)" > click to delete </Button>
          </ListItem>
        </List>

        <Modal v-model="readerMode" width="500" draggable scrollable :closable="false">
          <p slot="header" style="color:#2f7bff;text-align:center">
            <span>Reader Mode</span>
          </p>
          <div style="text-align:center">
            <Row>
              <Col span="6">
            <img src="../../static/reader.png" width="400px">
              </Col>
            </Row>
            <Row>
              <Col span="16">
              <Input v-model="cardInfo" type="password" password placeholder="Please put on..." style="width: 200px" />
              </Col>
              <Col span="6">
                <Button><Icon @click="showClicked" size=24 type="md-lock" /></Button>
              </Col>
            </Row>
          </div>
          <div slot="footer">
          </div>
        </Modal>
        <Modal v-model="showPwd" fullscreen title="Fullscreen Modal">
          <pwd v-model="showPwd" @handPwd="handPwd"></pwd>
        </Modal>

      </div>
</template>
<script>
import pwd from '@/components/LockFacility'
export default {
  components: {
    pwd
  },
  data () {
    return {
      list: [],
      completed: [],
      ColorList: ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'],
      showCompleted: false,
      actiId: this.$route.params.id,
      percentage: 0,
      readerMode: false,
      cardInfo: [],
      buttonDisable: false,
      showPwd: false
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
  watch: {
    cardInfo: {
      handler (newName, oldName) {
        let index = this.list.map(function (e) { return e.cardInfo }).indexOf(newName)
        let already = this.completed.map(function (e) { return e.cardInfo }).indexOf(newName)
        if (index !== -1) {
          this.checkInStudent(index)
          this.cardInfo = []
        } else if (already !== -1) {
          this.cardInfo = []
        }
      },
      immediate: true
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
      this.$Message.success(temp.name + '注册成功')
      this.list.splice(id, 1)
    },
    checkOutStudent: function (id) {
      // post更改
      let temp = this.completed[id]
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
          content: '您确认要显示/隐藏已签到吗？',
          onOk: () => {
            this.showCompleted = ((this.showCompleted === false))
            resolve()
          }
        })
      })
    },
    showClicked () {
      this.showPwd = true
      this.buttonDisable = true
    },
    handPwd (val) {
      if (val) {
        this.buttonDisable = false
        this.readerMode = false
      }
    }
  }
}
</script>
<style scoped>
</style>
