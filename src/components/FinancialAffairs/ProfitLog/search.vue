<template>
	<div>
		<div class="popup-title">搜索</div>
		<div class="search-info">
			<van-form>
				<van-cell-group>
					<van-field v-model.trim="fromorder.OrderNo" label="订单号" placeholder="订单号"/>
				</van-cell-group>
				<van-cell-group>
					<van-field readonly clickable right-icon="arrow-down" name="picker" 
					:value="fromorder.updatetype.text" label="类别" placeholder="类别" @click="showPickerList(2)"/>
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
			    @confirm="onConfirm"
			    @cancel="PopupShowPicker = false"
			  />
			  <van-datetime-picker v-else
			    v-model="currentDate"
			    type="year-month"
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
		name:'profitLog-search',
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
				pickerLoading:false,  //下拉列表加载状态
				currentDate: new Date(), //当前时间
				iftype:0  ,//弹出列表选择器  0用户列表  1月份  2类别
				isdate:false  ,//判断弹出的是否是时间别
				columns:[],  //下拉列表存放数据
			}
		},
		created() {
		},
		methods:{
			//显示搜索得选择器列表
			showPickerList(i){
				this.isdate=false;
				this.iftype=i;
				this.PopupShowPicker=true
				this.columns=[
					{value:-1,text:'全部'},
					{value:0,text:'测评结束'},
					{value:1,text:'提取'},
					{value:2,text:'利润变更'}
				];
			},
			//搜索选择器确认后得值
			onConfirm(val){
				switch(this.iftype){
					case 2:
						this.fromorder.updatetype.text=val.text;
						this.fromorder.updatetype.value=val.value;
						break;
					case 5:
						this.fromorder.date1=`${val.getFullYear()}-${val.getMonth() + 1}`;
						break;
					case 6:
						this.fromorder.date2=`${val.getFullYear()}-${val.getMonth() + 1}`;
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
