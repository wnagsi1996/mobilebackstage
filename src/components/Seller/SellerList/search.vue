<template>
	<div>
		<div class="popup-title">
			搜索
		</div>
		<van-form>
			<div class="search-info">
				<van-cell-group>
					<van-field v-model.trim="fromSeller.name" label="商家名称" placeholder="商家名称" />
				</van-cell-group>
				<van-cell-group>
					<van-field v-model.trim="fromSeller.contact" label="商家联系方式" placeholder="商家联系方式" />
				</van-cell-group>
			</div>
			<div class="search-btn">
				<van-button type="info" block round @click="searchConfirm">搜索</van-button>
			</div>
		</van-form>
	</div>
</template>

<script>
	import {Button,Form,Field,CellGroup,} from 'vant'
	export default({
		name:'SellerList-search',
		components:{
			[Button.name]:Button,
			[Form.name]:Form,
			[Field.name]:Field,
			[CellGroup.name]:CellGroup
		},
		props:{
			fromSeller:{
				type:Object,
				default:new Object()
			}
		},
		data(){
			return{
			}
		},
		methods:{
			//搜索提交
			searchConfirm(){
				this.$emit('update:fromSeller', this.fromSeller);
				this.$emit('loadproductdata',1)
			}
		}
	})
</script>

<style>
</style>
