import NProgress from 'nprogress';
export default {
  data(){
    return {
      addForm: {},
      editForm: {},
      dictTypes: [],
      saveAuthLoading:false,
      pageSize: 15,
      total: 0,
      page: 1,
      addLoading: false,
      editLoading: false,
      authTableVisible:false,
      loading: false,
      sels: [],
      addFormVisible: false,
      editFormVisible: false,
      formRules: {
        name: [
          {required: true, message: "名称为必填", trigger: 'blur'}
        ]
      }

    }
  },
  methods: {
    showAddDict(){
      this.addFormVisible = true;
    },
    handleEdit(row){
      this.editForm = row;
      this.editFormVisible = true;
    },
    handleDel(row){
      var dictionaryId = row.id;
      this.$$deleteDictType({dictionaryId:dictionaryId},data => {
        var type = 'success';
        if(!data.isSuccess){
          type = 'error';
        }
        this.$notify({
          title: '提示',
          message: data.message,
          type: type
        });
        this.getDictTypes();
      });
    },
    addSubmit(){
      this.$refs['addForm'].validate(valid =>{
        if (valid) {
          this.loading = true;
          this.$$addDictType(this.addForm,data => {
            this.loading = false;
            if(data.isSuccess){
              this.addFormVisible=false;
              this.$notify({
                title: '提示',
                message: data.message,
                type: 'success'
              });
            }
            this.getDictTypes();
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
          this.$$editDictType(this.editForm,data => {
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
            this.getDictTypes();
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
        this.$$batchRemoveDictType(para,(data) => {
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
          this.getDictTypes();
        });
      });
    },
    selsChange(sels){
      this.sels = sels;
    },
    handleCurrentChange(val){
      this.page = val;
      this.getDictTypes();
    },
    getDictTypes(){
      let para = {
        currentPage: this.page,
        pageSize: this.pageSize
      };
      this.loading = true;
      NProgress.start();
      this.$$dictTypeList(para,(data) => {
        if (data.isSuccess) {
          this.dictTypes = data.obj.result;
          this.total = data.obj.total;
          this.loading = false;
        }
        this.loading = false;
        NProgress.done();
      });

    },
  },
  mounted(){
    this.getDictTypes();
  }
}
