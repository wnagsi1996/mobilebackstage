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
					<van-field readonly clickable right-icon="arrow-down" name="picker" 
					:value="fromorder.orderType.text" label="订单类型" placeholder="订单类型" @click="showPickerList(2)"/>
				</van-cell-group>
				<van-cell-group>
					<van-field readonly clickable right-icon="arrow-down" name="picker" 
					:value="fromorder.reviewStatus.text" label="留评状态" placeholder="留评状态" @click="showPickerList(3)"/>
				</van-cell-group>
				<van-cell-group>
					<van-field readonly clickable right-icon="arrow-down" name="picker" 
					:value="fromorder.orderStaus.text" label="订单状态" placeholder="订单状态" @click="showPickerList(4)"/>
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
			<van-picker v-if="!isdate"
			    show-toolbar
			    :columns="columns"
				:loading="pickerLoading"
			    @confirm="onConfirm"
			    @cancel="PopupShowPicker = false"
			  />
			  <van-datetime-picker v-else
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
	import {orderType,reviewStatus,orderStaus} from '@/utils/searchCondition.js' //引入公共的订单类型/留评状态/订单状态
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
				columns:[],  //下拉列表存放数据
				iftype:0  ,//弹出列表选择器  0用户列表  1月份  2类别
				pickerLoading:false,  //下拉列表加载状态
				currentDate: new Date(), //当前时间
				isdate:false  ,//判断弹出的是否是时间别
			}
		},
		methods:{
			//显示搜索得选择器列表
			async showPickerList(i){
				this.isdate=false;
				this.pickerLoading=true
				this.iftype=i;
				this.PopupShowPicker=true
				this.columns=[];
				switch(i){
					case 2:  //订单类型
						this.columns=orderType;
						break;
					case 3:  //留评状态
						this.columns=reviewStatus;
						break;
					case 4:  //订单状态
						this.columns=orderStaus;
						break;
				}
				this.pickerLoading=false
			},
			//搜索选择器确认后得值
			onConfirm(val){
				switch(this.iftype){
					case 2:
						this.fromorder.orderType.text=val.text;
						this.fromorder.orderType.value=val.value;
						break;
					case 3:
						this.fromorder.reviewStatus.text=val.text;
						this.fromorder.reviewStatus.value=val.value;
						break;
					case 4:
						this.fromorder.orderStaus.text=val.text;
						this.fromorder.orderStaus.value=val.value;
						break;
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
				this.isdate=true;
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
