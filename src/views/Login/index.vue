<template>
	<div class="login">
		<div class="login-title">
			<div class="login-logo">
				<img src="../../assets/images/logo-icon.png"/>
			</div>
			<h3>跨境测评管理平台</h3>
		</div>
		<van-form @submit="onSubmit" ref="fromLogin" class="login-form">
			<div class="inp">
				<van-field
				  class="form-txt"
				  v-model="username"
				  name="用户名"
				  label="用户名"
				  placeholder="用户名"
				  :rules="[{ required: true, message: '请填写用户名' }]"
				/>
			</div>
		    <div class="inp">
				<van-field
				  class="form-txt"
				  v-model="password"
				  type="password"
							label="密码"
				  name="密码"
				  placeholder="密码"
				  :rules="[{ required: true, message: '请填写密码' }]"
				/>
			</div>
		  
		  <div class="inp code">
		  	<van-field
		  	  v-model="code"
		  	  name="code"
		  	  placeholder="验证码"
		  	/>
		  	<img class="codeimg" src='' id="codeimg" @click="showCode" />
		  </div>
		  <div style="margin: 30px 0 0;">
		    <van-button round block type="info" native-type="submit" :loading="loading">提交</van-button>
		  </div>
		</van-form>
	</div>
</template>

<script>
	import { Form,Field,Button } from 'vant'
	import {cmdEncrypt} from "@/assets/JS/RSAz.js"
	export default({
		name:'Login',
		components:{
			[Form.name]:Form,
			[Field.name]:Field,
			[Button.name]:Button
		},
		data(){
			return{
				 username: '',
				 password: '',
				 code:'',
				 loading:false
			}
		},
		mounted() {
			this.showCode()
		},
		methods: {
		   onSubmit(values) {
			   this.loading=true
		      //获取后台传过来的公钥
			    let strPublicKeyExponent,strPublicKeyModulus,pass,loginForm={}
				this.axios.get('/Handler/RSAKey.ashx?cmd=CreateRSAKey').then((res)=>{
					if(res.data.rescode==0){
						strPublicKeyExponent=res.data.strPublicKeyExponent
						strPublicKeyModulus=res.data.strPublicKeyModulus;
						pass = cmdEncrypt(this.password, strPublicKeyExponent, strPublicKeyModulus);
						loginForm={'VerifyCode':this.code,'lname':this.username,'pass':pass};
						
						//登录
						this.$store.dispatch('user/login',loginForm).then((res)=>{
							if(res.rescode=='0'){
								this.$toast.success('登录成功')
								
								this.$back('/')
							}
						})
						.catch(err=>{
							this.loading = false
							this.$toast.fail('登录出错请重试')
						}) 
					}
					else{
						this.$toast.fail('加密失败');
						this.loading=false;
					}
				}).catch(xhr=>{
					this.$toast.fail('登录出错请重试')
					this.loading=false;
				});
				
		    },
			showCode(){
				let url=""
				process.env.NODE_ENV==='development'?url="/Handler":url='';  //区分开发环境加‘/Handler’，生产环境不加
				document.getElementById("codeimg").src=url+'/UserControl/Validata.aspx?ValiType=valiregister&' + Math.random();
			}
		},
	})
</script>

<style scoped>
	.login-title{height:40vh;background-color: #1989fa;text-align: center;display: flex;flex-direction: column;align-items: center;padding-top: 30px;}
	.login-logo{width: 30vw;height: 30vw;}
	.login-logo img{width: 80%;background-color: #fff;padding:10px;border-radius: 50%;}
	.login-title h3{font-size: 24px;color: #FFFFFF;margin-top: 30px;}
	.login-form{padding: 20px;}
	.form-txt{margin: 5px 0;}
	.form-txt i{font-size: 18px !important;}
	.inp{margin:30px 0}
	.inp>.van-cell{background-color: #f7f7f7;border-radius: 5px;}
	.inp.code>.van-cell{width:50%;display: inline-block;}
	.codeimg{height: 40px;padding-left: 10px;}
</style>
