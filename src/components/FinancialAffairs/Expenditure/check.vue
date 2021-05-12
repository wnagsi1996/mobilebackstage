<template>
	<div>
		<div class="popup-title">{{title}}</div>
		<van-form @submit="onSubmit">
			<van-cell-group v-if="fromattr.state!='2'">
				<van-field type="number" v-model.trim="fromattr.moneyTxt" label="支出人民币" placeholder="支出人民币" />
			</van-cell-group>
			<van-cell-group>
				<van-field type="textarea" autosize rows="1" v-model="fromattr.remark" label="备注" placeholder="备注" />
			</van-cell-group>
			<van-cell-group v-if="fromattr.state!='2'">
				<UploadImg title="图片" @getimgsrc='getimgsrc' :file="file" />
			</van-cell-group>
			 <div class="search-btn">
			    <van-button round block type="info" native-type="submit" :loading="btnLoading">提交</van-button>
			  </div>
		</van-form>
	</div>
</template>

<script>
	import {Button,Form,Field,CellGroup} from 'vant'
	import UploadImg from '@/components/UploadImg'
	export default({
		name:'Expenditure-check',
		components:{
			[Button.name]:Button,
			[Form.name]:Form,
			[Field.name]:Field,
			[CellGroup.name]:CellGroup,
			UploadImg
		},
		props:{
			checkObj:{
				type:Object,
				default:new Object()
			}
		},
		data(){
			return{
				fromattr:{
					moneyTxt:'',
					remark:'',
					rid:'',
					state:'',
					imgurl:''
				},
				title:'',
				newCheckObj:{},
				btnLoading:false,
				file:[]
			}
		},
		created() {
			this.newCheckObj=this.checkObj
			this.handle()
		},
		methods:{
			//处理数据
			handle(){
				if(this.newCheckObj.state=='2'){
					this.title='您确定要驳回该订单吗?'
				}else{
					this.title='您确认该订单已返款?'
				}
				this.fromattr.rid=this.newCheckObj.rid;
				this.fromattr.state=this.newCheckObj.state;
				this.fromattr.moneyTxt=this.newCheckObj.price;
			},
			//提交
			onSubmit(){
				if(this.fromattr.state=='2'){
					this.fromattr.moneyTxt=0
				}
				this.btnLoading=true
				this.axios.post("/Handler/CPManageSystem.ashx?cmd=doCWDetail",this.qs.stringify({
					//params:{
						"rids":this.fromattr.rid,
						"shremark":this.fromattr.remark,
						"cwstate":this.fromattr.state,
						"_img64":this.fromattr.imgurl,
						"realrmbmoney":this.fromattr.moneyTxt
						
					//}
				})).then(res=>{console.log(res)
					this.$toast(res.data.resdesc)
					if(res.data.rescode==1){
						//成功
						this.$emit('loadproductdata','1')
					}
					this.btnLoading=false
				}).catch(xhr=>{
					this.btnLoading=false
					this.$toast('添加失败')
				})
			},
			//获取上传组件回传的信息
			getimgsrc(info){
				//console.log(info)
				this.fromattr.imgurl=info;
			}
		},
		watch:{
			checkObj(newVal,oldVal){
				this.newCheckObj=newVal;
				this.handle();
			}
		}
	})
</script>

<style>
</style>
