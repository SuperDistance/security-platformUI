<template>
<div>
  <h2> Permission Info <Button @click="addPermission = !addPermission" type="primary" size="large"><h2> + </h2></Button></h2>
  <Table row-key="id" :columns="permissionColumns" :data="permissionList" border>
    <template slot-scope="{ row, index }" slot="action">
      <Button v-if="!isNaN(row.id)" type="success" size="small" style="margin-right: 5px" @click="handleAddPathToPermission(index)"><h3>   +   </h3></Button>
      <Button v-if="!isNaN(row.id)" type="primary" size="small" style="margin-right: 5px" @click="handleRevisePermission(index)">Revise</Button>
      <Button v-if="isNaN(row.id)" type="error" size="small" @click="handleDeleteRecord(row.recordId)">Delete</Button>
      <Button v-else type="error" size="small" @click="async(index)">Delete</Button>
    </template>
  </Table>

  <Modal v-model="addPermission" :loading = "refuseLoading" width="500" draggable scrollable>
    <p slot="header" style="color:#2f7bff;text-align:center">
      <Icon type="ios-add" />
      <span>Creat New Permission</span>
    </p>
    <div style="text-align:center">
      <Form ref="addPermission" :model="permissionToAdd" label-position="left" :label-width="200" :rules = "ruleInline">
        <FormItem label="Permission Name" prop = "name">
          <Input v-model="permissionToAdd.permissionName"></Input>
        </FormItem>
        <FormItem label="Permission Code" prop = "code">
          <Input v-model="permissionToAdd.permissionCode"></Input>
        </FormItem>
        <FormItem>
          <Button type="success" long @click = "handleAddPermission">SUBMIT</Button>
        </FormItem>
      </Form>
    </div>
    <div slot="footer">
    </div>
  </Modal>

  <Modal v-model="addRecord" :loading = "refuseLoading" width="600" draggable scrollable>
    <p slot="header" style="color:#2f7bff;text-align:center">
      <Icon type="ios-add" />
      <span>Add Path To Permission</span>
    </p>
    <div style="text-align:center">
      <Form ref="addPermission" :model="recordToAdd" label-position="left" :label-width="100" :rules = "ruleInline">
        <FormItem label="Permission Name" prop = "name">
          <Tag v-if="recordToAdd.id % 5 === 0" color = "volcano">
            {{ recordToAdd.permissionName }}
          </Tag>
          <Tag v-else-if="recordToAdd.id % 5 === 1" color="purple">
            {{ recordToAdd.permissionName }}
          </Tag>
          <Tag v-else-if="recordToAdd.id % 5 === 2" color="orange">
            {{ recordToAdd.permissionName }}
          </Tag>
          <Tag v-else-if="recordToAdd.id % 5 === 3" color="blue">
            {{ recordToAdd.permissionName }}
          </Tag>
          <Tag v-else color="green">
            {{ recordToAdd.permissionName }}
          </Tag>
        </FormItem>
        <FormItem label="Permission Code" prop = "code">
          <h4> {{recordToAdd.permissionCode}} </h4>
        </FormItem>
        <FormItem label="Paths: ">
          <CheckboxGroup v-model = "recordToAdd.paths">
            <Checkbox border v-for = "(item, index) in pathList" :key = index :label = item.url alt=item.description>{{item.url}}</Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem>
          <Button type="success" long @click = "postRecord">SUBMIT</Button>
        </FormItem>
      </Form>
    </div>
    <div slot="footer">
    </div>
  </Modal>

  <Modal v-model="revisePermission" :loading = "refuseLoading" width="600" draggable scrollable>
    <p slot="header" style="color:#2f7bff;text-align:center">
      <Icon type="ios-add" />
      <span>Revise Role</span>
    </p>
    <div style="text-align:center">
      <Form ref="reviseRole" :model="roleToRevise" label-position="left" :label-width="100" :rules = "ruleInline">
        <FormItem label="Permission Name" prop = "name">
          <Input v-model="permissionToAdd.permissionName"></Input>
        </FormItem>
        <FormItem label="Permission Code" prop = "code">
          <Input v-model="permissionToAdd.permissionCode"></Input>
        </FormItem>
        <FormItem>
          <Button type="success" long @click = "handlePermissionRevise">SUBMIT</Button>
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
  name: 'PermissionManagement',
  data () {
    return {
      permissionColumns: [
        {
          title: 'Id',
          key: 'id',
          tree: true
        },
        {
          title: 'Name',
          key: 'permissionName',
          width: 150
        },
        {
          title: 'Code',
          key: 'permissionCode'
        },
        {
          title: 'Description',
          key: 'permissionDescription'
        },
        {
          title: 'Action',
          slot: 'action',
          align: 'center',
          width: 250
        }
      ],
      permissionList: [],
      refuseLoading: true,
      pathList: '',
      permissionToAdd: {
        id: '',
        permissionName: '',
        permissionCode: '',
        roleDescription: ''
      },
      addPermission: false,
      pathToAdd: '',
      addPathToPermission: false,
      revisePermission: false,
      pathRecord: '',
      recordToAdd: '',
      addRecord: false,
      PermissionToRevise: '',
      ruleInline: {
        name: [
          {required: true, message: 'Please enter name', trigger: 'change'}
        ],
        code: [
          {required: true, message: 'Please enter code', trigger: 'change'}
        ],
        description: [
          {required: true, message: 'Please enter description', trigger: 'change'}
        ]
      }
    }
  },
  created () {
    this.initiate()
  },
  methods: {
    initiate () {
      this.getPermission()
    },
    getPermission () {
      this.$api.get('/permission', null, r => {
        this.permissionList = r.data.data
        this.getPath()
        console.log('permission list ' + JSON.stringify(this.permissionList))
      })
    },
    getPath () {
      this.$api.get('/path', null, r => {
        this.pathList = r.data.data
        this.getPermissionPathRelation()
        console.log('permission list ' + JSON.stringify(this.pathList))
      })
    },
    getPermissionPathRelation () {
      console.log('role list ' + JSON.stringify(this.roleList))
      for (let index = 0; index < this.permissionList.length; index++) {
        this.$set(this.permissionList[index], 'children', [])
        console.log('role list ' + JSON.stringify(this.permissionList))
      }
      // let size = (this.pageSize < this.roleNum) ? this.pageSize : this.roleNum
      this.$api.get('/pathPermission', null, r => {
        r = r.data
        console.log('results ' + JSON.stringify(r))
        if (r.success === true) {
          this.pathRecord = r.data
          r.data.forEach(item => {
            console.log('Record:' + JSON.stringify(item))
            this.insertPathIntoPermissionList(item.permissionId, item.urlId, item.id)
          })
          this.$Message.success('Update Role-Permission Relation Success')
        } else {
          this.$Message.error('Fail Update Role-Permission Relation')
        }
      })
    },
    insertPathIntoPermissionList (permissionId, urlId, recordId) {
      // console.log(this.roleList + '  ')
      console.log(JSON.stringify(this.permissionList))
      let PermissionIndex
      for (let index = 0; index < this.permissionList.length; index++) {
        if (this.permissionList[index].id === permissionId) {
          PermissionIndex = index
          break
        }
      }
      console.log('PermissionIndex: ' + PermissionIndex)
      for (let item of this.pathList) {
        if (item.id === urlId) {
          console.log(JSON.stringify(item))
          this.permissionList[PermissionIndex].children.push({id: 'Path Id: ' + item.id,
            permissionName: 'URL: ',
            permissionCode: item.url,
            permissionDescription: item.description + '\n Record Id: ' + recordId,
            recordId: recordId})
        }
        console.log(JSON.stringify(this.permissionList))
      }
    },
    handleAddPathToPermission (index) {
      this.recordToAdd = this.permissionList[index]
      this.$set(this.recordToAdd, 'paths', [])
      for (let item of this.recordToAdd.children) {
        this.recordToAdd.paths.push(item.permissionCode)
      }
      this.addRecord = !this.addRecord
    },
    handleAddPermissionToRole (index) {
      this.recordToAdd = this.roleList[index]
      this.$set(this.recordToAdd, 'paths', [])
      for (let item of this.recordToAdd.children) {
        this.recordToAdd.paths.push(item.permissionCode)
      }
      this.addPermissionToRole = !this.addPermissionToRole
    },
    postRecord () {
      console.log('record to add ' + JSON.stringify(this.recordToAdd))
      let pathIds = []
      for (let record of this.recordToAdd.paths) {
        for (let path of this.pathList) {
          if (record === path.url) {
            pathIds.push(path.id)
            break
          }
        }
      }
      this.$api.post('/pathPermissionByPathIds', this.$qs.stringify({permissionId: this.recordToAdd.id, pathIds: JSON.stringify(pathIds)}), r => {
        if (r.data.success) {
          this.$Message.success('Update Permission-Path Relations Success!')
          this.initiate()
        } else {
          this.$Message.error('Fail! ' + r.data.errorMsg)
        }
      })
      this.addRecord = !this.addRecord
    },
    handleAddPermission () {
      this.$api.post('/permission', this.$qs.stringify({
        permissionName: this.permissionToAdd.permissionName,
        permissionCode: this.permissionToAdd.permissionCode}), r => {
        if (r.data.success === true) {
          this.$Message.success('Success!')
          this.initiate()
        } else {
          this.$Message.error('Fail! ' + r.data.errorMsg)
        }
      })
    },
    handleRevisePermission (index) {
      this.permissionToRevise = this.permissionList[index]
      this.revisePermission = !this.revisePermission
    },
    handlePermissionRevise () {
      let data = this.permissionToRevise
      this.$api.put('/role', this.$qs.stringify({id: data.id, permissionName: data.roleName, permissionCode: data.permissionCode}), r => {
        r = r.data
        if (r.success === true) {
          this.$Message.success('Revise permission Success !')
          this.initiate()
        } else {
          this.$Message.error('Fail! ' + r.errorMsg)
        }
        this.revisePermission = !this.revisePermission
      })
    },
    handleDeleteRecord (recordId) {
      console.log('To post record Id: ' + this.$qs.stringify({id: recordId}))
      this.$api.delete('/pathPermission', {id: recordId}, r => {
        if (r.data.success === true) {
          this.$Message.success('Delete Path Success!')
          this.initiate()
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
