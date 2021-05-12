<template>
	<div>
		<div class="popup-title">
			提交返款
		</div>
		<van-form @submit="submit" ref="rebate">
			<van-cell-group>
				<van-field v-model.trim="rebate.account" label="账号" placeholder="账号" 
				:rules="[{required: true, message: '请输入账号'}]" />
			</van-cell-group>
			<van-cell-group>
				<van-field type="number" v-model.trim="rebate.price" label="金额" placeholder="收款金额(人民币)" 
				:rules="[{required: true, message: '请输入收款金额'}]" />
			</van-cell-group>
			<van-cell-group>
				<van-field readonly clickable right-icon="arrow-down" name="picker"
				:value="rebate.channel.text" label="收款方式" placeholder="收款方式"
				:rules="[{required: true, message: '请选择收款方式'}]" @click="PopupShowPicker=true"/>
			</van-cell-group>
			<van-cell-group>
				<UploadImg title="二维码" @getimgsrc='getimgsrc' :file="file"/>
			</van-cell-group>
			<van-cell-group>
				<van-field v-model="rebate.remark" label="备注" placeholder="备注" />
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
	import {Button,Popup,Form,Field,CellGroup,Picker,Dialog } from 'vant'
	import UploadImg from '@/components/UploadImg'
	import {aisleSub} from '@/utils/searchCondition.js'
	export default({
		name:'MonthlyGoal-add',
		components:{
			[Button.name]:Button,
			[Popup.name]:Popup,
			[Form.name]:Form,
			[Field.name]:Field,
			[CellGroup.name]:CellGroup,
			[Picker.name]:Picker,
			[Dialog.Component.name]: Dialog.Component,
			UploadImg
		},
		props:{
			Rebatedata:{
				type:Object,
				default:new Object()
			}
		},
		data(){
			return{
				rebate:{
					channel:{
						text:'',
						value:''
					},
					account:'',
					price:'',
					remark:'',
					imgsrc:'',
					oldimg:''
				},
				PopupShowPicker:false,  //选择器弹框
				columns:aisleSub,  //下拉列表存放数据
				btnloading:false,
				file:[]
			}
		},
		created() {
			this.getdata()
		},
		methods:{
			//选择器确认
			onConfirm(val){
				this.rebate.channel.text=val.text
				this.rebate.channel.value=val.value
				this.PopupShowPicker=false
			},
			//提交
			submit(){
				if(this.rebate.channel.value!='3'){
				   let firstmoney = (eval(this.Rebatedata.usmoney) * 7) * 1.1;
				   let lastmoney = (eval(this.Rebatedata.usmoney) * 7) * 0.9;
				   if(this.rebate.price>firstmoney || this.rebate.price<lastmoney){
					   Dialog.confirm({
					     title: '警告',
					     message: '您输入的返款人民币跟实际误差比较大，请重新核算遍，继续提交点确定！',
					   }).then(() => {
							this.uploadRebate();
					    }).catch(() => {
					       this.$toast('已取消返款')
					    });
						
				   }else{
					   this.uploadRebate();
				   }
				}else{
					this.uploadRebate();
				}
			},
			//提交返款FN
			uploadRebate(){
				if(this.rebate.account=="" && this.rebate.imgsrc=="" ){
					this.$toast('收款账户或二维码不能都为空')
				}else{
				  this.btnloading=true;
				  let newremark;
				  if(this.rebate.channel.value!='3'){
					  newremark=this.rebate.remark+"(填写人民币金额：" + this.rebate.price + ")";
				  }else{
					  newremark=this.rebate.remark
				  }
				  this.axios.post("/Handler/CPManageSystem.ashx",this.qs.stringify({
						"cmd":"comitProductFK",
						"orderno":this.Rebatedata.orderno,
						"remark":newremark,
						"skaccount":this.rebate.account,
						"oldfkimgurl":this.rebate.oldimg,
						"sktype":this.rebate.channel.value,
						"_img64":this.rebate.imgsrc,
				  })).then(res=>{
					console.log(res);
					if(res.data.rescode>0){
						this.$toast('提交成功')
						this.$emit('loadproductdata','1');
						this.rebate=this.$options.data().rebate;
					}else{
						this.$toast('提交失败')
					}
					this.btnloading=false;
				  }).catch(xhr=>{
					this.$toast('提交失败')
					this.btnloading=false;
				  })
				}
			},
			//获取图片地址
			getimgsrc(val){
				this.rebate.imgsrc=val;
			},
			//有传数据来的时候赋值
			getdata(){console.log(this.Rebatedata)
				if(Object.keys(this.Rebatedata).length>2){
					this.rebate.channel.value=this.Rebatedata.fktype;
					aisleSub.forEach(n=>{  //循环遍历，显示返款类型
						if(n.value==this.Rebatedata.fktype){
							this.rebate.channel.text=n.text
						}
					})
					this.rebate.account=this.Rebatedata.fkaccount;
					this.rebate.price=this.Rebatedata.fktype;
					
					if(this.Rebatedata.fkimgurl!=''){  //判断返款二维码是否为空
						this.rebate.imgsrc=this.Rebatedata.fkimgurl;
						this.file=[{src:this.Rebatedata.fkimgurl}];
						this.rebate.oldimg=this.Rebatedata.fkimgurl;
					}
					if(this.Rebatedata.remark!=''){  //判断备注是否为空，不为空再判断是否有自动添加的备注信息，有则剥离出来
						let newfkremark;
						let fkremarkrmb = this.Rebatedata.fkremark.lastIndexOf("(");
						if (fkremarkrmb != -1) {
							newfkremark = this.Rebatedata.fkremark.substring(0, fkremarkrmb);
							this.rebate.price = (this.Rebatedata.fkremark.substring(newfkremark).match(/\d+(.\d+)?/g)).toString();
						} else
							newfkremark = this.Rebatedata.fkremark;
						this.rebate.remark=newfkremark;
					}
				}
			}
		},
		watch:{
			Rebatedata(newVal,oldVal){
				this.rebate=this.$options.data().rebate;//清空输入数据
				this.Rebatedata=newVal;
				this.getdata();
			}
		}
	})
</script>

<style>
</style>
