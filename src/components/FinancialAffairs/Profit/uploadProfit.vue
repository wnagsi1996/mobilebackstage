<template>
	<div>
		<div class="popup-title">提取利润</div>
		<van-form @submit="onSubmit">
			<van-cell-group>
				<van-field type="number" v-model.trim="fromattr.money" label="提取金额" placeholder="提取金额" />
			</van-cell-group>
			<van-cell-group>
				<van-field type="textarea" autosize rows="1" v-model.trim="fromattr.remark" label="备注" placeholder="备注" />
			</van-cell-group>
			 <div class="search-btn">
			    <van-button round block type="info" native-type="submit" :loading="btnLoading">提交</van-button>
			  </div>
		</van-form>
	</div>
</template>

<script>
	import {Button,Form,Field,CellGroup} from 'vant'
	export default({
		name:'Audit-check',
		components:{
			[Button.name]:Button,
			[Form.name]:Form,
			[Field.name]:Field,
			[CellGroup.name]:CellGroup
		},
		data(){
			return{
				fromattr:{
					money:'',
					remark:''
				},
				btnLoading:false
			}
		},
		created() {
		},
		methods:{
			//提交
			onSubmit(){
				if(this.fromattr.money<=0){
					this.$toast('提取金额应大于0')
				}else{
					this.btnLoading=true
					this.axios.post('/Handler/CPManageSystem.ashx?cmd=comitProfitTQ',this.qs.stringify({
						//params:{
							tqmoney:this.fromattr.money,
							remark:this.fromattr.remark
						//}
					})).then(res=>{//console.log(res)
						if(res.data.rescode==1){
							this.$toast('提交成功')
							this.fromattr=this.$options.data().fromattr
							//成功
							this.$emit('getTotalProfit')
						}else{
							this.$toast('提交失败')
						}
						this.btnLoading=false
					}).catch(xhr=>{
						this.btnLoading=false
						this.$toast('提交失败')
					})
				}
				
			}
		}
	})
</script>

<style>
</style>
