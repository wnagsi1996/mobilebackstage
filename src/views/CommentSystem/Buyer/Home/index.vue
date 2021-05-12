<template>
	<div>
		<Header :menuList="true" />
		<div class="one-today public-statue">
			<div class="today-title">
				<h5>数据</h5>
			</div>
			<div class="today-desc">
				<OrderModule v-if="summaryOrderData.length>0" :orderdata="summaryOrderData"/>
			</div>
		</div> 
		
		<!-- 本月折线图 -->
		<canvas class="line" id="container" height="260"></canvas>
		
		<div class="link-item">
			 <div class="link-item1" v-for="(item,index) in module" :key="index" @click="pushlink(item)">
				 <div class="today-title">
					<h5>{{item.title}}</h5>
				 </div>
				 <div class="link-num">{{item.money}}</div>
			 </div>
		</div>
		
		
	</div>
</template>

<script>
	// import F2 from '@antv/f2';
	const F2 = require('@antv/f2/lib/core');
	require('@antv/f2/lib/geom/line'); // 只加载折线图
	// 第一步：加载插件 Tooltip
	const Tooltip = require('@antv/f2/lib/plugin/tooltip');
	// 第二步：注册插件 Tooltip
	F2.Chart.plugins.register(Tooltip); // 这里进行全局注册，也可以给 chart 的实例注册
	// 第一步：加载插件 Legend
	const Legend = require('@antv/f2/lib/plugin/legend');
	// 第二步：注册插件 Legend
	F2.Chart.plugins.register(Legend); // 这里进行全局注册，也可以给 chart 的实例注册
	
	import OrderModule from '@/components/AdminHome/OrderModule.vue'
	import VueCookies from 'vue-cookies'  //引入vue-cookies插件
	import {Dialog} from 'vant'
	export default({
		name:'Home',
		components:{
			[Dialog.Component.name]: Dialog.Component,
			OrderModule
		},
		data(){
			return{
				summaryOrderData:[], //本月数据模块
				module:[],//第一部分模块
				dialogVisible:false,
				reviewNum:0//待留评数量
			}
		},
		created() {
			this.getdata()
			this.getdata1()
			this.getReviewOrder()
		},
		mounted() {
			
		},
		methods:{
			getdata(){
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=getMMJTotalData").then(res=>{
					//console.log(res)
					
					let data=res.data;
					this.module=[
						{
							'title':'待测评订单',
							'money':data.waitcplpnum + data.waitcpmpnum,
							'path':'/evaluationorder',
							'txt':`免:${data.waitcpmpnum} 留：${data.waitcplpnum}`,
							'name':'待测评订单',
							'param':'1'
						},
						{
							'title':'待审核订单',
							'money':data.waitmjshnum,
							'path':'/orderreview',
							'name':'待审核订单',
							'param':'1'
						},
						{
							'title':'待返款订单',
							'money':data.waitfknum,
							'path':'/rebateorder',
							'name':'待返款订单',
							'param':'1'
						},
						{
							'title':'价格异常',
							'money':data.priceycnum,
							'path':'/rebateorder',
							'name':'待返款订单',
							'param':'1'
						},
						{
							'title':'订单审核驳回',
							'money':data.bhmjshnum,
							'param':'0',
							'path':'/evaluationorder',
							'name':'待测评订单',
							'param':'1'
						},
						{
							'title':'损失金额',
							'money':data.outmoney,
							'param':'0'
						},
						{
							'title':'等待财务处理',
							'money':data.waitcwshnum,
							'path':'/financialaudittrail',
							'name':'财务处理进度查询',
							'param':'1'
						},
						{
							'title':'财务审核驳回',
							'money':data.backcwshnum,
							'path':'/financialaudittrail',
							'name':'财务处理进度查询',
							'param':'1'
						}
					];
				}).catch(xhr=>{
					console.log(xhr);
				})
			},
			getdata1(){
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=getMMJCurMonthCPOrderDetailNums_CurUser").then(res=>{
					console.log(res);
					
					//今日刷单免评/留评/退单免评/留评
					let todaySdMpNum,todaySdLpNum,todayTdMpNum,todayTdLpNum;
					
					//本月刷单免评/留评/退单免评/留评
					let monthSdMpNum=0,monthSdLpNum=0,monthTdMpNum=0,monthTdLpNum=0;		
					
					//月份折线图数据
					let LineRow=[]; //折线图数据
					
					if(res.data!=''){
						res.data.monthViews.forEach(item=>{
							monthSdMpNum+=item.mpnum;
							monthSdLpNum+=item.lpnum;
							monthTdMpNum+=item.cmpnum;
							monthTdLpNum+=item.clpnum;
							if(item.ifcurday==1){
								todaySdMpNum=item.mpnum;
								todaySdLpNum=item.lpnum;
								todayTdMpNum=item.cmpnum;
								todayTdLpNum=item.clpnum;
							}
							
							let date = item.day.slice(5);
							
							LineRow.push({
								"date":date,
								"name":'刷单',
								"num":item.mpnum+item.lpnum
							},{
								"date":date,
								"name":'退单',
								"num":item.cmpnum+item.clpnum
							})
						})
					
					//今日数据
					this.summaryOrderData=[  
						{  
							'title':'今日刷单',
							'lpnum':todaySdLpNum,
							'mpnum':todaySdMpNum
						},
						{
							'title':'今日退单',
							'lpnum':todayTdLpNum,
							'mpnum':todayTdMpNum
						},
						{
							'title':'本月刷单',
							'lpnum':monthSdLpNum,
							'mpnum':monthSdMpNum
						},
						{
							'title':'本月退单',
							'lpnum':monthTdLpNum,
							'mpnum':monthTdMpNum
						}
					];
					const chart = new F2.Chart({
					  id: 'container',
					  pixelRatio: window.devicePixelRatio,
					  appendPadding:20
					});
					chart.source(LineRow,{
						num:{
							tickCount: 5
						},
						date: {
						    type: 'cat',
						    tickCount: 5
						  }
					});
					chart.tooltip({
					  showCrosshairs: true
					});
					chart.legend({
					  marker: function marker(x, y, r, ctx) {
					    ctx.lineWidth = 1;
					    ctx.strokeStyle = ctx.fillStyle;
					    ctx.moveTo(x - r - 3, y);
					    ctx.lineTo(x + r + 3, y);
					    ctx.stroke();
					    ctx.arc(x, y, r, 0, Math.PI * 2, false);
					    ctx.fill();
					  }
					});
					chart.line().position('date*num').color('name').shape('smooth')		  
					chart.render();
					
					
					}else{
						console.log('数据加载失败')
					}
				}).catch(xhr=>{
					console.log(xhr)
				})
			},
			//获取留评订单数据
			getReviewOrder(){
				let lpnum=VueCookies.get('lpnum')
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=getNotLPOrderNum").then(res=>{
					if(res.data.rescode==1){
						if(lpnum==null){
							VueCookies.set('lpnum',res.data.resdesc)
							Dialog.confirm({
							  title: '您有'+res.data.resdesc+'订单需要催评',
							  message: '提醒',
							})
							  .then(() => {
							    this.$router.push({path:'/commentorder'})
							  })
							  .catch(() => {
							    // on cancel
							  });
						}
					}
				}).catch(xhr=>{
					
				})
			},
			//打开页面
			pushlink(item){
				//console.log(item);
				if(item.param=='1'){
					if(item.title=='财务审核驳回'){
						this.$router.push({ path: item.path ,query: { type: '2' }})
					}else if(item.title=='等待财务处理'){
						this.$router.push({ path: item.path ,query: { type: '0' }})
					}else{
						this.$router.push({ path: item.path })
					}
				}
				
			}
		}
	})
</script>

<style>
	@import url("../../../../assets/css/style.css");
</style>