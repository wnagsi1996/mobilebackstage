<template>
	<div>
		<div class="popup-title">中介佣金批量返款</div>
		<van-form v-if="ifdata">
			<van-cell-group>
				<van-field readonly clickable right-icon="arrow-down" name="picker" 
				:value="rebate.agent.text" label="中介" placeholder="中介" @click="showPickerList(3)"/>
			</van-cell-group>
			<van-cell-group>
				<van-field readonly clickable right-icon="arrow-down" name="datetimePicker" 
				:value="rebate.date1" label="开始时间" placeholder="开始时间" @click="showdate(5)"/>
			</van-cell-group>
			<van-cell-group>
				<van-field readonly clickable right-icon="arrow-down" name="datetimePicker" 
				:value="rebate.date2" label="结束时间" placeholder="结束时间" @click="showdate(6)"/>
			</van-cell-group>
			<div class="search-btn">
				<van-button type="info" block round @click="searchAgent" :loading="btnLoading">确认</van-button>
			</div>
		</van-form>
		<van-form v-else>
			<div class="batch-info">
				<h4>中介“{{rebate.agent.text}}”在{{rebate.date1}}至{{rebate.date2}}的数据如下</h4>
			</div>
			<van-cell-group>
				<van-field v-model.trim="agent.ordernum" label="下单单数" placeholder="下单单数" readonly />
			</van-cell-group>
			<van-cell-group>
				<van-field type="number" v-model.trim="agent.orderyj" label="下单佣金" placeholder="下单佣金" />
			</van-cell-group>
			<van-cell-group>
				<van-field v-model.trim="agent.reviewnum" label="留评单数" placeholder="留评单数" readonly />
			</van-cell-group>
			<van-cell-group>
				<van-field type="number" v-model.trim="agent.reviewyj" label="留评佣金" placeholder="留评佣金" />
			</van-cell-group>
			<van-cell-group>
				<van-field v-model.trim="agent.totalyj" label="总的佣金" placeholder="总的佣金" readonly />
			</van-cell-group>
			<van-cell-group>
				<van-field v-model.trim="agent.remark" label="备注" placeholder="备注" readonly />
			</van-cell-group>
			<div class="search-btn">
				<van-button type="info" block round @click="submithReate" :loading="btnLoading">提交</van-button>
			</div>
		</van-form>
		
		<van-popup v-model="PopupShowPicker" round position="bottom">
			<van-picker v-if="!isdate"
			    show-toolbar
			    :columns="columns"
				:loading="pickerLoading"
			    @confirm="onConfirm"
			    @cancel="PopupShowPicker = false"
			  />
			  <van-datetime-picker v-else
			    v-model="currentDate"
			    type="date"
			    title="选择年月日"
				@confirm="onConfirm"
				@cancel="PopupShowPicker = false"
			  />
		</van-popup>
	</div>
</template>

<script>
	import {Button,Popup,Form,Field,CellGroup,Picker,DatetimePicker,Dialog} from 'vant'
	import {mapGetters} from 'vuex'
	export default({
		name:'bacth',
		components:{
			[Button.name]:Button,
			[Popup.name]:Popup,
			[Form.name]:Form,
			[Field.name]:Field,
			[CellGroup.name]:CellGroup,
			[Picker.name]:Picker,
			[DatetimePicker.name]:DatetimePicker,
			[Dialog.Component.name]: Dialog.Component
		},
		computed:{
			...mapGetters([
				'buyerAgentList'
			])
		},
		data(){
			return{
				PopupShowPicker:false,  //选择器弹框
				columns:[],  //下拉列表存放数据
				iftype:0  ,//弹出列表选择器  0用户列表  1月份  2类别
				pickerLoading:false,  //下拉列表加载状态
				currentDate: new Date(), //当前时间
				isdate:false  ,//判断弹出的是否是时间别
				rebate:{
					agent:{
						text:'',
						value:''
					},
					date1:'',
					date2:''
				},
				btnLoading:false,
				agent:{
					ordernum:'',  //下单数量
					reviewnum:'',  //留评数量
					orderyj:'',  //单个下单佣金
					reviewyj:'', //单个留评佣金
					totalorderyj:'',  //总的下单佣金
					totalreviewyj:'',  //总的留评佣金
					totalyj:''  ,//总的佣金
					DraftMaxMoney:0  ,//中介最大抵扣佣金
					remark:''
				},
				ifdata:true,
			}
		},
		created() {
			
		},
		methods:{
			//显示搜索得选择器列表
			async showPickerList(i){
				this.isdate=false;
				this.iftype=i;
				this.columns=[];
				this.pickerLoading=true;
				this.PopupShowPicker=true
				if(i==2){
					this.columns=orderType;
				}else{
					if(this.buyerAgentList.length==0){
						await this.$store.dispatch('userList/getBuyerAgentList');
						this.buyerAgentList.unshift({
							text:'全部',
							value:'-1'
						})
					};
					this.columns=this.buyerAgentList;
				}
				this.pickerLoading=false;
			},
			//搜索选择器确认后得值
			onConfirm(val){
				switch(this.iftype){
					case 3:
						this.rebate.agent.text=val.text;
						this.rebate.agent.value=val.value;
						break;
					case 5:
						this.rebate.date1=`${val.getFullYear()}-${val.getMonth() + 1}-${val.getDate()}`;
						break;
					case 6:
						this.rebate.date2=`${val.getFullYear()}-${val.getMonth() + 1}-${val.getDate()}`;
						break;
				}
				this.PopupShowPicker=false
			},
			//显示时间选择
			showdate(i){
				this.PopupShowPicker=true;
				this.isdate=true;
				this.iftype=i
			},
			searchAgent(){
			  if(this.rebate.date1==''&&this.rebate.date2==''){
				  this.$toast('两个时间都不能为空')
			  }else{
				  this.btnLoading=true;
				  this.axios.get("/Handler/CPManageSystem.ashx?cmd=searchBuyerZJYJ",{
					  params:{
						"zjid":this.rebate.agent.value,
						"cxsjs":this.rebate.date1,
						"cxsje":this.rebate.date2
					  }
				  }).then(res=>{
					  this.btnLoading=false;
					  if(res.data.rescode>0){
						  if(res.data.xdnum==0 && res.data.lpnum==0){
							  this.$toast('您查询的数据为空')
						  }else{
							  this.ifdata=false;
							  this.agent.ordernum=res.data.xdnum
							  this.agent.reviewnum=res.data.lpnum
						  }
					  }else{
						  this.$toast(res.data.resdesc)
					  }
					  
				  }).catch(xhr=>{
					  this.$toast('查询失败')
					  this.btnLoading=false;
				  })
			  }
			},
			submithReate(){
			  if(this.agent.orderyj=='' || this.agent.reviewyj==''){
				  this.$toast('返款金额不能为空,没有则填写0')
					  return false;
			  }else{
				  this.btnLoading=true;
				  this.axios.get("/Handler/CPManageSystem.ashx?cmd=getAgentOverDraftMaxMoney&zjid="+this.rebate.agent.value+"&ordermoney="+this.agent.totalyj).then(res=>{
					  if(res.data==0){
						  this.submitdata()
					  }else{
						  this.rebate.DraftMaxMoney=res.data;
						  let zfmoney=this.agent.totalyj - eval(data);
						  let txt="该中介还欠" + res.data + "美金;本次所需支付是" + this.agent.totalyj + "美金,减掉中介所欠还需支付" + zfmoney + "美金";
						 Dialog.confirm({
						   title: '提示',
						   message: txt,
						   beforeClose,
						 });
					  }
				  })
				  
			  }
			},
			beforeClose(action, done){
				if (action === 'confirm') {
				    this.submitdata()
				  } else {
				    done();
					this.btnLoading=false;
				  }
			},
			submitdata(){
				this.axios.get("/Handler/CPManageSystem.ashx",{
					 params:{
						"cmd":"comitBuyerZJYJFK",
						"zjid":this.rebate.agent.value,
						"cxsjs":this.rebate.date1,
						"cxsje":this.rebate.date2,
						"xdyjdj":this.agent.orderyj,
						"lpyjdj":this.agent.reviewyj,
						"remark":this.agent.remark,
						"DraftMaxMoney":this.agent.DraftMaxMoney
					}
				}).then(res=>{
					//\\console.log(res);
					if(res.data.rescode>0){
						this.$toast('提交成功')
						this.$emit('loadproductdata','1');
						this.agent=this.$options.data().agent;
					}else{
						this.$toast('提交失败')
					}
					this.btnLoading=false;
				}).catch(xhr=>{
					this.$toast('提交失败')
					this.btnLoading=false;
				})
			}
		},
		watch:{
			'agent.orderyj'(newVal,oldVal){
				this.agent.totalorderyj=eval(this.agent.ordernum)*eval(newVal);
				this.agent.totalorderyj=this.agent.totalorderyj?this.agent.totalorderyj:0;
				this.agent.totalreviewyj=this.agent.totalreviewyj?this.agent.totalreviewyj:0;
				this.agent.totalyj=eval(this.agent.totalorderyj)+eval(this.agent.totalreviewyj);
			},
			'agent.reviewyj'(newVal,oldVal){
				this.agent.totalreviewyj=eval(this.agent.reviewnum)*eval(newVal);
				this.agent.totalorderyj=this.agent.totalorderyj?this.agent.totalorderyj:0;
				this.agent.totalreviewyj=this.agent.totalreviewyj?this.agent.totalreviewyj:0;
				this.agent.totalyj=eval(this.agent.totalorderyj)+eval(this.agent.totalreviewyj);
			}
		}
	})
</script>

<style>
	.batch-info{padding: 0 15px;}
	.batch-info h4{padding-bottom: 10px;}
</style>
