<template>
	<div>
		<div class="popup-title">
			补退差价
		</div>
		<van-form @submit="submit" ref="spread">
			<van-cell-group>
				<van-field name="radio" label="分类">
				  <template #input>
					<van-radio-group v-model="spread.type" direction="horizontal" @change="hankSwitch">
					  <van-radio name="0">补差价</van-radio>
					  <van-radio name="1">退差价</van-radio>
					</van-radio-group>
				  </template>
				</van-field>
			</van-cell-group>
			<van-cell-group>
				<van-field type="number" v-model.trim="spread.money" label="金额" placeholder="金额(小数点保留两位)" 
				:rules="[{required: true, message: '请输入金额(小数点保留两位)'}]" />
			</van-cell-group>
			<van-cell-group>
				<van-field readonly clickable right-icon="arrow-down" name="picker"
				:value="spread.channel.text" label="渠道" placeholder="渠道"
				:rules="[{required: true, message: '请选择渠道'}]" @click="PopupShowPicker=true"/>
			</van-cell-group>
			<van-cell-group>
				<van-field v-model.trim="spread.account" label="账号" placeholder="账号" />
			</van-cell-group>
			<van-cell-group>
				<van-field v-model.trim="spread.remark" label="备注" placeholder="备注" />
			</van-cell-group>
			<van-cell-group>
				<UploadImg title="二维码/截图" @getimgsrc='getimgsrc' :file="file" />
			</van-cell-group>
			<div class="search-btn">
				<van-button type="info" block round native-type="submit" :loading="btnloading">提交</van-button>
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
	import {Button,Popup,Form,Field,CellGroup,Picker,RadioGroup, Radio} from 'vant'
	import {aisleSub} from '@/utils/searchCondition.js'
	import UploadImg from '@/components/UploadImg'
	export default({
		name:'MonthlyGoal-add',
		components:{
			[Button.name]:Button,
			[Popup.name]:Popup,
			[Form.name]:Form,
			[Field.name]:Field,
			[CellGroup.name]:CellGroup,
			[Picker.name]:Picker,
			[RadioGroup.name]:RadioGroup,
			[Radio.name]:Radio,
			UploadImg
		},
		props:{
			orderno:{
				type:String,
				default:''
			}
		},
		data(){
			return{
				spread:{
					orderno:'',
					type:'',
					money:'',
					channel:{
						text:'',
						value:''
					},
					account:'',
					remark:'',
					imgsrc:''
				},
				PopupShowPicker:false,  //选择器弹框
				columns:aisleSub,  //下拉列表存放数据
				btnloading:false,
				file:[]
			}
		},
		created() {
			this.spread.orderno=this.orderno
		},
		methods:{
			//获取图片地址
			getimgsrc(val){
				this.spread.imgsrc=val;
			},
			//选择器确认
			onConfirm(val){
				this.spread.channel.text=val.text
				this.spread.channel.value=val.value
				this.PopupShowPicker=false
			},
			//切换分类
			hankSwitch(val){
				this.spread.status=val
			},
			//提交
			submit(){
				if(this.spread.account=='' && this.spread.imgsrc==''){
					this.$toast('返款账号或者截图不能为空！')
					return false;
				}else{
					this.btnloading=true;
					this.axios.post("/Handler/CPManageSystem.ashx?cmd=comitMakeUpTopOrderMoney",this.qs.stringify({
							"toporderno":this.spread.orderno,
							"remark":this.spread.remark,
							"ordertype":this.spread.type,
							"ordermoney":this.spread.money,
							"skaccount":this.spread.account,
							"sktype":this.spread.channel.value,
							"_img64":this.spread.imgsrc
					})).then(res=>{
					     //console.log(res);
						if(res.data.rescode>0){
							this.$toast('提交成功')
							this.$emit('loadproductdata','1');
							this.spread=this.$options.data().spread;//清空输入数据
						}else{
							this.$toast(res.data.resdesc)
						}
						this.btnloading=false;
					}).catch(xhr=>{
						this.$toast('提交失败')
						this.btnloading=false;
					})
				}
			},
		},
		watch:{
			orderno(newVal,oldVal){
				this.spread=this.$options.data().spread;//清空输入数据
				this.spread.orderno=newVal
			}
		}
	})
</script>

<style>
</style>
