<template>
	<div>
		<Header title="测评订单管理"> 
			<van-icon class="iconfont-2x" slot="search" name="search" @click="seach" />
		</Header>
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
						<span>是否留评:</span>
						<em>
							<van-icon v-if="n.lpurl" class="iconfont-lg" style="padding-right: 10px;" name="peer-pay" @click="golpurl(n.lpurl)" />
							<van-icon v-if="n.lpimgurl" class="iconfont-lg" name="photo" @click="showImg(n.lpimgurl)"/>
						</em>
					</div>
					<div class="goal-item-info">
						<span>接单人员:</span>
						<em>{{n.jduser}}</em>
					</div>
					<div class="goal-item-info">
						<span>购买单号:</span>
						<em>{{n.xdOrderno}}</em>
					</div>
					<div class="goal-item-info">
						<span>购买金额:</span>
						<em>{{n.realprice}}</em>
					</div>
				</div>
				<div class="account-item-bottom">
					
					<div class="account-item-operating" @click="viewDetail(n.orderno)">详情</div>
					<div class="account-item-operating" @click="viewLog(n.orderno)">日志</div>
				</div>
			</div>
		</ProductList>
		<van-popup v-model="PopupShow" round position="bottom">
			<component :is="searchcom" :fromorder.sync="fromorder" @loadproductdata="loadproductdata"></component>
		</van-popup>
		
		<van-dialog v-model="dialogShow">
		  <img style="width: 100%;" :src="dialogImgSrc" />
		</van-dialog>
	</div>
</template>

<script>
	import { Card,Tag,Button,List,Popup,Dialog} from 'vant';
	import ProductList from '@/components/ProductList'  //下拉加载上拉刷新
	export default({
		name:'AllOrder',
		components:{
			[Card.name]:Card,
			[Tag.name]:Tag,
			[Button.name]:Button,
			[List.name]:List,
			[Popup.name]:Popup,
			[Dialog.Component.name]: Dialog.Component,
			ProductList
		},
		data(){
			return{
				//搜索内容
				fromorder:{
					OrderNo:'',
					orderType:{
						value:-1,
						text:'全部'
					},
					reviewStatus:{
						value:-1,
						text:'全部'
					},
					orderStaus:{
						value:'',
						text:'全部'
					},
					buyOrderNo:'',
					date1:'',
					date2:''
				},
				index:0,
				productlist:[],
				productTotal:false,  //是否没有产品可加载
				PopupShow:false,
				searchcom:null   ,//搜索组件
				dialogImgSrc:'',
				dialogShow:false
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
						"pageSize":20,                         //页面大小
						"pageNum":this.index,   //页码
						"orderno": this.fromorder.OrderNo,
						"iflp": this.fromorder.orderType.value,
						"state": this.fromorder.orderStaus.value,
						"xdorderno": this.fromorder.buyOrderNo,
						"sjs":this.fromorder.date1,
						"sje": this.fromorder.date2,
						"lpstate":this.fromorder.reviewStatus.value
					}
				}).then(res=>{
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
			//显示留评截图
			showImg(url){
				this.dialogShow=true;
				this.dialogImgSrc=url;
			},
			//打开留评链接
			golpurl(url){
				window.open(url);
			},
			seach(){
				this.PopupShow=true;
				if(this.searchcom==null){
					this.searchcom=()=>import('@/components/Seller/ToalOrder/search.vue')
				}
			}
		}
	})
</script>

<style scoped>
	.card{background-color: #fff;margin:5px auto;width: 96%;}
	.search-btn{margin: 20px 10px 10px;}
</style>
