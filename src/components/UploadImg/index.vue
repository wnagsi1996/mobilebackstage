<template>
	<div class="uploadImg">
		<div class="uploadImg-txt">{{title}}</div>
		<div class="uploadImg-photo">
			<van-uploader v-model="fileList" :after-read="afterRead" :max-count="1" @delete="delimg" />
		</div>
	</div>
</template>

<script>
	import {Uploader} from 'vant'
	export default({
		name:'uploadImg',
		components:{
			[Uploader.name]:Uploader
		},
		props:{
			title:{
				type:String,
				default:'图片'
			},
			file:{
				type:Array,
				default:new Array()
			}
		},
		data(){
			return{
				fileList:[]
			}
		},
		created() {
			this.fileList=this.file
		},
		methods:{
			afterRead(file){
				this.$emit('getimgsrc',file.content);
			},
			delimg(){
				this.$emit('getimgsrc','');
			}
		},
		watch:{
			file(newVal,oldVal){
				this.fileList=newVal
			}
		}
	})
</script>

<style scoped>
	.uploadImg{display: flex;padding: 10px 16px 0;}
	.uploadImg-txt{width: 6.2em;color: #646566;}
	.uploadImg-photo{flex: 1;}
</style>
