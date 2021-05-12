<template>
	<div>
		<div class="popup-title">搜索</div>
		<div class="search-info">
			<van-form>
				<van-cell-group>
					<van-field v-model.trim="fromorder.username" label="名称" placeholder="名称" />
				</van-cell-group>
				<van-cell-group>
					<van-field v-model.trim="fromorder.contact" label="联系方式" placeholder="联系方式" />
				</van-cell-group>
				<van-cell-group>
					<van-field readonly clickable right-icon="arrow-down" name="picker" 
					:value="fromorder.name.text" label="接单人员" placeholder="接单人员" @click="showPickerList(0)"/>
				</van-cell-group>
			</van-form>
			<div class="search-btn">
				<van-button type="info" block round @click="searchConfirm">搜索</van-button>
			</div>
		</div>
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
	import {orderStausTotal} from '@/utils/searchCondition.js' //引入公共的订单类型/留评状态/订单状态
	export default({
		name:'ClientOrder-search',
		computed:{
			...mapGetters({
				jduserdata:'jdUserList'
			})
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
			}
		},
		methods:{
			//显示搜索得选择器列表
			async showPickerList(i){
				this.pickerLoading=true
				this.PopupShowPicker=true
				if(this.jduserdata.length==0){
					await this.$store.dispatch('userList/getJdUserList');
				}
				this.columns=this.jduserdata
				this.pickerLoading=false
			},
			//搜索选择器确认后得值
			onConfirm(val){console.log(val)
				this.fromorder.name.text=val.text;
				this.fromorder.name.value=val.value;
				this.PopupShowPicker=false
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
