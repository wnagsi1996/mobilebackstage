<template>
	<div>
		<Header title="测评订单管理"> 
			<van-icon class="iconfont-2x" slot="search" name="search" @click="search" />
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
						<van-icon class="iconfont-lg" v-if="n.fkimgurl" name="photo" @click="dialogShowImg(n.fkimgurl)" />
					</div>
					<div class="goal-item-info">
						<span>放单人员:</span>
						<em>{{n.mjusername}}</em>
					</div>
					<div class="goal-item-info">
						<span>订单类别:</span>
						<em>{{n.ordertypestr}}</em>
						<van-icon class="iconfont-lg" v-if="n.lpimgurl" name="photo" @click="dialogShowImg(n.lpimgurl)" />
						<van-icon class="iconfont-lg" v-if="n.lpurl" name="eye-o" @click="hankOpen(n.lpurl)" />
					</div>
					<div class="goal-item-info" v-if="n.zjname">
						<span>去向:</span>
						<em>{{n.zjname}}</em>
					</div>
					<div class="goal-item-info goal-item-info100">
						<span>购买单号:</span>
						<em>{{n.xdOrderno}}</em>
					</div>
				</div>
				<div class="account-item-bottom">
					<div class="account-item-operating" @click="viewDetail(n.orderno)">详情</div>
					<div class="account-item-operating" @click="viewLog(n.orderno)">日志</div>
				</div>
			</div>
		</ProductList>
		<van-popup v-model="PopupShow" round position="bottom">
			<component :is="publicCom" :fromorder.sync="fromorder" @loadproductdata="loadproductdata"></component>
		</van-popup>
		
		<van-dialog v-model="dialogShow">
		  <img style="width: 100%;" :src="dialogImgSrc" />
		</van-dialog>
	</div>
</template>

<script>
	import { Popup,Image as VanImage,Dialog } from 'vant';
	import ProductList from '@/components/ProductList'  //下拉加载上拉刷新
	export default({
		name:'AllOrder',
		components:{
			[Popup.name]:Popup,
			[VanImage.name]:VanImage,
			[Dialog.Component.name]: Dialog.Component,
			ProductList
		},
		data(){
			return{
				//搜索内容
				fromorder:{
					OrderNo:'',
					xdorderno:'',
					orderType:{
						value:'-1',
						text:'全部'
					},
					agent:{
						value:'-1',
						text:'全部'
					},
					orderStatus:{
						value:'2,3,4,5,8,9,12,13',
						text:'全部'
					},
					txtbuyer:'',
					date1:'',
					date2:''
				},
				index:0,
				productlist:[],
				productTotal:false,  //是否没有产品可加载
				PopupShow:false,
				publicCom:null,  //公共组件
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
						"pageSize": 20,                         //页面大小
						"pageNum":this.index,   //页码
						"orderno": this.fromorder.OrderNo,
						"xdorderno":this.fromorder.xdorderno,
						"zjID": this.fromorder.agent.value,
						"type": this.fromorder.orderType.value,
						"sjs":this.fromorder.date1,
						"sje": this.fromorder.date2,
						"buyer": this.fromorder.txtbuyer,
						"state":this.fromorder.orderStatus.value
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
			//搜索
			search(){
				this.PopupShow=true;
				if(this.searchcom==null){
					this.searchcom=()=>import('@/components/Buyer/AllOrder/search.vue')
				}
				this.publicCom=this.searchcom
			},
			//显示图片
			dialogShowImg(src){
				this.dialogShow=true;
				this.dialogImgSrc=src;
			},
			//打开新页面
			hankOpen(link){
				window.open(link)
			}
		}
	})
</script>

<style scoped>
	.card{background-color: #fff;margin:5px auto;width: 96%;}
	.search-btn{margin: 20px 10px 10px;}
</style>
