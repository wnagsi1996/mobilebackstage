<template>
	<div>
		<Header title="员工账号管理">
			<div slot="search" class="icon-right">
				<van-icon class="iconfont-2x" name="search" @click="search" />
				<van-icon class="iconfont-2x" name="plus" @click="addOrEdit()"/>
			</div>
		</Header>
		<ProductList @loadproductdata="loadproductdata" :productTotal="productTotal" :index='index'>
			<div class="goal-item account-item" v-for="(n,i) in productlist" :key="i">
				<div class="goal-item-top">
					<div class="goal-item-info">
						<span>姓名:</span>
						<em>{{n.uname}}</em>
					</div>
					<div class="goal-item-info">
						<span>登录名:</span>
						<em>{{n.udlname}}</em>
					</div>
					<div class="goal-item-info">
						<span>状态:</span>
						<em>{{n.zt | ztFilter}}</em>
					</div>
					<div class="goal-item-info">
						<span>类别:</span>
						<em>{{n.jsid | typeMethod}}</em>
					</div>
				</div>
				<div class="account-item-bottom">
					<div class="account-item-operating" @click="addOrEdit(n.uid)">编辑</div>
					<div class="account-item-operating" @click="resetPass(n.uid)">重置密码</div>
					<div class="account-item-operating" @click="activation(n.uid)">{{n.zt | ztFilter1}}</div>
					<div class="account-item-operating" @click="del(n.uid)">删除</div>
				</div>
			</div>
		</ProductList>
		<van-popup v-model="PopupShow" round position="bottom" safe-area-inset-bottom>
			<component :is="componentSrc" :rid.sync="userrid" :fromAccount.sync="fromAccount"
			 @loadproductdata="loadproductdata"></component>
		</van-popup>
	</div>
</template>

<script>
	import {Popup,Dialog} from 'vant'
	import ProductList from '@/components/ProductList' //下拉加载上拉刷新
	import {cmdEncrypt} from "@/assets/JS/RSAz.js"
	export default({
		name:'MonthlyGoal',
		components:{
			[Dialog.Component.name]: Dialog.Component,
			[Popup.name]:Popup,
			ProductList
		},
		data(){
			return{
				fromAccount:{
					name:'',
					user:{
						text:'全部',
						value:''
					},
				},
				productTotal:false,  //是否没有产品可加载
				index:0,  
				productlist:[], //列表数据
				PopupShow:false,  //搜索弹框
				userMonthAims:{},  //编辑月份目标传的数据
				componentSrc:null ,//动态引入组件地址
				AddAimsCom:null,   //添加OR编辑的组件
				SearchCom:null   ,//搜索组件
				userrid:''
			}
		},
		methods:{
			// 获取列表数据
			loadproductdata(i=0){
				this.PopupShow=false
				if(i!=0){
					this.index=0
				}
				this.loading=true;
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=getCPUserList",{
					params:{
						"pageSize":20,                         //页面大小
						"pageNum":this.index,   //页码
						"uname":this.fromAccount.name,
						"ujs":this.fromAccount.user.value
					}
				}).then(res=>{
					if(i!=0){
						this.productlist=[];
					}
					this.index++;
					this.productlist = this.productlist.concat(res.data.rows);
					if(res.data.rows.length==0){
						this.productTotal=true
					}
				}).catch(xhr=>{
					console.log(xhr);
				})
			},
			//搜索
			search(){
				if(this.SearchCom==null){
					this.SearchCom=()=>import('@/components/Admin/AccountInfo/search.vue');
				}
				this.PopupShow=true;
				this.componentSrc=this.SearchCom
			},
			//添加或编辑用户信息
			addOrEdit(rid=''){
				if(this.AddAimsCom==null){
					this.AddAimsCom=()=>import('@/components/Admin/AccountInfo/add.vue');
				}
				this.PopupShow=true;
				this.userrid=rid;
				this.componentSrc=this.AddAimsCom
			},
			// 重置密码
			resetPass(uid){
				let newpass;
				Dialog.confirm({
				  title: '重置提示',
				  message: '您确定要重置该员工账号登陆密码吗',
				  beforeClose:async (action, done)=>{
					  if (action === 'confirm') {
					      newpass = Math.floor(Math.random() * 999999) + "";
					      let strPublicKeyExponent,strPublicKeyModulus,pass
						  //加密
					      await this.axios.get('/Handler/RSAKey.ashx?cmd=CreateRSAKey').then((res)=>{
					      	if(res.data.rescode==0){
					      		strPublicKeyExponent=res.data.strPublicKeyExponent
					      		strPublicKeyModulus=res.data.strPublicKeyModulus;
					      		pass = cmdEncrypt(newpass, strPublicKeyExponent, strPublicKeyModulus);
					      		
					      	}
					      })
						  // 重置
						  await this.axios.get("/Handler/CPManageSystem.ashx?cmd=modifyCPUserPassword&userid="+uid+"&newpass="+pass).then(res=>{
						  	if(res.data.rescode>0){	
								done();
						  	}else{
								newpass='';
								this.$toast('重置密码失败')
						  	}
						  }).catch(xhr=>{
							  newpass='';
						  	  this.$toast('重置密码失败')
						  })
					    } else {
							newpass='';
					        done();
					    }
						
						if(newpass!=''){
							Dialog.alert({
							  title: '重置成功',
							  message: `新密码:${newpass}`,
							}).then(() => {
							  // on close
							});
						}
				  }
				});
			},
			//激活
			activation(uid){
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=JhCPUser&userid="+uid).then(res=>{
					if(res.data>0){
						this.$toast('切换成功');
						this.productlist.forEach((n,i)=>{
							if(n.uid==uid){
								n.zt==1?this.productlist[i].zt=0:this.productlist[i].zt=1
							}
						})
					}
				}).catch(xhr=>{
					this.$toast('切换失败')
				})
			},
			//删除
			del(uid){
				Dialog.confirm({
				  title: '删除提示',
				  message: '确认要删除选中的员工账号吗',
				  beforeClose:async (action, done)=>{
					  if (action === 'confirm') {
						 // let list=this.productlist;
					    await this.axios.get("/Handler/CPManageSystem.ashx?cmd=delCPUsers&uIDs="+uid).then(res=>{
					     	if(res.data>0){
								this.$toast('删除成功');
								this.productlist.forEach((n,i)=>{
									if(n.uid==uid){
										this.productlist.splice(i,1);
									}
								})
					     	}else{
								this.$toast('删除失败,可能原因：该员工已操作过相关订单信息将无法删除!')
					     	}
					     }).catch(xhr=>{console.log(xhr)
							 this.$toast('删除失败')
					     });
						 done();
						 //this.productlist=list;
					  }else{
						  done();
					  }
				  }
				})
			}
		},
		filters:{
			//类别格式化
			typeMethod(val){
				if (val == 50)
					 return "卖家端";
				else if(val==51)
					return "买家端"
				else
					return "财务"
			},
			//状态格式化（列表）
			ztFilter(val){
				if (val == 0)
					 return "禁用";
				 else
					return "启用"
			},
			//状态格式化（按钮）
			ztFilter1(val){
				if (val == 1)
					 return "禁用";
				 else
					return "启用"
			}
		}
	})
</script>

<style scoped>
	
</style>
