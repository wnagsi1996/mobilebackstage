<template>
	<div>
		<Header title="测评中介管理">
			<div slot="search" class="icon-right">
				<van-icon class="iconfont-2x" name="search" @click="search" />
				<van-icon class="iconfont-2x" name="plus" @click="addOrEdit()"/>
			</div>
		</Header>
		<ProductList @loadproductdata="loadproductdata" :productTotal="productTotal" :index='index'>
			<div class="goal-item account-item" v-for="(n,i) in productlist" :key="i">
				<div class="goal-item-top">
					<div class="goal-item-info">
						<span>中介名称:</span>
						<em>{{n.name}}</em>
					</div>
					<div class="goal-item-info">
						<span>收款渠道:</span>
						<em>{{n.sktypestr}}</em>
					</div>
					<div class="goal-item-info goal-item-info100">
						<span>收款账号:</span>
						<em>{{n.skaccount}}</em>
						<van-icon class="iconfont-lg" v-if="n.fkImgUrl" name="photo" @click="dialogShowImg(n.fkImgUrl)" />
					</div>
					<div class="goal-item-info goal-item-info100">
						<span>联系方式:</span>
						<em>{{n.lxfs}}</em>
					</div>
					<div class="goal-item-info">
						<span>哪一端:</span>
						<em>{{n.agenttype | typeMethod}}</em>
					</div>
					<div class="goal-item-info">
						<span>创建人员:</span>
						<em>{{n.mjusername}}</em>
					</div>
					<div class="goal-item-info goal-item-info100">
						<span>创建时间:</span>
						<em>{{n.insertdate}}</em>
					</div>
				</div>
				<div class="account-item-bottom">
					<div class="account-item-operating" @click="addOrEdit(n)">编辑</div>
					<div class="account-item-operating" @click="del(n.rid)">删除</div>
				</div>
			</div>
		</ProductList>
		<van-popup v-model="PopupShow" round position="bottom" safe-area-inset-bottom>
			<component :is="componentSrc" :userInfo="userInfo" :fromAccount.sync="fromAccount"
			 @loadproductdata="loadproductdata"></component>
		</van-popup>
		
		<van-dialog v-model="dialogShow">
		  <img  style="width: 100%;" :src="dialogImgSrc" />
		</van-dialog>
	</div>
</template>

<script>
	import {Popup,Dialog} from 'vant'
	import ProductList from '@/components/ProductList' //下拉加载上拉刷新
	export default({
		name:'MonthlyGoal',
		components:{
			[Dialog.Component.name]: Dialog.Component,
			[Popup.name]:Popup,
			ProductList
		},
		data(){
			return{
				fromAccount:{
					name:''
				},
				productTotal:false,  //是否没有产品可加载
				index:0,  
				productlist:[], //列表数据
				PopupShow:false,  //搜索弹框
				componentSrc:null ,//动态引入组件地址
				addOrEditCom:null,   //添加OR编辑的组件
				SearchCom:null   ,//搜索组件
				userInfo:{},
				dialogShow:false,
				dialogImgSrc:''
			}
		},
		created() {
			//console.log(this.account);
		},
		methods:{
			// 获取列表数据
			loadproductdata(i=0){
				this.PopupShow=false
				if(i!=0){
					this.index=0
				}
				this.loading=true;
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=getCPAgentLists",{
					params:{
						"pageSize":20,                         //页面大小
						"pageNum":this.index,   //页码
						"zjname": this.fromAccount.name
					}
				}).then(res=>{
					if(this.index==0){
						this.productlist=[];
						// this.productTotal=false
					}
					this.index++;
					this.productlist = this.productlist.concat(res.data.rows);console.log()
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
					this.SearchCom=()=>import('@/components/Intermediary/search.vue');
				}
				this.PopupShow=true;
				this.componentSrc=this.SearchCom
			},
			//添加或编辑用户信息
			addOrEdit(userInfo={}){
				if(this.addOrEditCom==null){
					this.addOrEditCom=()=>import('@/components/Intermediary/addORedit.vue');
				}
				this.PopupShow=true;
				this.userInfo=userInfo;
				this.componentSrc=this.addOrEditCom
			},
			//显示图片
			dialogShowImg(src){
				this.dialogShow=true;
				this.dialogImgSrc=src;
			},
			//删除
			del(zjid){
				Dialog.confirm({
				  title: '删除提示',
				  message: '确认要删除选中的中介吗',
				  beforeClose:async (action, done)=>{
					  if (action === 'confirm') {
					    await this.axios.get("/Handler/CPManageSystem.ashx?cmd=delCPAgent&zjid="+zjid).then(res=>{
					     	if(res.data>0){
								this.$toast('删除成功');
								this.productlist=this.productlist.filter(item=>item.rid!=zjid);
					     	}else{
								this.$toast('删除失败,可能原因：该中介已操作过相关订单信息将无法删除!')
					     	}
					     }).catch(xhr=>{console.log(xhr)
							 this.$toast('删除失败')
					     });
						 done();
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
					 return "买家端中介";
				else
					return "卖家端中介"
			}
		}
	})
</script>

<style scoped>
	
</style>
