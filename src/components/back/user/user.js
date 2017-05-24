
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.addForm.passwd !== '') {
          this.$refs.addForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.addForm.passwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    var validateEditPass = (rule, value, callback) => {
      if (this.editForm.passwd !== '') {
        this.$refs.editForm.validateField('checkPass');
      }
      callback();
    };
    var validateEditPass2 = (rule, value, callback) => {
      if (this.editForm.passwd !== '') {
        if (value !== this.editForm.passwd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      }else{
        callback();
      }
    };
    return {
      filters: {
        name: ''
      },
      sels: [],//列表选中列
      loading: false,
      total: 0,
      page: 1,
      listLoading: false,
      roleFormVisible:false,
      roles:[],
      isIndeterminate: true,
      checkAll:true,
      checkedroles:[],
      users: [],
      addFormVisible: false,//新增界面是否显示
      addFormRules: {
        name: [
          {required: true, message: '请输入姓名', trigger: 'blur'}
        ],
        account: [
          {required: true, message: '请输入帐号', trigger: 'blur'}
        ],
        passwd: [
          { validator: validatePass, trigger: 'blur'}
        ],
        checkPass: [
          {validator: validatePass2, trigger: 'blur'}
        ],
      },
      editFormRules: {
        name: [
          {required: true, message: '请输入姓名', trigger: 'blur'}
        ],
        account: [
          {required: true, message: '请输入帐号', trigger: 'blur'}
        ],
        passwd: [
          { validator: validateEditPass, trigger: 'blur'}
        ],
        checkPass: [
          {validator: validateEditPass2, trigger: 'blur'}
        ],
      },
      editFormVisible: false,//编辑界面是否显示
      editLoading: false,
      //编辑界面数据
      editForm: {
        name: '',
        sex: 1,
        age: 0,
      },
      addLoading: false,
      //新增界面数据
      addForm: {
        name: '',
        sex: 1,
        age: 0,
      }
    }
  },

  methods: {
    //选中条数
    selsChange: function (sels) {
      this.sels = sels;
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getUsers();
    },
    //获取用户列表
    getUsers () {
      let para = {
        name: this.filters.name,
        currentPage: this.page
      };
      this.loading = true;
      this.$$selectUser(para,(data) => {
        this.users = data.obj.result;
        this.total = data.obj.total;
        this.loading = false;
      });
    },
    //批量删除
    batchRemove: function () {
      var ids = this.sels.map(item => item.id).toString();
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        let para = {ids: ids};
        this.$$bentchDeleteUser(para,(data) => {
          this.listLoading = false;
          if(data.isSuccess){
            this.$notify({
              title: '成功',
              message: data.message,
              type: 'success'
            });
            this.getUsers();
          }else{
            this.$notify({
              title: '失败',
              message: data.message,
              type: 'error'
            });
          }


        });
      });
    },
    addSubmit(){
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$$saveUser(this.addForm,data => {
            this.loading = false;
            if(data.isSuccess){
              this.addFormVisible=false;
              this.$notify({
                title: '提示',
                message: data.message,
                type: 'success'
              });
            }
            this.getUsers();
          });
        } else {
          return false;
        }
      });
    },
    editSubmit(){
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$$updateUser(this.editForm,data => {
            this.loading = false;
            if(data.isSuccess){
              this.editFormVisible=false;
              this.$notify({
                title: '提示',
                message: data.message,
                type: 'success'
              });
            }else{
              this.$notify({
                title: '提示',
                message: data.message,
                type: 'error'
              });
            }
            this.getUsers();
          });
        } else {
          return false;
        }
      });
    },
    handleDel(row){
      var id = row.id;
      this.$$deleteUser({userId:id},data => {
        if(data.isSuccess){
          this.$notify({
            title: '提示',
            message: data.message,
            type: 'success'
          });
        }else{
          this.$notify({
            title: '提示',
            message: data.message,
            type: 'error'
          });
        }
        this.getUsers();
      });
    },
    showAddUser(){
      this.addFormVisible = true;
    },
    getRoles(){
      this.$$roleListAll({},data => {
        this.roles = data.obj;
      });
    },
    handleEdit(row){
      this.editForm = Object.assign({}, row);
      this.editForm.passwd = "";
      this.editFormVisible=true;
    },
    showAddUserRole(){
      if(this.sels.length==0){
        this.$notify({
          title: '提示',
          message: '请选中一个用户',
          type: 'error'
        });
      }else if (this.sels.length>1){
        this.$notify({
          title: '提示',
          message: '只能选中一个用户',
          type: 'error'
        });
      }else{
        this.checkedroles = [];
        this.$$getUserRole({userId:this.sels[0].id},data =>{
          for(var i = 0;i<data.obj.length;i++){
            this.checkedroles.push(data.obj[i].id);
          }
        });
        this.roleFormVisible = true;
      }

    },
    handleCheckAllChange(event) {
      this.checkedroles = event.target.checked ? this.roles : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.roles.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.roles.length;
    },
    saveUserRole(){
      var data = {
        userId:this.sels[0].id,
      };
      var  roleIds = []
      for(var i =0;i<this.checkedroles.length;i++){
        roleIds.push(this.checkedroles[i]);
      }
      roleIds = roleIds.join(",");
      data.roleIds=roleIds;
      this.$$saveUserRole(data,res => {
        this.$notify({
          title: '提示',
          message: res.message,
          type: 'info'
        });
        this.roleFormVisible=false;
      })
    }
  },
  mounted() {
    this.getUsers();
    this.getRoles();
  }
};
