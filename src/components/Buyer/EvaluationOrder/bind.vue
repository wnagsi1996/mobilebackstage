<template>
	<div>
		<div class="popup-title">绑定</div>
		<van-cell-group v-if="bindInfo.id=='0'">
			<van-field v-model.trim="name" label="买家名称" placeholder="买家名称" />
		</van-cell-group>
		<van-cell-group v-else>
			<van-field readonly clickable right-icon="arrow-down" name="picker" 
			 v-model="agent.text" label="中介名称" placeholder="中介名称" @click="showPickerList" />
		</van-cell-group>
		<div class="search-btn">
			<van-button type="info" block round @click="bind" :loading="btnLoading">提交</van-button>
		</div>
		
		<van-popup v-model="PopupShowPicker" round position="bottom">
			<van-picker
			    show-toolbar
			    :columns="columns"
				:loading="pickerLoading"
			    @confirm="onConfirm"
			    @cancel="PopupShowPicker = false"
			  />
		</van-popup>
	</div>
</template>

<script>
	import {CellGroup,Field,Popup,Button,Picker} from 'vant'
	import {mapGetters} from 'vuex'
	export default({
		name:'EvaluationOrder-bind',
		props:{
			bindInfo:{
				type:Object,
				default:new Object()
			}
		},
		components:{
			[CellGroup.name]:CellGroup,
			[Popup.name]:Popup,
			[Button.name]:Button,
			[Picker.name]:Picker,
			[Field.name]:Field
		},
		computed:{
			...mapGetters([
				'buyerAgentList'
			])
		},
		data(){
			return{
				name:'',
				agent:{
					text:'',
					value:'-1'
				},
				columns:[],
				pickerLoading:false,
				PopupShowPicker:false,
				btnLoading:false
			}
		},
		created() {
			
		},
		methods:{
			bind(){
				this.btnLoading=true
				if(this.bindInfo.id=='0'){
					this.axios.get('/Handler/CPManageSystem.ashx?cmd=setCPOrderDetailSDUserName&orderno='+this.bindInfo.orderno+'&sdusername='+this.name).then(res=>{
						this.$toast(res.data.resdesc)
						if(res.data.rescode>0){
							this.$emit('loadproductdata','1');
						}
						
						this.btnLoading=false
					}).catch(xhr=>{
						console.log(xhr);
						this.$toast('绑定失败')
						this.btnLoading=false
					})
				}else{
					this.axios.get("/Handler/CPManageSystem.ashx?cmd=setCPOrderDetailAgent&rids="+this.bindInfo.rid+"&zjid="+this.agent.value).then(res=>{
						this.$toast(res.data.resdesc)
						if(res.data.rescode>0){
							this.$emit('loadproductdata','1');
						}
						this.btnLoading=false;
					}).catch(xhr=>{
						console.log(xhr);
						this.$toast('绑定失败')
						this.btnLoading=false
					})
				}
				
			},
			//显示搜索得选择器列表
			async showPickerList(){
				this.pickerLoading=true;
				this.PopupShowPicker=true
				if(this.buyerAgentList.length==0){
					await this.$store.dispatch('userList/getBuyerAgentList')
				};
				if(this.columns.length==0){
					this.columns=this.buyerAgentList
				}
				
				this.pickerLoading=false;
			},
			onConfirm(val){
				this.agent.text=val.text
				this.agent.value=val.value
				this.PopupShowPicker=false
			}
		},
		watch:{
			bindInfo(newval,oldval){
				this.bindInfo=newval;
				this.name='';
				this.agent.text=''
				this.agent.value='-1'
			}
		}
	})
</script>

<style>
</style>
