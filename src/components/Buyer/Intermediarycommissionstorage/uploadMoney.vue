<template>
	<div>
		<div class="popup-title">
			新增收款
		</div>
		<van-form @submit="submit" ref="order">
			<van-cell-group>
				<van-field type="number" v-model.trim="order.money" label="金额" placeholder="收款金额(人民币)" 
				:rules="[{required: true, message: '请输入收款金额'}]" />
			</van-cell-group>
			<van-cell-group>
				<van-field readonly clickable right-icon="arrow-down" name="picker"
				:value="order.channel.text" label="收款方式" placeholder="收款方式"
				:rules="[{required: true, message: '请选择收款方式'}]" @click="showPickerList(0)"/>
			</van-cell-group>
			<!-- <van-cell-group>
				<van-field readonly clickable right-icon="arrow-down" name="picker"
				:value="order.type.text" label="收款类型" placeholder="收款类型"
				:rules="[{required: true, message: '请选择收款类型'}]" @click="showPickerList(1)"/>
			</van-cell-group> -->
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
	export default({
		name:'Intermediarycommissionstorage-add',
		components:{
			[Button.name]:Button,
			[Popup.name]:Popup,
			[Form.name]:Form,
			[Field.name]:Field,
			[CellGroup.name]:CellGroup,
			[Picker.name]:Picker
		},
		props:{
			orderno:{
				type:String,
				default:''
			}
		},
		data(){
			return{
				order:{
					channel:{
						text:'',
						value:''
					},
					type:{
						text:'',
						value:''
					},
					money:'',
					remark:''
				},
				PopupShowPicker:false,  //选择器弹框
				columns:[],  //下拉列表存放数据
				btnLoading:false,
				type:''
			}
		},
		created() {
			
		},
		methods:{
			//弹出选择器
			showPickerList(type){
				this.type=type;
				this.PopupShowPicker=true;
				switch(type){
					case 0:  //收款方式
						this.columns=aisleSub
						break;
				}
			},
			//选择器确认
			onConfirm(val){
				switch(this.type){
					case 0:  //收款方式
						this.order.channel.text=val.text
						this.order.channel.value=val.value
						break;
				}
				this.PopupShowPicker=false
			},
			//提交
			submit(){
				this.btnLoading=true;
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=comitPayTopOrderMoney",{
					params:{
						"toporderno":this.orderno,
						"remark":this.order.remark,
						"ordermoney":this.order.money,
						"sktype":this.order.channel.value
					}
				}).then(res=>{
					if(res.data.rescode>0){
						this.$toast('提交成功')
						this.$emit('loadproductdata','1');
						this.order=this.$options.data().order
					}else{
						this.$toast(res.data.resdesc)
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
			orderno(newVal,oldVal){
				this.order=this.$options.data().order;//清空输入数据
				this.orderno=newVal
			}
		}
	})
</script>

<style>
</style>
