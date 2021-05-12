//引入ajax函数
import { ajaxFun } from '@/assets/JS/ajax.js'
import{Toast} from 'vant'
const state={
	fdUserList:[],  //放单用户列表
	jdUserList:[],  //接单用户列表
	allUserList:[]  ,//全部用户列表
	roleList:[]   ,//角色列表
	buyerAgentList:[] //买家端中介列表
}

const mutations={
	// 设置放单成员
	SET_FDUSERLIST:(state,val)=>{
		state.fdUserList=val;
	},
	// 设置接单成员
	SET_JDUSERLIST:(state,val)=>{
		state.jdUserList=val;
	},
	// 设置全部成员
	SET_ALLUSERLIST:(state,val)=>{
		state.allUserList=val;
	},
	// 设置角色列表
	SET_ROLELIST:(state,val)=>{
		state.roleList=val;
	},
	// 设置角色列表
	SET_BUYERAGENTLIST:(state,val)=>{
		state.buyerAgentList=val;
	}
}

const actions={
	//获取接单成员列表
	getJdUserList({ commit, state },index=0,len=50){
		return new Promise((resolve,reject)=>{
			ajaxFun('/Handler/CPManageSystem.ashx?cmd=getMJUserList&pageindex='+index+'&len='+len).then(res=>{
				//console.log(res.rows)
				let userlist=res.rows
				if(userlist){
					//重新构造给vant选择器组件适用格式
					let newuserlist=userlist.map(n=>{
						return {
							text:n.username,
							value:n.userid
						}
					})
					newuserlist.unshift({
						value:'0',
						text:'全部'
					})
					commit('SET_JDUSERLIST',newuserlist);
					resolve(res);
				}else{
					Toast('接单成员列表用户获取出错')
					reject(res)
				}
			}).catch(xhr=>{
				Toast('接单成员列表用户获取出错')
				reject(xhr)
			})
		})
	},
	//获取放单成员列表
	getFdUserList({ commit, state },index=0,len=50){
		return new Promise((resolve,reject)=>{
			ajaxFun('/Handler/CPManageSystem.ashx?cmd=getMMJUserList&pageindex='+index+'&len='+len).then(res=>{
				//console.log(res.rows)
				let userlist=res.rows
				if(userlist){
					//重新构造给vant选择器组件适用格式
					let newuserlist=userlist.map(n=>{
						return {
							text:n.username,
							value:n.userid
						}
					})
					newuserlist.unshift({
						value:'0',
						text:'全部'
					})
					
					commit('SET_FDUSERLIST',newuserlist);
					resolve(newuserlist);
				}else{
					Toast('放单成员列表用户获取出错')
					reject(res)
				}
			}).catch(xhr=>{
				Toast('放单成员列表用户获取出错')
				reject(xhr)
			})
		})
	},
	//获取全部成员列表
	getAllUserList({ commit, state },index=0,len=50){
		return new Promise((resolve,reject)=>{
			ajaxFun('/Handler/CPManageSystem.ashx?cmd=getCPMMJUserList&pageindex='+index+'&len='+len).then(res=>{
				//console.log(res.rows)
				let userlist=res.rows
				if(userlist){
					//重新构造给vant选择器组件适用格式
					let newuserlist=userlist.map(n=>{
						return {
							text:n.username,
							value:n.userid
						}
					})
					newuserlist.unshift({
						value:'0',
						text:'全部'
					})
					
					commit('SET_ALLUSERLIST',newuserlist);
					resolve(newuserlist);
				}else{
					Toast('全部成员列表用户获取出错')
					reject(res)
				}
			}).catch(xhr=>{
				Toast('全部成员列表用户获取出错')
				reject(xhr)
			})
		})
	},
	//获取角色列表
	getroleList({ commit, state }){
		return new Promise((resolve,reject)=>{
			ajaxFun('/Handler/CPManageSystem.ashx?cmd=getCPRoles').then(res=>{
				//console.log(res.rows)
				let userlist=res.rows
				if(userlist){
					let newuserlist=userlist.map(n=>{
						return {
							text:n.rolename,
							value:n.roleid
						}
					})
					commit('SET_ROLELIST',newuserlist);
					resolve(newuserlist);
				}else{
					Toast('角色列表用户获取出错')
					reject(res)
				}
			}).catch(xhr=>{
				Toast('角色列表用户获取出错')
				reject(xhr)
			})
		})
	},
	//获取买家端中介列表
	getBuyerAgentList({ commit, state }){
		return new Promise((resolve,reject)=>{
			ajaxFun('/Handler/CPManageSystem.ashx?cmd=getCPAgentList').then(res=>{
				//console.log(res.rows)
				let userlist=res.rows
				if(userlist){
					let newuserlist=userlist.map(n=>{
						return {
							text:n.name,
							value:n.rid
						}
					})
					commit('SET_BUYERAGENTLIST',newuserlist);
					resolve(newuserlist);
				}else{
					Toast('角色列表用户获取出错')
					reject(res)
				}
			}).catch(xhr=>{
				Toast('角色列表用户获取出错')
				reject(xhr)
			})
		})
	}
}

export default({
	namespaced: true,
	state,
	mutations,
	actions
})