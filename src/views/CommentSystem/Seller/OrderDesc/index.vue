<template>
	<div>
		<Header title="订单列表" />
		<ProductList @loadproductdata="loadproductdata" :productTotal="productTotal" :index='index'>
			<div class="goal-item account-item" v-for="(n,i) in productlist" :key="i">
				<div class="goal-item-top">
					<div class="goal-item-info goal-item-info100">
						<span>订单号:</span>
						<em>{{n.orderno}}</em>
					</div>
					<div class="goal-item-info">
						<span>客单价:</span>
						<em>{{n.price}}</em>
					</div>
					<div class="goal-item-info">
						<span>订单状态:</span>
						<em>{{n.ztstr}}</em>
					</div>
					<div class="goal-item-info">
						<span>订单类别:</span>
						<em>{{n.ordertypestr}}</em>
					</div>
					<div class="goal-item-info">
						<span>接单人员:</span>
						<em>{{n.jduser}}</em>
					</div>
					<div class="goal-item-info">
						<span>购买单号:</span>
						<em>{{n.xdOrderno}}</em>
					</div>
					<div class="goal-item-info" v-if="n.plantfddate">
						<span>计划放单时间:</span>
						<em>{{n.plantfddate}}</em>
					</div>
				</div>
				<div class="account-item-bottom">
					<template v-if="n.zt=='0'">
						<div class="account-item-operating" @click="operating(n.orderno,'1')">退单</div>
						<div class="account-item-operating" @click="operating(n.orderno,'2')">放单</div>
						<div class="account-item-operating" @click="operating(n.orderno,'3')">放单时间</div>
					</template>
					<div class="account-item-operating"  v-if="n.zt=='1'" @click="operating(n.orderno,'4')">撤回放单</div>
					<div class="account-item-operating" @click="viewDetail(n.orderno)">详情</div>
					<div class="account-item-operating" @click="viewLog(n.orderno)">日志</div>
				</div>
			</div>
		</ProductList>
		<van-popup v-model="popup.toggle" round position="bottom">
			<component :is="publicCom" :orderno="popup.orderno" @loadproductdata="loadproductdata"></component>
		</van-popup>
	</div>
</template>

<script>
	import {mapGetters} from 'vuex'
	import {Popup,Dialog,Field} from 'vant'
	import ProductList from '@/components/ProductList' //下拉加载上拉刷新
	export default({
		name:'ClientOrder',
		components:{
			[Popup.name]:Popup,
			[Field.name]:Field,
			[Dialog.Component.name]: Dialog.Component,
			ProductList
		},
		computed:{
			...mapGetters([
				'account'
			])
		},
		data(){
			return{
				productTotal:false,  //是否没有产品可加载
				index:0,  
				productlist:[], //列表数据
				popup:{  //弹框
					toggle:false,
					orderno:''
				},  
				publicCom:null,  //公共组件
				backOrderCom:null,  //退单组件
				setDateCom:null,  //设置放单组件
				editCom:null,  //放单组件
				orderno:''  //产品订单号
			}
		},
		created(){
			if(this.account[1]!='50'){
				this.$back()
			}
			this.orderno=this.$route.query.orderno;  //获取地址栏传的订单号
		},
		methods:{
			// 获取列表数据
			loadproductdata(i=0){
				this.popup.toggle=false
				if(i!=0){
					this.index=0
				}
				this.loading=true;
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=getCPOrderDetailListByCpOrderno",{
					params:{
						"pageSize":20,                         //页面大小
						"pageNum":this.index,   //页码
						"orderno": this.orderno
					}
				}).then(res=>{//console.log(res)
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
			//查看日志
			viewLog(orderno){
				this.$router.push({path:'/log', query: { orderno: orderno }})
			},
			//查看详情
			viewDetail(orderno){
				this.$router.push({path:'/orderdetail', query: { orderno: orderno }})
			},
			operating(orderno,type){
				switch(type){
					case '1':  //退单
						if(this.backOrderCom==null){
							this.backOrderCom=()=>import('@/components/Seller/AddProduct/backOrder.vue');
						}
						this.publicCom=this.backOrderCom;
						break;
					case '2':  //放单或暂存
						if(this.editCom==null){
							this.editCom=()=>import('@/components/Seller/AddProduct/editOrder.vue');
						}
						this.publicCom=this.editCom;
						break;
					case '3':  //设置放单时间
						if(this.setDateCom==null){
							this.setDateCom=()=>import('@/components/Seller/AddProduct/setDate.vue');
						}
						this.publicCom=this.setDateCom;
						break;
					case '4':  //撤回放单
						this.axios.get("/Handler/CPManageSystem.ashx?cmd=cancelFDCPOrderDetail&orderno="+orderno).then(res=>{
							if(res.data>0){
								this.$toast('撤回成功')
								this.loadproductdata('1');
							}else{
								this.$toast('撤回失败')
							}
						}).catch(xhr=>{
							this.$toast('撤回失败')
							console.log(xhr);
						})
						break;
				}
				if(type!='4'){
					this.popup.orderno=orderno;
					this.popup.toggle=true;
				}
				
			}
		},
		//路由离开守卫
		beforeRouteLeave(to, from, next) {
			if(to.path=='/orderdetail' || to.path=='/log'){
				from.meta.keepAlive=true;
			}else{
				from.meta.keepAlive=false;
			}
		    next();
		  }
	})
</script>

<style>
</style>
