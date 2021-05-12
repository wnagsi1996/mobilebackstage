<template>
	<div>
		<Header title="客户订单管理">
			<div slot="search" class="icon-right">
				<van-icon class="iconfont-2x" name="search" @click="search" />
				<van-icon class="iconfont-2x" name="plus" @click="operating('','4')"/>
			</div>
		</Header>
		<ProductList @loadproductdata="loadproductdata" :productTotal="productTotal" :index='index'>
			<div class="goal-item account-item" v-for="(n,i) in productlist" :key="i">
				<div class="goal-item-top">
					<div class="goal-item-info goal-item-info100">
						<span>订单号:</span>
						<em>{{n.orderno}}</em>
					</div>
					<div class="goal-item-info goal-item-info100">
						<span>客户名称:</span>
						<em>{{n.hzsjname}}</em>
					</div>
					<div class="goal-item-info">
						<span>支付选择:</span>
						<em>{{n.payselstr}}</em>
					</div>
					<div class="goal-item-info">
						<span>收款方式:</span>
						<em>{{n.channelstr}}</em>
					</div>
					<div class="goal-item-info">
						<span>应收金额:</span>
						<em>{{n.yskmoney}}</em>
					</div>
					<div class="goal-item-info">
						<span>已收金额:</span>
						<em>{{n.sskmoney}}</em>
					</div>
					<div class="goal-item-info">
						<span>已返款金额:</span>
						<em>{{n.fkmoney}}</em>
					</div>
					<div class="goal-item-info">
						<span>当前利润:</span>
						<em>{{n | profit}}</em>
					</div>
					<div class="goal-item-info">
						<span>订单状态:</span>
						<em>{{n.ztstr}}</em>
					</div>
					<div class="goal-item-info goal-item-info100">
						<span>创建时间:</span>
						<em>{{n.cjsj}}</em>
					</div>
				</div>
				<div class="account-item-bottom">
					<template v-if="n.zt=='0' || n.zt=='3'">
						<div class="account-item-operating" @click="goProduct(n.orderno)">产品</div>
						<div class="account-item-operating" @click="review(n.orderno)">提交审核</div>
						<div class="account-item-operating" @click="del(n.orderno)">删除</div>
					</template>
					<div v-if="n.zt!='0'" class="account-item-operating" @click="goProduct(n.orderno)">产品</div>
					<template v-if="n.zt=='2' || n.zt=='4'">
						<div class="account-item-operating" v-if="n.zt=='2'" @click="operating(n.orderno,'0')">退单</div>
						<div class="account-item-operating" @click="operating(n.orderno,'3')">差价</div>
						<div class="account-item-operating" v-if="n.paysel!='0'" @click="operating(n.orderno,'2')">收款</div>
					</template>
					<div class="account-item-operating" @click="operating(n.orderno,'1')">记事本</div>
					<div class="account-item-operating" @click="viewLog(n.orderno)">日志</div>
				</div>
			</div>
		</ProductList>
		<van-popup v-model="popup.toggle" round position="bottom">
			<component :is="publicCom" :orderno="popup.orderno" :fromorder.sync="fromorder" @loadproductdata="loadproductdata"></component>
		</van-popup>
		<van-dialog v-model="dialogShow" title="提交财务审核" show-cancel-button :before-close="onBeforeClose">
		  <van-field type="number" v-model="cwreview.remark" label="备注" placeholder="备注" />
		</van-dialog>
	</div>
</template>

<script>
	import {Popup,Dialog,Field} from 'vant'
	import ProductList from '@/components/ProductList' //下拉加载上拉刷新
	export default({
		name:'ClientOrder',
		components:{
			[Popup.name]:Popup,
			[Field.name]:Field,
			[Dialog.Component.name]: Dialog.Component,
			ProductList
		},
		data(){
			return{
				//搜索内容
				fromorder:{
					OrderNo:'',
					name:'',
					orderStaus:{
						value:'-1',
						text:'全部'
					},
					date1:'',
					date2:''
				},
				productTotal:false,  //是否没有产品可加载
				index:0,  
				productlist:[], //列表数据
				popup:{  //弹框
					toggle:false,
					orderno:''
				},  
				publicCom:null,  //公共组件
				searchCom:null ,//动态引入搜索组件地址
				workLogCom:null ,//动态引入记事本组件地址
				spreadCom:null ,//动态引入补退差价组件地址
				chargeBackCom:null ,//动态引入退单退款组件地址
				addPaymentCom:null ,//动态引入新增收款组件地址
				cwreview:{  //提交财务审核备注
					remark:'',
					orderno:''
				} ,
				dialogShow:false  //提交财务审核的弹窗状态
			}
		},
		methods:{
			// 获取列表数据
			loadproductdata(i=0){
				this.popup.toggle=false
				if(i!=0){
					this.index=0
				}
				this.loading=true;
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=getTopProductList",{
					params:{
						"pageSize":20,                         //页面大小
						"pageNum":this.index,   //页码
						"ddh": this.fromorder.OrderNo,
						"hzsjname": this.fromorder.name,
						"zt": this.fromorder.orderStaus.value,
						"sjs":this.fromorder.date1,
						"sje": this.fromorder.date2
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
			//查看日志
			viewLog(orderno){
				this.$router.push({path:'/log', query: { orderno: orderno }})
			},
			//搜索
			search(){
				if(this.searchCom==null){
					this.searchCom=()=>import('@/components/Seller/ClientOrder/search.vue')
				}
				this.publicCom=this.searchCom
				this.popup.toggle=true
			},
			//提交财务审核
			review(orderno){
				this.dialogShow=true
				this.cwreview.orderno=orderno;
				
			},
			//审核提交
			onBeforeClose(action, done){
				if(action==='confirm'){
					this.axios.get("/Handler/CPManageSystem.ashx?cmd=comitTOPCPOrder&toporderno="+this.cwreview.orderno+"&remark="+this.cwreview.remark).then(res=>{
						console.log(res);
						if(res.data.rescode>0){
							this.$toast('提交成功');
							this.loadproductdata('1')
							this.cwreview=this.$options.data().cwreview
							return done()
						}else{
							this.$toast('提交失败')
							return done(false)
						}
					}).catch(xhr=>{
						this.$toast('提交失败')
						return done(false)
					})
				}else{
					 return done()
				}
			},
			// 删除
			del(orderno){
				Dialog.confirm({
				  title: '删除提示',
				  message: '确认要删除该订单吗?',
				  beforeClose:async (action, done)=>{
					  if (action === 'confirm') {
						 // let list=this.productlist;
						await this.axios.get("/Handler/CPManageSystem.ashx?cmd=delTOPCPOrder&topordernos="+orderno).then(res=>{
							if(res.data>0){
								this.$toast('删除成功');
								this.productlist.forEach((n,i)=>{
									if(n.orderno==orderno){
										this.productlist.splice(i,1);
									}
								})
							}else{
								this.$toast('删除失败!')
							}
						 }).catch(xhr=>{console.log(xhr)
							 this.$toast('删除失败!')
						 });
						 done();
						 //this.productlist=list;
					  }else{
						  done();
					  }
				  }
				})
			},
			//操作
			operating(orderno='',type){
				switch(type){  
					case '0'://退单
						if(this.chargeBackCom==null){
							this.chargeBackCom=()=>import('@/components/Seller/ClientOrder/chargeback.vue')
						}
						this.publicCom=this.chargeBackCom;
						break
					case '1'://记事本
						if(this.workLogCom==null){
							this.workLogCom=()=>import('@/components/Seller/ClientOrder/worklog.vue')
						}
						this.publicCom=this.workLogCom;
						break
					case '2'://新增收款
						if(this.addPaymentCom==null){
							this.addPaymentCom=()=>import('@/components/Seller/ClientOrder/addPayment.vue')
						}
						this.publicCom=this.addPaymentCom;
						break
					case '3'://补退差价
						if(this.spreadCom==null){
							this.spreadCom=()=>import('@/components/Seller/ClientOrder/spread.vue')
						}
						this.publicCom=this.spreadCom;
						break;
					case '4'://搜索
						if(this.searchCom==null){
							this.searchCom=()=>import('@/components/Seller/ClientOrder/addOrder.vue')
						}
						this.publicCom=this.searchCom;
						break
				}
				this.popup.orderno=orderno;
				this.popup.toggle=true
			},
			goProduct(orderno){
				this.$router.push({path:'/addproduct', query: { orderno: orderno }})
			}
		},
		filters:{
			profit(val){
				return (val.sskmoney-val.fkmoney).toFixed(2)
			}
		}
	})
</script>

<style>
</style>
