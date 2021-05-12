<template>
	<div>
		<Header title="财务处理进度">
			<div slot="search" class="icon-right">
				<van-icon class="iconfont-2x" name="search" @click="search" />
			</div>
		</Header>
		<ProductList @loadproductdata="loadproductdata" :productTotal="productTotal" :index='index'>
			<div class="goal-item account-item" v-for="(n,i) in productlist" :key="i">
				<div class="goal-item-top">
					<div class="goal-item-info goal-item-info100">
						<span>订单号:</span>
						<em>{{n.orderno}}</em>
					</div>
					<div class="goal-item-info">
						<span>订单类型:</span>
						<em>{{n.bustypestr}}</em>
					</div>
					<div class="goal-item-info">
						<span>渠道:</span>
						<em>{{n.rattypestr}}</em>
					</div>
					<div class="goal-item-info">
						<span>货币:</span>
						<em>{{n.currencystr}}</em>
					</div>
					<div class="goal-item-info">
						<span>金额:</span>
						<em>{{n.currency | symbol}}{{n.ordermoney}}</em>
					</div>
					<div class="goal-item-info" :class="n.rat?'goal-item-info100':''">
						<span>支出账号:</span>
						<em>{{n.rat}}</em>
						<van-icon class="iconfont-lg" v-if="n.receiveAccountQRCodeUrl" name="photo" @click="dialogShowImg(n.receiveAccountQRCodeUrl)" />
					</div>
					
					<div class="goal-item-info" v-if="n.realmoney">
						<span>实际金额:</span>
						<em>￥{{n.realmoney}}</em>
					</div>
					<div class="goal-item-info">
						<span>订单状态:</span>
						<em>{{n.ztstr}}</em>
						<van-icon class="iconfont-lg" v-if="n.fkimgurl" name="photo" @click="dialogShowImg(n.fkimgurl)" />
					</div>
				</div>
				<div class="account-item-bottom" v-if="n.fqremark || n.shremark">
					<div class="account-item-operating" @click="remark(n.fqremark,n.shremark)">备注</div>
				</div>
			</div>
		</ProductList>
		<van-dialog v-model="dialogShow">
		  <img style="width: 100%;" :src="dialogImgSrc" />
		</van-dialog>
		<van-popup v-model="PopupShow" round position="bottom">
			<component :is="comSrc" :fromorder.sync="fromorder" :remarkTxt="remarkTxt" @loadproductdata="loadproductdata"></component>
		</van-popup>
	</div>
</template>

<script>
	import {Popup,Dialog} from 'vant'
	import ProductList from '@/components/ProductList' //下拉加载上拉刷新
	export default({
		name:'FinancialAuditTrail',
		components:{
			ProductList,
			[Dialog.Component.name]: Dialog.Component,
			[Popup.name]:Popup
		},
		data(){
			return{
				fromorder:{
					OrderNo:'',
					channel:{
						text:'全部',
						value:'-1'
					},
					orderStaus:{
						text:'全部',
						value:'-1'
					},
					currency:{
						text:'全部',
						value:'-1'
					},
					orderType:{
						text:'',
						value:''
					},
					date1:'',
					date2:''
				},
				productTotal:false,  //是否没有产品可加载
				index:0,  
				productlist:[], //列表数据
				searchcom:null  ,//搜索组件
				remarkcom:null,  //备注组件
				comSrc:null,  //组件共有入口
				PopupShow:false,
				dialogShow:false,
				dialogImgSrc:'',
				remarkTxt:{
					rem1:'',
					rem2:''
				}
			}
		},
		methods:{
			// 获取列表数据
			loadproductdata(i=0){
				this.PopupShow=false
				if(i!=0){
					this.index=0
				}
				this.loading=true;
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=getCWOrderDetailList",{
					params:{
						"pageSize":20,                         //页面大小
						"pageNum":this.index,   //页码
						"orderno": this.fromorder.OrderNo,
						"ordertype": this.fromorder.channel.value,
						"currency": this.fromorder.currency.value,
						"txtaccount":'',
						"zt": this.fromorder.orderStaus.value,
						"sjs":this.fromorder.date1,
						"sje": this.fromorder.date2,
						"xdOrderno":'',
						"bustype":this.fromorder.orderType.value,
						"ifauto":-1
					}
				}).then(res=>{console.log(res)
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
			//显示图片
			dialogShowImg(src){
				this.dialogShow=true;
				this.dialogImgSrc=src;
			},
			//备注
			remark(rem1,rem2){
				if(rem1!=''){
					this.remarkTxt.rem1=rem1
				}
				if(rem2!=''){
					this.remarkTxt.rem2=rem2
				}
				if(this.remarkcom==null){
					this.remarkcom=()=>import('@/components/Remark');
				}
				this.comSrc=this.remarkcom
				this.PopupShow=true;
			},
			//搜索
			search(){
				if(this.searchcom==null){
					this.searchcom=()=>import('@/components/Admin/FinancialAuditTrail/search.vue')
				}
				this.comSrc=this.searchcom;
				this.PopupShow=true
			}
		},
		filters:{
			symbol(val){
				if(val==0){
					return '￥'
				}else{
					return '$'
				}
			}
		}
	})
</script>

<style>
	.remark{padding:10px;}
	.remark-info{margin:10px 0;}
	.remark-info p{font-weight: bold;}
</style>
