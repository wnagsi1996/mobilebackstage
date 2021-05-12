<template>
	<div>
		<div class="popup-title">
			修改免评/留评
		</div>
		<van-form @submit="submit">
			<van-cell-group>
				<van-field type="digit" v-model="product.lpnum" label="留评单数量" :placeholder="txtlpnum"
				 :rules="[{required: true, message: '请输入留评单数量'}]"/>
			</van-cell-group>
			<van-cell-group>
				<van-field type="digit" v-model="product.mpnum" label="免评单数量" :placeholder="txtmpnum"
				 :rules="[{required: true, message: '请输入免评单数量'}]"/>
			</van-cell-group>
			<div class="search-btn">
				<van-button type="info" block round native-type="submit" :loading="btnLoading">提交</van-button>
			</div>
		</van-form>
	</div>
</template>

<script>
	import {Button,Form,Field,CellGroup} from 'vant'
	export default({
		name:'Comments',
		components:{
			[Button.name]:Button,
			[Form.name]:Form,
			[Field.name]:Field,
			[CellGroup.name]:CellGroup
		},
		props:{
			orderno:{
				type:String,
				default:''
			}
		},
		data(){
			return{
				product:{
					lpnum:'',
					mpnum:''
				},
				txtlpnum:'',
				txtmpnum:'',
				neworderno:'',
				btnLoading:false
			}
		},
		mounted() {
			this.neworderno=this.orderno;
			this.getCPOrderCanBackNum();
		},
		methods:{
			getCPOrderCanBackNum(){
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=getCPOrderCanBackNum&orderno="+this.neworderno).then(res=>{
					 //console.log(res);
					if(res.data!=''){
						this.txtlpnum="留评还有" + res.data.lpnum + "单";
						this.txtmpnum="留评还有" + res.data.mpnum + "单";
					}
				}).catch(xhr=>{
					console.log(xhr);
				})
			},
			submit(){
				this.btnLoading=true;
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=comitUpdateCPOrderMpLPNum",{
					params:{
						"orderno": this.neworderno,                         
						"newmpnum":this.product.mpnum,   
						"newlpnum": this.product.lpnum
					}
				}).then(res=>{
					if(res.data.rescode>0){
						this.$toast('修改成功')
						this.$emit("loadproductdata",'1');
						this.product=this.$options.data().product
					}else{
						this.$toast('修改失败')
					}
					this.btnLoading=false;
				}).catch(xhr=>{
					console.log(xhr);
				})
			}
		},
		watch:{
			orderno(newVal,oldVal){
				this.neworderno=newVal;
				this.getCPOrderCanBackNum();
			}
		}
	})
</script>

<style>
</style>
