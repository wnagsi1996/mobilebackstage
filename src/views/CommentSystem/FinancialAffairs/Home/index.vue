<template>
	<div>
		<Header :menuList="true"></Header>
		<van-notice-bar v-if="promptdataTxt"
		  left-icon="volume-o"
		  :text="promptdataTxt"
		/>
		<div class="aims-circle">
			<div class="aims-circle1" v-for="(item,index) in todaydesc" :key="index">
				<div class="aims-title">
					<h5>{{item.title}}</h5>
				</div>
				<div class="money-cw">
					{{item.money}}
				</div>
			</div>
		</div>
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
		
		<div class="userlist">
			<van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }">
			  卖家端成员
			</van-divider>
			<div class="userlist-grids">
				<div class="userinfo-grids" v-for="(item,index) in selerUserList" :key="index" @click="hankSelerinfodata(item)">{{item.username}}</div>
			</div>
		</div>
		
		<div class="userlist">
			<van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }">
			  买家端成员
			</van-divider>
			<div class="userlist-grids">
				<div class="userinfo-grids" v-for="(item,index) in buyerUserList" :key="index" @click="hankBuyerinfodata(item)">{{item.username}}</div>
			</div>
		</div>
		
		<van-popup v-model="PopupShow" round position="bottom" :style="{ minHeight: '35%' }">
			<component :is="publicCom" :userdata="userdata"></component>
		</van-popup>
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
	import {Divider,Circle,Popup,NoticeBar } from 'vant'
	export default({
		name:'Home',
		components:{
			OrderModule,
			[Divider.name]:Divider,
			[Circle.name]:Circle,
			[Popup.name]:Popup,
			[NoticeBar.name]:NoticeBar
		},
		data(){
			return{
				summaryOrderData:[]   ,//今日汇总和本月汇总数据
				selerUserList:{},  //卖家端人员列表
				buyerUserList:{},//买家端人员列表
				buycurrentRate:0,
				sellercurrentRate:0,
				seleUserListInfo:[],  //卖家端人员详细数据
				buyerUserListInfo:[] ,//买家端人员详细数据
				selerAllUserInfo:{}  ,//卖家各个成员数据
				buyerAllUserInfo:{}, //买家各个成员数据
				userdata:[],  //传给组件的数据
				PopupShow:false,  //弹出层组件显示隐藏
				publicCom:null,
				todaydesc:[] ,//财务数据
				promptdataTxt:'',  //待处理数据
			}
		},
		
		created() {
			this.getdata1();
			this.prompt()
		},
		mounted() {
			this.getcwdata();
			setTimeout(()=>{
				this.getBuyerUser();
				this.getSelerUser();
			},3000)
		},
		methods:{
			//获取待审核数据
			prompt(){
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=getCWWaitDoRecordNum").then(res=>{
					if(res.data!=''){
						if(res.data.srnum!=0 && res.data.zcnum!=0){
							this.promptdataTxt=`您有${res.data.srnum}单收款待确认,${res.data.zcnum}单返款待处理`
						}else if(res.data.srnum!=0){
							this.promptdataTxt=`您有${res.data.srnum}单收款待确认`
						}else if(res.data.zcnum!=0){
							this.promptdataTxt=`您有${res.data.zcnum}单返款待处理`
						}
						
					}
				}).catch(xhr=>{
					console.log(xhr)
				})
			},
			getcwdata(){
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=getCurDayCWTotalTotalData").then(res=>{
					//console.log(res);
					let data=res.data;
					const monthfince=[
						{
							'title':'今日收款总金额',
							'money':(data.todaysktotalmoney).toFixed(2)
						},
						{
							'title':'今日支出总金额',
							'money':data.todayzctotalmoney
						}
					];
					this.todaydesc=monthfince;
				}).catch(xhr=>{
					console.log(xhr)
				})
			},
			
			//月份每一天数据
			getdata1(){
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=getCurMonthCPOrderDetailNums").then(res=>{
					//console.log(res);
					//今日接单免评/留评/刷单免评/留评/卖家退单免评/留评/买家退单免评/留评
					let todayJdMpNum,todayJdLpNum,todaySdMpNum,todaySdLpNum,todayTdMpNum,todayTdLpNum,todayCdMpNum,todayCdLpNum;
					
					//月份接单免评/留评/刷单免评/留评/卖家退单免评/留评/买家退单免评/留评
					let monthJdMpNum=0,monthJdLpNum=0,monthSdMpNum=0,monthSdLpNum=0,monthTdMpNum=0,monthTdLpNum=0,monthCdMpNum=0,monthCdLpNum=0;		
					let LineRow=[]; //折线图数据
					
					if(res.data!=''){
						res.data.monthViews.forEach((item,value)=>{
							monthJdMpNum+=item.jdmpnum;
							monthJdLpNum+=item.jdlpnum;
							monthSdMpNum+=item.sdmpnum;
							monthSdLpNum+=item.sdlpnum;
							monthTdMpNum+=item.tdmpnum;
							monthTdLpNum+=item.tdlpnum;
							monthCdMpNum+=item.cdmpnum;
							monthCdLpNum+=item.cdlpnum;
							if(item.ifcurday==1){
								todayJdMpNum=item.jdmpnum;
								todayJdLpNum=item.jdlpnum;
								todaySdMpNum=item.sdmpnum;
								todaySdLpNum=item.sdlpnum;
								todayTdMpNum=item.tdmpnum;
								todayTdLpNum=item.tdlpnum;
								todayCdMpNum=item.cdmpnum;
								todayCdLpNum=item.cdlpnum;
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
								"num":item.sdmpnum+item.sdlpnum
							},{
								"date":date,
								"name":'买家退单',
								"num":item.cdmpnum+item.cdlpnum
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
					
					this.summaryOrderData.push(todayData);
					this.summaryOrderData.push(monthData);
					
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
			//获取买家端用户列表
			getBuyerUser(){
				this.axios.get('/Handler/CPManageSystem.ashx?cmd=getMMJUserList&pageindex=0&len=100').then(res=>{
					if(res.data!=''){
						//console.log(res.data)
						this.buyerUserList=res.data.rows;
					}
				}).catch(xhr=>{
					
				})
			},
			//获取卖家端用户列表
			getSelerUser(){
				this.axios.get('/Handler/CPManageSystem.ashx?cmd=getMJUserList&pageindex=0&len=100').then(res=>{
					if(res.data!=''){
						this.selerUserList=res.data.rows;
					}
				}).catch(xhr=>{
					
				})
			},
			//获取卖家端人员本月数据
			hankSelerinfodata(user){
				if(this.publicCom==null){
					this.publicCom=()=>import('@/components/AdminHome/userDescData.vue');
				}
				this.PopupShow=true;
				this.userdata=[];
				if(this.selerAllUserInfo[user.userid]!=undefined){
					this.selerUserInfoData(this.selerAllUserInfo[user.userid],user);
				}else{
					this.axios.get('/Handler/CPManageSystem.ashx?cmd=getMJCurMonthCPOrderDetailNums&userid=' + user.userid).then(res=>{
						if(res.data!=''){
							this.selerAllUserInfo[user.userid]=res.data.monthViews;
							this.selerUserInfoData(res.data.monthViews,user);
						}
					}).catch(xhr=>{
						
					})
				}
			},
			//解析卖家端用户数据
			selerUserInfoData(data,user){
				//let dayjdlpnum,dayjdmpnum,daytdlpnum,daytdmpnum,daysdlpnum,daysdmpnum,daycdlpnum,daycdmpnum;  //今日数据
				let monthjdlpnum=0,monthjdmpnum=0,monthtdlpnum=0,monthtdmpnum=0,monthsdlpnum=0,monthsdmpnum=0,monthcdlpnum=0,monthcdmpnum=0; //本月数据
				let daydata={},monthdata={}; //今日数据，月份数据
				
				data.forEach(item=>{
					if(item.ifcurday==1){  //判断是否是今日
						daydata.dayjdlpnum=item.jdlpnum;
						daydata.dayjdmpnum=item.jdmpnum;
						daydata.daytdlpnum=item.tdlpnum;
						daydata.daytdmpnum=item.tdmpnum;
						daydata.daysdlpnum=item.tdsdlpnum;
						daydata.daysdmpnum=item.tdsdmpnum;
						daydata.daycdlpnum=item.tdcdlpnum;
						daydata.daycdmpnum=item.tdcdmpnum;
					}
					
					monthjdlpnum+=item.jdlpnum;
					monthjdmpnum+=item.jdmpnum;
					monthtdlpnum+=item.tdlpnum;
					monthtdmpnum+=item.tdmpnum;
					monthsdlpnum+=item.tdsdlpnum;
					monthsdmpnum+=item.tdsdmpnum;
					monthcdlpnum+=item.tdcdlpnum;
					monthcdmpnum+=item.tdcdmpnum;
					
				});
				
				monthdata.monthjdlpnum=monthjdlpnum
				monthdata.monthjdmpnum=monthjdmpnum
				monthdata.monthtdlpnum=monthtdlpnum
				monthdata.monthtdmpnum=monthtdmpnum
				monthdata.monthsdlpnum=monthsdlpnum
				monthdata.monthsdmpnum=monthsdmpnum
				monthdata.monthcdlpnum=monthcdlpnum
				monthdata.monthcdmpnum=monthcdmpnum
				
				this.userdata.push(daydata);
				this.userdata.push(monthdata);
				this.userdata.push(user);
			},
			//获取买家端人员本月数据
			hankBuyerinfodata(user){
				if(this.publicCom==null){
					this.publicCom=()=>import('@/components/AdminHome/userDescData.vue');
				}
				this.PopupShow=true;
				this.userdata=[];
				if(this.buyerAllUserInfo[user.userid]!=undefined){
					this.buyerUserInfoData(this.buyerAllUserInfo[user.userid],user);
				}else{
					this.axios.get('/Handler/CPManageSystem.ashx?cmd=getMMJCurMonthCPOrderDetailNums&userid=' + user.userid).then(res=>{
						
						if(res.data!=''){
							this.buyerAllUserInfo[user.userid]=res.data.monthViews;
							this.buyerUserInfoData(res.data.monthViews,user);
						}
					}).catch(xhr=>{
						
					})
				}
			},
			//买家端人员数据解析
			buyerUserInfoData(data,user){
				//let dayjdlpnum,dayjdmpnum,daytdlpnum,daytdmpnum,daysdlpnum,daysdmpnum,daycdlpnum,daycdmpnum;  //今日数据
				let monthsdlpnum=0,monthsdmpnum=0,monthcdlpnum=0,monthcdmpnum=0; //本月数据
				let daydata={},monthdata={}; //今日数据
				
				data.forEach(item=>{
					if(item.ifcurday==1){  //判断是否是今日
						daydata.daysdlpnum=item.lpnum;
						daydata.daysdmpnum=item.mpnum;
						daydata.daycdlpnum=item.clpnum;
						daydata.daycdmpnum=item.cmpnum;
					}
					
					monthsdlpnum+=item.lpnum;
					monthsdmpnum+=item.mpnum;
					monthcdlpnum+=item.clpnum;
					monthcdmpnum+=item.cmpnum;
					
				});
				
				monthdata.monthsdlpnum=monthsdlpnum
				monthdata.monthsdmpnum=monthsdmpnum
				monthdata.monthcdlpnum=monthcdlpnum
				monthdata.monthcdmpnum=monthcdmpnum
				
				
				this.userdata.push(daydata);
				this.userdata.push(monthdata);
				this.userdata.push(user);
			},
		}
	})
</script>

<style scoped>
	@import url("../../../../assets/css/style.css");
 	.money-cw{font-size:24px;padding-left: 5px;color: #1989FA;}
</style>
