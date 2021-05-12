<template>
	<div>
		<div class="popup-title">
			上传订单信息
		</div>
		<van-form validate-first @submit="addConfirm">
			<van-cell-group>
				<van-field v-model.trim="order.userinfo" label="刷手名称" placeholder="刷手名称"
				:rules="[{required: true, message: '请输入刷手名称'}]" />
			</van-cell-group>
			<van-cell-group>
				<van-field v-model.trim="order.xdorderno" label="购买单号" placeholder="购买单号"
				:rules="[{required: true, message: '请输入购买单号'}]" />
			</van-cell-group>
			<van-cell-group>
				<van-field type="number" v-model.trim="order.price" label="购买价格" placeholder="价格"
				:rules="[{required: true, message: '请输入购买价格'}]" />
			</van-cell-group>
			<van-cell-group>
				<van-field readonly clickable right-icon="arrow-down" name="datetimePicker" 
				:value="order.date" label="下单时间" placeholder="下单时间" @click="showdate"/>
			</van-cell-group>
			<van-cell-group>
				<van-field v-model.trim="order.remark" label="备注" placeholder="备注" />
			</van-cell-group>
			<div class="search-btn">
				<van-button type="info" :loading="btnLoading" block round native-type="submit">提交</van-button>
			</div>
		</van-form>
		<van-popup v-model="PopupShowPicker" round position="bottom">
			  <van-datetime-picker
			    v-model="currentDate"
			    type="datetime"
			    title="选择年月日"
				@confirm="onConfirm"
				@cancel="PopupShowPicker = false"
			  />
		</van-popup>
	</div>
</template>

<script>
	import {Button,Form,Field,CellGroup,Picker,DatetimePicker,Popup} from 'vant'
	export default({
		name:'Review',
		components:{
			[Button.name]:Button,
			[Form.name]:Form,
			[Field.name]:Field,
			[CellGroup.name]:CellGroup,
			[Popup.name]:Popup,
			[Picker.name]:Picker,
			[DatetimePicker.name]:DatetimePicker
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
					userinfo:'',
					price:'',
					remark:'',
					xdorderno:'',
					date:''
				},
				btnLoading:false ,//按钮加载
				PopupShowPicker:false,
				currentDate:new Date()
			}
		},
		created() {
			this.getOrderInfo();
		},
		methods:{
			//获取订单信息
			getOrderInfo(){
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=getCPOrderDetailXDInfo&orderno="+this.orderno).then(res=>{
					//console.log(res);
					if(res.data!=''){
						this.order.userinfo=res.data.fklxfs;
						this.order.xdorderno=res.data.xdOrderno;
						this.order.price=res.data.realproductdj;
						this.order.date=res.data.realxddate;
						this.order.remark=res.data.fkremark;
					}else{
						this.order=this.$options.data().order;
					}
				}).catch(xhr=>{
					console.log(xhr);
				})
			},
			//提交
			addConfirm(){
				this.btnLoading=true;
				this.axios.post("/Handler/CPManageSystem.ashx",this.qs.stringify({
					 "cmd":"setCPOrderDetailXDInfo",
					 "orderno":this.orderno,
					 "useremail":this.order.userinfo,
					 "xdOrderno":this.order.xdorderno,
					 "fkaccount":'',
					 "fkremark":this.order.remark,
					 "realxddate":this.order.date,
					 "realproductdj":this.order.price,
					 "fktype":0,
					 "_img64":''
				})).then(res=>{
					this.$toast(res.data.resdesc);
					if(res.data.rescode>0){
						this.order=this.$options.data().order;
						this.$emit("loadproductdata","1");
					}
					this.btnLoading=false;
				}).catch(xhr=>{
					console.log(xhr);
				})
			},
			//显示时间选择
			showdate(i){
				this.PopupShowPicker=true;
			},
			onConfirm(val){
				this.order.date=`${val.getFullYear()}-${val.getMonth() + 1}-${val.getDate()} ${val.getHours()}:${val.getMinutes()}:0`;
				this.PopupShowPicker=false
			}
		},
		watch:{
			orderno(newVal,oldVal){
				this.orderno=newVal;
				this.getOrderInfo();

			}
		}
	})
</script>

<style>
</style>
