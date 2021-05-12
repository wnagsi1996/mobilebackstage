<template>
	<van-pull-refresh v-model="refreshing" @refresh="onRefresh">
	  <van-list v-model="loading" :finished="finished" finished-text="没有更多了" offset="500" @load="onLoad">
	    <div class="love-item">
			<slot></slot>
		</div>
	  </van-list>
	</van-pull-refresh>
</template>

<script>
	import {List,PullRefresh} from 'vant'
	export default({
		name:'ProductList',
		components:{
			[List.name]:List,
			[PullRefresh.name]:PullRefresh
		},
		props:{
			productTotal:{
				type:Boolean,
				default:false
			},
			index:{
				type:Number,
				default:0
			}
		},
		data(){
			return{
				finished:true,
				loading:false,
				refreshing:false
			}
		},
		mounted(){
			this.onRefresh();
		},
		methods:{
			onRefresh(){
				this.loading=true
				this.finished=false
				this.$emit("loadproductdata",'1')
			},
			onLoad(){
				if(this.productTotal){
					this.finished=true
				}else{
					this.loading=true,
					this.$emit("loadproductdata")
				}
			}
		},
		watch:{
			index(newVal,oldVal){//console.log(newVal)
				this.finished=false
				this.loading=false
				this.refreshing=false
			},
			productTotal(newVal,oldVal){
				if(newVal){
					this.finished=true
				}
			}
		}
	})
</script>

<style scoped>
	.love-item{width:100%;display: flex;flex-wrap:wrap;margin:10px auto;justify-content: space-between;}
</style>
