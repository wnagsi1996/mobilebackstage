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
		
		<div class="aims-circle" v-if="summarytotalData.length>0">
			<div class="aims-circle1">
				<div class="aims-title">
					<h5>买家端目标</h5>
				</div>
				<div class="aims-info">
					<van-circle
					  v-model="buycurrentRate"
					  :rate="summarytotalData[0].BuyerPercentage"
					  :speed="100"
					  :text="buytext"
					  size="70px"
					  layer-color="WhiteSmoke"
					  class="aims-circle-left"
					/>
					<div class="aims-desc">
						<p>目标：{{summarytotalData[0].aims}}</p>
						<p>接单：{{summarytotalData[0].sdnum}}</p>
						<p>退单：{{summarytotalData[0].cdnum}}</p>
						<p>完成：{{summarytotalData[0].num}}</p>
					</div>
				</div>
			</div>
			<div class="aims-circle1">
				<div class="aims-title">
					<h5>卖家端目标</h5>
				</div>
				<div class="aims-info">
					<van-circle
					  v-model="sellercurrentRate"
					  :rate="summarytotalData[1].SelerPercentage"
					  :speed="100"
					  :text="sellertext"
					  size="20vw"
					  layer-color="WhiteSmoke"
					  class="aims-circle-left"
					/>
					<div class="aims-desc">
						<p>目标：{{summarytotalData[1].aims}}</p>
						<p>接单：{{summarytotalData[1].jdnum}}</p>
						<p>退单：{{summarytotalData[1].tdnum}}</p>
						<p>完成：{{summarytotalData[1].num}}</p>
					</div>
				</div>
				
				
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
	import {Divider,Circle,Popup} from 'vant'
	export default({
		name:'Home',
		components:{
			OrderModule,
			[Divider.name]:Divider,
			[Circle.name]:Circle,
			[Popup.name]:Popup
		},
		data(){
			return{
				summaryOrderData:[]   ,//今日汇总和本月汇总数据
				summarytotalData:[]   ,//目标汇总
				selerUserList:{},  //卖家端人员列表
				buyerUserList:{},//买家端人员列表
				selerInfo:[],    //卖家成员本月数据
				buyerInfo:[]   ,//买家成员本月数据
				buycurrentRate:0,
				sellercurrentRate:0,
				seleUserListInfo:[],  //卖家端人员详细数据
				buyerUserListInfo:[] ,//买家端人员详细数据
				selerAllUserInfo:{}  ,//卖家各个成员数据
				buyerAllUserInfo:{}, //买家各个成员数据
				userdata:[],  //传给组件的数据
				PopupShow:false,  //弹出层组件显示隐藏
				publicCom:null
			}
		},
		
		created() {
			this.getdata1();
			
		},
		mounted() {
			this.getdata();
			setTimeout(()=>{
				this.getBuyerUser();
				this.getSelerUser();
			},3000)
		},
		computed: {
		    buytext() {
		      return this.buycurrentRate.toFixed(2) + '%'
		    },
			sellertext() {
			  return this.sellercurrentRate.toFixed(2) + '%'
			},
		  },
		methods:{
			getdata(){
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=getManagerTotalTotalData").then(res=>{
					//console.log(res);
					
					//买家端目标/卖家端目标
					let	BuyermonthAims=0,SellermonthAims=0;
					//接单/卖家退单/刷单/买家退单
					let jdNum=0,tdNum=0,sdNum=0,cdNum=0;
					//买家完成百分比/卖家百分比
					let BuyerPercentage,SelerPercentage;
					
					let selerInfo=[],buyerInfo=[];
					
					//遍历买家数据
					res.data.curmonthsdtdnums.forEach(n=>{  
						BuyermonthAims+=n.plantnum;
						sdNum+=n.sdnum;
						cdNum+=n.cdnum;
						
						//遍历买家目标
						res.data.todaybuyerjdnums.forEach(nn=>{
							let outmoneydata=0;
							//遍历买家损失金额成员
							res.data.outmoneydata.forEach(nnn=>{
								if (nnn.userid == n.userid){
									outmoneydata = eval(nnn.userdata);
								}
							})
							if (n.username == nn.username) {
								let proportion=eval(((n.sdnum-n.cdnum)/n.plantnum*100).toFixed(2));
								buyerInfo.push({
									'userid':n.userid,
									'username':n.username,
									'plantnum':n.plantnum,
									'jdnum':nn.jdnum,
									'sdnum':n.sdnum,
									'cdnum':n.cdnum,
									'outmoney':outmoneydata.toFixed(2),
									'proportion':proportion<0?0:proportion
								})
							}
						})
					});
					BuyerPercentage=eval(((sdNum-cdNum)/BuyermonthAims*100).toFixed(2));
					
					this.buyerInfo=buyerInfo;
					//遍历卖家数据
					res.data.curmonthjdtdnums.forEach(n=>{
						SellermonthAims+=n.plantnum;
						jdNum+=n.jdnum;
						tdNum+=n.tdnum;
						//遍历卖家待刷产品和订单
						res.data.totalsellerwaitnums.forEach(nn=>{
							let outmoneydata=0;
							//遍历卖家损失金额的成员
							res.data.outmoneydata.forEach(nnn=>{
								 if (nnn.userid == n.userid){
									 outmoneydata = eval(nnn.userdata);
								 }                
							})
							if (n.username == nn.username) {
								let proportion=eval(((n.jdnum-n.tdnum)/n.plantnum*100).toFixed(2));
								selerInfo.push({
									'userid':n.userid,
									'username':n.username,
									'totalproductnum':nn.jdpnum,
									'totalorder':nn.jdnum,
									'plantnum':n.plantnum,
									'jdnum':n.jdnum,
									'tdnum':n.tdnum,
									'sdnum':n.sdnum,
									'cdnum':n.cdnum,
									'outmoney':outmoneydata.toFixed(2),
									'proportion':proportion<0?0:proportion
								})
							}
						})
						
					});
					SelerPercentage=eval(((jdNum-tdNum)/SellermonthAims*100).toFixed(2));
					//console.log(selerInfo)
					this.selerInfo=selerInfo;
					//let buynum=sdNum-cdNum;console.log(buynum)
					//生成目标信息展示数据
					this.summarytotalData.push({
						'aims':BuyermonthAims,
						'sdnum':sdNum,
						'cdnum':cdNum,
						'num':sdNum-cdNum,
						'BuyerPercentage':BuyerPercentage<0?0:BuyerPercentage
					},{
						'aims':SellermonthAims,
						'jdnum':jdNum,
						'tdnum':tdNum,
						'num':jdNum-tdNum,
						'SelerPercentage':SelerPercentage<0?0:SelerPercentage
					});
					console.log(this.summarytotalData)
					
					
					
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
				
				this.selerInfo.forEach((item,index)=>{
					if(item.userid==user.userid){
						monthdata.plantnum=item.plantnum;
						monthdata.outmoney=item.outmoney;
						monthdata.totalproductnum=item.totalproductnum;
						monthdata.totalorder=item.totalorder;
					}
				})
				
				
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
				
				this.buyerInfo.forEach((item,index)=>{
					if(item.userid==user.userid){
						monthdata.plantnum=item.plantnum;
						monthdata.outmoney=item.outmoney;
					}
				})
				
				this.userdata.push(daydata);
				this.userdata.push(monthdata);
				this.userdata.push(user);
			},
		}
	})
</script>

<style scoped>
	@import url("../../../../assets/css/style.css");
</style>
