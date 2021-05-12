import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import permission from './modules/permission'
import userList from './modules/userList'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
	  user,
	  permission,
	  userList
  },
  getters:{
	  roles: state => state.user.roles,
	  account:state=>state.user.account,  //用户信息
	  menulist:state=>state.user.menulist,  //原始菜单目录，等待重新构造
	  permission_routes: state => state.permission.routes,  //有权限菜单目录
	  fdUserList:state=>state.userList.fdUserList,  //放单用户列表
	  jdUserList:state=>state.userList.jdUserList,  //接单用户列表
	  allUserList:state=>state.userList.allUserList,  //全部用户列表
	  roleList:state=>state.userList.roleList,  //角色列表
	  buyerAgentList:state=>state.userList.buyerAgentList  //买家端中介列表
  }
})
