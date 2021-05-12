<template>
	<div>
		<div class="popup-title">
			{{rid==0?'创建':'编辑'}}人员信息
		</div>
		<van-form validate-first @submit="addConfirm" ref="user">
			<van-cell-group>
				<van-field v-model.trim="user.username" label="员工姓名" placeholder="员工姓名"
				:rules="[{required: true, message: '请输入员工姓名'}]" />
			</van-cell-group>
			<van-cell-group>
				<van-field v-model.trim="user.loginname" label="登录名称" placeholder="登录名称"
				:rules="[{required: true, message: '请输入登录名称'}]" />
			</van-cell-group>
			<template v-if="rid==''">
				<van-cell-group>
					<van-field type="password" v-model.trim="user.pass" label="登录密码" placeholder="登录密码"
					:rules="[{required: true, message: passmsg,validator:passFun}]" />
				</van-cell-group>
				<van-cell-group>
					<van-field type="password" v-model.trim="user.pass1" label="确认密码" placeholder="确认密码"
					:rules="[{required: true,  message: pass1msg, validator:pass1Fun}]" />
				</van-cell-group>
			</template>
			<van-cell-group>
				<van-field readonly clickable right-icon="arrow-down" name="picker"
				:value="user.role.text" label="类别" placeholder="请选择用户类别" @click="showPickerList()" 
				:rules="[{required: true, message: '请选择用户类别'}]" />
			</van-cell-group>
			<van-cell-group>
				<van-field v-model.trim="user.remark" label="备注" placeholder="备注" />
			</van-cell-group>
			<div class="search-btn">
				<van-button type="info" :loading="btnLoading" block round native-type="submit">{{rid==0?'创建':'确认'}}</van-button>
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
	import {mapGetters} from 'vuex'
	import {Button,Popup,Form,Field,CellGroup,Picker} from 'vant'
	import {cmdEncrypt} from "@/assets/JS/RSAz.js"
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
		props:{
			rid:{
				type:String,
				default:'0'
			}
		},
		computed:{
			...mapGetters([
				'roleList'
			])
		},
		data(){
			return{
				user:{
					username:'',
					loginname:'',
					pass:'',
					pass1:'',
					role:{
						text:'',
						value:''
					},
					remark:''
				},
				PopupShow:false,  //搜索弹框
				PopupShowPicker:false,  //选择器弹框
				columns:[],  //下拉列表存放数据
				userid:'0',
				btnLoading:false //按钮加载
			}
		},
		created() {
			this.userid=this.rid;
			this.rolelistFun();
			this.getUserInfo();
		},
		methods:{
			//获取用户信息
			async getUserInfo(){
				if(this.rid!=""){
					await this.axios.get("/Handler/CPManageSystem.ashx?cmd=getCPUserInfo&userid="+this.userid).then(res=>{
						//console.log(res);
						this.user.username=res.data.Username;
						this.user.loginname=res.data.Loginname;
						this.user.role.value=res.data.Roleid;
						this.user.remark=res.data.Remark;
						
						//赋值
						this.roleList.forEach(n=>{
							if(n.value==res.data.Roleid){
								this.user.role.text=n.text
							}
						})
					}).catch(xhr=>{
						this.$toast('获取用户信息失败!')
					})
					
					this.user.pass="1"
					this.user.pass1="1"
				}else{
					this.user.pass=""
					this.user.pass1=""
					this.user=this.$options.data().user;
				}
			},
			//判断有没有角色列表
			async rolelistFun(){
				if(this.roleList.length==0){
					await this.$store.dispatch('userList/getroleList')
				}
				this.columns=this.roleList;
			},
			//选择器确认
			onConfirm(val){
				this.user.role.text=val.text
				this.user.role.value=val.value
				this.PopupShowPicker=false
			},
			//显示选择器
			showPickerList(){
				this.PopupShowPicker=true
			},
			//创建按钮
			async addConfirm(){
				this.btnLoading=true;
				let strPublicKeyExponent,strPublicKeyModulus,pass=1,pass1=1;
				if(this.rid==''){//创建
					//获取后台传过来的公钥
					await this.axios.get('/Handler/RSAKey.ashx?cmd=CreateRSAKey').then((res)=>{
						if(res.data.rescode==0){
							strPublicKeyExponent=res.data.strPublicKeyExponent
							strPublicKeyModulus=res.data.strPublicKeyModulus;
							pass = cmdEncrypt(this.user.pass, strPublicKeyExponent, strPublicKeyModulus);
							pass1 = cmdEncrypt(this.user.pass, strPublicKeyExponent, strPublicKeyModulus);
						}
						else{
							this.$toast.fail('加密失败');
							this.loading=false;
						}
						this.btnLoading=false;
					}).catch(xhr=>{
						this.$toast.fail('登录出错请重试')
						this.btnLoading=false;
					});
				}
				//创建或编辑
				await this.axios.get("/Handler/CPManageSystem.ashx?cmd=addOrEditCPUser",{
					params:{
						"uid":this.userid,
						"username":this.user.username,
						"loginname":this.user.loginname,
						"password":pass,
						"surepassword":pass1,
						"roleid":this.user.role.value,
						"remark":this.user.remark
					}
				}).then(res=>{
					//console.log(res);
					if(res.data.rescode==1){
						this.$toast(res.data.resdesc)
						this.$emit('loadproductdata',1);
					}else{
						this.$toast(res.data.resdesc)
					}
					this.btnLoading=false;
				}).catch(xhr=>{
					//console.log(xhr);
					this.$toast('设置出错');
					this.btnLoading=false;
				})
			},
			//第一次密码错误提示
			passmsg(value){
				let reg=new RegExp(/^\w{6,20}$/)
				if(value==''){
					return '请输入密码'
				}else if(!reg.test(value)){
					return '密码范围再6-20位'
				}
			},
			//第二次密码错误提示
			pass1msg(value,rule){
				if(value==''){
					return '请再次输入密码'
				}else if(value!==this.user.pass){
					return '两次密码输入不一致'
				}
			},
			//第一次密码校验函数
			passFun(value){
				let reg=new RegExp(/^\w{6,20}$/);
				return reg.test(value)
			},
			//第二次密码校验函数
			pass1Fun(value){
				return value===this.user.pass
			}
		},
		watch:{
			rid(newVal,oldVal){
				this.userid=newVal;
				this.getUserInfo();
			}
		}
	})
</script>

<style>
</style>
