<template>
  <div>
    <h1><Icon type="ios-chatbubbles" />留言板</h1>
    <List>
      <ListItem v-for="(item, index) in messageArray" :key="index">
        <Col span=6>
        <Icon size="40" type="md-person" :color="ColorList[(item.speaker.charCodeAt(item.speaker.length - 1) +
        item.speaker.charCodeAt(item.speaker.length - 2)) % ColorList.length]"></Icon>
        <p v-text="item.speaker"></p>
        </Col>
        <Col span=12>
        <p v-html="item.content"></p>
        </Col>
        <Col span=6>
        <Button type="error" @click="handleDelete(index)">delete</Button>
        </Col>
      </ListItem>
    </List>
    <Row>
      <Col span=4>
      </Col>
      <Col span=18>
    <Input type="textarea" v-model="messageToAdd.content"> </Input>
      </Col>
      <Col span=4>
        <Button type="primary" @click="handleSubmit"> <Icon type="ios-send-outline" />Send!</Button>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  name: 'XSSInjection',
  data () {
    return {
      test: '<a onclick=\'alert("xss攻击")\'>链接</a>',
      test2: '<script>alert("xss")',
      messageToAdd: {
        content: ''
      },
      messageArray: [],
      ColorList: ['#17233d', '#c5c8ce', '#ff9900', '#ed4014', '#5cadff', '#2db7f5', '#e8eaec']
    }
  },
  created () {
    this.initiate()
  },
  methods: {
    initiate () {
      this.$api.get('/seminar3/exp2', null, r => {
        r = r.data
        this.messageArray.splice(0, this.messageArray.length)
        if (r.success === true) {
          this.$Message.success('Success!')
          for (const item of r.data) {
            console.log('data ' + JSON.stringify(item))
            this.messageArray.splice(this.messageArray.length, 0, item)
          }
        } else {
          this.$Message.error('Fail! ' + r.data.errorMsg)
        }
      })
    },
    handleSubmit () {
      this.$api.post('/seminar3/exp2', this.$qs.stringify({
        speaker: localStorage.getItem('username'),
        content: this.messageToAdd.content
      }), r => {
        if (r.data.success === true) {
          this.$Message.success('Success!')
          this.messageToAdd.content = ''
          this.initiate()
        } else {
          this.$Message.error('Fail! ' + r.data.errorMsg)
        }
      })
    },
    handleDelete (index) {
      this.$api.delete('/seminar3/exp2', {
        id: this.messageArray[index].id
      }, r => {
        if (r.data.success === true) {
          this.$Message.success('Success Delete!')
          this.messageArray.splice(index, 1)
        } else {
          this.$Message.error('Fail! ' + r.data.errorMsg)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
