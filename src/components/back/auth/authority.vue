<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="primary" @click="showAddAuth">新增权限</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="auths" row-key="id" current-row-key highlight-current-row v-loading="loading"
                  @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection" prop="id">
            </el-table-column>
            <el-table-column prop="name" label="名称" sortable>
            </el-table-column>
            <el-table-column prop="path" label="路径" sortable>
            </el-table-column>
            <el-table-column prop="component" label="组件名称" sortable>
            </el-table-column>
            <el-table-column prop="leaf" label="是否单一菜单"  :formatter="formatLeaf" sortable>
            </el-table-column>
            <el-table-column prop="hidden" label="是否显示"  :formatter="formatHidden" sortable>
            </el-table-column>
            <el-table-column prop="iconfont" label="图标" sortable>
            </el-table-column>
            <el-table-column prop="redirect" label="跳转路径" sortable>
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
            <el-form :model="addForm" label-width="80px" :rules="formRules" ref="addForm">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="组件" prop="component">
                    <el-input v-model="addForm.component" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="路径" prop="path">
                    <el-input v-model="addForm.path" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="跳转路径" prop="redirect">
                    <el-input v-model="addForm.redirect" value="" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="图标" prop="iconfont">
                    <el-input v-model="addForm.iconfont" value=""  auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="上级菜单" prop="higherAuthId">
                    <el-select v-model="addForm.higherAuthId"   placeholder="请选择">
                        <el-option label="无" value="" checked>/</el-option>
                        <el-option
                                v-for="item in auths"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否单一菜单">
                    <el-radio-group v-model="addForm.leaf">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否显示">
                    <el-radio-group v-model="addForm.hidden">
                        <el-radio label="true">否</el-radio>
                        <el-radio label="false">是</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog title="新增" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="formRules" ref="editForm">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="组件" prop="component">
                    <el-input v-model="editForm.component" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="路径" prop="path">
                    <el-input v-model="editForm.path" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="跳转路径" prop="redirect">
                    <el-input v-model="editForm.redirect" value="" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="图标" prop="iconfont">
                    <el-input v-model="editForm.iconfont" value="" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="上级菜单" prop="higherAuthId">
                    <el-select v-model="editForm.higherAuthId" placeholder="请选择">
                        <el-option label="无" value="" checked>/</el-option>
                        <el-option v-for="item in auths"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否单一菜单">
                    <el-radio-group v-model="editForm.leaf">
                        <el-radio label="true">是</el-radio>
                        <el-radio label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否显示">
                    <el-radio-group v-model="editForm.hidden">
                        <el-radio label="true">否</el-radio>
                        <el-radio label="false">是</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
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
  import auth from './authority.js'
  module.exports = auth;
</script>
<style scoped>
</style>
