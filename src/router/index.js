import Vue from 'vue'
import VueRouter from 'vue-router'

const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}


Vue.use(VueRouter)
 export const constRouter = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login'),
	meta:{
		keepAlive:false
	}
  },
  {
    path: '/orderdetail',
    name: 'OrderDetail',
    component: () => import('@/views/CommentSystem/OrderDetail'),
	meta:{
		keepAlive:false
	}
  },
  {
    path: '/log',
    name: 'Log',
    component: () => import('@/views/CommentSystem/Log'),
	meta:{
		keepAlive:false
	}
  },
  {
    path: '/orderdesc',  //卖家端子订单页面，后台没返回相关页面ID，前台增加自己在页面做判断访问权限
    component: () => import('@/views/CommentSystem/Seller/OrderDesc'),
    name: 'orderDesc',
	meta:{
		keepAlive:false
	}
  },
  {
    path: '/profitlog',  //利润管理日志页面，后台没返回相关页面ID，前台增加自己在页面做判断访问权限
    component: () => import('@/views/CommentSystem/FinancialAffairs/ProfitLog'),
    name: 'profitlog',
  	meta:{
  		keepAlive:false
  	}
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    name: '404',
    meta: {
      title: "404",
      icon: 'el-icon-s-home',
    }
  }
]

// 动态路由 communication
export const asyncRoutes = [
	{
	  path: '/',  //卖家端首页
	  component: () => import('@/views/CommentSystem/Seller/Home'),
	  name: '首页',
	  meta: {
	    title: "首页",
	    icon: 'el-icon-s-home',
	    roles: ['m-50'],
		keepAlive:true
	  }
	},
	{
	  path: '/',  //买家端首页
	  component: () => import('@/views/CommentSystem/Buyer/Home'),
	  name: '首页',
	  meta: {
	    title: "首页",
	    icon: 'el-icon-s-home',
	    roles: ['m-51'],
		keepAlive:true
	  }
	},
	{
	  path: '/',  //管理员首页
	  component: () => import('@/views/CommentSystem/Admin/Home'),
	  name: '首页',
	  meta: {
	    title: "首页",
	    icon: 'el-icon-s-home',
	    roles: ['m-53'],
		keepAlive:true
	  }
	},
	{
	  path: '/',  //财务首页
	  component: () => import('@/views/CommentSystem/FinancialAffairs/Home'),
	  name: '首页',
	  meta: {
	    title: "首页",
	    icon: 'el-icon-s-home',
	    roles: ['m-52'],
		keepAlive:true
	  }
	},
	{
	  path: '/allorder',
	  component: () => import('@/views/CommentSystem/Admin/AllOrder'),
	  name: '测评订单管理',
	  meta: {
	    title: "测评订单管理",
	    icon: 'el-icon-s-home',
	    roles: ['m11818'],
		keepAlive:true
	  }
	},
	{
	  path: '/accountinfo',
	  component: () => import('@/views/CommentSystem/Admin/AccountInfo'),
	  name: '员工账号信息管理',
	  meta: {
	    title: "员工账号信息管理",
	    icon: 'el-icon-s-home',
	    roles: ['m1191'],
		keepAlive:true
	  }
	},
	{
	  path: '/monthlygoal',
	  component: () => import('@/views/CommentSystem/Admin/MonthlyGoal'),
	  name: '员工月份目标管理',
	  meta: {
	    title: "员工月份目标管理",
	    icon: 'el-icon-s-home',
	    roles: ['m11822'],
		keepAlive:true
	  }
	},
	{
	  path: '/clientorder',
	  component: () => import('@/views/CommentSystem/Admin/ClientOrder'),
	  name: '客户订单管理',
	  meta: {
	    title: "客户订单管理",
	    icon: 'el-icon-s-home',
	    roles: ['m11817'],
		keepAlive:true
	  }
	},
	{
	  path: '/business',
	  component: () => import('@/views/CommentSystem/Admin/Business'),
	  name: '卖家客户管理',
	  meta: {
	    title: "卖家客户管理",
	    icon: 'el-icon-s-home',
	    roles: ['m11816'],
		keepAlive:true
	  }
	},
	{
	  path: '/financialaudittrail',
	  component: () => import('@/views/CommentSystem/Admin/FinancialAuditTrail'),
	  name: '财务处理进度',
	  meta: {
	    title: "财务处理进度",
	    icon: 'el-icon-s-home',
	    roles: ['m11819'],
		keepAlive:true
	  }
	},
	{
	  path: '/syslogmanage',
	  component: () => import('@/views/CommentSystem/Admin/SysLogManage'),
	  name: '操作日志查询',
	  meta: {
	    title: "操作日志查询",
	    icon: 'el-icon-s-home',
	    roles: ['m11820'],
		keepAlive:true
	  }
	},
	{
	  path: '/intermediarycommissionstorage',
	  component: () => import('@/views/CommentSystem/Admin/Intermediarycommissionstorage'),
	  name: '中介佣金挂账管理',
	  meta: {
	    title: "中介佣金挂账管理",
	    icon: 'el-icon-s-home',
	    roles: ['m11828']
	  }
	},
	{
	    path: '/monthsummary',
	    component: () => import('@/views/CommentSystem/FinancialAffairs/MonthSummary'),
	    name: '月份财务报表',
	    meta: {
	      title: "月份财务报表",
	      icon: 'el-icon-s-home',
	      roles: ['m11824'],
		  keepAlive:true
	    }
	},
	{
	    path: '/profit',
	    component: () => import('@/views/CommentSystem/FinancialAffairs/Profit'),
	    name: '利润管理',
	    meta: {
	      title: "利润管理",
	      icon: 'el-icon-s-home',
	      roles: ['m11830'],
		  keepAlive:true
	    }
	},
	// {
	//     path: '/adminmonthsummary',
	//     component: () => import('@/views/CommentSystem/Admin/MonthSummary'),
	//     name: '月份数据汇总',
	//     meta: {
	//       title: "月份数据汇总",
	//       icon: 'el-icon-s-home',
	//       roles: ['m11825']
	//     }
	// },
	{
	  path: '/audit',
	  component: () => import('@/views/CommentSystem/FinancialAffairs/Audit'),
	  name: '收入审核',
	  meta: {
	    title: "收入审核",
	    icon: 'el-icon-s-home',
	    roles: ['m1182'],
		keepAlive:true
	  }
	},
	{
	  path: '/expenditure',
	  component: () => import('@/views/CommentSystem/FinancialAffairs/Expenditure'),
	  name: '支出处理',
	  meta: {
	    title: "支出处理",
	    icon: 'el-icon-s-home',
	    roles: ['m1183'],
		keepAlive:true
	  }
	},
	{
	  path: '/lossexpenses',
	  component: () => import('@/views/CommentSystem/FinancialAffairs/Lossexpenses'),
	  name: '员工财务损失管理',
	  meta: {
	    title: "员工财务损失管理",
	    icon: 'el-icon-s-home',
	    roles: ['m11826'],
		keepAlive:true
	  }
	},
	{
	  path: '/monthlyexpenditure',
	  component: () => import('@/views/CommentSystem/FinancialAffairs/MonthlyExpenditure'),
	  name: '月份支出管理',
	  meta: {
	    title: "月份支出管理",
	    icon: 'el-icon-s-home',
	    roles: ['m11823'],
		keepAlive:true
	  },
	},
	  {
	    path: '/addproduct',
	    component: () => import('@/views/CommentSystem/Seller/AddProduct'),
	    name: '测评产品管理',
	    meta: {
	      title: "测评产品管理",
	      icon: 'el-icon-s-home',
	      roles: ['m1181'],
		  keepAlive:false
	    }
	  },
	  {
	    path: '/clientorder',
	    component: () => import('@/views/CommentSystem/Seller/ClientOrder'),
	    name: '客户订单管理',
	    meta: {
	      title: "客户订单管理",
	      icon: 'el-icon-s-home',
	      roles: ['m1180'],
		  keepAlive:true
	    }
	  },
	  {
	    path: '/sellerlist',
	    component: () => import('@/views/CommentSystem/Seller/SellerList'),
	    name: '卖家客户管理',
	    meta: {
	      title: "卖家客户管理",
	      icon: 'el-icon-s-home',
	      roles: ['m11811'],
		  keepAlive:true
	    }
	  },
	  {
	    path: '/waitingorder',
	    component: () => import('@/views/CommentSystem/Seller/WaitingOrder'),
	    name: '等待放单库',
	    meta: {
	      title: "等待放单库",
	      icon: 'el-icon-s-home',
	      roles: ['m1186'],
		  keepAlive:true
	    }
	  },
	  {
	    path: '/revieworder',
	    component: () => import('@/views/CommentSystem/Seller/ReviewOrder'),
	    name: '单号待审核',
	    meta: {
	      title: "单号待审核",
	      icon: 'el-icon-s-home',
	      roles: ['m1189'],
		  keepAlive:true
	    }
	  },
	  {
	    path: '/commentnotification',
	    component: () => import('@/views/CommentSystem/Seller/CommentNotification'),
	    name: '最新留评单',
	    meta: {
	      title: "最新留评单",
	      icon: 'el-icon-s-home',
	      roles: ['m11814'],
		  keepAlive:true
	    }
	  },
	  {
	    path: '/totalorder',
	    component: () => import('@/views/CommentSystem/Seller/TotalOrder'),
	    name: '历史测评订单管理',
	    meta: {
	      title: "历史测评订单管理",
	      icon: 'el-icon-s-home',
	      roles: ['m1184'],
		  keepAlive:true
	    }
	  },
	  {
	    path: '/financialaudittrail',
	    component: () => import('@/views/CommentSystem/Seller/FinancialAuditTrail'),
	    name: '财务处理进度查询',
	    meta: {
	      title: "财务处理进度查询",
	      icon: 'el-icon-s-home',
	      roles: ['m11815'],
		  keepAlive:true
	    }
	  },
	  {
	    path: '/receiveorder',
	    component: () => import('@/views/CommentSystem/Buyer/ReceiveOrder'),
	    name: '等待接单库',
	    meta: {
	      title: "等待接单库",
	      icon: 'el-icon-s-home',
	      roles: ['m1185'],
		  keepAlive:true
	    }
	  },
	  {
	    path: '/evaluationorder',
	    component: () => import('@/views/CommentSystem/Buyer/EvaluationOrder'),
	    name: '待测评订单',
	    meta: {
	      title: "待测评订单",
	      icon: 'el-icon-s-home',
	      roles: ['m11812'],
		  keepAlive:true
	    }
	  },
	  {
	    path: '/orderreview',
	    component: () => import('@/views/CommentSystem/Buyer/ReviewOrder'),
	    name: '待审核订单',
	    meta: {
	      title: "待审核订单",
	      icon: 'el-icon-s-home',
	      roles: ['m11821'],
		  keepAlive:true
	    }
	  },
	  {
	    path: '/rebateorder',
	    component: () => import('@/views/CommentSystem/Buyer/RebateOrder'),
	    name: '待返款订单',
	    meta: {
	      title: "待返款订单",
	      icon: 'el-icon-s-home',
	      roles: ['m11810'],
		  keepAlive:true
	    }
	  },
	  {
	    path: '/allorder',
	    component: () => import('@/views/CommentSystem/Buyer/AllOrder'),
	    name: '测评订单管理',
	    meta: {
	      title: "测评订单管理",
	      icon: 'el-icon-s-home',
	      roles: ['m1187'],
		  keepAlive:true
	    }
	  },
	  {
	    path: '/intermediarycommissionstorage',
	    component: () => import('@/views/CommentSystem/Buyer/Intermediarycommissionstorage'),
	    name: '中介佣金挂账',
	    meta: {
	      title: "中介佣金挂账",
	      icon: 'el-icon-s-home',
	      roles: ['m11827'],
		  keepAlive:true
	    }
	  },
	  {
	    path: '/modifypassword',
	    component: () => import('@/views/ModifyPass'),
	    name: '密码修改',
	    meta: {
	      title: "密码修改",
	      icon: 'el-icon-s-home',
	      roles: ['m20001'],
		  keepAlive:false
	    }
	  },
	  {
	    path: '/agentcommission',
	    component: () => import('@/views/CommentSystem/Buyer/AgentCommission'),
	    name: '中介佣金返款',
	    meta: {
	      title: "中介佣金返款",
	      icon: 'el-icon-s-home',
	      roles: ['m11813'],
		  keepAlive:true
	    }
	  },
	  {
	    path: '/commentorder',
	    component: () => import('@/views/CommentSystem/Buyer/CommentOrder'),
	    name: '待留评订单',
	    meta: {
	      title: "待留评订单",
	      icon: 'el-icon-s-home',
	      roles: ['m11813'],
		  keepAlive:true
	    }
	  },
	  {
	    path: '/intermediary',
	    component: () => import('@/views/CommentSystem/Intermediary'),
	    name: '测评中介管理',
	    meta: {
	      title: "测评中介管理",
	      icon: 'el-icon-s-home',
	      roles: ['m1188'],
		  keepAlive:true
	    }
	  }
]

const router = new VueRouter({
  mode: 'history',//history
  base: 'mmain',
  routes: constRouter
})

router.afterEach((to, from) => {
  let url=window.location.href;
  if(url.endsWith('/')){
	  url=url.substr(0, url.length - 1);
	  window.history.pushState(null, null, url);
  }
  
})

export default router