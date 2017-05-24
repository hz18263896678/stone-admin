import NProgress from 'nprogress';
export default {
  data(){
    return {
      auths: [],
      loading: false,
      editForm: {
        leaf: false,
        hidden: false,
        higherAuthId:[]
      },
      editFormVisible: false,
      addFormVisible: false,
      addForm: {
        leaf: false,
        hidden: false,
        higherAuthId:[]
      },
      sels: [],
      page: 1,
      total: 0,
      addLoading: false,
      editLoading: false,
      pageSize: 15,
      formRules: {
        name: [
          {required: true, message: "名称为必填", trigger: 'blur'}
        ],
        path: [
          {required: true, message: "路径为必填", trigger: 'blur'}
        ],
        component: [
          {required: true, message: "组件名称为必填", trigger: 'blur'}
        ],
      },
      addFormRules: {},
      editFormRules: {}
    }
  },
  methods: {
    formatLeaf(row, column){
      return row.leaf=='true'?'是':'否';
    },
    formatHidden(row, column){
      return row.hidden=='true'?'不显示':'显示';
    },
    showAddAuth(){
      this.addFormVisible = true;

    },
    handleCurrentChange(val){
      this.page = val;
      this.getRoles();
    },
    handleEdit(row){
      this.editForm = row;
      this.editFormVisible = true;
    },
    handleDel(row){
      var authorityId = row.id;
      this.$$deleteAuth({authorityId:authorityId},data => {
        var type = 'success';
        if(data.isSuccess){
          type = 'error';
        }
        this.$notify({
          title: '提示',
          message: data.message,
          type: type
        });
        this.getAuths();
      });
    },
    selsChange(sels){
      this.sels = sels;
    },
    batchRemove(){
      var ids = this.sels.map(item => item.id).toString();
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        NProgress.start();
        let para = {ids: ids};
        this.$$batchRemoveAuth(para,(data) => {
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
          this.getAuths();
        });
      });
    },
    addSubmit(){
      this.$refs['addForm'].validate(valid =>{
        if (valid) {
          this.loading = true;
          this.$$saveAuth(this.addForm,data => {
            this.loading = false;
            this.addFormVisible=false;
            var type = 'success';
            if(!data.isSuccess){
              type = 'error';
            }else{
              this.$refs['addForm'].resetFields();
            }
            this.$notify({
              title: '提示',
              message: data.message,
              type: type
            });
            this.getAuths();
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
          this.$$editAuth(this.editForm,data => {
            this.loading = false;
            this.editFormVisible=false;
            var type = 'success';
            if(!data.isSuccess){
              type = 'error';
            }else{
              this.$refs['editForm'].resetFields();
            }
            this.$notify({
              title: '提示',
              message: data.message,
              type: type
            });
            this.getAuths();
          });
        } else {
          return false;
        }
      });
    },

    getAuths(){
      let para = {
        currentPage: this.page,
        pageSize: this.pageSize
      };
      this.loading = true;
      NProgress.start();
      this.$$listAuth(para,(data) => {
        if (data.isSuccess) {
          this.auths = data.obj.result;
          this.total = data.obj.total;
          this.loading = false;
        }
        this.loading = false;
        NProgress.done();
      });
    }
  },
  mounted(){
    this.getAuths();
  }
}
