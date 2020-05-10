<template>
  <div>
    <h2> User Info <Button @click="addUser = !addUser" type="primary" size="large"> + </Button></h2>
    <Table border :columns="userColumns" :data="userList">
      <template slot-scope="{ row, index }" slot="name">
        <Avatar size="large" :style="{background: ColorList[index % ColorList.length]}">{{ row.userName.split(' ')[0] }}</Avatar>
      </template>
      <template slot-scope="{ row }" slot="date1">
        <DatePicker :value="row.lastLoginTime" v-model="row.lastLoginTime" disabled type="datetime" format="yyyy-MM-dd HH:mm:ss" />
      </template>
      <template slot-scope="{ row }" slot="date2">
        <DatePicker :value="row.createTime" v-model="row.createTime" disabled type="datetime" format="yyyy-MM-dd HH:mm:ss" />
      </template>
      <template slot-scope="{ row }" slot="date3">
        <DatePicker :value="row.updateTime" v-model="row.updateTime" disabled type="datetime" format="yyyy-MM-dd HH:mm:ss" />
      </template>
      <template slot-scope="{ index }" slot="action">
        <Button type="primary" size="small" style="margin-right: 5px" @click="handleUserInfo(index)">View</Button>
        <Button type="primary" size="small" style="margin-right: 5px" @click="handleReviseUser(index)">Revise</Button>
        <Button type="error" size="small" @click="handleDeleteUser(index)">Delete</Button>
      </template>
    </Table>
    <Page @on-change="setPageNo" @on-page-size-change="setPageSize" :total="userNum" size="small" show-elevator show-sizer></Page>

    <Modal v-model="addUser" :loading = "refuseLoading" width="600" draggable scrollable>
      <p slot="header" style="color:#2f7bff;text-align:center">
        <Icon type="ios-add" />
        <span>Creat New User</span>
      </p>
      <div style="text-align:center">
        <Form ref="addUser" :model="userToAdd" label-position="left" :label-width="100" :rules = "ruleInline">
          <FormItem label="Account" prop = "account">
            <Input v-model="userToAdd.account"></Input>
          </FormItem>
          <FormItem label="User Name" prop = "account">
            <Input v-model="userToAdd.userName"></Input>
          </FormItem>
          <FormItem label="Password" prop = "account">
            <Input type="password" v-model="userToAdd.password"></Input>
          </FormItem>
          <FormItem label="ReEnter Password" prop = "nowPassword">
            <Input type="password" v-model="userToAdd.tempPassword"></Input>
          </FormItem>
          <FormItem label = "Role" prop = "role">
            <RadioGroup v-model = "userToAdd.role">
              <Radio v-for = "item in roleList" :key = item.id :label = item.roleCode alt=item.roleDescription>{{item.roleCode}}</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem>
            <Button type="success" long @click = "handleAddUser">SUBMIT</Button>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
      </div>
    </Modal>

    <Modal v-model="openInfo" width="500" draggable scrollable :closable="true">
      <p slot="header" style="color:#2f7bff;text-align:center">
        <span>User Info Details</span>
      </p>
      <Form label-position="left" :label-width="200">
        <FormItem label="User Id:">
          <h4>{{currentUserInfo.id}}</h4>
        </FormItem>
        <FormItem label="Account:" >
          <h4>{{currentUserInfo.account}}</h4>
        </FormItem>
        <FormItem label="Role:" >
          <Tag v-if="currentUserInfo.roleId % 5 === 0" color = "volcano">
            {{ currentUserInfo.role }}
          </Tag>
          <Tag v-else-if="currentUserInfo.roleId % 5 === 1" color="purple">
            {{ currentUserInfo.role }}
          </Tag>
          <Tag v-else-if="currentUserInfo.roleId % 5 === 2" color="orange">
            {{ currentUserInfo.role }}
          </Tag>
          <Tag v-else-if="currentUserInfo.roleId % 5 === 3" color="blue">
            {{ currentUserInfo.role }}
          </Tag>
          <Tag v-else color="green">
            {{ currentUserInfo.role }}
          </Tag>
        </FormItem>
        <FormItem label="Create User Id:" >
          <h4>{{currentUserInfo.createUser}}</h4>
        </FormItem>
        <FormItem label="Update User Id:" >
          <h4>{{currentUserInfo.updateUser}}</h4>
        </FormItem>
        <FormItem label="Account Not Expired:" >
          <h4>{{currentUserInfo.accountNonExpired}}</h4>
        </FormItem>
        <FormItem label="Account Not Locked:" >
          <h4>{{currentUserInfo.accountNonLocked}}</h4>
        </FormItem>
        <FormItem label="Credentials Not Expired:" >
          <h4>{{currentUserInfo.credentialsNonExpired}}</h4>
        </FormItem>
      </Form>
      <div slot="footer"></div>
    </Modal>

    <Modal v-model="reviseUser" :loading = "refuseLoading" width="600" draggable scrollable>
      <p slot="header" style="color:#2f7bff;text-align:center">
        <Icon type="ios-add" />
        <span>Revise User</span>
      </p>
      <div style="text-align:center">
        <Form ref="reviseUser" :model="userToRevise" label-position="left" :label-width="100" :rules = "ruleInline">
          <FormItem label="Account" prop = "account">
            <Input v-model="userToRevise.account"></Input>
          </FormItem>
          <FormItem label="User Name" prop = "userName">
            <Input v-model="userToRevise.userName"></Input>
          </FormItem>
          <FormItem label="Password" prop = "rawPassword">
            <Input type="password" v-model="userToRevise.password"></Input>
          </FormItem>
          <FormItem label="ReEnter Password" prop = "nowPassword">
            <Input type="password" v-model="userToRevise.newPassword"></Input>
          </FormItem>
          <FormItem label = "Role" prop = "role">
            <RadioGroup v-model = "userToRevise.roleCode">
              <Radio v-for = "item in roleList" :key = item.id :label = item.roleCode alt=item.roleDescription>{{item.roleCode}}</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="Status: ">
          <CheckboxGroup v-model="userToRevise.status">
            <Checkbox label="enabled" border></Checkbox>
            <Checkbox label="accountNonExpired" border></Checkbox>
            <Checkbox label="accountNonLocked" border></Checkbox>
            <Checkbox label="credentialsNonExpired" border></Checkbox>
          </CheckboxGroup>
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
  name: 'UserManagement',
  data () {
    const validatePassword = (rule, value, callback) => {
      if (value !== this.userToAdd.rawPassword) {
        callback(new Error('These two password are different!'))
      } else {
        callback()
      }
    }
    return {
      userColumns: [
        {
          title: 'Id',
          key: 'id'
        },
        {
          title: 'Account',
          key: 'account'
        },
        {
          title: 'User Name',
          slot: 'name'
        },
        {
          title: 'Last login Time',
          slot: 'date1',
          align: 'center',
          width: 210
        },
        {
          title: 'Create Time',
          slot: 'date2',
          align: 'center',
          width: 210
        },
        {
          title: 'Update Time',
          slot: 'date3',
          align: 'center',
          width: 210
        },
        {
          title: 'Enabled',
          key: 'enabled'
        },
        {
          title: 'Action',
          slot: 'action',
          align: 'center',
          width: 300
        }
      ],
      userList: [],
      openInfo: false,
      userNum: 0,
      pageNo: 1,
      pageSize: 10,
      addUser: false,
      refuseLoading: true,
      userToAdd: {
        account: '',
        userName: '',
        password: '',
        tempPassword: '',
        role: ''
      },
      currentUserInfo: [],
      reviseUser: false,
      userToRevise: '',
      ColorList: ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'],
      roleList: [],
      ruleInline: {
        account: [
          { required: true, message: 'Please enter account', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: 'Please enter username', trigger: 'blur' }
        ],
        rawPassword: [
          { required: false, message: 'Please enter password', trigger: 'blur' }
        ],
        nowPassword: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        role: [
          { required: true, message: 'Please select a role', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.initiate()
  },
  methods: {
    initiate () {
      this.getUserNum() // step1-4
    },
    getUserList () {
      this.$api.get('/getUser', { pageNo: this.pageNo, pageSize: this.pageSize }, r => {
        r = r.data
        if (r.success === true) {
          this.userList = r.data.records
          this.$Message.success('Success!')
          this.getRoles() // step3
        } else {
          this.$Message.error('Fail! ' + r.errorMsg)
        }
      })
    },
    getUserNum () {
      this.$api.get('/getUser/number', null, r => {
        r = r.data
        if (r.success === true) {
          this.userNum = parseInt(r.data)
          this.getUserList() // step2
        } else {
          this.$Message.error('Fail! ' + r.errorMsg)
        }
      })
    },
    setPageNo (index) {
      this.pageNo = index
      this.getUserList()
    },
    setPageSize (index) {
      this.pageSize = index
      this.getUserList()
    },
    getRoles () {
      this.$api.get('/rolelist', null, r => {
        if (r.data.success === true) {
          this.roleList = r.data.data
          console.log('role list ' + JSON.stringify(this.roleList))
          this.getUserRoleRelation() // step4
        } else {
          this.$Message.error('Fail! ' + r.data.errorMsg)
        }
      })
    },
    handleAddUser () {
      const _this = this
      const user = this.userToAdd
      console.log('To post ' + this.userToAdd.role)
      console.log('To post ' + this.userToAdd)
      this.$refs.addUser.validate((valid) => {
        if (valid) {
          // this.postData(actInfo)
          this.$api.post('/addUser', this.$qs.stringify({
            role: user.role,
            account: user.account,
            username: user.userName,
            password: user.password
          }), r => {
            if (r.data.success === true) {
              this.addUser = false
              this.$Message.success('Add User Success')
              this.initiate()
            } else {
              this.addUser = false
              this.$Message.error('Fail! ' + r.errorMsg)
            }
          })
          this.$refs.addUser.resetFields()
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
    handleUserInfo (index) {
      this.currentUserInfo = this.userList[index]
      this.openInfo = !this.openInfo
    },
    getUserRoleRelation () {
      const size = (this.pageSize < this.userNum) ? this.pageSize : this.userNum
      console.log('size: ' + size)
      const listIds = new Array(0)
      for (const item of this.userList) {
        listIds.push(item.id)
      }
      console.log('Ids to query ' + listIds)
      console.log('JSON stringifyed: ' + JSON.stringify(listIds))
      console.log('THEN stringifyed: ' + this.$qs.stringify({ userIds: JSON.stringify(listIds) }))
      this.$api.post('/userRoleByIds', this.$qs.stringify({ userIds: JSON.stringify(listIds) }), r => {
        r = r.data
        if (r.success === true) {
          console.log('roleRelation ' + r)
          r.data.forEach((item, index) => {
            console.log(item, index)
            this.insertRoleIntoUserList(item.roleId, index)
          })
          this.$Message.success('Update Role Relation Success')
        } else {
          this.$Message.error('Fail Update Role Relation')
        }
      })
    },
    insertRoleIntoUserList (roleId, index) {
      // console.log(this.roleList + '  ')
      for (const item of this.roleList) {
        if (item.id === roleId) {
          this.$set(this.userList[index], 'role', item.roleName)
          this.$set(this.userList[index], 'roleCode', item.roleCode)
          this.$set(this.userList[index], 'roleId', item.id)
          // console.log(this.userList[index])
        }
      }
    },
    handleReviseUser (index) {
      this.userToRevise = this.userList[index]
      this.$set(this.userToRevise, 'newPassword', '')
      this.$set(this.userToRevise, 'password', '')
      const array = []
      if (this.userToRevise.enabled) {
        array.push('enabled')
      }
      if (this.userToRevise.accountNonExpired) {
        array.push('accountNonExpired')
      }
      if (this.userToRevise.accountNonLocked) {
        array.push('accountNonLocked')
      }
      if (this.userToRevise.credentialsNonExpired) {
        array.push('credentialsNonExpired')
      }
      this.$set(this.userToRevise, 'status', array)
      this.reviseUser = !this.reviseUser
    },
    handleRevise () {
      const _this = this
      const user = this.userToRevise
      console.log('To post status' + JSON.stringify(user.status))
      this.$refs.reviseUser.validate((valid) => {
        if (valid) {
          // this.postData(actInfo)
          this.$api.put('/updateUser', this.$qs.stringify({
            role: user.roleCode,
            account: user.account,
            username: user.userName,
            password: user.password,
            newPassword: user.newPassword,
            status: JSON.stringify(user.status)
          }), r => {
            if (r.data.success === true) {
              this.addUser = false
              this.$Message.success('Update User Success')
              this.initiate()
            } else {
              this.addUser = false
              this.$Message.error('Fail! ' + r.errorMsg)
            }
          })
          this.$refs.reviseUser.resetFields()
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
    handleDeleteUser (index) {
      this.$api.delete('/deleteUser', { userId: this.userList[index].id }, r => {
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
