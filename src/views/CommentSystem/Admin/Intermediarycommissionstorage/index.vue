<template>
	<div>
		<Header title="中介佣金挂账"></Header>
		<ProductList @loadproductdata="loadproductdata" :productTotal="productTotal" :index='index'>
			<div class="goal-item account-item" v-for="(n,i) in productlist" :key="i">
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
				<div class="account-item-bottom" v-if="n.state=='0' || n.remark">
					<div class="account-item-operating" v-if="n.state=='0'" @click='collection(n.rid)'>登记损失</div>
					<div class="account-item-operating" v-if="n.remark" @click="remark(n.remark)">备注</div>
				</div>
			</div>
		</ProductList>
		<van-popup v-model="PopupShow" round position="bottom" safe-area-inset-bottom>
			<component :is="componentSrc" @loadproductdata="loadproductdata" :remarkTxt="remarkTxt"></component>
		</van-popup>
	</div>
</template>

<script>
	import {Button,Popup,Dialog} from 'vant'
	import ProductList from '@/components/ProductList' //下拉加载上拉刷新
	export default({
		name:'MonthlyGoal',
		components:{
			[Button.name]:Button,
			[Popup.name]:Popup,
			[Dialog.Component.name]: Dialog.Component,
			ProductList
		},
		data(){
			return{
				fromorder:{
					OrderNo:'',
					agentname:'',
					username:{
						text:'全部',
						value:'-1'
					},
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
				remarkcom:null,  //备注组件
				SearchCom:null   ,//搜索组件
				remarkTxt:{}
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
						"zjname": this.fromorder.agentname,
						"sjs": this.fromorder.date1,
						"sje": this.fromorder.date2,
						"state": this.fromorder.status.value,
						"orderno": this.fromorder.OrderNo,
						"mjuserid": this.fromorder.username.value
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
					this.SearchCom=()=>import('@/components/Admin/MonthlyGoal/search.vue');
				}
				this.PopupShow=true;
				this.componentSrc=this.SearchCom
			},
			//备注
			remark(rem1){
				if(rem1!=''){
					this.remarkTxt.rem1=rem1
				}
				if(this.remarkcom==null){
					this.remarkcom=()=>import('@/components/Remark');
				}
				this.componentSrc=this.remarkcom
				this.PopupShow=true;
			},
			//登记损失
			collection(rid){
				Dialog.confirm({
				  title: '登记提示',
				  message: '您确定要把该笔记录登记为员工损失吗',
				  beforeClose:async (action, done)=>{
					  if (action === 'confirm') {
						 // let list=this.productlist;
					    await this.axios.get("/Handler/CPManageSystem.ashx?cmd=agentOverDraftToUserOutMoney&rid="+rid).then(res=>{
					     	if(res.data>0){
								this.$toast('登记成功');
								this.loadproductdata('1')
					     	}else{
								this.$toast('登记失败')
					     	}
					     }).catch(xhr=>{console.log(xhr)
							 this.$toast('登记失败')
					     });
						 done();
						 //this.productlist=list;
					  }else{
						  done();
					  }
				  }
				})
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
