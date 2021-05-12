<template>
	<div class="today-desc">
		<div class="today-desc-title" v-for="(item,index) in neworderdata" :key="index">
		  <h5>{{item.title}}</h5>
		  <p>{{item.lpnum+item.mpnum}}</p>
		  <div class="today-desc-info">
			  <span>免：{{item.mpnum}}</span>
			  <span>留：{{item.lpnum}}</span>
		  </div>
		</div>
	</div>
	  
</template>

<script>
	export default({
		name:'OrderModule',
		props:{
			orderdata:{
				type:Array,
				default:new Array()
			}
		},
		data(){
			return{
				neworderdata:[]
			}
		},
		mounted() {
			this.neworderdata=this.orderdata;
		},
		methods:{
			
		},
		watch:{
			orderdata(newVal,oldVal){
				this.neworderdata=newVal;
			}
		}
	})
</script>

<style scoped>
	.today-desc{display: flex;flex-wrap: wrap;}
	.today-desc-title{width:25%;text-align: center;margin: 15px 0;}
	.today-desc-title h5{font-weight: normal;color: #666666;font-size:14px;}
	.today-desc-title p{color:#1989FA;font-size: 24px;margin:10px 0 0}
	.today-desc-info span{font-size:12px;color:#ccc;padding:0 5px;display: block;}
</style>
