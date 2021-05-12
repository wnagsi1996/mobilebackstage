<template>
	<div>
		<div class="popup-title">
			添加损失
		</div>
		<van-form @submit="addConfirm" ref="log">
			<van-cell-group>
				<van-field readonly clickable right-icon="arrow-down" name="picker"
				:value="log.name.text" label="人员名称" placeholder="人员名称"
				:rules="[{required: true, message: '请选择人员名称'}]" @click="showPickerList(0)"/>
			</van-cell-group>
			<van-cell-group>
				<van-field readonly clickable right-icon="arrow-down" name="picker"
				:value="log.loss.text" label="损失类型" placeholder="损失类型'"
				:rules="[{required: true, message: '请选择损失类型'}]" @click="showPickerList(1)"/>
			</van-cell-group>
			<van-cell-group>
				<van-field type="number" v-model.trim="log.money" label="损失金额" placeholder="损失金额" 
				:rules="[{required: true, message: '请输入金额'}]" />
			</van-cell-group>
			<van-cell-group>
				<van-field type="textarea" v-model.trim="log.remark" label="备注" placeholder="备注" 
				:rules="[{required: true, message: '请输入备注'}]" />
			</van-cell-group>
			<div class="search-btn">
				<van-button type="info" block round native-type="submit" :loading="btnLoading">{{rid?'编辑':'创建'}}</van-button>
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
	export default({
		name:'MonthlyGoal-add',
		components:{
			[Button.name]:Button,
			[Popup.name]:Popup,
			[Form.name]:Form,
			[Field.name]:Field,
			[CellGroup.name]:CellGroup,
			[Picker.name]:Picker
		},
		props:[
			'userMonthAims'
		],
		computed:{
			...mapGetters([
				'allUserList'
			])
		},
		data(){
			return{
				log:{
					name:{
						text:'全部',
						value:'0'
					},
					loss:{
						text:'损失金额',
						value:'0'
					},
					money:'',
					remark:''
				},
				PopupShow:false,  //搜索弹框
				PopupShowPicker:false,  //选择器弹框
				columns:[],  //下拉列表存放数据
				iftype:0,
				pickerLoading:false,
				rid:'',
				lossex:[
					{text:'损失金额',value:'0'},
					{text:'追回损失',value:'1'},
				],
				btnLoading:false
			}
		},
		created() {
			
		},
		methods:{
			///显示搜索得选择器列表
			async showPickerList(i){
				this.pickerLoading=true
				this.PopupShowPicker=true
				this.columns=[];
				this.iftype=i
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
			onConfirm(val){
				if(this.iftype==0){
					this.log.name.text=val.text
					this.log.name.value=val.value
				}else{
					this.log.loss.text=val.text
					this.log.loss.value=val.value
				}
				this.PopupShowPicker=false
			},
			addConfirm(){
				this.btnLoading=true;
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=addUserOutMoney",{
					params:{
						"userid":this.log.name.value,
						"outmoney":this.log.money,
						"remark":this.log.remark,
						"outtype":this.log.loss.value
					}
				}).then(res=>{
					if(res.data>0){
						this.$toast('添加成功');
						this.log=this.$options.data().log;
						 this.$emit('loadproductdata',1);
						 this.btnLoading=true;
					}else{
						this.$toast('添加失败');
					}
					this.btnLoading=false;
				}).catch(xhr=>{
					this.btnLoading=false;
					this.$toast('添加失败');
				})
			}
		},
		watch:{
			userMonthAims(newVal,oldVal){
				this.ifRID(newVal);
			}
		}
	})
</script>

<style>
</style>
