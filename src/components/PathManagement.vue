<template>
  <div>
  <h2> Path Info <Button @click="addPath = !addPath" type="primary" size="large"> + </Button></h2>
  <Table border :columns="pathColumns" :data="pathList">
    <template slot-scope="{ row }" slot="url">
      <strong>{{row.url}}</strong>
    </template>
    <template slot-scope="{ index }" slot="action">
      <Button type="primary" size="small" style="margin-right: 5px" @click="handlePathInfo(index)">View</Button>
      <Button type="primary" size="small" style="margin-right: 5px" @click="handleRevisePath(index)">Revise</Button>
      <Button type="error" size="small" @click="handleDeletePath(index)">Delete</Button>
    </template>
  </Table>
  <Page @on-change="setPageNo" @on-page-size-change="setPageSize" :total="pathNum" size="small" show-elevator show-sizer></Page>

  <Modal v-model="addPath" :loading = "refuseLoading" width="600" draggable scrollable>
    <p slot="header" style="color:#2f7bff;text-align:center">
      <Icon type="ios-add" />
      <span>Creat New Path</span>
    </p>
    <div style="text-align:center">
      <Form ref="addPath" :model="pathToAdd" label-position="left" :label-width="100" :rules = "ruleInline">
        <FormItem label="URL Pattern" prop = "url">
          <Input v-model="pathToAdd.url"></Input>
        </FormItem>
        <FormItem label="Description" prop = "account">
          <Input v-model="pathToAdd.description"></Input>
        </FormItem>
        <FormItem>
          <Button type="success" long @click = "handleAddPath">SUBMIT</Button>
        </FormItem>
      </Form>
    </div>
    <div slot="footer">
    </div>
  </Modal>

  <Modal v-model="revisePath" :loading = "refuseLoading" width="600" draggable scrollable>
    <p slot="header" style="color:#2f7bff;text-align:center">
      <Icon type="ios-add" />
      <span>Revise Path</span>
    </p>
    <div style="text-align:center">
      <Form ref="revisePath" :model="pathToRevise" label-position="left" :label-width="100" :rules = "ruleInline">
        <FormItem label="URL Pattern" prop = "url">
          <Input v-model="pathToRevise.url"></Input>
        </FormItem>
        <FormItem label="Description" prop = "description">
          <Input v-model="pathToRevise.description"></Input>
        </FormItem>
        <FormItem>
          <Button type="success" long @click = "handleRevise">SUBMIT</Button>
        </FormItem>
      </Form>
    </div>
    <div slot="footer">
    </div>
  </Modal>

  </div>
</template>

<script>
export default {
  name: 'PathManagement',
  data () {
    return {
      pathColumns: [
        {
          title: 'Id',
          key: 'id'
        },
        {
          title: 'URL Pattern',
          slot: 'url'
        },
        {
          title: 'Description',
          key: 'description'
        },
        {
          title: 'Action',
          slot: 'action',
          align: 'center',
          width: 300
        }
      ],
      pathList: [],
      pathNum: 0,
      pageNo: 1,
      pageSize: 10,
      addPath: false,
      refuseLoading: true,
      pathToAdd: {
        url: '',
        description: ''
      },
      currentPathInfo: [],
      revisePath: false,
      pathToRevise: '',
      ColorList: ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'],
      ruleInline: {
        url: [
          { required: true, message: 'Please enter url pattern to interceptor', trigger: 'blur' }
        ],
        description: [
          { required: true, message: 'Please enter description', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.initiate()
  },
  methods: {
    initiate () {
      this.getPathNum() // step1-2
    },
    getPathList () {
      this.$api.get('/path', { pageNo: this.pageNo, pageSize: this.pageSize }, r => {
        r = r.data
        if (r.success === true) {
          this.pathList = r.data.records
          this.$Message.success('Success!')
        } else {
          this.$Message.error('Fail! ' + r.errorMsg)
        }
      })
    },
    getPathNum () {
      this.$api.get('/path/number', null, r => {
        r = r.data
        if (r.success === true) {
          this.pathNum = parseInt(r.data)
          this.getPathList() // step2
        } else {
          this.$Message.error('Fail! ' + r.errorMsg)
        }
      })
    },
    setPageNo (index) {
      this.pageNo = index
      this.initiate()
    },
    setPageSize (index) {
      this.pageSize = index
      this.initiate()
    },
    handleAddPath () {
      const _this = this
      const path = this.pathToAdd
      console.log('To post ' + this.pathToAdd)
      this.$refs.addPath.validate((valid) => {
        if (valid) {
          // this.postData(actInfo)
          this.$api.post('/path', this.$qs.stringify({
            url: path.url,
            description: path.description
          }), r => {
            if (r.data.success === true) {
              this.addPath = false
              this.$Message.success('Add Path Success')
              this.initiate()
            } else {
              this.addPath = false
              this.$Message.error('Fail! ' + r.errorMsg)
            }
          })
          this.$refs.addPath.resetFields()
        } else {
          setTimeout(() => {
            _this.refuseLoading = false
            _this.$nextTick(() => {
              _this.refuseLoading = true
            })
          }, 1000)
          this.$Message.error('Error!')
          console.log('error')
          // this.handleReset('newActInfo')
        }
      })
    },
    handlePathInfo (index) {
      this.currentPathInfo = this.pathList[index]
      this.openInfo = !this.openInfo
    },
    handleRevisePath (index) {
      this.pathToRevise = this.pathList[index]
      this.revisePath = !this.revisePath
    },
    handleRevise () {
      const _this = this
      const path = this.pathToRevise
      console.log('To post status' + JSON.stringify(path.status))
      this.$refs.revisePath.validate((valid) => {
        if (valid) {
          // this.postData(actInfo)
          this.$api.put('/path', this.$qs.stringify({
            id: path.id,
            url: path.url,
            description: path.description
          }), r => {
            if (r.data.success === true) {
              this.revisePath = false
              this.$Message.success('Update Path Success')
              this.initiate()
            } else {
              this.revisePath = false
              this.$Message.error('Fail! ' + r.errorMsg)
            }
          })
          this.$refs.revisePath.resetFields()
        } else {
          setTimeout(() => {
            _this.refuseLoading = false
            _this.$nextTick(() => {
              _this.refuseLoading = true
            })
          }, 1000)
          this.$Message.error('Error!')
          console.log('error')
          // this.handleReset('newActInfo')
        }
      })
    },
    handleDeletePath (index) {
      this.$api.delete('/path', { id: this.pathList[index].id }, r => {
        r = r.data
        if (r.success === true) {
          this.$Message.success('Success!')
          this.initiate()
        } else {
          this.$Message.error('Fail! ' + r.errorMsg)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
