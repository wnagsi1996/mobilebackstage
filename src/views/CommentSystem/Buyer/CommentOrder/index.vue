<template>
	<div>
		<Header title="待留评订单"> 
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
						<span>下单价格:</span>
						<em>{{n.realproductdj_mj}}</em>
					</div>
					<div class="goal-item-info">
						<span>订单状态:</span>
						<em>{{n.ztstr}}</em>
					</div>
					<div class="goal-item-info">
						<span>放单人员:</span>
						<em>{{n.mjusername}}</em>
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
					<div class="account-item-operating" @click="hankReviewUrl(n.orderno)">上传留评</div>
					<div class="account-item-operating" @click="hankNotReview(n.orderno)">无法留评</div>
					<div class="account-item-operating" @click="viewDetail(n.orderno)">详情</div>
					<div class="account-item-operating" @click="viewLog(n.orderno)">日志</div>
				</div>
			</div>
		</ProductList>
		<van-popup v-model="PopupShow" round position="bottom">
			<component :is="publicCom" :fromorder.sync="fromorder" :orderno="orderno" @loadproductdata="loadproductdata"></component>
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
					agent:{
						value:-1,
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
				reviewcom:null  ,//上传留评链接
				orderno:''   //传给留评组件
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
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=getCPOrderDetailList_MJWLP",{
					params:{
						"pageSize": 20,                         //页面大小
						"pageNum":this.index,   //页码
						"orderno": this.fromorder.OrderNo,
						"xdorderno":this.fromorder.xdorderno,
						"zjID": this.fromorder.agent.value,
						"sjs":this.fromorder.date1,
						"sje": this.fromorder.date2,
						"buyer": this.fromorder.txtbuyer
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
			seach(){
				this.PopupShow=true;
				if(this.searchcom==null){
					this.searchcom=()=>import('@/components/Buyer/CommentOrder/search.vue')
				}
				this.publicCom=this.searchcom
			},
			//上传留评链接
			hankReviewUrl(orderno){
				this.PopupShow=true;
				if(this.reviewcom==null){
					this.reviewcom=()=>import('@/components/Buyer/CommentOrder/uploadComment.vue')
				}
				this.orderno=orderno;
				this.publicCom=this.reviewcom
			},
			//无法留评
			hankNotReview(orderno){
				this.axios.get('/Handler/CPManageSystem.ashx?cmd=doNotLPOrder&orderno='+orderno).then(res=>{
					//console.log(res)
					if(res.data.rescode==1){
						this.$toast('设置成功');
						//this.loadproductdata('1');
						this.productlist=this.productlist.filter(item=>item.orderno!=orderno)
					}else{
						this.$toast('设置失败');
					}
				}).catch(xhr=>{
					console.log(xhr)
					this.$toast('设置失败');
				})
			}
		}
	})
</script>

<style scoped>
	.card{background-color: #fff;margin:5px auto;width: 96%;}
	.search-btn{margin: 20px 10px 10px;}
</style>
