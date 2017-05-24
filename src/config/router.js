import {
  Login,
  Home,
  NotFound,
  Content,
  Back,
  Welcome,
} from '../components/';

module.exports = [{
  path: '/',
  redirect: to => {
    return 'login';
  },
  hidden: true
}, {
  path: '/login',
  component: Login,
  hidden: true
}, {
  path: '/404',
  component: Home,
  hidden: true,
  children: [{
    path: '',
    component: NotFound
  }]
}, {
  path: '/welcome',
  component: Home,
  hidden: true,
  children: [{
    path: '',
    component: Welcome
  }]
},{
  path: '/back',
  name: '后台管理',
  icon: 'inbox',
  component: Home,
  children: [{
    hidden: true,
    path: '',
    redirect: to => {
      return 'back'
    }
  },{
    path: 'back',
    name: '后台管理',
    component: Content,
    iconCls: 'el-icon-message',//图标样式class
    children: [
      {
        hidden: true,
        path: '',
        redirect: to => {
          return 'userList'
        }
      },
      {
        path: 'userList',
        name: '用户管理',
        component:Back.User
      } , {
        path: 'authList',
        name: '权限管理',
        component:Back.Auth
      },{
        path: 'dictList',
        name: '字典管理',
        component:Back.Dict
      },{
        path: 'dictTypeList',
        name: '字典类型管理',
        component:Back.DictType
      },{
        path: 'roleList',
        name: '角色管理',
        component:Back.Role
      },
    ]
  }]
}];
