<template>
	<div>
		<div class="popup-title">
			{{title}}
		</div>
		<van-form validate-first @submit="addConfirm">
			<van-cell-group v-if="reviewOrder.type=='1'">
				<van-field type="number" v-model.trim="reviewOrder.money" label="购买金额" placeholder="购买金额"
				:rules="[{required: true, message: '请输入购买金额'}]" />
			</van-cell-group>
			<van-cell-group>
				<van-field v-model.trim="reviewOrder.remark" label="备注" placeholder="备注" />
			</van-cell-group>
			<div class="search-btn">
				<van-button type="info" :loading="btnLoading" block round native-type="submit">提交</van-button>
			</div>
		</van-form>
	</div>
</template>

<script>
	import {Button,Form,Field,CellGroup} from 'vant'
	export default({
		name:'Review',
		components:{
			[Button.name]:Button,
			[Form.name]:Form,
			[Field.name]:Field,
			[CellGroup.name]:CellGroup
		},
		props:{
			reviewObj:{
				type:Object,
				default:new Object()
			}
		},
		data(){
			return{
				reviewOrder:{
					money:'',
					remark:'',
					orderno:'',
					type:''
				},
				title:'',
				btnLoading:false //按钮加载
			}
		},
		created() {
			this.reviewOrder=this.reviewObj;
			this.count();
		},
		methods:{
			count(){
				if(Object.keys(this.reviewOrder).length>0){
					if(this.reviewOrder.type=='0'){
						this.title='驳回'
					}else{
						this.title='审核通过'
					}
				}
			},
			//提交
			addConfirm(){
				this.btnLoading=true;
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=doSHXDInfo",{
					params:{
						"orderno": this.reviewOrder.orderno,                         
						"shremark":this.reviewOrder.remark?this.reviewOrder.remark:'',   
						"dostate": this.reviewOrder.type,
						"realproductdj": this.reviewOrder.money
					}
				}).then(res=>{//console.log(res)
					if(res.data.rescode>0){
						this.$toast('提交成功');
						this.reviewOrder=this.$options.data().reviewOrder;
						this.$emit("loadproductdata","1");
					}else{
						this.$toast('提交失败');
					}
					this.btnLoading=false;
				}).catch(xhr=>{
					console.log(xhr);
				})
			}
		},
		watch:{
			reviewObj(newVal,oldVal){
				this.reviewOrder=newVal;
				this.count();
			}
		}
	})
</script>

<style>
</style>
