<template>
	<div>
		<Header title="等待接单库"> 
			<van-icon class="iconfont-2x" slot="search" name="search" @click="seach" />
		</Header>
		<ProductList @loadproductdata="loadproductdata" :productTotal="productTotal" :index='index'>
			<div class="goal-item account-item" v-for="(n,i) in productlist" :key="i">
				<div class="goal-item-top">
					<div class="goal-top">
						<div class="goal-top-img">
							<van-image :src="n.ProductImgUrl" />
						</div>
						<div class="goal-top-right van-ellipsis">
							<div class="goal-item-info goal-item-info100">
								<span>标题:</span>
								<em class="van-ellipsis">{{n.ProductTitle}}</em>
							</div>
							<div class="goal-item-info goal-item-info100">
								<span>订单号:</span>
								<em>{{n.orderno}}</em>
							</div>
						</div>
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
						<span>店铺:</span>
						<em>{{n.StoreName}}</em>
					</div>
					<div class="goal-item-info goal-item-info100">
						<span>关键词:</span>
						<em>{{n.KeyWord}}</em>
					</div>
					<div class="goal-item-info">
						<span>是否留评:</span>
						<em>{{n.ordertypestr}}</em>
					</div>
					<div class="goal-item-info">
						<span>ASIN:</span>
						<em>{{n.asin}}</em>
					</div>
				</div>
				<div class="account-item-bottom">
					<div class="account-item-operating" @click="viewDetail(n.orderno)">详情</div>
					<div class="account-item-operating" @click="viewLog(n.orderno)">日志</div>
					<div class="account-item-operating" @click="review(n)">接单</div>
				</div>
			</div>
		</ProductList>
		<van-popup v-model="PopupShow" round position="bottom">
			<component :is="publicCom" :fromorder.sync="fromorder" :reviewObj="reviewOrder" @loadproductdata="loadproductdata"></component>
		</van-popup>
	</div>
</template>

<script>
	import { Button,Popup,Image as VanImage,Switch } from 'vant';
	import ProductList from '@/components/ProductList'  //下拉加载上拉刷新
	export default({
		name:'Receive',
		components:{
			[Button.name]:Button,
			[Popup.name]:Popup,
			[Switch.name]:Switch,
			[VanImage.name]:VanImage,
			ProductList
		},
		data(){
			return{
				//搜索内容
				fromorder:{
					OrderNo:'',
					title:'',
					asin:'',
					orderType:{
						value:-1,
						text:'全部'
					},
					date1:'',
					date2:''
				},
				index:0,
				productlist:[],
				productTotal:false,  //是否没有产品可加载
				PopupShow:false,
				publicCom:null,  //公共组件
				searchcom:null   ,//搜索组件
				reviewcom:null   ,//审核组件
				reviewOrder:{}
			}
		},
		created() {
			
		},
		mounted() {
			
		},
		methods:{
			// 获取列表数据
			loadproductdata(i=0){
				this.PopupShow=false
				if(i!=0){
					this.index=0
				}
				this.loading=true;
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=getCPOrderDetailList",{
					params:{
						"pageSize": 20,                         //页面大小
						"pageNum":this.index,   //页码
						"orderno": this.fromorder.OrderNo,
						"iflp": this.fromorder.orderType.value,
						"ptitle": this.fromorder.title,
						"sjs":this.fromorder.date1,
						"sje": this.fromorder.date2,
						"asin": this.fromorder.asin,
						"state":"1"
					}
				}).then(res=>{//console.log(res)
					//this.pagination.total=res.data.results;
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
			//查看详情
			viewDetail(orderno){
				this.$router.push({path:'/orderdetail', query: { orderno: orderno }})
			},
			//查看日志
			viewLog(orderno){
				this.$router.push({path:'/log', query: { orderno: orderno }})
			},
			//搜索
			seach(){
				this.PopupShow=true;
				if(this.searchcom==null){
					this.searchcom=()=>import('@/components/Buyer/ReceiveOrder/search.vue')
				}
				this.publicCom=this.searchcom
			},
			//接单
			review(item){
				if(item.zt=='1'){
					this.axios.get("/Handler/CPManageSystem.ashx?cmd=jdCPOrderDetail&orderno="+item.orderno).then(res=>{console.log(res)
						if(res.data.rescode>0){
							this.$toast('接单成功');
							this.productlist=this.productlist.filter((value,index)=>value.orderno!=item.orderno)
						}else{
							this.$toast('接单失败')
						}
					}).catch(xhr=>{
						this.$toast('接单失败')
					})
				}else{
					this.axios.get("/Handler/CPManageSystem.ashx?cmd=cancelJDCPOrderDetail&orderno="+item.orderno).then(res=>{
						if(res.data.rescode>0){
							this.$toast('取消成功');
						}else{
							this.$toast('取消失败');
						}
					}).catch(xhr=>{
						this.$toast('取消失败');
					})
				}
			}
			
		}
	})
</script>

<style scoped>
	.card{background-color: #fff;margin:5px auto;width: 96%;}
	.search-btn{margin: 20px 10px 10px;}
</style>
