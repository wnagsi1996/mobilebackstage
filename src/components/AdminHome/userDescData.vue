<template>
	<div class="info-body">
		<div v-if="userdata.length>0">
			<div class="popup-title">
				{{userdata[2].username}}
			</div>
			<div class="info" v-if="userdata[1].plantnum">
				<div class="info-title">
						信息
				</div>
				<div class="info-item">
					<div class="info-item-li" v-if="userdata[1].plantnum!=undefined">
						<div class="info-item-title">目标: </div>
						<div class="info-item-desc">
							<span>{{userdata[1].plantnum}}</span>
						</div>
					</div>
					<div class="info-item-li" v-if="userdata[1].outmoney!=undefined">
						<div class="info-item-title">损失金额: </div>
						<div class="info-item-desc">
							<span>{{userdata[1].outmoney}}</span>
						</div>
					</div>
					<div class="info-item-li" v-if="userdata[1].totalproductnum!=undefined">
						<div class="info-item-title">总待刷产品: </div>
						<div class="info-item-desc">
							<span>{{userdata[1].totalproductnum}}</span>
						</div>
					</div>
					<div class="info-item-li" v-if="userdata[1].totalorder!=undefined">
						<div class="info-item-title">总待刷订单: </div>
						<div class="info-item-desc">
							<span>{{userdata[1].totalorder}}</span>
						</div>
					</div>
				</div>
			</div>
			<div class="info">
				<div class="info-title">
					今日数据
				</div>
				<div class="info-item">
					<div class="info-item-li" v-if="userdata[0].dayjdmpnum!=undefined">
						<div class="info-item-title">接单: </div>
						<div class="info-item-desc">
							<em>(免: {{userdata[0].dayjdmpnum}}/留: {{userdata[0].dayjdlpnum}})</em>
							<span>{{userdata[0].dayjdmpnum+userdata[0].dayjdlpnum}}</span>
						</div>
					</div>
					<div class="info-item-li" v-if="userdata[0].daytdmpnum!=undefined">
						<div class="info-item-title">卖家退单: </div>
						<div class="info-item-desc">
							<em>(免: {{userdata[0].daytdmpnum}}/留: {{userdata[0].daytdlpnum}})</em>
							<span>{{userdata[0].daytdmpnum+userdata[0].daytdlpnum}}</span>
						</div>
					</div>
					<div class="info-item-li" v-if="userdata[0].daysdmpnum!=undefined">
						<div class="info-item-title">刷单: </div>
						<div class="info-item-desc">
							<em>(免: {{userdata[0].daysdmpnum}}/留: {{userdata[0].daysdlpnum}})</em>
							<span>{{userdata[0].daysdmpnum+userdata[0].daysdlpnum}}</span>
						</div>
					</div>
					<div class="info-item-li" v-if="userdata[0].daycdmpnum!=undefined">
						<div class="info-item-title">买家退单: </div>
						<div class="info-item-desc">
							<em>(免: {{userdata[0].daycdmpnum}}/留: {{userdata[0].daycdlpnum}})</em>
							<span>{{userdata[0].daycdmpnum+userdata[0].daycdlpnum}}</span>
						</div>
					</div>
				</div>
			</div>
			<div class="info">
				<div class="info-title">
					本月数据
				</div>
				<div class="info-item">
					<div class="info-item-li" v-if="userdata[1].monthjdmpnum!=undefined">
						<div class="info-item-title">接单: </div>
						<div class="info-item-desc">
							<em>(免: {{userdata[1].monthjdmpnum}}/留: {{userdata[1].monthjdlpnum}})</em>
							<span>{{userdata[1].monthjdmpnum+userdata[1].monthjdlpnum}}</span>
						</div>
					</div>
					<div class="info-item-li" v-if="userdata[1].monthtdmpnum!=undefined">
						<div class="info-item-title">卖家退单: </div>
						<div class="info-item-desc">
							<em>(免: {{userdata[1].monthtdmpnum}}/留: {{userdata[1].monthtdlpnum}})</em>
							<span>{{userdata[1].monthtdmpnum+userdata[1].monthtdlpnum}}</span>
						</div>
					</div>
					<div class="info-item-li" v-if="userdata[1].monthsdmpnum!=undefined">
						<div class="info-item-title">刷单: </div>
						<div class="info-item-desc">
							<em>(免: {{userdata[1].monthsdmpnum}}/留: {{userdata[1].monthsdlpnum}})</em>
							<span>{{userdata[1].monthsdmpnum+userdata[1].monthsdlpnum}}</span>
						</div>
					</div>
					<div class="info-item-li" v-if="userdata[1].monthcdmpnum!=undefined">
						<div class="info-item-title">买家退单: </div>
						<div class="info-item-desc">
							<em>(免: {{userdata[1].monthcdmpnum}}/留: {{userdata[1].monthcdlpnum}})</em>
							<span>{{userdata[1].monthcdmpnum+userdata[1].monthcdlpnum}}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div v-else class="info-loading">
			<van-loading />
		</div>
	</div>
</template>

<script>
	import {Loading} from 'vant'
	export default({
		name:'userDescData',
		components:{
			[Loading.name]:Loading
		},
		props:{
			userdata:{
				type:Array,
				default:new Array()
			}
		},
		data(){
			return{
				
			}
		},
		created() {
			//console.log(this.userdata)
		},
		watch:{
			userdata(newVal){
				this.userdata=newVal
			}
		}
	})
</script>

<style scoped>
	.info-body{padding:10px;}
	.info{margin-top: 20px;}
	.info-title{font-weight: bold;}
	.info-item-li{display: flex;justify-content: space-between;padding:5px 0;}
	.info-item-title{width:100px;}
	.info-item-desc{flex: 1;text-align: right;}
	.info-item-desc span{display: inline-block;width:40px;color: #e41c1d;}
	.info-item-desc em{color:#666}
	.info-loading{width: 100%;height: 100%;line-height: 100%;text-align: center;}
</style>
