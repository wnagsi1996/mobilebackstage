<template>
	<div>
		<div class="popup-title">
			人员月份目标操作
		</div>
		<van-form @submit="addConfirm" ref="formaccount">
			<template v-if="rid==''">
				<van-cell-group>
					<van-field name="radio" label="分类">
					  <template #input>
					    <van-radio-group v-model="fromAccount.status" direction="horizontal" @change="hankSwitch">
					      <van-radio name="0">卖家端</van-radio>
					      <van-radio name="1">买家端</van-radio>
					    </van-radio-group>
					  </template>
					</van-field>
				</van-cell-group>
				<van-cell-group>
					<van-field readonly clickable right-icon="arrow-down" name="picker"
					:value="fromAccount.name.text" label="人员名称" placeholder="人员名称"
					:rules="[{required: true, message: '请选择人员名称'}]" @click="showPickerList()"/>
				</van-cell-group>
			</template>
			<van-cell-group>
				<van-field type="digit" v-model="fromAccount.ordernum" label="单数" placeholder="单数" 
				:rules="[{required: true, message: '请输入目标单数'}]" />
			</van-cell-group>
			<van-cell-group>
				<van-field readonly clickable right-icon="arrow-down" name="datetimePicker" 
				:value="fromAccount.monthly" label="月份" placeholder="月份"
				:rules="[{required: true, message: '请选择目标月份'}]" @click="showdate()"/>
			</van-cell-group>
			<div class="search-btn">
				<van-button type="info" block round native-type="submit">{{rid?'编辑':'创建'}}</van-button>
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
	export default({
		name:'MonthlyGoal-add',
		components:{
			[Button.name]:Button,
			[Popup.name]:Popup,
			[Form.name]:Form,
			[Field.name]:Field,
			[CellGroup.name]:CellGroup,
			[Picker.name]:Picker,
			[DatetimePicker.name]:DatetimePicker,
			[RadioGroup.name]:RadioGroup,
			[Radio.name]:Radio
		},
		props:[
			'userMonthAims'
		],
		computed:{
			...mapGetters([
				'jdUserList',
				'fdUserList'
			])
		},
		data(){
			return{
				fromAccount:{
					name:{
						text:'全部',
						value:'0'
					},
					monthly:'',
					ordernum:'',
					status:''
				},
				PopupShow:false,  //搜索弹框
				PopupShowPicker:false,  //选择器弹框
				columns:[],  //下拉列表存放数据
				currentDate: new Date(), //当前时间
				isdate:false  ,//判断弹出的是否是时间
				pickerLoading:false,
				rid:''
			}
		},
		created() {
			this.ifRID(this.userMonthAims);
		},
		methods:{
			//显示搜索得选择器列表
			async showPickerList(){
				if(this.columns.length==0){
					if(this.pickerLoading){
						this.PopupShowPicker=true;
					}else{
						this.$toast('请先选择分类')
					}
					
				}else{
					this.PopupShowPicker=true;
					this.isdate=false;
				}
				
			},
			//显示时间选择
			showdate(){
				this.PopupShowPicker=true;
				this.isdate=true;
			},
			onConfirm(val){
				if(Object.keys(val).length==0){//月份
					this.fromAccount.monthly=`${val.getFullYear()}-${val.getMonth() + 1}`;
				}else{//人员
					this.fromAccount.name.text=val.text
					this.fromAccount.name.value=val.value
				}
				this.PopupShowPicker=false
			},
			//切换分类
			async hankSwitch(val){
				this.columns=[];
				this.fromAccount.status=val
				if(val==0){
					if(this.jdUserList.length==0){
						this.pickerLoading=true;
						await this.$store.dispatch('userList/getJdUserList');
					}
					this.columns=this.jdUserList
				}else{
					if(this.fdUserList.length==0){
						this.pickerLoading=true;
						await this.$store.dispatch('userList/getFdUserList');
					}
					this.columns=this.fdUserList
				}
				this.pickerLoading=false;
			},
			addConfirm(){
				if(this.rid==''){//创建
					this.axios.get("/Handler/CPManageSystem.ashx?cmd=addUserPlant",{
						params:{
							"month":this.fromAccount.monthly,
							"usertype":this.fromAccount.status,
							"plantnum":this.fromAccount.ordernum,
							"userid":this.fromAccount.name.value,
						}
					}).then(res=>{
						if(res.data>0){
							this.$toast('设置成功');
							this.fromAccount=this.$options.data().fromAccount;
							//this.$emit('update:userMonthAims', this.fromAccount);
							 this.$emit('loadproductdata',1);
						}else{
							this.$toast('设置失败');
						}
					}).catch(xhr=>{
						this.$toast('设置失败');
					})
				}else{//编辑
					this.axios.get("/Handler/CPManageSystem.ashx?cmd=editUserPlant",{
						params:{
							"month":this.fromAccount.monthly,
							"plantnum":this.fromAccount.ordernum,
							"rid":this.rid
						}
					}).then(res=>{
						if(res.data>0){
							this.$toast('编辑成功');
							let newuserMonthAims={  //构造相同回传的数据
								username:this.fromAccount.name.text,
								month:this.fromAccount.monthly,
								plantnum:eval(this.fromAccount.ordernum),
								usertype:this.fromAccount.status,
								rid:this.rid
							}
							this.$emit('update:userMonthAims', newuserMonthAims);  //更新父组件的值
							this.fromAccount=this.$options.data().fromAccount;
							this.$emit('editSuccess');
							this.rid='';
						}else{
							this.$toast('编辑失败');
						}
						
					}).catch(xhr=>{
						this.$toast('编辑失败');
					})
				}
				
			},
			//判断是否编辑还是创建
			ifRID(val){
				if(val.rid){
					this.fromAccount.ordernum=val.plantnum;
					this.fromAccount.monthly=val.month;
					this.rid=val.rid;  
					this.fromAccount.status=val.usertype;  
					this.fromAccount.name.text=val.username; 
					
				}else{
					this.rid='';
					this.fromAccount=this.$options.data().fromAccount;
				}
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
