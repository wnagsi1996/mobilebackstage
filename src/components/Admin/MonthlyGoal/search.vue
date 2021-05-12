<template>
	<div>
		<div class="popup-title">
			搜索
		</div>
		<van-form>
			<div class="search-info">
				<van-cell-group>
					<van-field readonly clickable right-icon="arrow-down" name="picker"
					:value="fromAccount.name.text" label="人员名称" placeholder="人员名称" @click="showPickerList(0)"/>
				</van-cell-group>
				<van-cell-group>
					<van-field readonly clickable right-icon="arrow-down" name="datetimePicker" 
					:value="fromAccount.monthly" label="月份" placeholder="月份" @click="showdate(1)"/>
				</van-cell-group>
				<van-cell-group>
					<van-field readonly clickable right-icon="arrow-down" name="picker"
					:value="fromAccount.selstate.text" label="类别" placeholder="类别" @click="showPickerList(2)"/>
				</van-cell-group>
			</div>
			<div class="search-btn">
				<van-button type="info" block round @click="searchConfirm">搜索</van-button>
			</div>
		</van-form>
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
			    type="year-month"
			    title="选择年月"
				@confirm="onConfirm"
				@cancel="PopupShowPicker = false"
			  />
		</van-popup>
	</div>
</template>

<script>
	import {mapGetters} from 'vuex'
	import {Button,Popup,Form,Field,CellGroup,Picker,DatetimePicker,RadioGroup, Radio} from 'vant'
	import {userType} from '@/utils/searchCondition.js'  //引入公共的用户类型
	export default({
		name:'MonthlyGoal-search',
		computed:{
			...mapGetters([
				'allUserList'
			])
		},
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
			fromAccount:{
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
				this.columns=[];
				this.pickerLoading=true;
				this.PopupShowPicker=true;
				this.iftype=i
				this.isdate=false;
				switch(i){
					case 0:
						if(this.allUserList.length==0){
							await this.$store.dispatch('userList/getAllUserList');
						}
						this.columns=this.allUserList;
						break;
					case 2:
						this.columns=userType;
						break;
				}
				this.pickerLoading=false
			},
			//显示时间选择
			showdate(i){
				this.PopupShowPicker=true;
				this.isdate=true;
				this.iftype=i
			},
			//确认选择器后显示搜索数据
			onConfirm(val){
				switch(this.iftype){
					case 0:
						this.fromAccount.name.text=val.text;
						this.fromAccount.name.value=val.value;
						break;
					case 1:
						this.fromAccount.monthly=`${val.getFullYear()}-${val.getMonth() + 1}`;
						break;
					case 2:
						this.fromAccount.selstate.text=val.text;
						this.fromAccount.selstate.value=val.value;
						break;
				}
				this.PopupShowPicker=false
			},
			//搜索提交
			searchConfirm(){
				this.$emit('update:fromAccount', this.fromAccount);
				this.$emit('loadproductdata',1)
			}
		}
	})
</script>

<style>
</style>
