//引入ajax函数
import { ajaxFun } from '@/assets/JS/ajax.js'
//import{Toast} from 'vant'

//本地存储
import {getStorage,setStorage,delStorage} from '@/assets/JS/LocalStorage.js'

 import router from '@/router/index.js'

// 村赤用户令牌和角色信息
const state ={
    token: getStorage("token"),
    roles: [] ,//角色ID
	account:[]  ,//角色信息
	menulist:[]  //原始目录
}

const mutations ={
    SET_TOKEN: (state,token) => {
        state.token = token;
    },
    SET_ROLES: (state,roles) => {
        state.roles = roles;
    },
	SET_ACCOUNT:(state,info)=>{
		state.account=info;
	},
	SET_MENULIST:(state,menulist)=>{
		state.menulist=menulist;
	}
};

const actions = {
    // 用户登录
    login({ commit }, userInfo) {
        return new Promise((resolve,reject) => {
			ajaxFun('/Handler/WebHandler.ashx?cmd=Login&VerifyCode=' + userInfo.VerifyCode + '&VerifyType=valiregister&lname=' + userInfo.lname + '&pass=' + userInfo.pass).then(res=>{
				//console.log(res)
				if (res.rescode == "0"){
					//console.log("登录成功")
					//Toast("登录成功")
					commit('SET_TOKEN',1);
					setStorage("token",'1');
					resolve(res);
				}else{
					//Toast(res.resdesc)
					//console.log(res.resdesc)
					reject(res.resdesc)
				}
			}).catch(xhr=>{console.log(xhr);
				 reject(xhr)
			})
        })
    },
    // 获取用户角色信息
    getInfo({ commit, state }){
		return new Promise((resolve,reject) => {
			ajaxFun('/Handler/ManageHandler.ashx?cmd=getMenuConfig&ifMobile=0').then(res=>{
				//console.log(res);
				let menuId=[];
				if(res!=''){
					//添加角色信息
					let info=[res[0].username,res[0].userroleid];
					commit('SET_ACCOUNT',info);
					let menu=res[0].menu;
					if(menu.length>0){
						commit('SET_MENULIST',menu)
						menu.forEach((item,index)=>{
							if(item.items){
								item.items.forEach((item1,index1)=>{
									menuId.push(item1.id);
								})
							}
						})
						menuId.splice(0, 0, 'm-'+res[0].userroleid);
						commit('SET_ROLES',menuId);
						 resolve({menuId});
					}else{
						reject('没有数据')
					}
				}else{
					reject('数据获取出错')
				}
			}).catch(xhr=>{console.log(xhr);
				 reject(xhr)
			})
		})
    },
	
    // 重置令牌
    resetToken({ commit }){
        return new Promise(resolve => {
			return new Promise((resolve,reject) => {
				ajaxFun('/Handler/WebHandler.ashx?cmd=logout').then(res=>{
					if (res.rescode == "0"){
						console.log("退出登录成功")
						commit('SET_TOKEN','')
						commit('SET_ROLES',[])
						commit('SET_ACCOUNT',[])
						commit('permission/DEL_ROUTES','',{root: true})
						delStorage('token');
						router.push({path:'/login'})
						resolve()
					}else{
						console.log(res.resdesc)
						reject('退出登录出错')
					}
				}).catch(xhr=>{console.log(xhr);
					 reject(xhr)
				})
			})
            
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}