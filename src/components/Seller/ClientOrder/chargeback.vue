<template>
	<div>
		<div class="popup-title">
			退单退款
		</div>
		<van-form @submit="submit">
			<van-cell-group>
				<van-field type="number" v-model.trim="chargeback.money" label="退款金额" placeholder="退款金额"
				 :rules="[{required: true, message: '请输入退款金额'}]"/>
			</van-cell-group>
			<van-cell-group>
				<van-field readonly clickable right-icon="arrow-down" name="picker"
				:value="chargeback.channel.text" label="退款渠道" placeholder="退款渠道"
				:rules="[{required: true, message: '请选择退款渠道'}]" @click="PopupShowPicker=true"/>
			</van-cell-group>
			<van-cell-group>
				<van-field type="number" v-model.trim="chargeback.account" label="退款账号" placeholder="退款账号" />
			</van-cell-group>
			<van-cell-group>
				<van-field type="number" v-model.trim="chargeback.remark" label="备注" placeholder="备注" />
			</van-cell-group>
			<van-cell-group>
				<UploadImg title="二维码" @getimgsrc='getimgsrc' />
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
	import {Button,Form,Field,CellGroup,Picker,Popup} from 'vant'
	import UploadImg from '@/components/UploadImg'
	import {aisleSub} from '@/utils/searchCondition.js'
	export default({
		name:'Chargeback',
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
			orderno:{
				type:String,
				default:''
			}
		},
		data(){
			return{
				chargeback:{
					orderno:'',
					money:'',
					channel:{
						text:'',
						value:''
					},
					account:'',
					remark:'',
					imgsrc:''
				},
				columns:aisleSub,
				PopupShowPicker:false,
				btnLoading:false
			}
		},
		created() {
			this.chargeback.orderno=this.orderno;
		},
		methods:{
			//获取图片地址
			getimgsrc(val){
				this.chargeback.imgsrc=val;
			},
			// 显示选择器
			showPickerList(){
				this.PopupShowPicker=true;
			},
			// 选择器确认
			onConfirm(val){
				this.chargeback.channel.text=val.text
				this.chargeback.channel.value=val.value
				this.PopupShowPicker=false
			},
			//提交
			submit(){
				if(this.chargeback.account=='' && this.chargeback.imgsrc==''){
					this.$toast('返款账号或者返款二维码不能都为空');
					return false;
				}else{
					this.btnLoading=true;
					this.axios.post("/Handler/CPManageSystem.ashx",this.qs.stringify({
						 "cmd":"comitOrderGoBack",
						 "orderno":this.chargeback.orderno,
						 "ordertype":2,
						 "remark":this.chargeback.remark,
						 "yskmoney_product":0,
						 "yskmoney_yj":0,
						 "tkmoney":this.chargeback.money,
						 "sktype":this.chargeback.channel.value,
						 skaccount:this.chargeback.account,
						 "mpnum":0,
						 "lpnum":0,
						 "_img64":this.chargeback.imgsrc
					})).then(res=>{
						 //console.log(res);
						 if(res.data.rescode>0){
							this.$toast('退单已提交给财务返款')
							this.$emit('loadproductdata','1');
							this.chargeback=this.$options.data().chargeback;
						 }else{
							this.$toast(res.data.resdesc)
						 }
						 this.btnLoading=false;
					}).catch(xhr=>{
						console.log(xhr)
						this.btnLoading=true;
					})
				}
			}
		},
		watch:{
			orderno(newVal,oldVal){
				this.chargeback.orderno=newVal;
			}
		}
	})
</script>

<style>
</style>
