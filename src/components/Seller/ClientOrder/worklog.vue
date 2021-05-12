<template>
	<div>
		<div class="popup-title">
			记事本
		</div>
		<van-field type="textarea" rows="5" v-model.trim="textarea" autosize autofocus style="background-color: #f7f7f7;"/>
		<div class="search-btn">
			<van-button type="info" block round native-type="submit" :loading="btnLoading"  @click="save">提交</van-button>
		</div>
		
	</div>
</template>

<script>
	import {Button,Field} from 'vant'
	export default({
		name:'Worklog',
		components:{
			[Button.name]:Button,
			[Field.name]:Field
		},
		props:{
			orderno:{
				type:String,
				default:''
			}
		},
		data(){
			return{
				textarea:'',
				btnLoading:false,
				neworderno:''
			}
		},
		created() {
			this.neworderno=this.orderno;
			this.getWorkLog();
		},
		methods:{
			getWorkLog(){
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=getCPTopWorkLog&orderno="+this.neworderno).then(res=>{
					this.textarea=res.data
				}).catch(xhr=>{
					
				})
			},
			save(){
				this.btnLoading=true;
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=addCPTopWorkLog&orderno="+this.neworderno+"&remark="+this.textarea).then(res=>{
					this.$toast(res.data.resdesc)
					if(res.data.rescode>0){
						this.textarea='';
						this.$emit('loadproductdata');
					}
					this.btnLoading=false;
					
				}).catch(xhr=>{
					this.$toast(xhr.data.resdesc)
				})
			}
		},
		watch:{
			orderno(newVal,oldVal){
				this.neworderno=newVal
				this.getWorkLog()
			}
		}
	})
</script>

<style>
</style>
