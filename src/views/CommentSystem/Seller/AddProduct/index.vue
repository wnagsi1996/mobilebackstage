<template>
	<div>
		<Header title="产品管理">
			<div slot="search" class="icon-right">
				<van-icon class="iconfont-2x" name="description" @click="dialogShow=true" />
				<van-icon class="iconfont-2x" name="plus" @click="add()"/>
			</div>
		</Header>
		<ProductList @loadproductdata="loadproductdata" :productTotal="productTotal" :index='index'>
			<div class="goal-item account-item" v-if="productlist.length>0" v-for="(n,i) in productlist" :key="i">
				<div class="goal-item-top" @click="goOderDesc(n.orderno)">
					<div class="goal-top">
						<div class="goal-top-img">
							<van-image :src="n.pimg" fit="scale-down" />
						</div>
						<div class="goal-top-right">
							<div class="goal-item-info goal-item-info100">
								<span>标题:</span>
								<em class="van-ellipsis">{{n.ptitle}}</em>
							</div>
							<div class="goal-item-info goal-item-info100">
								<span>订单号:</span>
								<em>{{n.orderno}}</em>
							</div>
						</div>
					</div>
					<div class="goal-item-info">
						<span>留评单数:</span>
						<em>{{n.lpnum}}</em>
					</div>
					<div class="goal-item-info">
						<span>免评单数:</span>
						<em>{{n.mpnum}}</em>
					</div>
					<div class="goal-item-info">
						<span>完成单数:</span>
						<em>{{n.successNum}}</em>
					</div>
					<div class="goal-item-info">
						<span>应收金额:</span>
						<em>{{n.skmoney}}</em>
					</div>
					<div class="goal-item-info">
						<span>订单状态:</span>
						<em>{{n.ztstr}}</em>
					</div>
				</div>
				<div class="account-item-bottom">
					<template v-if="n.zt=='0' || n.zt=='3'">
						<div class="account-item-operating" @click="add(n.orderno)">编辑</div>
						<div class="account-item-operating" v-if="n.addflag==1" @click="review(n)">被拒原因</div>
						<div class="account-item-operating" @click="del(n.orderno)">删除</div>
					</template>
					<template v-if="n.zt=='2'">
						<div class="account-item-operating" @click="operating(n.orderno,'0')">退单</div>
						<div class="account-item-operating" @click="operating(n.orderno,'3')">追加订单</div>
						<div class="account-item-operating" @click="operating(n.orderno,'2')">更改类型</div>
					</template>
					<div class="account-item-operating" @click="viewLog(n.orderno)">日志</div>
				</div>
			</div>
		</ProductList>
		<van-popup v-model="popup.toggle" closeable position="bottom">
			<component :is="publicCom" :orderno="popup.orderno" :dataObj="popup.dataObj" @loadproductdata="loadproductdata"></component>
		</van-popup>
		<!-- 显示订单详情 -->
		<van-dialog v-model="dialogShow">
		  <div class="order-info-desc">
			  <p><span>客户:</span>{{orderInfo.sjname}}</p>
			  <p><span>订单号:</span>{{orderInfo.orderno}}</p>
			  <p><span>支付方式:</span>{{orderInfo.sktype}}</p>
			  <p><span>支付选择:</span>{{orderInfo.sktypeinfo}}</p>
			  <p><span>汇率:</span>{{orderInfo.RMB2US}}</p>
			  <p><span>订单状态:</span>{{orderInfo.ddzt}}</p>
			  <p><span>客户联系方式:</span>{{orderInfo.sjlxfs}}</p>
		  </div>
		</van-dialog>
	</div>
</template>

<script>
	import ProductList from '@/components/ProductList' //下拉加载上拉刷新
	import {Image as VanImage,Popup,Dialog} from 'vant'
	export default({
		name:'AddProduct',
		components:{
			ProductList,
			[VanImage.name]:VanImage,
			[Popup.name]:Popup,
			[Dialog.Component.name]: Dialog.Component
		},
		data(){
			return{
				productTotal:false,  //是否没有产品可加载
				index:0,  
				productlist:[], //列表数据
				toporderno:'',  //订单号
				orderInfo:{},  //订单信息
				publicCom:null ,  //公共组件
				popup:{
					toggle:false,
					orderno:'',
					dataObj:{},    //传状态/汇率/客户订单
				},
				addCom:null  ,//添加或编辑产品组件
				backOrderCom:null,  //退单组件
				commentsCom:null  ,//更改类型组件
				appendProductCom:null  ,//追加订单
				dialogShow:false
			}
		},
		beforeRouteEnter(to,from,next) {
			let orderno=to.query.orderno;
			if(orderno=='' || orderno==undefined){
				next('/clientorder');
			}else{
				next()
			}
		},
		created() {
			this.toporderno=this.$route.query.orderno;
			this.getOrderInfo();
		},
		methods:{
			// 获取列表数据
			loadproductdata(i=0){
				this.popup.toggle=false;
				if(i!=0){
					this.index=0
				}
				this.loading=true;
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=getCPOrderList",{
					params:{
						"pageSize":20,                         //页面大小
						"pageNum":this.index,   //页码
						"toporderno": this.toporderno
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
			// 获取订单信息
			getOrderInfo(){
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=getCPTopOrderInfo&orderno="+this.toporderno).then(res=>{
					// console.log(res);
					if(res.data!=""){
						this.orderInfo=res.data;
						this.popup.dataObj.rate=res.data.RMB2US  //汇率
						this.popup.dataObj.orderno=res.data.orderno  //客户订单
					}
				}).catch(xhr=>{
					console.log(xhr);
				})
			},
			//添加产品
			add(orderno=''){
				if(this.addCom==null){
					this.addCom=()=>import('@/components/Seller/AddProduct/addOrEdit.vue')
				}
				this.publicCom=this.addCom;
				this.popup.toggle=true;
				if(this.orderInfo.state=='0'||this.orderInfo.state=='3'){
					this.popup.dataObj.state=1; //正常添加1  追加产品0
				}else{
					this.popup.dataObj.state=0; //正常添加1  追加产品0
				}
				this.popup.orderno=orderno;
			},
			//查看日志
			viewLog(orderno){
				this.$router.push({path:'/log', query: { orderno: orderno }})
			},
			//删除
			del(orderno){
				Dialog.confirm({
				  title: '删除提示',
				  message: '此操作将永久该产品信息, 是否继续?',
				  beforeClose:async (action, done)=>{
					  if (action === 'confirm') {
						 // let list=this.productlist;
					    await this.axios.get("/Handler/CPManageSystem.ashx?cmd=delCPOrder&ordernos="+orderno).then(res=>{
					     	if(res.data>0){
								this.$toast('删除成功');
								this.productlist.forEach((n,i)=>{
									if(n.orderno==orderno){
										this.productlist.splice(i,1);
									}
								})
					     	}else{
								this.$toast('删除失败')
					     	}
					     }).catch(xhr=>{console.log(xhr)
							 this.$toast('删除失败')
					     });
						 done();
					  }else{
						  done();
					  }
				  }
				})
			},
			//按钮点击
			operating(orderno,type){  //订单号/类型
				switch(type){
					case '0':  //退单
						if(this.backOrderCom==null){
							this.backOrderCom=()=>import('@/components/Seller/AddProduct/backOrder.vue');
						}
						this.publicCom=this.backOrderCom;
						break;
					case '2'://更改免评/留评
						if(this.commentsCom==null){
							this.commentsCom=()=>import('@/components/Seller/AddProduct/comments.vue');
						}
						this.publicCom=this.commentsCom;
						break;
					case '3':  //追加订单
						if(this.appendProductCom==null){
							this.appendProductCom=()=>import('@/components/Seller/AddProduct/appendProduct.vue');
						}
						this.publicCom=this.appendProductCom;
						break;
				}
				this.popup.orderno=orderno;
				this.popup.toggle=true
			},
			goOderDesc(orderno){
				this.$router.push({path:'/orderdesc', query: { orderno: orderno }})
			}
		},
		//路由离开守卫
		beforeRouteLeave(to, from, next) {
		    // console.log(to);
		    // console.log(from);
			if(to.path=='/orderdesc' || to.path=='/orderdetail' || to.path=='/log'){
				from.meta.keepAlive=true;
			}else{
				from.meta.keepAlive=false;
			}
		    next();
		  }
	})
</script>

<style scoped>
	.order-info-desc{padding:15px}
	.order-info-desc p{margin: 15px 0;}
	.order-info-desc p span{width:100px;font-weight: bold;padding-right: 5px;display: inline-block;}
</style>
