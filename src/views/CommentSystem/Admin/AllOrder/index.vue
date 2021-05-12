<template>
	<div>
		<Header title="测评订单管理"> 
			<van-icon class="iconfont-2x" slot="search" name="search" @click="seach" />
		</Header>
		<ProductList @loadproductdata="loadproductdata" :productTotal="productTotal" :index='index'>
			<van-card v-for="(item) in productlist" :key="item.rid"
			  :tag="item.ordertypestr"
			  :price="item.price"
			  :desc="item.asin"
			  :title="item.orderno"
			  :thumb="item.ProductImgUrl"
			  currency="$"
			  class="card"
			>
				<template #tags>
					<van-tag plain type="danger">{{item.ztstr}}</van-tag>
					<van-tag plain type="danger">{{item.mjusername}}</van-tag>
					<van-tag plain type="danger" v-if="item.jduser">{{item.jduser}}</van-tag>
				</template>
				<template #footer>
				    <van-button v-if="item.zt==='4' || item.zt==='12'" size="mini" @click="modifystatus(item)">修改状态</van-button>
				    <van-button size="mini" @click="viewDetail(item.orderno)">详情</van-button>
				    <van-button size="mini" @click="viewLog(item.orderno)">日志</van-button>
				  </template>
			</van-card>
		</ProductList>
		<van-popup v-model="PopupShow" round position="bottom">
			<component :is="searchcom" :fromorder.sync="fromorder" @loadproductdata="loadproductdata"></component>
		</van-popup>
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
					fduser:{
						value:0,
						text:'全部'
					},
					jduser:{
						value:0,
						text:'全部'
					},
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
				searchcom:null   //搜索组件
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
						"mjuserid": this.fromorder.jduser.value,
						"mmjuserid": this.fromorder.fduser.value,
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
			//修改订单状态
			modifystatus(item){
				Dialog.confirm({
				  title: '提示',
				  message: '您确认要把该订单状态改成【已接单】状态？',
				  beforeClose:(action, done) =>{
					  if (action === 'confirm') {
						  this.axios.get('/Handler/CPManageSystem.ashx?cmd=resetCPOrderDetailState&orderno=' + item.orderno).then(res=>{
						  	if(res.data=="0"){
						  		this.$toast('修改失败')
						  	}else{
						  		this.$toast('修改成功')
						  		this.loadproductdata(1);
						  	}
						  }).catch(xhr=>{
						  	this.$toast('修改失败')
						  })
					  }else{
						  done()
					  }
				  }
				})
			},
			seach(){
				this.PopupShow=true;
				if(this.searchcom==null){
					this.searchcom=()=>import('@/components/Admin/Allorder/search.vue')
				}
			}
		}
	})
</script>

<style scoped>
	.card{background-color: #fff;margin:5px auto;width: 96%;}
	.search-btn{margin: 20px 10px 10px;}
</style>
