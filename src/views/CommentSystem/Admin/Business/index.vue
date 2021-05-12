<template>
	<div>
		<Header title="卖家客户管理">
			<div slot="search" class="icon-right">
				<van-icon class="iconfont-2x" name="search" @click="search" />
			</div>
		</Header>
		<ProductList @loadproductdata="loadproductdata" :productTotal="productTotal" :index='index'>
			<div class="goal-item account-item" v-for="(n,i) in productlist" :key="i">
				<div class="goal-item-top">
					<div class="goal-item-info">
						<span>名称:</span>
						<em>{{n.sjname}}</em>
					</div>
					<div class="goal-item-info">
						<span>卖家端:</span>
						<em>{{n.mjusername}}</em>
					</div>
					<div class="goal-item-info goal-item-info100">
						<span>联系人:</span>
						<em>{{n.SJLXR}}</em>
					</div>
					<div class="goal-item-info goal-item-info100">
						<span>联系方式:</span>
						<em>{{n.SJLXFS}}</em>
					</div>
				</div>
				<div class="account-item-bottom">
					<!-- <div class="account-item-operating" @click="edit(n.rid)">编辑</div> -->
					<div class="account-item-operating" @click="del(n.rid)">删除</div>
				</div>
			</div>
		</ProductList>
		<van-popup v-model="PopupShow" round position="bottom" safe-area-inset-bottom>
			<component :is="componentSrc" :fromorder.sync="fromorder"
			 @loadproductdata="loadproductdata"></component>
		</van-popup>
	</div>
</template>

<script>
	import {Popup,Dialog} from 'vant'
	import ProductList from '@/components/ProductList' //下拉加载上拉刷新
	export default({
		name:'MonthlyGoal',
		components:{
			[Dialog.Component.name]: Dialog.Component,
			[Popup.name]:Popup,
			ProductList
		},
		data(){
			return{
				fromorder:{
					username:'',
					contact:'',
					name:{
						text:'全部',
						value:'0'
					}
				},
				productTotal:false,  //是否没有产品可加载
				index:0,  
				productlist:[], //列表数据
				PopupShow:false,  //搜索弹框
				componentSrc:null ,//动态引入组件地址
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
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=getHZBusinessList",{
					params:{
						"pageSize":20,                         //页面大小
						"pageNum":this.index,   //页码
						"sjname":this.fromorder.username,
						"sjlxfs":this.fromorder.contact,
						"mjuserid":this.fromorder.name.value
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
					this.SearchCom=()=>import('@/components/Admin/Business/search.vue');
				}
				this.PopupShow=true;
				this.componentSrc=this.SearchCom
			},
			// 删除
			del(rid){
				Dialog.confirm({
				  title: '删除提示',
				  message: '确认要删除选中的商家账号吗',
				  beforeClose:async (action, done)=>{
					  if (action === 'confirm') {
						 // let list=this.productlist;
					    await this.axios.get("/Handler/CPManageSystem.ashx?cmd=delHZSJ&rids="+rid).then(res=>{
					     	if(res.data>0){
								this.$toast('删除成功');
								this.productlist.forEach((n,i)=>{
									if(n.rid==rid){
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
		}
	})
</script>

<style scoped>
	
</style>
