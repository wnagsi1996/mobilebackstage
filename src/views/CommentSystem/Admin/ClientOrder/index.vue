<template>
	<div>
		<Header title="客户订单管理">
			<div slot="search" class="icon-right">
				<van-icon class="iconfont-2x" name="search" @click="search" />
			</div>
		</Header>
		<ProductList @loadproductdata="loadproductdata" :productTotal="productTotal" :index='index'>
			<div class="goal-item account-item" v-for="(n,i) in productlist" :key="i">
				<div class="goal-item-top">
					<div class="goal-item-info goal-item-info100">
						<span>订单号:</span>
						<em>{{n.orderno}}</em>
					</div>
					<div class="goal-item-info goal-item-info100">
						<span>客户名称:</span>
						<em>{{n.hzsjname}}</em>
					</div>
					<div class="goal-item-info">
						<span>支付选择:</span>
						<em>{{n.payselstr}}</em>
					</div>
					<div class="goal-item-info">
						<span>收款方式:</span>
						<em>{{n.channelstr}}</em>
					</div>
					<div class="goal-item-info">
						<span>应收金额:</span>
						<em>{{n.yskmoney}}</em>
					</div>
					<div class="goal-item-info">
						<span>已收金额:</span>
						<em>{{n.sskmoney}}</em>
					</div>
					<div class="goal-item-info">
						<span>已返款金额:</span>
						<em>{{n.fkmoney}}</em>
					</div>
					<div class="goal-item-info">
						<span>当前利润:</span>
						<em>{{n | profit}}</em>
					</div>
					<div class="goal-item-info">
						<span>订单状态:</span>
						<em>{{n.ztstr}}</em>
					</div>
					<div class="goal-item-info goal-item-info100">
						<span>创建时间:</span>
						<em>{{n.cjsj}}</em>
					</div>
					<div class="goal-item-info">
						<span>卖家端:</span>
						<em>{{n.mjusername}}</em>
					</div>
				</div>
				<div class="account-item-bottom">
					<div class="account-item-operating" @click="goProduct(n.orderno)">产品管理</div>
					<div class="account-item-operating" @click="viewLog(n.orderno)">查看日志</div>
				</div>
			</div>
		</ProductList>
		<van-popup v-model="PopupShow" round position="bottom">
			<component :is="searchcom" :fromorder.sync="fromorder" @loadproductdata="loadproductdata"></component>
		</van-popup>
	</div>
</template>

<script>
	import {Popup} from 'vant'
	import ProductList from '@/components/ProductList' //下拉加载上拉刷新
	export default({
		name:'ClientOrder',
		components:{
			[Popup.name]:Popup,
			ProductList
		},
		data(){
			return{
				//搜索内容
				fromorder:{
					OrderNo:'',
					jduser:{
						text:'全部',
						value:0
					},
					name:'',
					orderStaus:{
						value:'-1',
						text:'全部'
					},
					date1:'',
					date2:'',
					profit:{
						value:'-1',
						text:'全部'
					}
				},
				productTotal:false,  //是否没有产品可加载
				index:0,  
				productlist:[], //列表数据
				PopupShow:false,  //搜索弹框
				searchcom:null ,//动态引入组件地址
			}
		},
		methods:{
			// 获取列表数据
			async loadproductdata(i=0){
				this.PopupShow=false
				if(i!=0){
					this.index=0
				}
				this.loading=true;
				await this.axios.get("/Handler/CPManageSystem.ashx?cmd=getGLproductList",{
					params:{
						"pageSize":20,                         //页面大小
						"pageNum":this.index,   //页码
						"ddh": this.fromorder.OrderNo,
						"hzsjname": this.fromorder.name,
						"zt": this.fromorder.orderStaus.value,
						"sjs":this.fromorder.date1,
						"sje": this.fromorder.date2,
						"mjuserid": this.fromorder.jduser.value,
						"iffs":this.fromorder.profit.value
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
			//查看日志
			viewLog(orderno){
				this.$router.push({path:'/log', query: { orderno: orderno }})
			},
			search(){
				if(this.searchcom==null){
					this.searchcom=()=>import('@/components/Admin/ClientOrder/search.vue')
				}
				this.PopupShow=true
			},
			goProduct(orderno){
				this.$router.push({path:'/addproduct', query: { orderno: orderno }})
			}
		},
		filters:{
			profit(val){
				return (val.sskmoney-val.fkmoney).toFixed(2)
			}
		}
	})
</script>

<style>
</style>
