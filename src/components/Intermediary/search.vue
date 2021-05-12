<template>
	<div>
		<div class="popup-title">搜索</div>
		<div class="search-info">
			<van-cell-group>
				<van-field v-model.trim="fromAccount.name" label="名称" placeholder="名称" />
			</van-cell-group>
			<div class="search-btn">
				<van-button type="info" block round @click="searchConfirm">搜索</van-button>
			</div>
		</div>
	</div>
</template>

<script>
	import {Button,Field,CellGroup} from 'vant'
	export default({
		name:'Intermediary-search',
		components:{
			[Button.name]:Button,
			[Field.name]:Field,
			[CellGroup.name]:CellGroup,
		},
		props:{
			fromAccount:{
				type:Object,
				default:new Object()
			}
		},
		methods:{
			//搜索提交
			searchConfirm(){
				this.$emit('update:fromAccount', this.fromAccount);
				this.$emit('loadproductdata',1)
			}
		}
	})
</script>

<style>
</style>
