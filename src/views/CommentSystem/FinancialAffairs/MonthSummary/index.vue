<template>
	<div>
		<Header title="月份财务报表">
			<p slot="search"><em style="color: #e41c1d;">{{month}}</em> <span @click="popupShow=true">切换</span></p>
		</Header>
		
		<div class="one-today public-statue">
			<div class="today-title">
				<h5>订单数据</h5>
			</div>
			<div class="today-desc">
				<OrderModule v-if="monthOrderData.length>0" :orderdata="monthOrderData"/>
			</div>
		</div> 
		<div class="aims-circle" v-if="monthfince.length>0">
			<div class="aims-circle1" v-for="(item,index) in monthfince" :key="index">
				<div class="aims-title">
					<h5>{{item.title}}</h5>
				</div>
				<div class="money-cw">
					{{item.money}}
				</div>
			</div>
		</div>
		<div class="month-info-item" v-if="selerUserData.length>0" v-for="(item,index) in selerUserData" :key="index">
			<h5>{{item[0]}} (卖家端)</h5>
			<div class="info-item">
				<div class="info-item-li">
					<div class="info-item-title">接单: </div>
					<div class="info-item-desc">
						<em>(免: {{item[1]}}/留: {{item[2]}})</em>
						<span>{{Number(item[1])+Number(item[2])}}</span>
					</div>
				</div>
				<div class="info-item-li">
					<div class="info-item-title">卖家退单: </div>
					<div class="info-item-desc">
						<em>(免: {{item[3]}}/留: {{item[4]}})</em>
						<span>{{Number(item[3])+Number(item[4])}}</span>
					</div>
				</div>
				<div class="info-item-li">
					<div class="info-item-title">刷单: </div>
					<div class="info-item-desc">
						<em>(免: {{item[9]}}/留: {{item[10]}})</em>
						<span>{{Number(item[9])+Number(item[10])}}</span>
					</div>
				</div>
				<div class="info-item-li">
					<div class="info-item-title">买家退单: </div>
					<div class="info-item-desc">
						<em>(免: {{item[11]}}/留: {{item[12]}})</em>
						<span>{{Number(item[11])+Number(item[12])}}</span>
					</div>
				</div>
				<div class="info-item-li">
					<div class="info-item-title">损失金额: </div>
					<div class="info-item-desc">
						<span>{{item[19]}}</span>
					</div>
				</div>
			</div>
		</div>
		
		<div class="month-info-item" v-if="buyerUserData.length>0" v-for="(item,index) in buyerUserData" :key="'0'+index">
			<h5>{{item[0]}} (买家端)</h5>
			<div class="info-item">
				<div class="info-item-li">
					<div class="info-item-title">刷单: </div>
					<div class="info-item-desc">
						<em>(免: {{item[1]}}/留: {{item[2]}})</em>
						<span>{{Number(item[1])+Number(item[2])}}</span>
					</div>
				</div>
				<div class="info-item-li">
					<div class="info-item-title">中介刷单数: </div>
					<div class="info-item-desc">
						<em>(免: {{item[8]}}/留: {{item[9]}})</em>
						<span>{{Number(item[8])+Number(item[9])}}</span>
					</div>
				</div>
				<div class="info-item-li">
					<div class="info-item-title">个人刷单数: </div>
					<div class="info-item-desc">
						<em>(免: {{item[12]}}/留: {{item[13]}})</em>
						<span>{{Number(item[12])+Number(item[13])}}</span>
					</div>
				</div>
				<div class="info-item-li">
					<div class="info-item-title">退单: </div>
					<div class="info-item-desc">
						<em>(免: {{item[3]}}/留: {{item[4]}})</em>
						<span>{{Number(item[3])+Number(item[4])}}</span>
					</div>
				</div>
				<div class="info-item-li">
					<div class="info-item-title">中介退单: </div>
					<div class="info-item-desc">
						<em>(免: {{item[10]}}/留: {{item[11]}})</em>
						<span>{{Number(item[10])+Number(item[11])}}</span>
					</div>
				</div>
				<div class="info-item-li">
					<div class="info-item-title">个人退单: </div>
					<div class="info-item-desc">
						<em>(免: {{item[14]}}/留: {{item[15]}})</em>
						<span>{{Number(item[14])+Number(item[15])}}</span>
					</div>
				</div>
				<div class="info-item-li">
					<div class="info-item-title">损失金额: </div>
					<div class="info-item-desc">
						<span>{{item[16]}}</span>
					</div>
				</div>
			</div>
		</div>
		<van-popup v-model="popupShow" round position="bottom">
			<van-datetime-picker
			  v-model="currentDate"
			  type="year-month"
			  title="选择数据月份"
			  :min-date="minDate"
			  :max-date="maxDate"
			  @confirm="onConfirm"
			  @cancel="popupShow = false"
			/>
		</van-popup>
		
	</div>
</template>

<script>			
	
	import OrderModule from '@/components/AdminHome/OrderModule.vue'
	import {Divider,Circle,DatetimePicker,Popup } from 'vant'
	export default({
		name:'Home',
		components:{
			OrderModule,
			[Divider.name]:Divider,
			[DatetimePicker.name]:DatetimePicker,
			[Popup.name]:Popup,
			[Circle.name]:Circle
		},
		data(){
			return{
				currentDate: new Date(),
				month:'',
				monthOrderData:[]   ,//本月汇总数据
				profitattr:[],
				monthfince:[],
				selerUserData:[],
				buyerUserData:[],
				popupShow:false,
				minDate:new Date(2020, 0, 1),
				maxDate:new Date(),
			}
		},
		
		created() {
			let nowDate = new Date();
			let nowMonth = nowDate.getMonth();
			let nowYear = nowDate.getFullYear();
			if (nowMonth == "0") {
				nowYear = eval(nowYear) - 1;
				nowMonth = 12;
			}
			nowMonth = nowMonth < 9 ? "0" + nowMonth : nowMonth;
			this.month = nowYear + "-" + nowMonth;
			this.getdata(this.month);
			this.getdata2(this.month);
		},
		mounted() {
		},
		methods:{
			getdata(month){
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=getCWTotalMonthData1&month="+month).then(res=>{
					//console.log(res);
					let data=res.data;
					//本月数据
					this.monthOrderData=[  
						{  
							'title':'接单',
							'lpnum':data.monthlpnum,
							'mpnum':data.monthmpnum 
						},
						{
							'title':'商家退单',
							'lpnum':data.monthtdlpnum,
							'mpnum':data.monthtdmpnum
						},
						{
							'title':'刷单',
							'lpnum':data.monthsdlpnum,
							'mpnum':data.monthsdmpnum
						},
						{
							'title':'买家退单',
							'lpnum':data.monthcdlpnum,
							'mpnum':data.monthcdmpnum
						}
					]
					
					let skmoney=(data.monthsktotalmoney).toFixed(2); //本月收款金额
					let fkpmoney=(data.monthwxfktotalmoney+data.monthppfktotalmoney+data.monthyyfktotalmoney+data.monthzfbfktotalmoney).toFixed(2); //本月产品费返款
					let fkyjmoney=(data.monthzfbyjfktotalmoney + data.monthyyyjfktotalmoney + data.monthppyjfktotalmoney + data.monthwxyjfktotalmoney).toFixed(2); //本月佣金返款
					let fktkmoney=(data.monthtdtktotalmoney).toFixed(2); //本月退款
					let fkcjmoney=(data.monthtcjtotalmoney).toFixed(2); //本月退差价
					let fktcjmoney=(data.monthbcjtotalmoney).toFixed(2); //本月补差价
					let outmoney=(data.outmoney).toFixed(2); //本月损失金额
					let outhermoney=eval(data.monthOutLay).toFixed(2); //本月其他支出
					let profit=(skmoney-fkpmoney-fktkmoney-fkyjmoney-fkcjmoney-outmoney-outhermoney).toFixed(2)  //利润
					let remark=data.monthOutLayRemark //备注
					
					
					const monthfince=[
						{
							'title':'本月收款金额',
							'money':skmoney
						},
						{
							'title':'本月产品费返款',
							'money':fkpmoney
						},
						{
							'title':'本月佣金返款',
							'money':fkyjmoney
						},
						{
							'title':'本月退差价',
							'money':fkcjmoney,
							'txt':`单数：${data.monthtcjnum }`
						},
						{
							'title':'本月补差价',
							'money':fktcjmoney,
							'txt':`单数：${data.monthbcjnum }`
						},
						{
							'title':'本月损失金额',
							'money':outmoney
						}
					];
					this.monthfince=monthfince;
					
					this.profitattr=[skmoney,fkpmoney,fkyjmoney,fkcjmoney,outmoney,outhermoney,profit,remark,fktkmoney]
					
				}).catch(xhr=>{
					console.log(xhr);
				})
			},
			getdata2(month){
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=getCWTotalMonthData2&month="+month).then(res=>{
					
					let sellerUserData=[];
					res.data.sellerdata.forEach(item=>{
						let attr=item.userdata.split(',');
						
						let outmoney=0;
						res.data.outmoneydata.forEach(attrdata=>{
							if(attrdata.userid==item.userid){
								outmoney=eval(attrdata.userdata).toFixed(2);
							}
						})
						attr.push(outmoney);
						
						sellerUserData.push(attr);
					});
					this.selerUserData=sellerUserData;
					
					let buyerUserData=[];
					res.data.buyerdata.forEach(item=>{
						let attr=item.userdata.split(',');
						
						let outmoney=0;
						res.data.outmoneydata.forEach(attrdata=>{
							if(attrdata.userid==item.userid){
								outmoney=eval(attrdata.userdata).toFixed(2);
							}
						})
						attr.push(outmoney);
						
						buyerUserData.push(attr);
					});
					this.buyerUserData=buyerUserData;
					
				}).catch(xhr=>{
					console.log(xhr)
				})
			},
			onConfirm(val){
				this.month=`${val.getFullYear()}-${val.getMonth() + 1}`;
				this.popupShow=false;
				this.getdata(this.month);
				this.getdata2(this.month);
			}
		}
	})
</script>

<style scoped>
	@import url("../../../../assets/css/style.css");
	.money-cw{font-size:24px;padding-left: 5px;color: #1989FA;}
	
	.month-info-item{margin:15px 15px;background-color: #fff;border-radius: 5px;padding:10px}
	.info-item-li{display: flex;justify-content: space-between;padding:5px 0;}
	.info-item-title{width:100px;}
	.info-item-desc{flex: 1;text-align: right;}
	.info-item-desc span{display: inline-block;width:40px;color: #e41c1d;}
	.info-item-desc em{color:#666}
</style>
