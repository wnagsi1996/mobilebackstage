<template>
	<div>
		<Header title="中介佣金挂账">
			<van-icon class="iconfont-2x" slot="search" name="search" @click="search" />
		</Header>
		<ProductList @loadproductdata="loadproductdata" :productTotal="productTotal" :index='index'>
			<div class="goal-item account-item" v-if="productlist.length>0" v-for="(n,i) in productlist" :key="i">
				<div class="goal-item-top">
					<div class="goal-item-info">
						<span>中介名称:</span>
						<em>{{n.zjname}}</em>
					</div>
					<div class="goal-item-info">
						<span>状态:</span>
						<em>{{n.statestr}}</em>
					</div>
					<div class="goal-item-info">
						<span>操作人员:</span>
						<em>{{n.username}}</em>
					</div>
					<div class="goal-item-info">
						<span>挂账美元:</span>
						<em>{{n.usdmoney}}</em>
					</div>
					<div class="goal-item-info">
						<span>挂账人民币:</span>
						<em>{{n.rmbmoney}}</em>
					</div>
					<div class="goal-item-info" v-if="n.usdmoney_real">
						<span>实际回款美元:</span>
						<em>{{n.usdmoney_real}}</em>
					</div>
					<div class="goal-item-info" v-if="n.rmbmoney_real">
						<span>实际回款人民币:</span>
						<em>{{n.rmbmoney_real}}</em>
					</div>
					<div class="goal-item-info goal-item-info100">
						<span>挂账时间:</span>
						<em>{{n.insertdate}}</em>
					</div>
					<div class="goal-item-info goal-item-info100">
						<span>处理时间:</span>
						<em>{{n.dodate}}</em>
					</div>
				</div>
				<div class="account-item-bottom" v-if="n.status=='0'">
					<div class="account-item-operating" @click="hankUploadMoney(n.orderno)">发起回款</div>
				</div>
			</div>
		</ProductList>
		<van-popup v-model="PopupShow" round position="bottom" safe-area-inset-bottom>
			<component :is="componentSrc" :fromorder.sync="fromorder" :orderno="orderno" @loadproductdata="loadproductdata" ></component>
		</van-popup>
	</div>
</template>

<script>
	import {Button,Popup} from 'vant'
	import ProductList from '@/components/ProductList' //下拉加载上拉刷新
	export default({
		name:'MonthlyGoal',
		components:{
			[Button.name]:Button,
			[Popup.name]:Popup,
			ProductList
		},
		data(){
			return{
				fromorder:{
					OrderNo:'',
					agentname:'',
					status:{
						text:'全部',
						value:'-1'
					},
					date1:'',
					date2:''
				},
				productTotal:false,  //是否没有产品可加载
				index:0,  
				productlist:[], //列表数据
				PopupShow:false,  //搜索弹框
				componentSrc:null ,//动态引入组件地址
				SearchCom:null   ,//搜索组件
				uploadcom:null, //上传回款金额组件
				orderno:''   //传单号给组件回款使用
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
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=getAgentOverDraftList",{
					params:{
						"pageSize":20,                         //页面大小
						"pageNum":this.index,   //页码
						"orderno": this.fromorder.OrderNo,
						"zjname": this.fromorder.agentname,
						"sjs":this.fromorder.date1,
						"sje": this.fromorder.date2,
						"mjuserid": '-1',
						"state":this.fromorder.status.value
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
			//搜索
			search(){
				if(this.SearchCom==null){
					this.SearchCom=()=>import('@/components/Buyer/Intermediarycommissionstorage/search.vue');
				}
				this.PopupShow=true;
				this.componentSrc=this.SearchCom
			},
			//回款
			hankUploadMoney(orderno){
				this.orderno=orderno;
				if(this.uploadcom==null){
					this.uploadcom=()=>import('@/components/Buyer/Intermediarycommissionstorage/uploadMoney.vue');
				}
				this.componentSrc=this.uploadcom;
				this.PopupShow=true;
			}
		},
		filters:{
			//类别格式化
			typeMethod(val){
				if (val == 0)
					 return "卖家端";
				 else
					return "买家端"
			}
		}
	})
</script>

<style scoped>
	
	
</style>
