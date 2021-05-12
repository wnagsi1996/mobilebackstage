<template>
	<div>
		<div class="popup-title">搜索</div>
		<div class="search-info">
			<van-form>
				<van-cell-group>
					<van-field readonly clickable right-icon="arrow-down" name="picker" 
					:value="fromorder.username.text" label="人员" placeholder="人员" @click="showPickerList(0)"/>
				</van-cell-group>
				<van-cell-group>
					<van-field readonly clickable right-icon="arrow-down" name="picker" 
					:value="fromorder.loss.text" label="类别" placeholder="类别" @click="showPickerList(1)"/>
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
	import {mapGetters} from 'vuex'
	import {Button,Popup,Form,Field,CellGroup,Picker,DatetimePicker} from 'vant'
	export default({
		name:'Lossexpenses-search',
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
			fromorder:{
				type:Object,
				default:new Object()
			}
		},
		data(){
			return{
				PopupShowPicker:false,  //选择器弹框
				columns:[],  //下拉列表存放数据
				iftype:0  ,//弹出列表选择器  0用户列表  1月份
				pickerLoading:false,  //下拉列表加载状态
				currentDate: new Date(), //当前时间
				isdate:false  ,//判断弹出的是否是时间别
				lossex:[
					{text:'全部',value:'-1'},
					{text:'损失金额',value:'0'},
					{text:'追回损失',value:'1'},
				]
			}
		},
		created() {
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
					case 0: //全部人员
						if(this.allUserList.length==0){
							await this.$store.dispatch('userList/getAllUserList');
						}
						this.columns=this.allUserList
						break;
					case 1:  //类别
						this.columns=this.lossex
						break;
				}
				this.pickerLoading=false
			},
			//搜索选择器确认后得值
			onConfirm(val){
				switch(this.iftype){
					case 0:
						this.fromorder.username.text=val.text;
						this.fromorder.username.value=val.value;
						break;
					case 1:
						this.fromorder.loss.text=val.text;
						this.fromorder.loss.value=val.value;
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
