<template>
	<div>
		<Header title="订单详情"></Header>
		<van-cell-group>
		  <van-cell title="产品标题" :value="orderDetailData.ProductTitle" />
		  <van-cell title="订单号" :value="orderDetailData.Orderno" />
		  <van-cell title="RID" :value="orderDetailData.rid" />
		  <van-cell title="原始单价" :value="orderDetailData.productdj" />
		  <van-cell title="关键词" :value="orderDetailData.KeyWord" />
		  <van-cell title="关键词大概在第几行" :value="orderDetailData.KeyWordPage" />
		  <van-cell title="ASIN" :value="orderDetailData.Asin" />
		  <van-cell title="品牌" :value="orderDetailData.Brand" />
		  <van-cell title="店铺名称" :value="orderDetailData.StoreName" />
		  <van-cell title="是否追加" :value="orderDetailData.addflag | addflag" />
		  <van-cell title="订单状态" :value="orderDetailData.state" />
		  <van-cell title="买家联系方式" :value="orderDetailData.fklxfs" />
		  <van-cell v-if="orderDetailData.CouponCode!=''" title="折扣码" :value="orderDetailData.CouponCode" />
		  <van-cell title="是否留评" :value="orderDetailData.ordertype" />
		  <van-cell v-if="orderDetailData.ordertype==1" title="留评状态" :value="orderDetailData.lpstate | reviewStatus" />
		  <van-cell v-if="orderDetailData.ordertype==1" title="留评时间" :value="orderDetailData.lpdate" />
		  <van-cell v-if="orderDetailData.ifFB!=0" title="是否需要Feedback" value="是" />
		  <van-cell v-if="orderDetailData.ifQA!=0" title="是否需要是否需要QA" value="是" />
		  <van-cell v-if="orderDetailData.HelpFulUrl!=''" title="点赞链接" value="查看" :url="orderDetailData.HelpFulUrl" />
		  <van-cell title="创建时间" :value="orderDetailData.cjdate" />
		  <van-cell title="放单人员" :value="orderDetailData.fdusername" />
		  <van-cell title="放单时间" :value="orderDetailData.fddate" />
		  <van-cell title="接单时间" :value="orderDetailData.jddate" />
		  <van-cell title="下单单价" :value="orderDetailData.realproductdj" />
		  <van-cell title="购买单号" :value="orderDetailData.xdOrderno" />
		  <van-cell title="下单时间" :value="orderDetailData.xddate" />
		  <van-cell title="返款金额" :value="orderDetailData.fkmoney" />
		  <van-cell v-if="orderDetailData.zjmoneyRMB_mmj!=''" title="中介佣金（卖家端）" :value="orderDetailData.zjmoneyRMB_mmj" />
		  <van-cell title="中介佣金（买家端）" :value="intermediaryYJ" />
		  <van-cell title="Feedback内容" :value="orderDetailData.FB" />
		  <van-cell title="QA内容" :value="orderDetailData.QA" />
		  <van-cell title="下单要求" :value="orderDetailData.xdyq" />
		  <van-cell title="备注" :value="orderDetailData.remark" />
		</van-cell-group>
	</div>
</template>

<script>
	import { Cell, CellGroup } from 'vant';
	export default({
		name:'LogDesc',
		components:{
			[Cell.name]:Cell,
			[CellGroup.name]:CellGroup
		},
		data(){
			return{
				orderDetailData:new Object,   //订单数据
				intermediaryYJ:0,  //买家端中介佣金
				loadLog:null,
				loading:true,
				orderno:'',
			}
		},
		beforeRouteEnter(to,from,next) {
			let orderno=to.query.orderno;
			if(orderno=='' || orderno==undefined){
				next('/');
			}else{
				next()
			}
		},
		created() {
			this.orderno=this.$route.query.orderno;
			this.getOrderInfo();
		},
		mounted() {
			
		},
		methods:{
			//执行父元素的函数关闭
			closeDialog(){
				this.$emit('handleLogClick');
			},
			//获取订单详情
			getOrderInfo(){
				this.loading=true;
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=getCPOrderDetailInfo&orderno="+this.orderno).then(res=>{
					this.orderDetailData=res.data;
					this.mjzjyj();
					this.loading=false;
				}).catch(xhr=>{
					console.log(xhr);
				})
			},
			//计算买家中介佣金
			mjzjyj(){
				let productyj=this.orderDetailData.zjmoneyRMB_mj;
				let zjyj=this.orderDetailData.zjmoneyRMB_mjlp;
				if(productyj=="")
					productyj=0;
				if(zjyj=="")
					zjyj=0;
				this.intermediaryYJ=(eval(productyj)+eval(zjyj)).toFixed(2);
			},
			//获取订单日志
			search(valdata=[]){
				//判断是否是分页传过来的参数
				if(valdata.length!=0){
					if(valdata[0]=="current"){
						this.pagination.current=valdata[1];
					}else if(valdata[0]=="size"){
						this.pagination.size=valdata[1];
					}
				}
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=getCPLogList",{
					params:{
						"pageindex":this.pagination.current-1,
						"len":this.pagination.size,
						"orderno":this.logorderno
					}
				}).then(res=>{
					//console.log(res);
					if(res.data!=""){
						this.logListData=res.data.rows;
						this.pagination.total=res.data.results
					}
					
				}).catch(xhr=>{
					console.log(xhr);
				})
			}
		},
		filters:{
			//是否追加订单
			addflag(val){
				if (val == 0)
					return "否";
				else
					return "是";
			},
			//订单状态
			reviewStatus(val){
				if(val==1)
					return "留评"
				else
					return "免评"
			}
		},
		watch:{
			logshow(newVal,oldVal){
				this.dialogVisible=newVal;
			},
			logorderno(newVal,oldVal){
				this.orderno=newVal;
				this.getOrderInfo();
				this.logListData=[];
				this.pagination.total=0
			}
		}
	})
</script>

<style>
</style>
