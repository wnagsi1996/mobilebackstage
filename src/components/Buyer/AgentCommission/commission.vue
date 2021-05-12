<template>
	<div>
		<div class="popup-title">
			佣金返款
		</div>
		<van-form @submit="submit" ref="order">
			<van-cell-group v-if="orderInfo.iffkxdyj=='0' || orderInfo.iffkxdyj=='3'">
				<van-field type="number" v-model.trim="order.orderYJ" label="下单佣金" placeholder="下单佣金" />
			</van-cell-group>
			<van-cell-group v-if="orderInfo.lpzt=='1'">
				<van-field v-if="orderInfo.iffklpyj=='0' || orderInfo.iffklpyj=='3'" type="number"  v-model.trim="order.reviewYJ" label="留评佣金" placeholder="留评佣金" />
			</van-cell-group>
			
			<van-cell-group>
				<van-field readonly clickable right-icon="arrow-down" name="picker"
				:value="order.channel.text" label="收款方式" placeholder="收款方式"
				:rules="[{required: true, message: '请选择收款方式'}]" @click="PopupShowPicker=true"/>
			</van-cell-group>
			<van-cell-group>
				<van-field v-model.trim="order.account" label="账号" placeholder="账号" />
			</van-cell-group>
			<van-cell-group>
				<UploadImg title="收款码" @getimgsrc='getimgsrc' :file="file" />
			</van-cell-group>
			<van-cell-group>
				<van-field v-model.trim="order.remark" label="备注" placeholder="备注" />
			</van-cell-group>
			<div class="search-btn">
				<van-button type="info" block round native-type="submit" :loading="btnLoading">提交</van-button>
			</div>
		</van-form>
		
		<van-popup v-model="PopupShowPicker" round position="bottom">
			<van-picker
			    show-toolbar
			    :columns="columns"
			    @confirm="onConfirm"
			    @cancel="PopupShowPicker = false"
			  />
		</van-popup>
	</div>
</template>

<script>
	import {Button,Popup,Form,Field,CellGroup,Picker} from 'vant'
	import {aisleSub} from '@/utils/searchCondition.js'
	import UploadImg from '@/components/UploadImg'
	export default({
		name:'AgentCommission-commission',
		components:{
			[Button.name]:Button,
			[Popup.name]:Popup,
			[Form.name]:Form,
			[Field.name]:Field,
			[CellGroup.name]:CellGroup,
			[Picker.name]:Picker,
			UploadImg
		},
		props:{
			orderInfo:{
				type:Object,
				default:new Object()
			}
		},
		data(){
			return{
				order:{
					channel:{
						text:'',
						value:''
					},
					account:'',
					imgsrc:'',
					remark:'',
					reviewYJ:'',
					orderYJ:''
				},
				PopupShowPicker:false,  //选择器弹框
				columns:aisleSub,  //下拉列表存放数据
				btnLoading:false,
				file:[]
			}
		},
		created() {
			
		},
		methods:{
			//弹出选择器
			// showPickerList(type){
			// 	this.PopupShowPicker=true;
			// 	switch(type){
			// 		case 0:  //收款方式
			// 			this.columns=aisleSub
			// 			break;
			// 	}
			// },
			//获取图片地址
			getimgsrc(val){
				this.order.imgsrc=val;
			},
			//选择器确认
			onConfirm(val){
				this.order.channel.text=val.text
				this.order.channel.value=val.value
				this.PopupShowPicker=false
			},
			//提交
			submit(){
				if(this.order.orderYJ=='' && this.order.reviewYJ==''){
					this.$toast('返款金额不能为空')
				    return false;
				}
				if(this.order.account=="" && this.order.imgsrc=="" ){
					this.$toast('收款账号或者收款码不能为空')
					return false;
				 }
				 if(this.order.orderYJ==''){
				 	this.order.orderYJ=0;
				 }
				 if(this.order.reviewYJ==''){
				 	this.order.reviewYJ=0;
				 }
				this.btnLoading=true;
				this.axios.post("/Handler/CPManageSystem.ashx",this.qs.stringify({
					"cmd":"comitCPOrderDetailYJFK",
					"orderno":this.orderInfo.orderno,
					"remark":this.order.remark,
					"skaccount":this.order.account,
					"yjmoney_xd":this.order.orderYJ,
					"yjmoney_lp":this.order.reviewYJ,
					"sktype":this.order.channel.value,
					"_img64":this.order.imgsrc,
				})).then(res=>{console.log(res)
					if(res.data.rescode>0){
						this.$toast('提交成功')
						this.$emit('loadproductdata','1');
						this.order=this.$options.data().order
					}else{
						this.$toast('提交失败')
					}
					this.btnLoading=false;
				}).catch(xhr=>{
					//console.log(xhr);
					this.$toast('提交失败')
					this.btnLoading=false;
				})
			},
		},
		watch:{
			orderInfo(newVal,oldVal){
				this.order=this.$options.data().order;//清空输入数据
				this.orderInfo=newVal
			}
		}
	})
</script>

<style>
</style>
