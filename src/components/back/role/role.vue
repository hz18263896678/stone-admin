<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="primary" @click="showAddRole">新增角色</el-button>
                    <el-button type="primary" @click="showAddAsignAuth">权限分配</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="roles" row-key="id" current-row-key highlight-current-row v-loading="loading"
                  @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection"  prop="id">
            </el-table-column>
            <el-table-column prop="name" label="名称"  sortable>
            </el-table-column>
            <el-table-column prop="remark" label="简介"  sortable>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="简介" prop="remark">
                    <el-input v-model="addForm.remark" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="简介" prop="remark">
                    <el-input v-model="editForm.remark" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
        <!--权限分配-->
        <el-dialog title="权限分配" v-model="authTableVisible">
            <el-tree
                    :data="auths"
                    show-checkbox
                    node-key="id"
                    ref="tree"
                    :default-expand-all="defaultExpandAll"
                    :props="defaultProps">
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="authTableVisible = false">取消</el-button>
                <el-button type="primary" @click.native="saveAuthRole" :loading="saveAuthLoading">提交</el-button>
            </div>
        </el-dialog>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <!--分页-->
            <el-pagination layout="prev, pager, next" @current-change="this.handleCurrentChange" :page-size="pageSize"
                           :total="total" style="float:right;">
            </el-pagination>
        </el-col>
    </section>
</template>
<script>
import role from './role.js'
  module.exports = role;
</script>
<style scoped>
</style>
