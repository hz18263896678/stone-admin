import NProgress from 'nprogress';
export default {
  data(){
    return {
      addForm: {},
      editForm: {},
      roles: [],
      auths: [],
      defaultExpandAll:true,
      defaultProps:{
        label:'name',
        children:'children'
      },
      saveAuthLoading:false,
      pageSize: 15,
      addLoading: false,
      editLoading: false,
      authTableVisible:false,
      loading: false,
      sels: [],
      total: 0,
      page: 1,
      addFormVisible: false,
      editFormVisible: false,
      editFormRules: {
        name: [
          {required: true, message: "名称为必填", trigger: 'blur'}
        ]
      },
      addFormRules: {
        name: [
          {required: true, message: "名称为必填", trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    showAddRole(){
      this.addFormVisible = true;
    },
    showAddAsignAuth(){
      if(this.sels.length>1){
        this.$message.error('只能选择一个角色进行分配');
      }else if(this.sels.length==0){
        this.$message.error('需要选择一个角色');
      }else{
        var params = {
          roleId:this.sels[0].id
        };
        this.authTableVisible = true;
        this.$$listByRole(params,data => {
          var checkIds = data.obj;
          var ids = [];
          for(var i = 0;i<checkIds.length;i++){
            var id = checkIds[i].authorityId;
            ids.push(id);
          }
          this.$refs.tree.setCheckedKeys(ids);
        });

      }

    },
    handleEdit(row){
      this.editForm = row;
      this.editFormVisible = true;
    },
    handleDel(row){
      var roleId = row.id;
      this.$$deleteRole({roleId:roleId},data => {
        var type = 'success';
        if(!data.isSuccess){
          type = 'error';
        }
        this.$notify({
          title: '提示',
          message: data.message,
          type: type
        });
        this.getRoles();
      });
    },
    addSubmit(){
      this.$refs['addForm'].validate(valid =>{
        if (valid) {
          this.loading = true;
          this.$$saveAuthorityRole(this.addForm,data => {
            this.loading = false;
            if(data.isSuccess){
              this.addFormVisible=false;
              this.$notify({
                title: '提示',
                message: data.message,
                type: 'success'
              });
            }
            this.getRoles();
          });
        } else {
          return false;
        }
      });
    },
    editSubmit(){
      this.$refs['editForm'].validate(valid =>{
        if (valid) {
          this.loading = true;
          this.$$editRole(this.editForm).then(data => {
            this.loading = false;
            this.editFormVisible=false;
            var type = 'success';
            if(!data.isSuccess){
              type = 'error';
            }
            this.$notify({
              title: '提示',
              message: data.message,
              type: type
            });
            this.getRoles();
          });
        } else {
          return false;
        }
      });
    },
    //批量删除
    batchRemove: function () {
      var ids = this.sels.map(item => item.id).toString();
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        NProgress.start();
        let para = {ids: ids};
        this.$$batchRemoveRole(para,(data) => {
          this.listLoading = false;
          NProgress.done();
          var type = 'success';
          if(!data.isSuccess){
            type = 'error';
          }
          this.$notify({
            title: '提示',
            message: data.message,
            type: type
          });
          this.getRoles();
        });
      });
    },
    selsChange(sels){
      this.sels = sels;
    },
    handleCurrentChange(val){
      this.page = val;
      this.getRoles();
    },
    saveAuthRole(){
      this.saveAuthLoading = true;
      var nodes = this.$refs.tree.getCheckedKeys();
      if(nodes.length==0){
        this.$message.error('为空不能提交!');
      }else{
        var roleIds = this.sels[0].id;
        var params = {
          authIds:nodes.join(","),
          roleIds:roleIds
        }
        this.$$saveAuthorityRole(params,data => {
          this.saveAuthLoading = false;
          this.authTableVisible = false;
          var type = 'success';
          if(!data.isSuccess){
            type = 'error';
          }
          this.$notify({
            title: '提示',
            message: data.message,
            type: type
          });
        });
      }
    },
    getRoles(){
      let para = {
        currentPage: this.page,
        pageSize: this.pageSize
      };
      this.loading = true;
      NProgress.start();
      this.$$getRoles(para,(data) => {
        if (data.isSuccess) {
          this.roles = data.obj.result;
          this.total = data.obj.total;
          this.loading = false;
        }
        this.loading = false;
        NProgress.done();
      });

    },
  },
  computed:{

  },
  mounted(){
    this.getRoles();
    this.$$listAuthorityTree({},data=>{
      this.auths = data.obj;
    });
  }
}
