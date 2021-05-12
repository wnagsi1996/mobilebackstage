<template>
	<div>
		<div class="popup-title">
			新建订单
		</div>
		<van-form @submit="submitOrder">
			<van-cell-group>
				<van-field v-model.trim="order.name" label="客户名称" placeholder="输入名称搜索,默认全部显示"/>
			</van-cell-group>
			<van-cell-group>
				<van-field readonly clickable right-icon="arrow-down" name="picker"
				:value="order.user.text" label="客户" placeholder="上面输入框关键字搜索的结果"
				:rules="[{required: true, message: '请选择客户'}]" @click="showPickerList(0)"/>
			</van-cell-group>
			<van-cell-group>
				<van-field readonly clickable right-icon="arrow-down" name="picker"
				:value="order.paySel.text" label="支付选择" placeholder="支付选择"
				:rules="[{required: true, message: '请选择支付选择'}]" @click="showPickerList(1)"/>
			</van-cell-group>
			<van-cell-group>
				<van-field readonly clickable right-icon="arrow-down" name="picker"
				:value="order.channel.text" label="收款方式" placeholder="收款方式"
				:rules="[{required: true, message: '请选择收款方式'}]" @click="showPickerList(2)"/>
			</van-cell-group>
			<van-cell-group>
				<van-field type="number" v-model.trim="order.rate" label="汇率" placeholder="汇率" 
				:rules="[{required: true, message: '汇率不能为空'}]" />
			</van-cell-group>
			<van-cell-group>
				<van-field type="number" v-model.trim="order.money" label="收款金额" placeholder="当前实际收款金额(人民币)"
				:rules="[{required: true, message: '收款金额不能为空'}]" />
			</van-cell-group>
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
				:loading="pickLoading"
			    @confirm="onConfirm"
			    @cancel="PopupShowPicker = false"
			  />
		</van-popup>
	</div>
</template>

<script>
	import {Button,Popup,Form,Field,CellGroup,Picker} from 'vant'
	import {payment,aisleSub} from '@/utils/searchCondition.js'
	export default({
		name:'ClientOrder-addOrder',
		components:{
			[Button.name]:Button,
			[Popup.name]:Popup,
			[Form.name]:Form,
			[Field.name]:Field,
			[CellGroup.name]:CellGroup,
			[Picker.name]:Picker
		},
		data(){
			return{
				order:{
					name:'',
					intermediary:'0',  //中介 
					user:{
						text:'',
						value:''
					},
					paySel:{
						text:'',
						value:''
					},
					channel:{
						text:'',
						value:''
					},
					rate:'',
					money:''
				},
				btnLoading:false,
				sellerdata:[],
				columns:[],
				PopupShowPicker:false,
				pickLoading:false,
				type:0
			}
		},
		methods:{
			//搜索商家
			remoteMethod(){
				this.sellerdata=[];
				 return new Promise((resolve, reject)=>{
					 this.axios.get('/Handler/CPManageSystem.ashx?cmd=getHzsjListBySjname&sjname='+this.order.name).then(res=>{
					 	//console.log(res);
					 	if(res.data!=''){
					 		res.data.forEach(n=>{
					 			this.sellerdata.push({
					 				text:n.cname,
					 				value:n.id
					 			})
					 		})
							resolve(res);
					 	}else{
							reject(res)
						}
					 }).catch(xhr=>{
						 reject(res)
					 	console.log(xhr)
					 })
				 })
			},
			//弹出选择器
			async showPickerList(type){
				this.type=type;
				this.pickLoading=true;
				this.PopupShowPicker=true;
				switch(type){
					case 0:  //客户
						await this.remoteMethod();
						this.columns=this.sellerdata
						break;
					case 1://支付选择
						this.columns=payment;
						break;
					case 2: //支付方式
						this.columns=aisleSub;
						break;
				}
				this.pickLoading=false;
			},
			//确认选择器
			onConfirm(val){
				switch(this.type){
					case 0:
						this.order.user.text=val.text;
						this.order.user.value=val.value;
						break;
					case 1:
						this.order.paySel.text=val.text;
						this.order.paySel.value=val.value;
						break;
					case 2:
						this.order.channel.text=val.text;
						this.order.channel.value=val.value;
						break;
				}
				this.PopupShowPicker=false;
			},
			//订单提交
			submitOrder(){
				this.btnLoading=true;
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=addCPTopOrder",{
					params:{
						"hzsjid":this.order.user.value,
						"sktype":this.order.channel.value,
						"sktypeinfo":this.order.paySel.value,
						"selAgent":this.order.intermediary,
						"rmb2us":this.order.rate,
						"realskTotalMoney":this.order.money
					}
				}).then(res=>{
					//console.log(res);
					if(res.data.rescode==1){
						this.$toast('创建成功')
						this.$emit('loadproductdata','1');
						this.order=this.$options.data().order;
						//this.$router.push({path:'/addproduct', query: { orderno: res.data.resdesc }})
					}else{
						this.$toast(res.data.resdesc)
					}
					this.btnLoading=false;
				}).catch(xhr=>{
					//console.log(xhr);
					this.$toast('客户测评订单创建失败')
					this.btnLoading=false;
				})
			}
		}
		
	})
</script>

<style>
</style>
