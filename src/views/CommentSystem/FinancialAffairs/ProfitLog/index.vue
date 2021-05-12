<template>
	<div>
		<Header title="利润管理日志">
			<van-icon class="iconfont-2x" slot="search" name="search" @click="search" />
		</Header>
		<ProductList @loadproductdata="loadproductdata" :productTotal="productTotal" :index='index'>
			<div class="goal-item account-item" v-for="(n,i) in loglist" :key="i">
				<div class="goal-item-top">
					<div class="goal-item-info goal-item-info100">
						<span>订单号:</span>
						<em>{{n.toporderno}}</em>
					</div>
					<div class="goal-item-info">
						<span>利润:</span>
						<em>{{n.profit}}</em>
					</div>
					<div class="goal-item-info">
						<span>类别:</span>
						<em>{{n.updatetype | type}}</em>
					</div>
					<div class="goal-item-info goal-item-info100">
						<span>时间:</span>
						<em>{{n.profitdatetime}}</em>
					</div>
					<div class="goal-item-info goal-item-info100">
						<span>备注:</span>
						<em>{{n.remark}}</em>
					</div>
				</div>
			</div>
		</ProductList>
		
		<van-popup v-model="PopupShow" round position="bottom">
			<component :is="comSrc" :fromorder.sync="fromorder" @loadproductdata="loadproductdata"></component>
		</van-popup>
	</div>
</template>

<script>
	import ProductList from '@/components/ProductList'
	import {Cell, CellGroup, Popup} from 'vant';
	export default({
		name:'Log',
		components:{
			[Cell.name]:Cell,
			[CellGroup.name]:CellGroup,
			[Popup.name]:Popup,
			ProductList
		},
		data(){
			return{
				index:0,
				loglist:[],
				productTotal:false,  //是否没有产品可加载
				//搜索内容
				fromorder:{
					OrderNo:'',
					updatetype:{
						text:'全部',
						value:-1
					},
					date1:'',
					date2:''
				},
				month:'',
				searchcom:null   ,//搜索组件
				comSrc:null,  //组件共有入口
				PopupShow:false
			}
		},
		created() {
			if(this.$route.query.month){
				this.month=this.$route.query.month;
			}
		},
		mounted() {
		},
		methods:{
			loadproductdata(i=0){
				this.PopupShow=false
				if(i!=0){
					this.index=0
				}
				this.loading=true;
				this.axios.post('/Handler/CPManageSystem.ashx?cmd=getProfitLogList',this.qs.stringify({
					//params:{
						pageNum:this.index,
						pageSize:20,
						updatetype:this.fromorder.updatetype.value,
						toporderno:this.fromorder.OrderNo,
						sjs:this.fromorder.date1,
						sje:this.fromorder.date2,
						month:this.month,
						userid:-1
					//}
				})).then(res=>{
					if(i!=0){
						this.loglist=[];
					}
					this.index++;
					this.loglist = this.loglist.concat(res.data.rows);
					if(res.data.rows.length==0){
						this.productTotal=true
					}
				}).catch(xhr=>{
					console.log(xhr);
				})
			},
			search(){
				if(this.searchcom==null){
					this.searchcom=()=>import('@/components/FinancialAffairs/ProfitLog/search.vue')
				}
				this.comSrc=this.searchcom;
				this.PopupShow=true
			}
		},
		filters:{
			type(val){
				let status=''
				switch(val){
					case 0:
						status='测评结束';
						break;
					case 1:
						status='提取';
						break;
					case 2:
						status= '利润变更';
						break;
				};
				return status
			}
		}
	})
</script>

<style scoped>
	.log{width: 96vw;margin: 0 auto;}
	.log-cell{width: 100vw;}
	.log-item{display: flex;flex-direction: column;background-color: #fff;border-radius: 5px;margin: 5px auto;padding: 10px;}
	.log-title{display: flex;border-bottom: 1px solid #f7f7f7;padding-bottom: 10px;margin-bottom: 10px;}
	.log-title-info{width: 50vw;}
	.log-title-right{color: #888;text-align: right;}
	.log-desc{color: #999;}
</style>
