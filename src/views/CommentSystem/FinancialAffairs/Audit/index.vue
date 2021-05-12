<template>
	<div>
		<Header title="收入审核">
			<van-icon class="iconfont-2x" slot="search" name="search" @click="search" />
		</Header>
		<ProductList @loadproductdata="loadproductdata" :productTotal="productTotal" :index='index'>
			<div class="goal-item account-item" v-for="(n,i) in productlist" :key="i">
				<div class="goal-item-top">
					<div class="goal-item-info goal-item-info100">
						<span>订单号:</span>
						<em>{{n.orderno}}</em>
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
						<span>收款金额:</span>
						<em>{{n.currency | symbol}}{{n.ordermoney}}</em>
					</div>
					<div class="goal-item-info" :class="n.rat?'goal-item-info100':''">
						<span>提交人员:</span>
						<em>{{n.fqusername}}</em>
					</div>
					<div class="goal-item-info">
						<span>订单状态:</span>
						<em>{{n.ztstr}}
							<van-icon v-if="n.fkimgurl" name="photo" @click="dialogShowImg(n.fkimgurl)" />
						</em>
					</div>
				</div>
				<div class="account-item-bottom" v-if="n.fqremark || n.shremark || n.zt=='0'">
					<template v-if="n.zt=='0'">
						<div class="account-item-operating" @click="comitsh(n,'1')">确认</div>
						<div class="account-item-operating" @click="comitsh(n,'2')">驳回</div>
					</template>
					<div class="account-item-operating" v-if="n.fqremark || n.shremark" @click="remark(n.fqremark,n.shremark)">备注</div>
				</div>
			</div>
		</ProductList>
		<van-dialog v-model="dialogShow">
		  <img style="width: 100%;" :src="dialogImgSrc" />
		</van-dialog>
		<van-popup v-model="PopupShow" round position="bottom">
			<component :is="comSrc" :fromorder.sync="fromorder" :remarkTxt="remarkTxt" :checkObj="checkObj"
			@loadproductdata="loadproductdata"></component>
		</van-popup>
	</div>
</template>

<script>
	import {Popup,Dialog} from 'vant'
	import ProductList from '@/components/ProductList' //下拉加载上拉刷新
	export default({
		name:'Audit',
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
					currency:{
						text:'全部',
						value:'-1'
					},
					orderStaus:{
						text:'待处理',
						value:'0'
					},
					orderType:{
						text:'全部',
						value:''
					},
					date1:'',
					date2:''
				},
				index:0,
				productlist:[],
				productTotal:false,  //是否没有产品可加载
				PopupShow:false,
				searchcom:null   ,//搜索组件
				remarkcom:null,  //备注组件
				checkcom:null,  //审核组件
				comSrc:null,  //组件共有入口
				dialogShow:false,
				dialogImgSrc:'',
				remarkTxt:{
					rem1:'',
					rem2:''
				},
				checkObj:{}
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
				this.axios.post("/Handler/CPManageSystem.ashx?cmd=getCWOrderDetailList",this.qs.stringify({
					//params:{
						"pageSize":20,                         //页面大小
						"pageNum":this.index,   //页码
						"orderno": this.fromorder.OrderNo,
						"ordertype": 0,
						"currency": this.fromorder.currency.value,
						"txtaccount": '',
						"zt": this.fromorder.orderStaus.value,
						"bustype": this.fromorder.orderType.value,
						"xdOrderno": '',
						"ifauto": -1,
						"sjs":this.fromorder.date1,
						"sje": this.fromorder.date2
					//}
				})).then(res=>{console.log(res)
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
					this.searchcom=()=>import('@/components/FinancialAffairs/Audit/search.vue')
				}
				this.comSrc=this.searchcom;
				this.PopupShow=true
			},
			//审核
			comitsh(attr={},i='1'){
				if(this.checkcom==null){
					this.checkcom=()=>import('@/components/FinancialAffairs/Audit/check.vue')
				}
				this.comSrc=this.checkcom;
				this.checkObj={}
				if(Object.keys(attr).length>0){
					this.checkObj.rid=attr.rid;
					this.checkObj.state=i;
					this.checkObj.orderno=attr.orderno;
					this.checkObj.currency=attr.currency;
					this.PopupShow=true
				}
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
</style>
