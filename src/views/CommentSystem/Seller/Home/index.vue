<template>
	<div>
		<Header :menuList="true"></Header>
		<div class="one-today public-statue">
			<div class="today-title">
				<h5>当天数据</h5>
			</div>
			<div class="today-desc">
				<OrderModule v-if="summaryOrderData.length>0" :orderdata="summaryOrderData[0]"/>
			</div>
		</div> 
		<div class="one-today public-statue">
			<div class="today-title">
				<h5>当月数据</h5>
			</div>
			<div class="today-desc">
				<OrderModule v-if="summaryOrderData.length>0" :orderdata="summaryOrderData[1]"/>
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
	
	export default({
		name:'Home',
		components:{
			OrderModule
		},
		data(){
			return{
				summaryOrderData:[]   ,//今日汇总和本月汇总数据
				aimsdata:{},  //目标
				module:[],
				twodata:[],
				outmoney:''
			}
		},
		mounted() {
			this.getdata()
			this.getdata1()
		},
		methods:{
			getdata(){
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=getMJTotalData").then(res=>{
					//console.log(res);
					let data=res.data;
					this.module=[
						{
							'title':'单号待审核',
							'money':data.waitshnum,
							'path':'/revieworder',
							'name':'单号待审核',
							'param':'1'
						},
						{
							'title':'等待财务处理',
							'money':data.waitcwshnum,
							'path':'/financialaudittrail',
							'name':'财务处理进度查询',
							'param':'1'
						},
						{
							'title':'最新留评订单',
							'money':data.newlpnum,
							'path':'/commentnotification',
							'name':'最新留评单',
							'param':'1'
						},
						{
							'title':'财务驳回',
							'money':data.backcwshnum,
							'path':'/financialaudittrail',
							'name':'财务处理进度查询',
							'param':'1'
						},
						{
							'title':'待刷订单',
							'money':data.lsdslpnum+data.lsdsmpnum,
							'param':'0'
						},
						{
							'title':'待刷产品',
							'money':data.lsdscpnum,
							'param':'0'
							//'txt':`单数:${data.todaybcjnum}`
						}
					];
					
					this.twodata.push(data.lsdsmpnum,data.lsdslpnum,data.lsdscpnum);
				})
			},
			getdata1(){
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=getMJCurMonthCPOrderDetailNums_CurUser").then(res=>{
					console.log(res);
					
					//今日接单免评/留评/刷单免评/留评/卖家退单免评/留评/买家退单免评/留评
					let todayJdMpNum,todayJdLpNum,todaySdMpNum,todaySdLpNum,todayTdMpNum,todayTdLpNum,todayCdMpNum,todayCdLpNum;
					
					//月份接单免评/留评/刷单免评/留评/卖家退单免评/留评/买家退单免评/留评
					let monthJdMpNum=0,monthJdLpNum=0,monthSdMpNum=0,monthSdLpNum=0,monthTdMpNum=0,monthTdLpNum=0,monthCdMpNum=0,monthCdLpNum=0;		
					
					let LineRow=[]; //折线图数据
					
					if(res.data!=''){
						res.data.monthViews.forEach(item=>{
							monthJdMpNum+=item.jdmpnum;
							monthJdLpNum+=item.jdlpnum;
							monthSdMpNum+=item.tdsdmpnum;
							monthSdLpNum+=item.tdsdlpnum;
							monthTdMpNum+=item.tdmpnum;
							monthTdLpNum+=item.tdlpnum;
							monthCdMpNum+=item.tdcdmpnum;
							monthCdLpNum+=item.tdcdlpnum;
							if(item.ifcurday==1){
								todayJdMpNum=item.jdmpnum;
								todayJdLpNum=item.jdlpnum;
								todaySdMpNum=item.tdsdmpnum;
								todaySdLpNum=item.tdsdlpnum;
								todayTdMpNum=item.tdmpnum;
								todayTdLpNum=item.tdlpnum;
								todayCdMpNum=item.tdcdmpnum;
								todayCdLpNum=item.tdcdlpnum;
							}
							
							let date = item.day.slice(5);
							
							LineRow.push({
								"date":date,
								"name":'接单',
								"num":item.jdmpnum+item.jdlpnum
							},{
								"date":date,
								"name":'卖家退单',
								"num":item.tdmpnum+item.tdlpnum
							},{
								"date":date,
								"name":'刷单',
								"num":item.tdsdmpnum+item.tdsdlpnum
							},{
								"date":date,
								"name":'买家退单',
								"num":item.tdcdmpnum+item.tdcdlpnum
							})
						})
					
					//今日数据
					const todayData=[  
						{  
							'title':'接单',
							'lpnum':todayJdLpNum,
							'mpnum':todayJdMpNum
						},
						{
							'title':'商家退单',
							'lpnum':todayTdLpNum,
							'mpnum':todayTdMpNum
						},
						{
							'title':'刷单',
							'lpnum':todaySdLpNum,
							'mpnum':todaySdMpNum
						},
						{
							'title':'买家退单',
							'lpnum':todayCdLpNum,
							'mpnum':todayCdMpNum
						}
					];
					
					//本月数据
					const monthData=[  
						{  
							'title':'接单',
							'lpnum':monthJdLpNum,
							'mpnum':monthJdMpNum
						},
						{
							'title':'商家退单',
							'lpnum':monthTdLpNum,
							'mpnum':monthTdMpNum
						},
						{
							'title':'刷单',
							'lpnum':monthSdLpNum,
							'mpnum':monthSdMpNum
						},
						{
							'title':'买家退单',
							'lpnum':monthCdLpNum,
							'mpnum':monthCdMpNum
						}
					]
					let percentage=Number((((monthJdLpNum+monthJdMpNum)-(monthTdLpNum+monthTdMpNum))/res.data.monthPlantNum*100).toFixed(2))
					//目标汇总数据
					this.aimsdata={
						'aims':res.data.monthPlantNum,
						'jdnum':monthJdLpNum+monthJdMpNum,
						'tdnum':monthTdLpNum+monthTdMpNum,
						'percentage':percentage<0?0:percentage
					}
					
					this.summaryOrderData.push(todayData);
					this.summaryOrderData.push(monthData);
					
					
					this.outmoney=res.data.outmoney;
					
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
			pushlink(item){
				//console.log(item);
				if(item.param=='1'){
					if(item.title=='财务驳回'){
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

<style scoped>
	@import url("../../../../assets/css/style.css");
</style>
