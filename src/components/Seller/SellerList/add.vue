<template>
	<div>
		<div class="popup-title">
			{{userrid?'编辑':'创建'}}人员信息
		</div>
		<van-form validate-first @submit="addConfirm" ref="seller">
			<van-cell-group>
				<van-field v-model.trim="seller.username" label="客户名称" placeholder="客户名称"
				:rules="[{required: true, message: '请输入客户名称'}]" />
			</van-cell-group>
			<van-cell-group>
				<van-field v-model.trim="seller.name" label="联系人" placeholder="联系人"
				:rules="[{required: true, message: '请输入联系人'}]" />
			</van-cell-group>
			<van-cell-group>
				<van-field v-model.trim="seller.contact" label="联系方式" placeholder="联系方式"
				:rules="[{required: true, message: '请输入联系方式'}]" />
			</van-cell-group>
			<div class="search-btn">
				<van-button type="info" :loading="btnLoading" block round native-type="submit">{{userrid?'确认':'创建'}}</van-button>
			</div>
		</van-form>
	</div>
</template>

<script>
	import {Button,Form,Field,CellGroup} from 'vant'
	export default({
		name:'SellerList-add',
		components:{
			[Button.name]:Button,
			[Form.name]:Form,
			[Field.name]:Field,
			[CellGroup.name]:CellGroup
		},
		props:{
			rid:{
				type:String,
				default:'0'
			}
		},
		data(){
			return{
				seller:{
					username:'',
					name:'',
					contact:''
				},
				userrid:'',
				btnLoading:false //按钮加载
			}
		},
		created() {
			this.userrid=this.rid;
			this.getUserInfo();
		},
		methods:{
			//获取用户信息
			async getUserInfo(){
				this.seller=this.$options.data().seller;
				if(this.userrid!=""){
					await this.axios.get("/Handler/CPManageSystem.ashx?cmd=getHzsjInfo&rid="+this.userrid).then(res=>{
						//console.log(res);
						this.seller.username=res.data.SJName;
						this.seller.name=res.data.SJLXR;
						this.seller.contact=res.data.SJLXFS;
					}).catch(xhr=>{
						this.$toast('获取用户信息失败!')
					})
				}
			},
			//创建按钮
			async addConfirm(){
				this.btnLoading=true;
				
				//创建或编辑
				await this.axios.get("/Handler/CPManageSystem.ashx?cmd=addOrEditCPHzsj",{
					params:{
						"rid":this.userrid,
						"sjname":this.seller.username,
						"sjlxfs":this.seller.contact,
						"sjlxr":this.seller.name
					}
				}).then(res=>{
					//console.log(res);
					if(res.data.rescode==1){
						this.$toast(res.data.resdesc);
						this.seller=this.$options.data().seller;
						this.$emit('loadproductdata',1);
					}else{
						this.$toast(res.data.resdesc)
					}
					this.btnLoading=false;
				}).catch(xhr=>{
					//console.log(xhr);
					this.$toast('设置出错');
					this.btnLoading=false;
				})
			}
		},
		watch:{
			rid(newVal,oldVal){
				this.userrid=newVal;
				this.getUserInfo();
			}
		}
	})
</script>

<style>
</style>
