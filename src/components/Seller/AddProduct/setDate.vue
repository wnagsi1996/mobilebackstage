<template>
	<div>
		<div class="popup-title">
			设置放单时间
		</div>
		<van-field readonly clickable right-icon="arrow-down" name="datetimePicker"
		:value="setfdDate" label="放单时间" placeholder="放单时间" @click="PopupShowPicker=true"/>
		<div class="search-btn">
			 <van-button type="info" block round @click="submitForm" :loading="btnLoading">提交</van-button>
		</div>
		<van-popup v-model="PopupShowPicker" round position="bottom">
			<van-datetime-picker
			  v-model="currentDate"
			  type="datetime"
			  title="选择放单时间"
			  @confirm="onConfirm"
			  @cancel="PopupShowPicker = false"
			/>
		</van-popup>
	</div>
</template>

<script>
	import {Button,DatetimePicker,Popup,Field} from 'vant'
	export default({
		name:'SetDate',
		props:{
			orderno:{
				type:String,
				default:''
			}
		},
		components:{
			[Popup.name]:Popup,
			[Button.name]:Button,
			[Field.name]:Field,
			[DatetimePicker.name]:DatetimePicker 
		},
		data(){
			return{
				neworderno:'',
				currentDate:new Date(),
				setfdDate:'',
				btnLoading:false,
				PopupShowPicker:false
			}
		},
		created() {
			this.neworderno=this.orderno;
		},
		methods:{
			//提交
			submitForm(setdate){
			  this.btnLoading=true;
			  this.axios.get("/Handler/CPManageSystem.ashx?cmd=setCPDetailPlanFD",{
				params:{
					"orderno":this.neworderno,
					"plandate": this.setfdDate
				}
			  }).then(res=>{
				if(res.data>0){
					this.$toast('设置成功');
					this.setfdDate='';
					this.currentDate=new Date();
					this.$emit('loadproductdata','1');
					
				}else{
					this.$toast('设置失败')
				}
				this.btnLoading=false;
			  }).catch(xhr=>{
				this.$toast('设置失败')
				console.log(xhr);
			  })
			},
			onConfirm(val){
				this.setfdDate=`${val.getFullYear()}-${val.getMonth() + 1}-${val.getDate()} ${val.getHours()}:${val.getMinutes()}:0`;
				this.PopupShowPicker=false;
			}
		},
		watch:{
			orderno(newVal,oldVal){
				this.neworderno=newVal
			}
		}
	})
</script>

<style>
</style>
