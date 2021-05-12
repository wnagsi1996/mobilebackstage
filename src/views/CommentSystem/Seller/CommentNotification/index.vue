<template>
	<div>
		<Header title="最新留评订单"> 
			<van-icon class="iconfont-2x" slot="search" name="search" @click="seach" />
		</Header>
		<ProductList @loadproductdata="loadproductdata" :productTotal="productTotal" :index='index'>
			<div class="goal-item account-item" v-for="(n,i) in productlist" :key="i">
				<div class="goal-item-top">
					<div class="goal-top">
						<div class="goal-top-img">
							<van-image :src="n.ProductImgUrl" />
						</div>
						<div class="goal-top-right">
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
						<span>接单人员:</span>
						<em>{{n.jdusername}}</em>
					</div>
					<div class="goal-item-info">
						<span>购买单号:</span>
						<em>{{n.xdorderno}}</em>
					</div>
					<div class="goal-item-info">
						<span>留评内容:</span>
						<em>
							<van-icon v-if="n.lpurl" class="iconfont-lg" style="padding-right: 10px;" name="peer-pay" @click="golpurl(n.lpurl)" /> 
							<van-icon v-if="n.lpimgurl" class="iconfont-lg" name="photo" @click="showImg(n.lpimgurl)"/>
						</em>
					</div>
					<div class="goal-item-info goal-item-info100">
						<span>留评时间:</span>
						<em>{{n.lpdate}}</em>
					</div>
				</div>
				<div class="account-item-bottom">
					<div class="account-item-operating" @click="confirmReview(n.orderno,'1',n.realprice)">已留评</div>
					<div class="account-item-operating" @click="cancelReview(n.orderno,'0',n.realprice)">未留评</div>
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
	import { Button,Popup,Image as VanImage,Dialog} from 'vant';
	import ProductList from '@/components/ProductList'  //下拉加载上拉刷新
	export default({
		name:'CommentNotification',
		components:{
			[Dialog.Component.name]: Dialog.Component,
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
					buyOrderNo:'',
					date1:'',
					date2:''
				},
				index:0,
				productlist:[],
				productTotal:false,  //是否没有产品可加载
				PopupShow:false,
				publicCom:null,  //公共组件
				searchcom:null   ,//搜索组件
				reviewOrder:{},
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
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=getCPOrderDetailList_MJ",{
					params:{
						"pageSize": 20,                         //页面大小
						"pageNum":this.index,   //页码
						"orderno": this.fromorder.OrderNo,
						"state": "",
						"sjs":this.fromorder.date1,
						"sje": this.fromorder.date2,
						"xdorderno": this.fromorder.xdOrderNo,
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
			//确认留评
			confirmReview(orderno){
				Dialog.confirm({
				  title: '提示',
				  message: '确认该订单已留评',
				  beforeClose:(action, done)=>{
					  if (action === 'confirm') {
						 // let list=this.productlist;
					    this.axios.get('/Handler/CPManageSystem.ashx?cmd=setCPOrderDetailReadLP&orderno='+orderno).then(res=>{
					     	if(res.data.rescode>0){
								this.$toast('确认成功');
								this.loadproductdata('1')
					     	}else{
								this.$toast('确认失败')
					     	}
					     }).catch(xhr=>{//console.log(xhr)
							 this.$toast('确认失败')
					     });
						 done();
						 //this.productlist=list;
					  }else{
						  done();
					  }
				  }
				})
			},
			//未留评
			cancelReview(orderno){
				Dialog.confirm({
				  title: '提示',
				  message: '该订单确认没留评',
				  beforeClose:(action, done)=>{
					  if (action === 'confirm') {
						 // let list=this.productlist;
					    this.axios.get('/Handler/CPManageSystem.ashx?cmd=returnCPOrderDetailLP&orderno='+orderno).then(res=>{
					     	if(res.data.rescode>0){
								this.$toast('取消成功');
								this.loadproductdata('1')
					     	}else{
								this.$toast('取消失败')
					     	}
					     }).catch(xhr=>{//console.log(xhr)
							 this.$toast('取消失败')
					     });
						 done();
					  }else{
						  done();
					  }
				  }
				})
			},
			//搜索
			seach(){
				this.PopupShow=true;
				if(this.searchcom==null){
					this.searchcom=()=>import('@/components/Seller/CommentNotification/search.vue')
				}
				this.publicCom=this.searchcom
			},
			//显示留评截图
			showImg(url){
				this.dialogShow=true;
				this.dialogImgSrc=url;
			},
			//打开留评链接
			golpurl(url){
				window.open(url);
			}
		}
	})
</script>

<style scoped>
	.card{background-color: #fff;margin:5px auto;width: 96%;}
	.search-btn{margin: 20px 10px 10px;}
</style>
