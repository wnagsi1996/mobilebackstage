<template>
	<div>
		<div class="popup-title">
			追加订单
		</div>
		<van-form @submit="submitOrder">
			<van-cell-group>
				<van-field v-model.trim="order.keyword" label="关键词" placeholder="关键词" 
				:rules="[{required: true, message: '关键词不能为空'}]" />
			</van-cell-group>
			<van-cell-group>
				<van-field v-model.trim="order.keywordPage" label="页码" placeholder="关键词大概在第几页" 
				:rules="[{required: true, message: '关键词大概在第几页不能为空'}]" />
			</van-cell-group>
			<van-cell-group>
				<van-field v-model.trim="order.code" label="折扣码" placeholder="折扣码"  />
			</van-cell-group>
			<van-cell-group>
				<van-field type="number" v-model.trim="order.price" label="客单价" placeholder="客单价(单位:美金)" 
				:rules="[{required: true, message: '客单价不能为空'}]" />
			</van-cell-group>
			<van-cell-group>
				<van-field type="digit" v-model="order.lpnum" label="留评单数量" placeholder="留评单数量" 
				:rules="[{required: true, message: '留评单数量不能为空'}]" />
			</van-cell-group>
			<van-cell-group>
				<van-field type="digit" v-model="order.mpnum" label="免评单数量" placeholder="免评单数量" 
				:rules="[{required: true, message: '免评单数量不能为空'}]"  />
			</van-cell-group>
			<van-cell-group>
				<van-field type="number" v-model.trim="order.pp" label="PP费" placeholder="客单费加PP费（单位：美金)" 
				:rules="[{required: true, message: 'PP费不能为空'}]" />
			</van-cell-group>
			<van-cell-group>
				<van-field type="number" v-model.trim="order.commission" label="佣金" placeholder="佣金(单位：人民币)" 
				:rules="[{required: true, message: '佣金不能为空'}]" />
			</van-cell-group>
			<van-cell-group>
				<van-field type="number" v-model.trim="order.ytotalPrice" label="应收款" placeholder="应收款总金额(单位：人民币)" 
				:rules="[{required: true, message: '应收款不能为空'}]" />
			</van-cell-group>
			<van-cell-group>
				<van-field type="number" v-model.trim="order.stotalPrice" label="实收款" placeholder="实收款总金额(单位：人民币)" 
				:rules="[{required: true, message: '实收款不能为空'}]" />
			</van-cell-group>
			<van-cell-group>
				<van-field readonly clickable right-icon="arrow-down" name="picker"
				:value="order.channel.text" label="支付选择" placeholder="支付选择"
				:rules="[{required: true, message: '请选择支付选择'}]" @click="PopupShowPicker=true"/>
			</van-cell-group>
			<van-cell-group>
				<van-field v-model.trim="order.reviewUrl" label="点赞" placeholder="点赞（评论URL)" />
			</van-cell-group>
			<van-cell-group>
				<van-field type="textarea" rows="1" autosize v-model.trim="order.xdReamrk" label="下单要求" placeholder="下单要求" />
			</van-cell-group>
			<van-cell-group>
				<van-field type="textarea" rows="1" autosize v-model.trim="order.remark" label="备注" placeholder="备注,自己看" />
			</van-cell-group>
			<van-cell-group>
				<van-field type="textarea" rows="1" autosize v-model.trim="order.cwRemark" label="财务备注" placeholder="给财务审核看" />
			</van-cell-group>
			<div class="search-btn">
				<van-button type="info" block round native-type="submit" :loading="btnLoading">提交</van-button>
			</div>
		</van-form>
		
		<van-popup v-model="PopupShowPicker" round position="bottom">
			<van-picker
			    show-toolbar
			    :columns="columns"
				:loading="pickLoading"
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
		name:'appendProduct',
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
					keyword:'',
					keywordPage:'',
					code:'',
					price:'',
					lpnum:'',
					mpnum:'',
					pp:'',
					commission:'',
					ytotalPrice:'',
					stotalPrice:'',
					channel:{
						text:'',
						value:''
					},
					reviewUrl:'',
					xdReamrk:'',
					remark:'',
					cwRemark:''
				},
				btnLoading:false,
				columns:aisleSub,
				PopupShowPicker:false,
				pickLoading:false,
				neworderno:'',
			}
		},
		created() {
			this.neworderno=this.orderno;
		},
		methods:{
			//订单提交
			submitOrder(){
				if(this.order.KeyWord!=''){
				  if(this.order.keyword.includes("\“")||this.order.keyword.includes("\"")){
					  this.$toast('关键词不能用双引号')
					  return false
				  }					  
				}
				this.btnLoading=true;
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=appendCPOrder",{
					 params:{
						"cporderno":this.neworderno, //测评订单号
						"realtotalmoney":this.order.stotalPrice,
						"sktype":this.order.channel.value,
						"cwremark":this.order.cwRemark,
						"KeyWord":this.order.keyword,
						"KeyWordPage":this.order.keywordPage?this.order.keywordPage:'',
						"CouponCode":this.order.code,
						"HelpFulUrl":this.order.reviewUrl,
						"lpnum":eval(this.order.lpnum),
						"mpnum":eval(this.order.mpnum),
						"cpyj":eval(this.order.commission),
						"remark":this.order.remark,
						"xdyq":this.order.xdReamrk,
						"productdj":eval(this.order.price),
						"ProductPPMoney":eval(this.order.pp),
						"sktotalmoney":eval(this.order.ytotalPrice),
					 }
				}).then(res=>{console.log(res)
					if(res.data.rescode>0){
						this.$toast('添加成功')
						this.order=this.$options.data().order
						this.$emit("loadproductdata",'1');
					}else{
						this.$toast('添加失败')
					}
					this.btnLoading=false;
					
				}).catch(xhr=>{
					this.btnLoading=false;
				})
			},
			//确认选择器
			onConfirm(val){
				this.order.channel.text=val.text;
				this.order.channel.value=val.value;
				this.PopupShowPicker=false;
			}
		},
		watch:{
			orderno(newVal,oldVal){
				this.neworderno=newVal;
				this.order=this.$options.data().order
			}
		}
		
	})
</script>

<style>
</style>
