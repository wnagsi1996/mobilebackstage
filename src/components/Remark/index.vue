<template>
	<div class="remark">
		<div class="remark-info" v-if="newRemarkTxt.rem1">
			<p>提交备注</p>
			<span>{{newRemarkTxt.rem1}}</span>
		</div>
		<div class="remark-info" v-if="newRemarkTxt.rem2">
			<p>审核备注</p>
			<span>{{newRemarkTxt.rem2}}</span>
		</div>
	</div>
</template>

<script>
	export default({
		name:'Remark',
		props:{
			remarkTxt:{
				type:Object,
				default:new Object()
			}
		},
		data(){
			return{
				newRemarkTxt:{}
			}
		},
		created() {
			this.newRemarkTxt=this.remarkTxt;
		},
		watch:{
			remarkTxt(newVal,oldVal){
				this.newRemarkTxt=newVal;
			}
		}
	})
</script>

<style scoped>
	.remark{padding:10px;}
	.remark-info{margin:10px 0;}
	.remark-info p{font-weight: bold;}
</style>
