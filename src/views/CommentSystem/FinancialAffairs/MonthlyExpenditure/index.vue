<template>
	<div>
		<Header title="月份支出管理" />
		<ProductList @loadproductdata="loadproductdata" :productTotal="productTotal" :index='index'>
			<div class="log">
				<div class="log-item" v-for="(item,index) in tableData" :key="index">
					<div class="log-title">
						<div class="log-title-info log-title-left">
							{{item.month}}
						</div>
						<div class="log-title-info log-title-right">
							{{item.money}}
						</div>
					</div>
					<p>{{item.insertdate}}</p>
					<div class="log-desc">
						{{item.remark}}
					</div>
				</div>
			</div>
		</ProductList>
		<van-popup v-model="PopupShow" round position="bottom" safe-area-inset-bottom>
			<component :is="comsrc"
			 @loadproductdata="loadproductdata"></component>
		</van-popup>
	</div>
</template>

<script>
	import ProductList from '@/components/ProductList'
	import {Cell, CellGroup,Popup } from 'vant';
	export default({
		name:'SysLogManage',
		components:{
			[Cell.name]:Cell,
			[CellGroup.name]:CellGroup,
			[Popup.name]: Popup,
			ProductList
		},
		data(){
			return{
				index:0,
				tableData:[],
				productTotal:false,  //是否没有产品可加载
				dialogShow:false,
				dialogImgSrc:'', //图片地址
				addCom:null  ,//搜索组件
				comsrc:null,  //共有组件
				PopupShow:false
			}
		},
		methods:{
			loadproductdata(i=0){
				this.PopupShow=false
				if(i!=0){
					this.index=0
				}
				this.loading=true;
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=getMonthOutLayList",{
					params:{
						"pageSize":20,                         //页面大小
						"pageNum":this.index,
						"months": '',
						"monethe":''
					}
				}).then(res=>{
					console.log(res)
					if(i!=0){
						this.tableData=[];
					}
					this.index++;
					this.tableData = this.tableData.concat(res.data.rows);
					if(res.data.rows.length==0){
						this.productTotal=true
					}
				}).catch(xhr=>{
					console.log(xhr);
				})
			},
			add(){
				if(this.addCom==null){
					this.addCom=()=>import('@/components/FinancialAffairs/Lossexpenses/add.vue');
				}
				this.PopupShow=true;
				this.comsrc=this.addCom
			}
		},
		filters:{
			outType(val){
				if(val.outtype=='0'){
					return '损失金额'
				}else{
					return '追回损失'
				}
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
