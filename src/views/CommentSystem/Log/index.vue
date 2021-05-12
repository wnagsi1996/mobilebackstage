<template>
	<div>
		<Header title="订单操作日志"> </Header>
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
	</div>
</template>

<script>
	import ProductList from '@/components/ProductList'
	import {Cell, CellGroup,Dialog   } from 'vant';
	export default({
		name:'Log',
		components:{
			[Cell.name]:Cell,
			[CellGroup.name]:CellGroup,
			[Dialog.Component.name]: Dialog.Component,
			ProductList
		},
		data(){
			return{
				index:0,
				loglist:[],
				productTotal:false,  //是否没有产品可加载
				orderno:'',
				dialogShow:false,
				dialogImgSrc:''
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
		},
		mounted() {
			
		},
		methods:{
			loadproductdata(i=0){
				if(i!=0){
					this.index=0
				}
				this.loading=true;
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=getCPLogList",{
					params:{
						"len":20,                         //页面大小
						"pageindex":this.index,
						"orderno":this.orderno
					}
				}).then(res=>{console.log(res)
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
			dialogShowImg(src){
				this.dialogShow=true;
				this.dialogImgSrc=src;
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
