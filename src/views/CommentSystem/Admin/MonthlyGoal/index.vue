<template>
	<div>
		<Header title="员工月份目标管理">
			<div slot="search" class="icon-right">
				<van-icon class="iconfont-2x" name="search" @click="search" />
				<van-icon class="iconfont-2x" name="plus" @click="addOrEdit"/>
			</div>
		</Header>
		<ProductList @loadproductdata="loadproductdata" :productTotal="productTotal" :index='index'>
			<div class="goal-item goal-item-center" v-for="(n,i) in productlist" :key="i">
				<div class="goal-item-top">
					<div class="goal-item-info">
						<span>姓名:</span>
						<em>{{n.username}}</em>
					</div>
					<div class="goal-item-info">
						<span>时间:</span>
						<em>{{n.month}}</em>
					</div>
					<div class="goal-item-info">
						<span>目标:</span>
						<em>{{n.plantnum}}</em>
					</div>
					<div class="goal-item-info">
						<span>类别:</span>
						<em>{{n.usertype | typeMethod}}</em>
					</div>
				</div>
				<div class="goal-item-bottom">
					<van-icon class="iconfont-2x" name="edit"  @click="addOrEdit(n)" />
				</div>
			</div>
		</ProductList>
		<van-popup v-model="PopupShow" round position="bottom" safe-area-inset-bottom>
			<component :is="componentSrc" :userMonthAims.sync="userMonthAims" :fromAccount.sync="fromAccount" 
			@loadproductdata="loadproductdata" @editSuccess="editSuccess"></component>
		</van-popup>
	</div>
</template>

<script>
	import {Button,Popup} from 'vant'
	import ProductList from '@/components/ProductList' //下拉加载上拉刷新
	import {mapGetters} from 'vuex'
	export default({
		name:'MonthlyGoal',
		components:{
			[Button.name]:Button,
			[Popup.name]:Popup,
			ProductList
		},
		computed:{
			...mapGetters([
				'allUserList'
			])
		},
		data(){
			return{
				fromAccount:{
					name:{
						text:'全部',
						value:'0'
					},
					monthly:'',
					selstate:{
						text:'全部',
						value:'-1'
					}
				},
				productTotal:false,  //是否没有产品可加载
				index:0,  
				productlist:[], //列表数据
				PopupShow:false,  //搜索弹框
				userMonthAims:{},  //编辑月份目标传的数据
				componentSrc:null ,//动态引入组件地址
				AddAimsCom:null,   //添加OR编辑的组件
				SearchCom:null   //搜索组件
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
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=getUserPlantList",{
					params:{
						"pageSize":20,                         //页面大小
						"pageNum":this.index,   //页码
						"month":this.fromAccount.monthly,
						"usertype":this.fromAccount.selstate.value,
						"userid":this.fromAccount.name.value
					}
				}).then(res=>{
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
			//添加或编辑月份目标
			addOrEdit(n={}){
				if(this.AddAimsCom==null){
					this.AddAimsCom=()=>import('@/components/Admin/MonthlyGoal/add.vue');
				}
				this.PopupShow=true;
				this.userMonthAims=n;
				this.componentSrc=this.AddAimsCom
			},
			//编辑成功后给子组件回调
			editSuccess(){
				this.PopupShow=false;
				this.productlist.forEach((value, index, array)=>{
					if(value.rid==this.userMonthAims.rid){
						this.productlist[index]=this.userMonthAims;
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
