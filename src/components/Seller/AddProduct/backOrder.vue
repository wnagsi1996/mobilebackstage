<template>
	<div>
		<div class="popup-title">
			退单退款
		</div>
		<van-form @submit="submit">
			<template v-if="isorder">
				<van-cell-group>
					<van-field type="digit" v-model="chargeback.lpnum" label="留评单数量" :placeholder="attrplaceholder.lp"
					 :rules="[{required: true, message: '请输入留评单数量'}]"/>
				</van-cell-group>
				<van-cell-group>
					<van-field type="digit" v-model="chargeback.mpnum" label="免评单数量" :placeholder="attrplaceholder.mp"
					 :rules="[{required: true, message: '请输入免评单数量'}]"/>
				</van-cell-group>
			</template>
			<van-cell-group>
				<van-field type="number" v-model.trim="chargeback.ytproductprice" label="应退总产品费" placeholder="应退总产品费"
				 :rules="[{required: true, message: '请输入应退总产品费'}]"/>
			</van-cell-group>
			<van-cell-group>
				<van-field type="number" v-model.trim="chargeback.commission" label="应退总佣金" placeholder="应退总佣金"
				 :rules="[{required: true, message: '请输入应退总佣金'}]"/>
			</van-cell-group>
			<van-cell-group>
				<van-field type="number" v-model.trim="chargeback.stmoney" label="实退金额" placeholder="实退金额"
				 :rules="[{required: true, message: '请输入实退金额'}]"/>
			</van-cell-group>
			<van-cell-group>
				<van-field readonly clickable right-icon="arrow-down" name="picker"
				:value="chargeback.channel.text" label="退款渠道" placeholder="退款渠道"
				:rules="[{required: true, message: '请选择退款渠道'}]" @click="PopupShowPicker=true"/>
			</van-cell-group>
			<van-cell-group>
				<van-field v-model.trim="chargeback.account" label="退款账号" placeholder="退款账号" />
			</van-cell-group>
			<van-cell-group>
				<van-field v-model.trim="chargeback.remark" label="备注" placeholder="备注" />
			</van-cell-group>
			<van-cell-group>
				<UploadImg title="二维码" @getimgsrc='getimgsrc' />
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
	import {Button,Form,Field,CellGroup,Picker,Popup} from 'vant'
	import UploadImg from '@/components/UploadImg'
	import {aisleSub} from '@/utils/searchCondition.js'
	export default({
		name:'Chargeback',
		components:{
			[Button.name]:Button,
			[Popup.name]:Popup,
			[Form.name]:Form,
			[Field.name]:Field,
			[CellGroup.name]:CellGroup,
			[Picker.name]:Picker,
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
				chargeback:{
					orderno:'',
					lpnum:'',
					mpnum:'',
					ytproductprice:'',
					commission:'',
					stmoney:'',
					channel:{
						text:'',
						value:''
					},
					account:'',
					remark:'',
					imgsrc:''
				},
				columns:aisleSub,
				PopupShowPicker:false,
				btnLoading:false,
				attrplaceholder:{
					lp:'',
					mp:''
				},
				ordertype:0,
				isorder:false
			}
		},
		created() {
			this.chargeback.orderno=this.orderno;
			this.isorderfun()
		},
		methods:{
			//获取可退数量
			getordernonum(){
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=getCPOrderCanBackNum&orderno="+this.chargeback.orderno).then(res=>{
					//console.log(res)
					if(res.data!=''){
						this.attrplaceholder.lp='最多可退'+res.data.lpnum+'单'
						this.attrplaceholder.mp='最多可退'+res.data.mpnum+'单'
					}
					
				}).catch(xhr=>{
					console.log(xhr)
				})
			},
			//获取图片地址
			getimgsrc(val){
				this.chargeback.imgsrc=val;
			},
			// 显示选择器
			showPickerList(){
				this.PopupShowPicker=true;
			},
			// 选择器确认
			onConfirm(val){
				this.chargeback.channel.text=val.text
				this.chargeback.channel.value=val.value
				this.PopupShowPicker=false
			},
			//提交
			submit(){
				if(this.chargeback.account=='' && this.chargeback.imgsrc==''){
					this.$toast('返款账号或者返款二维码不能都为空');
					return false;
				}else{
					this.btnLoading=true;
					this.axios.post("/Handler/CPManageSystem.ashx",this.qs.stringify({
						 "cmd":"comitOrderGoBack",
						 "orderno":this.chargeback.orderno,
						 "ordertype":this.ordertype,
						 "remark":this.chargeback.remark,
						 "yskmoney_product":eval(this.chargeback.ytproductprice),
						 "yskmoney_yj":eval(this.chargeback.commission),
						 "tkmoney":this.chargeback.stmoney,
						 "sktype":this.chargeback.channel.value,
						 "skaccount":this.chargeback.account,
						 "mpnum":this.chargeback.mpnum,
						 "lpnum":this.chargeback.lpnum,
						 "_img64":this.chargeback.imgsrc
					})).then(res=>{
						 //console.log(res);
						 if(res.data.rescode>0){
							this.$toast('退单已提交给财务返款')
							this.$emit('loadproductdata','1');
							this.chargeback=this.$options.data().chargeback;
						 }else{
							this.$toast(res.data.resdesc)
						 }
						 this.btnLoading=false;
					}).catch(xhr=>{
						console.log(xhr)
						this.btnLoading=true;
					})
				}
			},
			isorderfun(){
				if(this.chargeback.orderno.startsWith('D')){  //判断子单还是产品单
					this.isorder=false
					this.chargeback.mpnum=0;
					this.chargeback.lpnum=0;
					this.attrplaceholder.lp=''
					this.attrplaceholder.mp=''
					this.ordertype=1
				}else{
					this.isorder=true
					this.getordernonum();
					this.chargeback.mpnum='';
					this.chargeback.lpnum='';
					this.ordertype=0
				}
			}
		},
		watch:{
			orderno(newVal,oldVal){
				this.chargeback=this.$options.data().chargeback;
				this.chargeback.orderno=newVal;
				this.isorderfun();
			}
		}
	})
</script>

<style>
</style>
