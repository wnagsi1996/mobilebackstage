<template>
	<div>
		<div class="popup-title">
			搜索
		</div>
		<van-form>
			<div class="search-info">
				<van-cell-group>
					<van-field v-model.trim="fromAccount.name" label="员工姓名" placeholder="员工姓名" />
				</van-cell-group>
				<van-cell-group>
					<van-field readonly clickable right-icon="arrow-down" name="picker"
					:value="fromAccount.user.text" label="类别" placeholder="类别" @click="showPickerList(2)"/>
				</van-cell-group>
			</div>
			<div class="search-btn">
				<van-button type="info" block round @click="searchConfirm">搜索</van-button>
			</div>
		</van-form>
		<van-popup v-model="PopupShowPicker" round position="bottom">
			<van-picker 
			    show-toolbar
			    :columns="columns"
				:loading="pickerLoading"
			    @confirm="onConfirm"
			    @cancel="PopupShowPicker = false"
			  />
		</van-popup>
	</div>
</template>

<script>
	import {mapGetters} from 'vuex'
	import {Button,Popup,Form,Field,CellGroup,Picker} from 'vant'
	import {userType} from '@/utils/searchCondition.js'  //引入公共的用户类型
	export default({
		name:'MonthlyGoal-search',
		computed:{
			...mapGetters([
				'roleList'
			])
		},
		components:{
			[Button.name]:Button,
			[Popup.name]:Popup,
			[Form.name]:Form,
			[Field.name]:Field,
			[CellGroup.name]:CellGroup,
			[Picker.name]:Picker,
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
				pickerLoading:false,  //下拉列表加载状态
			}
		},
		methods:{
			//显示搜索得选择器列表
			async showPickerList(i){
				this.pickerLoading=true;
				this.PopupShowPicker=true;
				if(this.roleList.length==0){
					await this.$store.dispatch('userList/getroleList');
				}
				this.columns=this.roleList;
				this.pickerLoading=false
			},
			//确认选择器后显示搜索数据
			onConfirm(val){
				this.fromAccount.user.text=val.text
				this.fromAccount.user.value=val.value
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
