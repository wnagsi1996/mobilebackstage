<template>
	<div>
		<div class="popup-title">{{title}}</div>
		<van-form @submit="onSubmit">
			<van-cell-group v-if="newCheckObj.currency=='1' && newCheckObj.state!='2'">
				<van-field type="number" v-model.trim="fromattr.moneyTxt" label="收入人民币" placeholder="收入人民币" />
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
					state:''
				},
				title:'',
				newCheckObj:'',
				btnLoading:false
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
					this.title='您确认该笔款项已到账?'
				}
				if(this.newCheckObj.currency!='1'){
					this.fromattr.moneyTxt=0
				}
				this.fromattr.rid=this.newCheckObj.rid;
				this.fromattr.state=this.newCheckObj.state;
			},
			//提交
			onSubmit(){
				this.btnLoading=true
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=doCWDetail",{
					params:{
						"rids":this.fromattr.rid,
						"shremark":this.fromattr.remark,
						"cwstate":this.fromattr.state,
						"realrmbmoney":this.fromattr.moneyTxt,
						"_img64":''
					}
				}).then(res=>{
					this.$toast(res.data.resdesc)
					if(res.data.rescode==1){
						this.fromattr=this.$options.data().fromattr
						//成功
						this.$emit('loadproductdata','1')
					}
					this.btnLoading=false
				}).catch(xhr=>{
					this.btnLoading=false
					this.$toast('提交失败')
				})
			}
		},
		watch:{
			checkObj(newVal,oldVal){
				this.newCheckObj=newVal
				this.handle()
			}
		}
	})
</script>

<style>
</style>
