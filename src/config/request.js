import {
	ajax
} from 'util/';

/**
 * 导出所有模块需要用到接口
 * 一级属性：模块名
 * 一级属性中的方法：当前模块需要用的接口
 * @type {Object}
 */
module.exports = {
  //公共模块
  common:{
    /**
     * 删除图片
     * @param data
     * @param fn
     */
    deleteImage(data,fn){
      ajax.call(this, 'post', 'admin/Common/deleteImage.do', data, fn, true);
    },
    /**
     * 获取验证码图片
     * @param data
     * @param fn
     */
    captcha(data, fn) {
      ajax.call(this, 'post', 'common/captcha.do', data, fn);
    },

  },
	//用户模块
	user: {
		/**
		 * 登录
		 * @param {object} data 参数
		 * @param {string} data.username 登陆用户名
		 * @param {string} data.password 登陆密码
		 * @param {fnnction} fn 成功回调
		 */
		login(data, fn, errFn) {
			ajax.call(this, 'post', '/api/login.do', data, fn, true, errFn);
		},
		/**
		 * 获取用户列表
		 * @param  	{object}   	data 			参数
		 * @param 	{string} 	data.username 	用户名-搜索
		 * @param 	{string} 	data.email 		邮箱-搜索
		 * @param  	{Function} 	fn   			成功回的回调
		 */
		selectUser(data, fn) {
			ajax.call(this, 'get', '/admin/User/list.do', data, fn);
		},

		/**
		 * 添加用户接口
		 * @param {object}   data 参数
		 * @param {fnnction} fn   成功回调
		 */
	  saveUser(data, fn) {
      ajax.call(this, 'post', '/admin/User/insert.do', data, fn);
    },
	/**
		 * 修改用户接口
		 * @param {object}   data 参数
		 * @param {fnnction} fn   成功回调
		 */
	  updateUser(data, fn) {
      ajax.call(this, 'post', '/admin/User/update.do', data, fn);
    },

    /**
		 * 删除用户
		 * @param  {object}   data 参数
		 * @param {string} data.id 需要删除的用户ID，批量删除时，值为以逗号分开的ID字符串
		 * @param  {Function} fn   成功回调
		 */
		deleteUser(data, fn) {
			ajax.call(this, 'post', '/admin/User/delete.do', data, fn);
		},
    /**
     * 批量删除用户
     * @param  {object}   data 参数
     * @param {string} data.id 需要删除的用户ID，批量删除时，值为以逗号分开的ID字符串
     * @param  {Function} fn   成功回调
     */
    bentchDeleteUser(data, fn) {
			ajax.call(this, 'post', '/admin/User/deletes.do', data, fn);
		},

		/**
		 * 获取用户信息
		 * @param  {string}   id 用户ID
		 * @param  {Function} fn 成功回调
		 */
		findUser(id, fn) {
			ajax.call(this, 'get', '/User/findUser', {
				id: id
			}, fn);
		},

		/**
		 * 修改密码
		 * @param  {object}   data 参数
		 * @param {string} data.old_password 旧密码
		 * @param {string} data.password 新密码
		 * @param {string} data.password_confirm 确认密码
		 * @param  {Function} fn   成功回调
		 */
		updPass(data, fn) {
			ajax.call(this, 'post', '/admin/User/update.do', data, fn);
		},
    /**
     * 更新用户信息
     * @param data
     * @param fn
     */
  	updUser(data, fn) {
			ajax.call(this, 'post', '/admin/User/update.do', data, fn);
		},

		/**
		 * 设置权限
		 * @param  {object}   data 参数
		 * @param {string} data.id 数据ID
		 * @param {string} data.login_style 登录方式，1：单点登录；2：多点登录
		 * @param {string} data.disabled_update_pass 不允许修改密码的用户ID，以逗号隔开
		 * @param  {Function} fn   成功回调
		 */
		accessUser(data, fn) {
			ajax.call(this, 'post', '/User/accessUser', data, fn);
		}
	},

	/**
	 * 文章管理
	 * @type {Object}
	 */
	article: {
		/**
		 * 查看文章列表
		 * @param  {object}   data 参数
		 * @param  {Function} fn   成功回调
		 */
		selectArticle(data, fn) {
			ajax.call(this, 'get', '/admin/News/list.do', data, fn);
		},

		/**
		 * 添加接口
		 * @param  {object}   data 参数
		 * @param  {Function} fn   成功回调
		 */
		saveArticle(data, fn) {
			ajax.call(this, 'post', '/admin/News/insert.do', data, fn);
		},
    /**
		 * 修改接口
		 * @param  {object}   data 参数
		 * @param  {Function} fn   成功回调
		 */
		updateArticle(data, fn) {
			ajax.call(this, 'post', '/admin/News/update.do', data, fn);
		},

		/**
		 * 删除文章
		 * @param  {object}   data 参数
		 * @param  {Function} fn   成功回调
		 */
		deleteArticle(data, fn) {
			ajax.call(this, 'post', '/admin/News/delete.do', data, fn);
		},
		/**
		 * 批量删除文章
		 * @param  {object}   data 参数
		 * @param  {Function} fn   成功回调
		 */
    batchDeleteArticle(data, fn) {
			ajax.call(this, 'post', '/admin/News/deletes.do', data, fn);
		},

		/**
		 * 获取文章
		 * @param  {object}   data 参数
		 * @param  {Function} fn   成功回调
		 */
		findArticle(data, fn) {
			ajax.call(this, 'post', '/admin/News/getNewsById.do', data, fn);
		},
	},
  /**
   * 字典管理
   */
  dict : {
    /**
     * 获取字典列表
     * @param data
     * @param fn
     */
    getDicts(data,fn){
      ajax.call(this, 'post', '/admin/Dictionary/list.do', data, fn);
    },
    /**
     * 根据类型查询
     * @param data
     * @param fn
     */
    listByType(data,fn){
      ajax.call(this, 'post', '/admin/Dictionary/listByType.do', data, fn);
    },
    /**
     * 增加字典
     * @param data
     * @param fn
     */
    addDict(data,fn){
      ajax.call(this, 'post', '/admin/Dictionary/insert.do', data, fn);
    },
    /**
     * 编辑字典
     * @param data
     * @param fn
     */
    editDict(data,fn){
      ajax.call(this, 'post', '/admin/Dictionary/update.do', data, fn);
    },
    /**
     * 删除字典
     * @param data
     * @param fn
     */
    deleteDict(data,fn){
      ajax.call(this, 'post', '/admin/Dictionary/delete.do', data, fn);
    },
    /**
     * 批量删除字典
     * @param data
     * @param fn
     */
    batchRemoveDict(data,fn){
      ajax.call(this, 'post', '/admin/Dictionary/deletes.do', data, fn);
    }
  },
  /**
   * 字典类型管理
   */
	dictType:{
    /**
     * 获取字典类型列表
     * @param data
     * @param fn
     */
    dictTypeList(data,fn){
      ajax.call(this, 'post', '/admin/DictionaryType/list.do', data, fn);
    },
    /**
     * 获取全部列表
     * @param data
     * @param fn
     */
    dictTypeListAll(data,fn){
      ajax.call(this, 'post', '/admin/DictionaryType/listAll.do', data, fn);
    },
    /**
     * 添加字典类型
     * @param data
     * @param fn
     */
    addDictType(data,fn){
      ajax.call(this, 'post', '/admin/DictionaryType/insert.do', data, fn);
    },
    /**
     * 编辑字典类型
     * @param data
     * @param fn
     */
    editDictType(data,fn){
      ajax.call(this, 'post', '/admin/DictionaryType/update.do', data, fn);
    },
    /**
     * 删除字典类型
     * @param data
     * @param fn
     */
    deleteDictType(data,fn){
      ajax.call(this, 'post', '/admin/DictionaryType/delete.do', data, fn);
    },
    /**
     * 批量删除
     * @param data
     * @param fn
     */
    batchRemoveDictType(data,fn){
      ajax.call(this, 'post', '/admin/DictionaryType/deletes.do', data, fn);
    },

  },
  /**
   * 权限管理
   */
  authority :{
    /**
     * 权限列表
     * @param data
     * @param fn
     */
    listAuth(data,fn){
      ajax.call(this, 'post', '/admin/Authority/list.do', data, fn);
    },
    /**
     * 新增权限
     * @param data
     * @param fn
     */
    saveAuth(data,fn){
      ajax.call(this, 'post', '/admin/Authority/insert.do', data, fn);
    },
    /**
     * 修改权限
     * @param data
     * @param fn
     */
    editAuth(data,fn){
      ajax.call(this, 'post', '/admin/Authority/update.do', data, fn);
    },
    /**
     * 删除权限
     * @param data
     * @param fn
     */
    deleteAuth(data,fn){
      ajax.call(this, 'post', '/admin/Authority/delete.do', data, fn);
    },
    /**
     * 批量删除权限
     * @param data
     * @param fn
     */
    batchRemoveAuth(data,fn){
      ajax.call(this, 'post', '/admin/Authority/deletes.do', data, fn);
    },

  },
  /**
   * 角色管理
   */
	role:{
    /**
     * 查询角色与对应权限
     * @param data
     * @param fn
     */
    listByRole(data,fn){
      ajax.call(this, 'post', '/admin/RoleAuthority/listByRole.do', data, fn);
    },
    /**
     * 角色列表
     * @param data
     * @param fn
     */
    getRoles(data,fn){
      ajax.call(this, 'post', '/admin/Role/list.do', data, fn);
    },
    roleListAll(data,fn){
      ajax.call(this, 'post', '/admin/Role/listAll.do', data, fn);
    },
    /**
     * 保存 角色与权限
     * @param data
     * @param fn
     */
    saveAuthorityRole(data,fn){
      ajax.call(this, 'post', '/admin/Role/insert.do', data, fn);
    },
    /**
     * 编辑 角色
     * @param data
     * @param fn
     */
    editRole(data,fn){
      ajax.call(this, 'post', '/admin/Role/update.do', data, fn);
    },
    /**
     * 删除 角色
     * @param data
     * @param fn
     */
    deleteRole(data,fn){
      ajax.call(this, 'post', '/admin/Role/delete.do', data, fn);
    },
    /**
     * 批量删除
     * @param data
     * @param fn
     */
    batchRemoveRole(data,fn){
      ajax.call(this, 'post', '/admin/Role/deletes.do', data, fn);
    },
    /**
     * 查询权限树形结构
     * @param data
     * @param fn
     */
    listAuthorityTree(data,fn){
      ajax.call(this, 'post', '/admin/Role/listAuthorityTree.do', data, fn);
    },
    /**
     * 根据用户id获取对应角色
     * @param data
     * @param fn
     */
    getUserRole(data,fn){
      ajax.call(this, 'post', '/admin/Role/getRoleByUser.do', data, fn);
    },
    /**
     * 保存用户与角色的关联
     * @param data
     * @param fn
     */
    saveUserRole(data,fn){
      ajax.call(this, 'post', '/admin/UserRole/insert.do', data, fn);
    }
  },
	/**
	 * 系统设置
	 * @type {Object}
	 */
	system: {
		/**
		 * 获取系统设置信息
		 * @param  {Function} fn 成功回调
		 */
		getSetting(fn) {
			ajax.call(this, 'get', '/System/getSetting', {}, fn);
		},

		/**
		 * 修改系统设置信息
		 * @param  {object}   data 参数
		 * @param  {Function} fn   成功回调
		 */
		updateSetting(data, fn) {
			ajax.call(this, 'post', '/System/updateSetting', data, fn);
		}
	}
};
