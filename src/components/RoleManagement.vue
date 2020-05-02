<template>
  <div>
    <h2> User Info <Button @click="addRole = !addRole" type="primary" size="large"><h2> + </h2></Button></h2>
    <Table row-key="id" :columns="roleColumns" :data="roleList" border>
      <template slot-scope="{ row, index }" slot="action">
        <Button v-if="!isNaN(row.id)" type="success" size="small" style="margin-right: 5px" @click="handleAddPermissionToRole(index)"><h3>   +   </h3></Button>
        <Button v-if="!isNaN(row.id)" type="primary" size="small" style="margin-right: 5px" @click="handleReviseRole(index)">Revise</Button>
        <Button v-if="isNaN(row.id)" type="error" size="small" @click="handleDeleteRecord(row.recordId)">Delete</Button>
        <Button v-else type="error" size="small" @click="async(index)">Delete</Button>
      </template>
    </Table>

    <Modal v-model="addRole" :loading = "refuseLoading" width="400" draggable scrollable>
      <p slot="header" style="color:#2f7bff;text-align:center">
        <Icon type="ios-add" />
        <span>Creat New Role</span>
      </p>
      <div style="text-align:center">
        <Form ref="addRole" :model="roleToAdd" label-position="left" :label-width="100" :rules = "ruleInline">
          <FormItem label="Role Name" prop = "name">
            <Input v-model="roleToAdd.roleName"></Input>
          </FormItem>
          <FormItem label="Role Code" prop = "code">
            <Input v-model="roleToAdd.roleCode"></Input>
          </FormItem>
          <FormItem label="description" prop = "description">
            <Input type="textarea" v-model="roleToAdd.roleDescription"></Input>
          </FormItem>
          <FormItem>
            <Button type="success" long @click = "handleAddRole">SUBMIT</Button>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
      </div>
    </Modal>

    <Modal v-model="addPermissionToRole" :loading = "refuseLoading" width="600" draggable scrollable>
      <p slot="header" style="color:#2f7bff;text-align:center">
        <Icon type="ios-add" />
        <span>Add Permission To Role</span>
      </p>
      <div style="text-align:center">
        <Form ref="addPermission" :model="roleToAdd" label-position="left" :label-width="100" :rules = "ruleInline">
          <FormItem label="Role Name" prop = "name">
            <Tag v-if="recordToAdd.id % 5 === 0" color = "volcano">
              {{ recordToAdd.roleName }}
            </Tag>
            <Tag v-else-if="recordToAdd.id % 5 === 1" color="purple">
              {{ recordToAdd.roleName }}
            </Tag>
            <Tag v-else-if="recordToAdd.id % 5 === 2" color="orange">
              {{ recordToAdd.roleName }}
            </Tag>
            <Tag v-else-if="recordToAdd.id % 5 === 3" color="blue">
              {{ recordToAdd.roleName }}
            </Tag>
            <Tag v-else color="green">
              {{ recordToAdd.roleName }}
            </Tag>
          </FormItem>
          <FormItem label="Role Code" prop = "code">
            <h4> {{recordToAdd.roleCode}} </h4>
          </FormItem>
          <FormItem label="description" prop = "description">
            <h4> {{recordToAdd.roleDescription}} </h4>
          </FormItem>
          <FormItem label="Permissions">
            <CheckboxGroup v-model = "recordToAdd.permissions">
              <Checkbox border v-for = "(item, index) in permissionList" :key = index :label = item.permissionCode alt=item.permissionName>{{item.permissionCode}}</Checkbox>
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

    <Modal v-model="reviseRole" :loading = "refuseLoading" width="600" draggable scrollable>
      <p slot="header" style="color:#2f7bff;text-align:center">
        <Icon type="ios-add" />
        <span>Revise Role</span>
      </p>
      <div style="text-align:center">
        <Form ref="reviseRole" :model="roleToRevise" label-position="left" :label-width="100" :rules = "ruleInline">
          <FormItem label="Role Name" prop = "name">
            <Input v-model="roleToRevise.roleName"></Input>
          </FormItem>
          <FormItem label="Role Code" prop = "code">
            <Input v-model="roleToRevise.roleCode"></Input>
          </FormItem>
          <FormItem label="description" prop = "description">
            <Input type="textarea" v-model="roleToRevise.roleDescription"></Input>
          </FormItem>
          <FormItem>
            <Button type="success" long @click = "handleRoleRevise">SUBMIT</Button>
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
  name: 'RoleManagement',
  data () {
    return {
      roleColumns: [
        {
          title: 'Id',
          key: 'id',
          tree: true
        },
        {
          title: 'Name',
          key: 'roleName',
          width: 150
        },
        {
          title: 'Code',
          key: 'roleCode'
        },
        {
          title: 'Description',
          key: 'roleDescription',
          width: 220
        },
        {
          title: 'Action',
          slot: 'action',
          align: 'center',
          width: 250
        }
      ],
      roleList: [],
      refuseLoading: true,
      permissionList: '',
      permissionRecord: '',
      roleToAdd: {
        id: '',
        roleName: '',
        roleCode: '',
        roleDescription: ''
      },
      addRole: false,
      recordToAdd: '',
      addPermissionToRole: false,
      reviseRole: false,
      roleToRevise: '',
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
      this.getRoles()
      this.getPermission()
    },
    getRoles () {
      this.$api.get('/role', null, r => {
        console.log('response ' + r)
        this.roleList = r.data.data
        console.log('role list ' + JSON.stringify(this.roleList))
        this.getRolePermissionRelation() // step2
      })
    },
    getPermission () {
      this.$api.get('/permission', null, r => {
        this.permissionList = r.data.data
        console.log('permission list ' + JSON.stringify(this.permissionList))
      })
    },
    getRolePermissionRelation () {
      console.log('role list ' + JSON.stringify(this.roleList))
      for (let index = 0; index < this.roleList.length; index++) {
        this.$set(this.roleList[index], 'children', [])
        console.log('role list ' + JSON.stringify(this.roleList))
      }
      // let size = (this.pageSize < this.roleNum) ? this.pageSize : this.roleNum
      // console.log('size: ' + size)
      let listIds = new Array(0)
      for (let item of this.roleList) {
        listIds.push(item.id)
      }
      console.log('Ids to query ' + listIds)
      console.log('JSON stringifyed: ' + JSON.stringify(listIds))
      console.log('THEN stringifyed: ' + this.$qs.stringify({roleIds: JSON.stringify(listIds)}))
      this.$api.post('/rolePermissionByRoleIds', this.$qs.stringify({roleIds: JSON.stringify(listIds)}), r => {
        r = r.data
        console.log('results ' + JSON.stringify(r))
        if (r.success === true) {
          this.permissionRecord = r.data
          r.data.forEach(item => {
            console.log('permission:' + JSON.stringify(item))
            this.insertPermissionIntoRoleList(item.permissionId, item.roleId, item.id)
          })
          this.$Message.success('Update Role-Permission Relation Success')
        } else {
          this.$Message.error('Fail Update Role-Permission Relation')
        }
      })
    },
    insertPermissionIntoRoleList (permissionId, roleId, recordId) {
      // console.log(this.roleList + '  ')
      console.log(JSON.stringify(this.roleList))
      let RoleIndex
      for (let index = 0; index < this.roleList.length; index++) {
        if (this.roleList[index].id === roleId) {
          RoleIndex = index
          break
        }
      }
      console.log('RoleIndex: ' + RoleIndex)
      for (let item of this.permissionList) {
        if (item.id === permissionId) {
          console.log(JSON.stringify(item))
          this.roleList[RoleIndex].children.push({id: 'Permission: ' + item.id,
            roleName: item.permissionName,
            roleCode: item.permissionCode,
            roleDescription: 'Permission id: ' + item.id +
          '\nRecord Id: ' + recordId,
            recordId: recordId})
        }
        console.log(JSON.stringify(this.roleList))
      }
    },
    handleDelete () {
    },
    async (index) {
      this.$Modal.confirm({
        title: 'Title',
        content: '<p>Are you sure to delete?</p>' + index,
        loading: true,
        onOk: () => {
          setTimeout(() => {
            this.$Modal.remove()
            this.$Message.info('Asynchronously close the dialog box')
          }, 1000)
        }
      })
    },
    handleAddRole () {
      this.$api.post('/role', this.$qs.stringify({
        roleName: this.roleToAdd.roleName,
        roleDescription: this.roleToAdd.roleDescription,
        roleCode: this.roleToAdd.roleCode}), r => {
        if (r.data.success === true) {
          this.$Message.success('Success!')
          this.initiate()
        } else {
          this.$Message.error('Fail! ' + r.data.errorMsg)
        }
      })
    },
    handleAddPermissionToRole (index) {
      this.recordToAdd = this.roleList[index]
      this.$set(this.recordToAdd, 'permissions', [])
      for (let item of this.recordToAdd.children) {
        this.recordToAdd.permissions.push(item.roleCode)
      }
      this.addPermissionToRole = !this.addPermissionToRole
    },
    postRecord () {
      console.log('record to add ' + JSON.stringify(this.recordToAdd))
      let permissionIds = []
      for (let record of this.recordToAdd.permissions) {
        for (let permission of this.permissionList) {
          if (record === permission.permissionCode) {
            permissionIds.push(permission.id)
            break
          }
        }
      }
      this.$api.post('/rolePermissionByPermissionIds', this.$qs.stringify({roleId: this.recordToAdd.id, permissionIds: JSON.stringify(permissionIds)}), r => {
        if (r.data.success) {
          this.$Message.success('Update Role-Permission Relations Success!')
        } else {
          this.$Message.error('Fail! ' + r.data.errorMsg)
        }
      })
      this.initiate()
    },
    handleReviseRole (index) {
      this.roleToRevise = this.roleList[index]
      this.reviseRole = !this.reviseRole
    },
    handleRoleRevise () {
      let data = this.roleToRevise
      this.$api.put('/role', this.$qs.stringify({id: data.id, roleName: data.roleName, roleDescription: data.roleDescription, roleCode: data.roleCode}), r => {
        r = r.data
        if (r.success === true) {
          this.$Message.success('Revised Role Success !')
          this.initiate()
        } else {
          this.$Message.error('Fail! ' + r.errorMsg)
        }
      })
    },
    handleDeleteRecord (recordId) {
      console.log('To post record Id: ' + this.$qs.stringify({id: recordId}))
      this.$api.delete('/rolePermission', {id: recordId}, r => {
        if (r.data.success === true) {
          this.$Message.success('Delete Permission Success!')
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
