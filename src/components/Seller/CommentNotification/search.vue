<template>
	<div>
		<div class="popup-title">搜索</div>
		<div class="search-info">
			<van-form>
				<van-cell-group>
					<van-field v-model.trim="fromorder.OrderNo" label="订单号" placeholder="系统单号" />
				</van-cell-group>
				<van-cell-group>
					<van-field v-model.trim="fromorder.buyOrderNo" label="购买单号" placeholder="购买单号" />
				</van-cell-group>
				<van-cell-group>
					<van-field readonly clickable right-icon="arrow-down" name="datetimePicker" 
					:value="fromorder.date1" label="开始时间" placeholder="开始时间" @click="showdate(5)"/>
				</van-cell-group>
				<van-cell-group>
					<van-field readonly clickable right-icon="arrow-down" name="datetimePicker" 
					:value="fromorder.date2" label="结束时间" placeholder="结束时间" @click="showdate(6)"/>
				</van-cell-group>
			</van-form>
			<div class="search-btn">
				<van-button type="info" block round @click="searchConfirm">搜索</van-button>
			</div>
		</div>
		<van-popup v-model="PopupShowPicker" round position="bottom">
			  <van-datetime-picker
			    v-model="currentDate"
			    type="date"
			    title="选择年月日"
				@confirm="onConfirm"
				@cancel="PopupShowPicker = false"
			  />
		</van-popup>
	</div>
</template>

<script>
	import {Button,Popup,Form,Field,CellGroup,Picker,DatetimePicker} from 'vant'
	export default({
		name:'MonthlyGoal-search',
		components:{
			[Button.name]:Button,
			[Popup.name]:Popup,
			[Form.name]:Form,
			[Field.name]:Field,
			[CellGroup.name]:CellGroup,
			[Picker.name]:Picker,
			[DatetimePicker.name]:DatetimePicker
		},
		props:{
			fromorder:{
				type:Object,
				default:new Object()
			}
		},
		data(){
			return{
				PopupShowPicker:false,  //选择器弹框
				currentDate: new Date(), //当前时间
				iftype:0
			}
		},
		methods:{
			//搜索选择器确认后得值
			onConfirm(val){
				switch(this.iftype){
					case 5:
						this.fromorder.date1=`${val.getFullYear()}-${val.getMonth() + 1}-${val.getDate()}`;
						break;
					case 6:
						this.fromorder.date2=`${val.getFullYear()}-${val.getMonth() + 1}-${val.getDate()}`;
				}
				this.PopupShowPicker=false
			},
			//显示时间选择
			showdate(i){
				this.PopupShowPicker=true;
				this.iftype=i
			},
			//搜索提交
			searchConfirm(){
				this.$emit('update:fromorder', this.fromorder);
				this.$emit('loadproductdata',1)
			}
		}
	})
</script>

<style>
</style>
