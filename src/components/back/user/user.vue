<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUsers">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="showAddUser">新增用户</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="showAddUserRole">匹配角色</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!--新增界面-->
    <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="帐号" prop="account">
          <el-input v-model="addForm.account" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="passwd">
          <el-input type="password" v-model="addForm.passwd" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="addForm.checkPass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="addForm.sex">
            <el-radio class="radio" :label="1">男</el-radio>
            <el-radio class="radio" :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
        </el-form-item>
        <el-form-item label="地址">
          <el-input type="textarea" v-model="addForm.address"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
    <!--编辑页面-->
    <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="帐号" prop="account">
          <el-input v-model="editForm.account" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="passwd">
          <el-input type="password" v-model="editForm.passwd" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="editForm.checkPass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="editForm.sex">
            <el-radio class="radio" :label="1">男</el-radio>
            <el-radio class="radio" :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
        </el-form-item>

        <el-form-item label="地址">
          <el-input type="textarea" v-model="editForm.address"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
    <!--角色匹配-->
    <el-dialog title="匹配角色" v-model="roleFormVisible" :close-on-click-modal="false">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <div style="margin: 15px 0;"></div>
      <el-checkbox-group v-model="checkedroles" @change="handleCheckedCitiesChange">
        <el-checkbox v-for="role in roles" :label="role.id">{{role.name}}</el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="roleFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="saveUserRole" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
    <!--列表-->
    <el-table :data="users" row-key="id" current-row-key highlight-current-row v-loading="loading"
              @selection-change="selsChange"
              style="width: 100%;">
      <el-table-column type="selection" width="55" prop="id">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="120" sortable>
      </el-table-column>
      <el-table-column prop="account" label="帐号" width="120" sortable>
      </el-table-column>
      <el-table-column prop="sex" label="性别" width="100" sortable>
      </el-table-column>
      <el-table-column prop="age" label="年龄" width="100" sortable>
      </el-table-column>
      <el-table-column prop="type" label="类型" width="100" sortable>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号" width="200" sortable>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="200" sortable>
      </el-table-column>
      <el-table-column prop="address" label="地址" min-width="280" sortable>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
      <!--分页-->
      <el-pagination layout="prev, pager, next" @current-change="this.handleCurrentChange" :page-size="15"
                     :total="total" style="float:right;">
      </el-pagination>
    </el-col>

  </section>
</template>
<script>
  import user from './user.js'
  module.exports = user;
</script>

<style scoped>

</style>
