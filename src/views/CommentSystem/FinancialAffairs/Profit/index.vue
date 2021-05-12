<template>
	<div>
		<Header title="利润管理">
			<van-icon class="iconfont-2x" slot="search" name="search" @click="search" />
		</Header>
		<div class="profit-total">
			<p>营业收入：<em>{{porfitTotal.totalprofit}}</em></p>
			<p>剩余金额：<em>{{porfitTotal.curjprofit}}</em></p>
			<p>应收账款：<em>{{porfitTotal.tqprofit}}</em></p>
			<div class="profit-total-btn">
				<van-button type="info" size="small" @click="hankUpload">利润提取</van-button>
				<van-button type="info" size="small" @click="hankLog()">利润日志</van-button>
			</div>
		</div>
		<ProductList @loadproductdata="loadproductdata" :productTotal="productTotal" :index='index'>
			<div class="goal-item account-item" v-for="(n,i) in productlist" :key="i">
				<div class="goal-item-top">
					<div class="goal-item-info">
						<span>月份:</span>
						<em>{{n.curmonth}}</em>
					</div>
					<div class="goal-item-info">
						<span>利润:</span>
						<em>{{n.profit}}</em>
					</div>
					<div class="goal-item-info goal-item-info100">
						<span>创建时间:</span>
						<em>{{n.cjsj}}</em>
					</div>
					<div class="goal-item-info goal-item-info100">
						<span>变更时间:</span>
						<em>{{n.bgsj}}</em>
					</div>
				</div>
				<div class="account-item-bottom">
					<div class="account-item-operating" @click="hankLog(n.curmonth)">详情</div>
				</div>
			</div>
		</ProductList>
		
		<van-popup v-model="PopupShow" round position="bottom">
			<component :is="comSrc" :fromorder.sync="fromorder" @loadproductdata="loadproductdata" @getTotalProfit="getTotalProfit"></component>
		</van-popup>
	</div>
</template>

<script>
	import {Button,Popup} from 'vant'
	import ProductList from '@/components/ProductList' //下拉加载上拉刷新
	export default({
		name:'Profit',
		components:{
			[Button.name]:Button,
			[Popup.name]:Popup,
			ProductList
		},
		data(){
			return{
				//利润汇总
				porfitTotal:{
					curjprofit:0,  //当前利润
					tqprofit:0,  //已提取利润
					totalprofit:0  //总的利润
				},
				index:0,
				productlist:[],
				productTotal:false,  //是否没有产品可加载
				//搜索内容
				fromorder:{
					months:'',
					monthe:''
				},
				searchcom:null   ,//搜索组件
				profituploadcom:null, //利润上传组件
				comSrc:null,  //组件共有入口
				PopupShow:false
			}
		},
		created() {
			this.getTotalProfit()
		},
		methods:{
			// 获取列表数据
			loadproductdata(i=0){
				this.PopupShow=false
				if(i!=0){
					this.index=0
				}
				this.loading=true;
				this.axios.post('/Handler/CPManageSystem.ashx?cmd=getMonthProfitList',this.qs.stringify({
					//params:{
						pageNum:this.index,
						pageSize:20,
						months:this.fromorder.months,
						monthe:this.fromorder.monthe
					//}
				})).then(res=>{
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
			getTotalProfit(){
				this.PopupShow=false;
				this.axios.get('/Handler/CPManageSystem.ashx?cmd=getTotalProfit').then(res=>{
					console.log(res);
					if(res.data.rescode==1){
						this.porfitTotal.curjprofit=res.data.curjprofit;
						this.porfitTotal.tqprofit=res.data.tqprofit;
						this.porfitTotal.totalprofit=res.data.curjprofit+res.data.tqprofit;
					}
				}).catch(xhr=>{
					//console.log(xhr);
				})
			},
			search(){
				if(this.searchcom==null){
					this.searchcom=()=>import('@/components/FinancialAffairs/Profit/search.vue')
				}
				this.comSrc=this.searchcom;
				this.PopupShow=true
			},
			hankUpload(){
				if(this.profituploadcom==null){
					this.profituploadcom=()=>import('@/components/FinancialAffairs/Profit/uploadProfit.vue')
				}
				this.comSrc=this.profituploadcom;
				this.PopupShow=true
			},
			hankLog(month=''){
				if(month==''){
					this.$router.push('/profitlog')
				}else{
					this.$router.push({path:'profitlog',query:{month:month}})
				}
				
			}
		}
	})
</script>

<style scoped>
	.profit-total{padding: 10px 20px 20px;background-color: #b5ecff;border-radius: 10px;margin:10px}
	.profit-total p{padding:6px 0}
	.profit-total p em{color: #e41c1d;font-style: normal;}
	.profit-total-btn{margin-top: 6px;}
	.profit-total-btn button{margin-right: 10px;}
</style>
