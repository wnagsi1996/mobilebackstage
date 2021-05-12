<template>
	<div>
		<Header title="操作日志"> 
			<div slot="search" class="icon-right">
				<van-icon class="iconfont-2x" name="search" @click="search" />
			</div>
		</Header>
		<ProductList @loadproductdata="loadproductdata" :productTotal="productTotal" :index='index'>
			<div class="log">
				<div class="log-item" v-for="(log,index) in loglist" :key="index">
					<div class="log-title">
						<div class="log-title-info log-title-left">
							{{log.czusername}}
						</div>
						<div class="log-title-info log-title-right">
							{{log.cztype}}
						</div>
					</div>
					<p>订单号：{{log.orderno}}</p>
					<div class="log-desc">
						
						{{log | remark}}
						<van-icon v-if="log.fkimgurl!=''" style="color: #E41C1D;" name="photo" @click="dialogShowImg(log.fkimgurl)" />
					</div>
				</div>
			</div>
		</ProductList>
		<van-dialog v-model="dialogShow">
		  <img style="width: 100%;" :src="dialogImgSrc" />
		</van-dialog>
		<van-popup v-model="PopupShow" round position="bottom" safe-area-inset-bottom>
			<component :is="searchCom" :fromorder.sync="fromorder"
			 @loadproductdata="loadproductdata"></component>
		</van-popup>
	</div>
</template>

<script>
	import ProductList from '@/components/ProductList'
	import {Cell, CellGroup,Dialog,Popup } from 'vant';
	export default({
		name:'SysLogManage',
		components:{
			[Cell.name]:Cell,
			[CellGroup.name]:CellGroup,
			[Dialog.Component.name]: Dialog.Component,
			[Popup.name]: Popup,
			ProductList
		},
		data(){
			return{
				index:0,
				loglist:[],
				productTotal:false,  //是否没有产品可加载
				fromorder:{
					OrderNo:'',
					keyword:'',
					name:{
						text:'全部',
						value:'-1'
					},
					date1:'',
					date2:''
				},
				dialogShow:false,
				dialogImgSrc:'', //图片地址
				searchCom:null  ,//搜索组件
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
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=getGLCPLogList",{
					params:{
						"pageSize":20,                         //页面大小
						"pageNum":this.index,
						"orderno":this.fromorder.OrderNo,
						"czuserid":this.fromorder.name.value,
						"sczsjs":this.fromorder.date1,
						"czsje":this.fromorder.date2,
						"keyword":this.fromorder.keyword
					}
				}).then(res=>{
					//this.pagination.total=res.data.results;
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
			//显示图片
			dialogShowImg(src){
				this.dialogShow=true;
				this.dialogImgSrc=src;
			},
			search(){
				if(this.searchCom==null){
					this.searchCom=()=>import('@/components/Admin/SysLogManage/search.vue')
				}
				this.PopupShow=true
			}
		},
		filters:{
			remark(val){
				if(val.czremark==''){
					return val.czdatetime;
				}else{
					return `${val.czdatetime} ${val.czremark}`;
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
