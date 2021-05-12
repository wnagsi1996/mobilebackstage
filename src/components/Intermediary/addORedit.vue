<template>
	<div>
		<div class="popup-title">
			{{ifType?'创建':'编辑'}}人员信息
		</div>
		<van-form validate-first @submit="addConfirm" ref="agent">
			<van-cell-group>
				<van-field v-model.trim="agent.username" label="中介名称" placeholder="中介名称"
				:rules="[{required: true, message: '请输入中介名称'}]" />
			</van-cell-group>
			<van-cell-group>
				<van-field v-model.trim="agent.contact" label="联系方式" placeholder="手机号码/微信号/FB号"
				:rules="[{required: true, message: '请输入联系方式'}]" />
			</van-cell-group>
			<van-cell-group>
				<van-field readonly clickable right-icon="arrow-down" name="picker"
				:value="agent.channel.text" label="收款方式" placeholder="收款方式"
				:rules="[{required: true, message: '请选择收款方式'}]" @click="PopupShowPicker=true"/>
			</van-cell-group>
			<van-cell-group>
				<van-field v-model.trim="agent.account" label="收款账号" placeholder="收款账号" />
			</van-cell-group>
			<van-cell-group>
				<UploadImg title="收款码" @getimgsrc='getimgsrc' :file="file" />
			</van-cell-group>
			<van-cell-group>
				<van-field v-model.trim="agent.remark" label="备注" placeholder="备注" />
			</van-cell-group>
			<div class="search-btn">
				<van-button type="info" :loading="btnLoading" block round native-type="submit">{{ifType?'创建':'确认'}}</van-button>
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
	import {Button,Form,Field,CellGroup,Popup,Picker} from 'vant'
	import UploadImg from '@/components/UploadImg'
	import {aisleSub} from '@/utils/searchCondition.js'
	export default({
		name:'Intermediary-add',
		components:{
			[Button.name]:Button,
			[Form.name]:Form,
			[Field.name]:Field,
			[CellGroup.name]:CellGroup,
			[Popup.name]:Popup,
			[Picker.name]:Picker,
			UploadImg
		},
		props:{
			userInfo:{
				type:Object,
				default:new Object()
			}
		},
		data(){
			return{
				agent:{
					username:'',
					account:'',
					contact:'',
					channel:{
						text:'',
						value:''
					},
					imgsrc:'',  //当前返款码
					oldimg:''  ,//旧的返款码  编辑使用
					zjid:'',   //中介ID，编辑使用
					remark:''
				},
				ifType:true,  //编辑为false  创建为true
				btnLoading:false ,//按钮加载
				PopupShowPicker:false,  //选择器显示隐藏
				columns:aisleSub  ,//选择器数据
				file:[]  //给图片组件传图片地址
			}
		},
		created() {
			this.ifAgentdes(this.userInfo)
		},
		methods:{
			//图片地址赋值
			getimgsrc(val){
				this.agent.imgsrc=val;
			},
			//选择器确认
			onConfirm(val){
				this.agent.channel.text=val.text;
				this.agent.channel.value=val.value;
				this.PopupShowPicker=false
			},
			//创建按钮
			addConfirm(){
				if(this.agent.account=="" && this.agent.imgsrc=="" ){
					this.$toast('收款账户或二维码不能都为空')
					return false;
				}
				this.btnLoading=true;
				if(Object.keys(this.userInfo).length>0){  //编辑
					this.axios.post("/Handler/CPManageSystem.ashx",this.qs.stringify({
						"cmd":"editCPAgent",
						"zjid":this.agent.zjid,
						"name":this.agent.username,
						"lxfs":this.agent.contact,
						"remark":this.agent.remark,
						"skaccount":this.agent.account,
						"sktype":this.agent.channel.value,
						"_img64":this.agent.imgsrc,
						"oldfkimgurl":this.agent.oldimg
					})).then(res=>{
						//console.log(res);
						if(res.data>0){
							this.$toast('中介编辑成功')
							this.$emit('loadproductdata','1');
							this.agent=this.$options.data().agent;
						}else{
							this.$toast('中介编辑出错')
						}
						this.btnLoading=false;
					}).catch(xhr=>{
						//console.log(xhr);
						this.$toast('中介编辑出错')
						this.btnLoading=false;
					})
				}else{  //创建
					this.axios.post("/Handler/CPManageSystem.ashx",this.qs.stringify({
						"cmd":"addCPAgent",
						"name":this.agent.username,
						"lxfs":this.agent.contact,
						"remark":this.agent.remark,
						"skaccount":this.agent.account,
						"sktype":this.agent.channel.value,
						"_img64":this.agent.imgsrc
					})).then(res=>{
						console.log(res);
						if(res.data>0){
							this.$toast('中介创建成功')
							this.$emit('loadproductdata','1');
							this.agent=this.$options.data().agent;
						}else{
							this.$toast('中介创建出错')
						}
						this.btnLoading=false;
					}).catch(xhr=>{
						this.$toast('中介创建出错')
						this.btnLoading=false;
					})
				}
			},
			//判断是否编辑还是创建
			ifAgentdes(val){
				//console.log(val.fkImgUrl);
				this.file=[]
				if(Object.keys(val).length>0){
					this.agent.username=val.name;
					this.agent.channel.value=val.sktype;
					this.agent.channel.text=val.sktypestr;
					this.agent.account=val.skaccount;
					this.agent.contact=val.lxfs;
					this.agent.imgsrc=val.fkImgUrl;
					this.agent.oldimg=val.fkImgUrl;
					this.agent.zjid=val.rid
					if(val.fkImgUrl){
						this.file.push({
							url:val.fkImgUrl
						})
					}
					this.ifType=false
				}else{
					this.agent=this.$options.data().agent;
					this.ifType=true
				}
			}
		},
		watch:{
			userInfo(newVal,oldVal){
				this.userInfo=newVal;
				this.ifAgentdes(this.userInfo)
			}
		}
	})
</script>

<style>
</style>
