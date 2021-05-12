<template>
	<div>
		<Header title="待测评订单"> 
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
						<span>放单人员:</span>
						<em>{{n.mjusername}}</em>
					</div>
					<div class="goal-item-info">
						<span>订单类别:</span>
						<em>{{n.ordertypestr}}</em>
					</div>
					<div class="goal-item-info" v-if="n.zjname">
						<span>去向:</span>
						<em>{{n.zjname}}</em>
					</div>
					<div class="goal-item-info">
						<span>店铺:</span>
						<em>{{n.StoreName}}</em>
					</div>
					<div class="goal-item-info goal-item-info100">
						<span>关键词:</span>
						<em>{{n.KeyWord}}</em>
					</div>
					<div class="goal-item-info goal-item-info100" v-if="n.xdyq">
						<span>下单要求:</span>
						<em>{{n.xdyq}}</em>
					</div>
				</div>
				<div class="account-item-bottom">
					<div class="account-item-operating" @click="cancelOrder(n)">取消接单</div>
					<div class="account-item-operating" @click="handOrderInfo(n.orderno)">测评信息</div>
					<template v-if="n.mmjzjid != '' && n.mmjzjid != '0'">
						<div class="account-item-operating" @click="cancelAgent(n.orderno)">取消绑定</div>
					</template>
					<template v-else>
						<div class="account-item-operating" @click="bind('0',n.orderno)">个人刷手</div>
						<div class="account-item-operating" @click="bind('1',n.orderno,n.rid)">中介</div>
					</template>
					
					<div class="account-item-operating" @click="viewDetail(n.orderno)">详情</div>
					<div class="account-item-operating" @click="viewLog(n.orderno)">日志</div>
					
				</div>
			</div>
		</ProductList>
		<van-popup v-model="PopupShow" round position="bottom">
			<component :is="publicCom" :fromorder.sync="fromorder" :bindInfo="bindInfo" :orderno="orderno" @loadproductdata="loadproductdata"></component>
		</van-popup>
	</div>
</template>

<script>
	import { Button,Popup,Image as VanImage } from 'vant';
	import ProductList from '@/components/ProductList'  //下拉加载上拉刷新
	export default({
		name:'EvaluationOrder',
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
						value:-1,
						text:'全部'
					},
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
				bindInfo:{},  //绑定使用，个人0，中介1
				productTotal:false,  //是否没有产品可加载
				PopupShow:false,
				publicCom:null,  //公共组件
				searchcom:null   ,//搜索组件
				bindcom:null   ,//绑定组件
				uploadOrdercom:null ,//上传订单信息组件
				orderno:'' //上传订单信息传
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
						"state":'2,5'
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
					this.searchcom=()=>import('@/components/Buyer/EvaluationOrder/search.vue')
				}
				this.publicCom=this.searchcom
			},
			//取消接单
			cancelOrder(row){
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=cancelJDCPOrderDetail&orderno="+row.orderno).then(res=>{
					if(res.data.rescode>0){
						this.$toast('取消成功');
						this.productlist=this.productlist.filter((value,index)=>value.orderno!=row.orderno)
					}else{
						this.$toast('取消失败');
					}
				}).catch(xhr=>{
					this.$toast('取消失败');
				})
			},
			//取消中介绑定
			cancelAgent(orderno){
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=deleteCPOrderDetailAgent&orderno="+orderno).then(res=>{
					this.$toast(res.data.resdesc)
					if(res.data.rescode>0){
						this.loadproductdata('1');
					}
				}).catch(xhr=>{
					console.log(xhr);
				})
			},
			//绑定中介‘1’/个人‘0’
			bind(id,orderno,rid=''){
				if(this.bindcom==null){
					this.bindcom=()=>import('@/components/Buyer/EvaluationOrder/bind.vue')
				}
				this.publicCom=this.bindcom;
				this.bindInfo={};
				this.bindInfo.id=id;
				this.bindInfo.orderno=orderno;
				this.bindInfo.rid=rid;
				this.PopupShow=true;
			},
			//上传订单信息
			handOrderInfo(orderno){
				if(this.uploadOrdercom==null){
					this.uploadOrdercom=()=>import('@/components/Buyer/EvaluationOrder/uploadOrderInfo.vue')
				}
				this.publicCom=this.uploadOrdercom;
				this.orderno=orderno;
				this.PopupShow=true;
			}
		}
	})
</script>

<style scoped>
	.card{background-color: #fff;margin:5px auto;width: 96%;}
	.search-btn{margin: 20px 10px 10px;}
</style>
