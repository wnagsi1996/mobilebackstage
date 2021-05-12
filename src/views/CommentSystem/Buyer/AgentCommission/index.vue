<template>
	<div>
		<Header title="中介佣金返款"> 
			<div slot="search" class="icon-right">
				<van-icon class="iconfont-2x" name="cash-back-record" @click="hankBatch" />
				<van-icon class="iconfont-2x" name="search" @click="seach" />
			</div>
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
						<span>订单类别:</span>
						<em>{{n.ordertypestr}}</em>
					</div>
					<div class="goal-item-info">
						<span>去向:</span>
						<em>{{n.zjname}}</em>
					</div>
					<div class="goal-item-info">
						<span>下单佣金:</span>
						<em v-if="n.iffkxdyj!='1'">{{n.xdyjfkztstr}}</em>
						<em v-else>{{n.xdyj}}</em>
					</div>
					<div class="goal-item-info">
						<span>留评佣金:</span>
						<em v-if="n.iffklpyj!='1'">{{n.lpyjfkztstr}}</em>
						<em v-else>{{n.lpyj}}</em>
					</div>
					<div class="goal-item-info goal-item-info100">
						<span>购买单号:</span>
						<em>{{n.xdOrderno}}</em>
					</div>
				</div>
				<div class="account-item-bottom">
					<template v-if="n.iffklpyj=='0' || n.iffklpyj=='3' || n.iffkxdyj=='0' || n.iffkxdyj=='3'" >
						<div class="account-item-operating" @click="hankCommission(n)">佣金返款</div>
					</template>
					<div class="account-item-operating" @click="viewDetail(n.orderno)">详情</div>
					<div class="account-item-operating" @click="viewLog(n.orderno)">日志</div>
				</div>
			</div>
		</ProductList>
		<van-popup v-model="PopupShow" round position="bottom">
			<component :is="publicCom" :fromorder.sync="fromorder" :orderInfo="orderInfo" @loadproductdata="loadproductdata"></component>
		</van-popup>
	</div>
</template>

<script>
	import { Button,Popup,Image as VanImage } from 'vant';
	import ProductList from '@/components/ProductList'  //下拉加载上拉刷新
	export default({
		name:'CommentOrder',
		components:{
			[Button.name]:Button,
			[Popup.name]:Popup,
			[VanImage.name]:VanImage,
			ProductList
		},
		data(){
			return{
				//搜索内容
				fromorder:{
					OrderNo:'',
					xdorderno:'',
					orderType:{
						text:'全部',
						value:'-1'
					},
					agent:{
						text:'全部',
						value:'-1'
					},
					txtbuyer:'',
					date1:'',
					date2:'',
					lpdate1:'',
					lpdate2:''
				},
				index:0,
				productlist:[],
				productTotal:false,  //是否没有产品可加载
				PopupShow:false,
				publicCom:null,  //公共组件
				searchcom:null   ,//搜索组件
				commissioncom:null  ,//返款组件
				batchcom:null,  //批量返款组件
				orderInfo:{}   //传给返款组件
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
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=getCPOrderDetailList_MMJ",{
					params:{
						"pageSize": 20,                         //页面大小
						"pageNum":this.index,   //页码
						"orderno": this.fromorder.OrderNo,
						"zjID": this.fromorder.agent.value,
						"type": this.fromorder.orderType.value,
						"xdsjs":this.fromorder.date1,
						"xdsje": this.fromorder.date2,
						"lpsjs":this.fromorder.lpdate1,
						"lpsje": this.fromorder.lpdate2,
						"buyer": this.fromorder.txtbuyer
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
					this.searchcom=()=>import('@/components/Buyer/AgentCommission/search.vue')
				}
				this.publicCom=this.searchcom
			},
			//返款组件
			hankCommission(orderInfo){
				if(this.commissioncom==null){
					this.commissioncom=()=>import('@/components/Buyer/AgentCommission/commission.vue')
				}
				this.publicCom=this.commissioncom
				this.orderInfo=orderInfo
				if(orderInfo.iffkxdyj=='0' || orderInfo.iffkxdyj=='3'){
					this.PopupShow=true;
				}else{
					if(orderInfo.lpzt=='1' && orderInfo.iffklpyj=='0' || orderInfo.iffklpyj=='3'){
						this.PopupShow=true;
					}else{
						this.$toast('该订单没有佣金可以返')
					}
				}
			},
			hankBatch(){
				this.PopupShow=true;
				if(this.batchcom==null){
					this.batchcom=()=>import('@/components/Buyer/AgentCommission/batch.vue')
				}
				this.publicCom=this.batchcom
			}
		}
	})
</script>

<style scoped>
	.card{background-color: #fff;margin:5px auto;width: 96%;}
	.search-btn{margin: 20px 10px 10px;}
</style>
