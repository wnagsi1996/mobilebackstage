<template>
	<div>
		<Header title="待返款订单"> 
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
						<span>返款渠道:</span>
						<em>{{n.fktype | typeFilter}}</em>
					</div>
					<div class="goal-item-info" :class="n.fkaccount?'goal-item-info100':''">
						<span>返款账号:</span>
						<em>{{n.fkaccount}}</em> 
						<van-icon v-if="n.fkaccountQRCodeUrl" class="iconfont-lg" name="qr" @click="dialogShowImg(n.fkaccountQRCodeUrl)" />
					</div>
					<div class="goal-item-info">
						<span>提供价格:</span>
						<em>{{n.realprice}}</em>
					</div>
					<div class="goal-item-info">
						<span>审核价格:</span>
						<em>{{n.realproductdj_mj}}</em>
					</div>
					<div class="goal-item-info goal-item-info100">
						<span>购买单号:</span>
						<em>{{n.xdOrderno}}</em>
					</div>
				</div>
				<div class="account-item-bottom">
					<div class="account-item-operating"  v-if="n.zt!='8'" @click="rebate(n.orderno,n.zt,n.realproductdj_mj)">提交返款</div>
					<div class="account-item-operating" @click="viewDetail(n.orderno)">详情</div>
					<div class="account-item-operating" @click="viewLog(n.orderno)">日志</div>
				</div>
			</div>
		</ProductList>
		<van-popup v-model="PopupShow" round position="bottom">
			<component :is="publicCom" :fromorder.sync="fromorder" :Rebatedata="Rebatedata" @loadproductdata="loadproductdata"></component>
		</van-popup>
		
		<van-dialog v-model="dialogShow">
		  <img style="width: 100%;" :src="dialogImgSrc" />
		</van-dialog>
	</div>
</template>

<script>
	import { Button,Popup,Image as VanImage,Dialog } from 'vant';
	import ProductList from '@/components/ProductList'  //下拉加载上拉刷新
	export default({
		name:'ReviewOrder',
		components:{
			[Button.name]:Button,
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
						value:-1,
						text:'全部'
					},
					agent:{
						value:-1,
						text:'全部'
					},
					orderStaus:{
						text:'全部',
						value:'4,8,12'
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
				rebatecom:null,  //返款组件
				Rebatedata:{},
				orderno:'',
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
						"state":this.fromorder.orderStaus.value
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
			//显示图片
			dialogShowImg(src){
				this.dialogShow=true;
				this.dialogImgSrc=src;
			},
			//搜索
			seach(){
				this.PopupShow=true;
				if(this.searchcom==null){
					this.searchcom=()=>import('@/components/Buyer/RebateOrder/search.vue')
				}
				this.publicCom=this.searchcom
			},
			//提交返款
			rebate(orderno,state,usmoney){
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=getCPOrderDetailXDInfo&orderno="+orderno).then(res=>{
					//console.log(res);
					if(res.data!=''){
						this.Rebatedata.usmoney=usmoney;
						this.Rebatedata.orderno=orderno;
						if(res.data.fkimgurl=='' && res.data.fkaccount==''){  //返款二维码或者账户都为空直接弹出
							this.rebateshow();
						}else{
							this.Rebatedata.fktype=res.data.fktype;
							this.Rebatedata.fkaccount=res.data.fkaccount;
							this.Rebatedata.fkremark=res.data.fkremark;
							this.Rebatedata.fkimgurl=res.data.fkimgurl;
							
							if(state=='12'){  //返款被驳回也是直接弹出
								//this.Rebatedata=res.data;
								this.rebateshow();
							}else{
								this.axios.post("/Handler/CPManageSystem.ashx",this.qs.stringify({
									"cmd":"comitProductFK",
									"orderno":orderno,
									"remark":this.Rebatedata.fkremark,
									"skaccount":this.Rebatedata.fkaccount,
									"oldfkimgurl":'',
									"sktype":this.Rebatedata.fktype,
									"_img64":this.Rebatedata.fkimgurl,
								})).then(resstr=>{
									//console.log(resstr);
									if(resstr.data.rescode>0){
										this.$toast('提交成功')
									}else{
										this.$toast('提交失败')
									}
								}).catch(xhr=>{
									this.$toast('提交失败')
								})
							}
						}
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
			//弹出返款的组件
			rebateshow(){
				if(this.rebatecom==null){
					this.rebatecom=() => import('@/components/Buyer/RebateOrder/rebate.vue');
				}
				this.publicCom=this.rebatecom;
				this.PopupShow=true;
			}
		},
		filters:{
			typeFilter:(val)=>{
				let txt='';
				switch(val){
					case '0':
						txt='微信'
						break;
					case '1':
						txt='支付宝'
						break;
					case '2':
						txt='银行转账'
						break;
					case '3':
						txt='PayPal'
						break;
				}
				return txt;
			}
		}
	})
</script>

<style scoped>
	.card{background-color: #fff;margin:5px auto;width: 96%;}
	.search-btn{margin: 20px 10px 10px;}
</style>
