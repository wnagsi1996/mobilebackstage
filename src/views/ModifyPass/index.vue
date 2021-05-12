<template>
	<div>
		<Header title="修改密码" />
		<van-form @submit="onSubmit">
		  <van-field v-model="formPass.oldPass" type="password" name="旧密码" label="旧密码" placeholder="旧密码"
		    :rules="[{ required: true, message: '请填写旧密码' }]" />
		  <van-field v-model="formPass.newpass1" type="password" name="新密码" label="新密码"  placeholder="新密码"
		    :rules="[{ required: true, message: '请填写新密码' }]" />
		  <van-field v-model="formPass.newpass2" type="password" name="确认密码" label="确认密码"  placeholder="确认密码"
			:rules="[{validator:checkpass, required: true, message: messFun }]" />
		  <div style="margin: 16px;">
		    <van-button round block type="info" :loading="loading" native-type="submit">提交</van-button>
		  </div>
		</van-form>
	</div>
</template>

<script>
	import {Field,Form,Button} from 'vant'
	import {cmdEncrypt} from "@/assets/JS/RSAz.js"
	export default({
		name:'ModifyPass',
		components:{
			[Field.name]:Field,
			[Form.name]:Form,
			[Button.name]:Button,
		},
		data(){
			return{
				formPass:{
					oldPass:'',
					newpass1:'',
					newpass2:''
				},
				loading:false
				
			}
		},
		methods:{
			checkpass(val){
				if(val==''){
					return false
				}else if(val!=this.formPass.newpass1){
					return false
				}
			},
			messFun(val){
				if(val==''){
					return '请再次输入密码'
				}else if(val!=this.formPass.newpass1){
					return '两次密码输入不一致'
				}
			},
			onSubmit(){
				this.loading=true;
				//获取后台传过来的公钥
				let strPublicKeyExponent,strPublicKeyModulus,pass,pass1
				this.axios.get('/Handler/RSAKey.ashx?cmd=CreateRSAKey').then((res)=>{
					if(res.data.rescode==0){
						strPublicKeyExponent=res.data.strPublicKeyExponent
						strPublicKeyModulus=res.data.strPublicKeyModulus;
						pass = cmdEncrypt(this.formPass.oldPass, strPublicKeyExponent, strPublicKeyModulus);
						pass1 = cmdEncrypt(this.formPass.newpass1, strPublicKeyExponent, strPublicKeyModulus);
						
						this.axios.post('/Handler/ManageHandler.ashx?cmd=modifyPasswordByCurUser',this.qs.stringify({
							//params:{
								"password1":pass,
								"password2":pass1,
								"password3":pass1
							//}
						})).then((resstr)=>{
							//console.log(resstr);
							this.$toast(resstr.data.resdesc);
							if(resstr.data.rescode>0){
								this.formPass=this.$options.data().formPass;
							}
							this.loading=false;
						}).catch(xhr=>{
							this.$toast('修改密码出错')
							//console.log(xhr)
							this.loading=false;
						})
					}else{
						this.$toast('加密失败')
					}
					this.loading=false;
				}).catch(xhr=>{
					this.$toast('加密失败')
					this.loading=false;
				})
			}
		}
	})
</script>

<style>
</style>
