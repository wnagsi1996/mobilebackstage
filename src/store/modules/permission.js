// 权限管理模块
import { asyncRoutes, constRouter } from '@/router'


/**
 * 递归过滤AsyncRoutes路由表
 * @routes 待过滤路由表,首次传入的就是AsyncRoutes
 * @roles 用户拥有角色
 * 
*/
export function filterAsyncRoutes(routes,roles){
    const res = []
   
    routes.forEach(route => {
        // 复制一份
        const tmp = { ...route};
       roles.menuId.forEach(item=>{
		   let routeID=tmp.meta.roles.toString();
		   if(routeID==item){
			   res.push(tmp)
		   }
	   })
        // 如果用户有访问权限则加入结果路由表
        
    })
    //console.log(res);
    return res;
}

const state = {
    routes: [], //完整路由表
    addRoutes: []  //用户可访问路由表
}

const mutations = {
    SET_ROUTES: (state, routes) => {
        // routes 用户可以访问的权限
        state.addRoutes = routes
        // 完整的路由表
        
        state.routes = constRouter.concat(routes)
       
    },
	DEL_ROUTES:(state,val)=>{
		state.addRoutes=[]
		state.routes=[]
	}
}

const actions = {
    generateRoutes({ commit }, roles) {
        return new Promise(resolve => {
            //console.log(roles);
            let accessedRoutes;
            // 用户是管理员则拥有完整访问权限
            // if(roles.includes('admin')){
            //     accessedRoutes = asyncRoutes || []
            // }else{
            //     // console.log(roles)
            //     //  否则需要根据用户角色做过滤处理 jerry
            //     accessedRoutes = filterAsyncRoutes(asyncRoutes,roles)
            // }
          accessedRoutes = filterAsyncRoutes(asyncRoutes,roles);
            commit('SET_ROUTES',accessedRoutes)
			
            resolve(accessedRoutes)
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}