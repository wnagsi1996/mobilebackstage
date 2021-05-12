<template>
	<div>
		<div class="popup-title">
			放单
		</div>
		<van-form @submit="submitOrder">
			<van-cell-group>
				<van-field v-model.trim="order.keyword" label="关键词" placeholder="关键词" 
				:rules="[{required: true, message: '关键词不能为空'}]" />
			</van-cell-group>
			<van-cell-group>
				<van-field type="digit" v-model="order.keywordPage" label="页码" placeholder="关键词大概在第几页" 
				:rules="[{required: true, message: '关键词大概在第几页不能为空'}]" />
			</van-cell-group>
			<van-cell-group>
				<van-field v-model.trim="order.imgurl" label="产品主图" placeholder="产品主图"  />
			</van-cell-group>
			<van-cell-group>
				<van-field v-model.trim="order.code" label="折扣码" placeholder="折扣码"  />
			</van-cell-group>
			<van-cell-group>
				<van-field type="number" v-model.trim="order.price" label="客单价" placeholder="客单价(单位:美金)" 
				:rules="[{required: true, message: '客单价不能为空'}]" />
			</van-cell-group>
			<van-cell-group>
				<van-field v-model.trim="order.qa" label="QA提问" placeholder="QA提问" />
			</van-cell-group>
			<van-cell-group>
				<van-field v-model.trim="order.feedback" label="Feedback" placeholder="Feedback" />
			</van-cell-group>
			<van-cell-group>
				<van-field v-model.trim="order.reviewUrl" label="点赞" placeholder="点赞（评论URL)" />
			</van-cell-group>
			<van-cell-group>
				<van-field type="textarea" rows="1" autosize v-model.trim="order.xdReamrk" label="下单要求" placeholder="下单要求" />
			</van-cell-group>
			<van-cell-group>
				<van-field type="textarea" rows="1" autosize v-model.trim="order.remark" label="备注" placeholder="备注,自己看" />
			</van-cell-group>
			<van-cell-group>
				<van-field name="radio" label="分类">
				  <template #input>
				    <van-radio-group v-model="order.status" direction="horizontal" 
					 :rules="[{required: true, message: '选择分类'}]" @change="hankSwitch">
				      <van-radio name="0">暂存</van-radio>
				      <van-radio name="1">放单</van-radio>
				    </van-radio-group>
				  </template>
				</van-field>
			</van-cell-group>
			<div class="search-btn">
				<van-button class="search-btn-block" type="info" round native-type="submit" :loading="btnLoading">提交</van-button>
			</div>
		</van-form>
	</div>
</template>

<script>
	import {Button,Form,Field,CellGroup,RadioGroup, Radio} from 'vant'
	import {aisleSub} from '@/utils/searchCondition.js'
	export default({
		name:'appendProduct',
		components:{
			[Button.name]:Button,
			[Form.name]:Form,
			[Field.name]:Field,
			[CellGroup.name]:CellGroup,
			[RadioGroup.name]:RadioGroup,
			[Radio.name]:Radio
		},
		props:{
			orderno:{
				type:String,
				default:''
			}
		},
		data(){
			return{
				order:{
					keyword:'',
					keywordPage:'',
					imgurl:'',
					code:'',
					price:'',
					qa:'',
					feedback:'',
					reviewUrl:'',
					xdReamrk:'',
					remark:'',
					status:'1'
				},
				btnLoading:false,
				neworderno:'',
			}
		},
		created() {
			this.neworderno=this.orderno;
			this.getOrderInfo();
		},
		methods:{
			//获取订单信息
			getOrderInfo(){
				this.loading=true;
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=getCPOrderDetailInfo&orderno="+this.neworderno).then(res=>{
					//console.log(res);
					if(res.data!=''){
						this.order.imgurl=res.data.ProductImgUrl;
						this.order.keyword=res.data.KeyWord;
						this.order.keywordPage=res.data.KeyWordPage;
						this.order.code=res.data.CouponCode;
						this.order.price=res.data.productdj;
						this.order.qa=res.data.QA;
						this.order.feedback=res.data.FB;
						this.order.reviewUrl=res.data.HelpFulUrl;
						this.order.xdReamrk=res.data.xdyq;
						this.order.remark=res.data.remark;
						//this.loading=false;
					}else{
						this.order=this.$options.data().order;
					}
				}).catch(xhr=>{
					console.log(xhr);
				})
			},
			//切换分类
			hankSwitch(val){
				this.order.status=val
			},
			//订单提交
			submitOrder(){
				if(this.order.KeyWord!=''){
				  if(this.order.keyword.includes("\“")||this.order.keyword.includes("\"")){
					  this.$toast('关键词不能用双引号')
					  return false
				  }					  
				}
				if(this.order.status==''){
					this.$toast('请选择放单还是暂存！')
					return false
				}
				let qa,fb
				if(this.order.qa==''){
					qa=0
				}else{
					qa=1 
				}
				if(this.order.feedback==''){
					fb=0
				}else{
					fb=1 
				}
				this.btnLoading=true;
				this.axios.post("/Handler/CPManageSystem.ashx",this.qs.stringify({
					//params:{
						"cmd":'editCPOrderDetail',
						"orderno": this.neworderno,                         
						"KeyWord": this.order.keyword,                         
						"KeyWordPage":this.order.keywordPage,   
						"CouponCode": this.order.code,
						"HelpFulUrl": this.order.reviewUrl,
						"remark": this.order.remark,
						"xdyq": this.order.xdReamrk,
						"ProductImgUrl": this.order.imgurl,
						"productdj": eval(this.order.price),
						"ifQA": qa,
						"ifFB": fb,
						"QA": this.order.qa,
						"FB": this.order.feedback,
						"fd":this.order.status
				//	}
				})).then(res=>{
					this.$toast(res.data.resdesc);
					if(res.data.rescode>0){
						this.order=this.$options.data().order
						this.$emit("loadproductdata",'1');
					}
					this.btnLoading=false;
					
				}).catch(xhr=>{
					this.btnLoading=false;
				})
			},
			//确认选择器
			onConfirm(val){
				this.order.channel.text=val.text;
				this.order.channel.value=val.value;
				this.PopupShowPicker=false;
			}
		},
		watch:{
			orderno(newVal,oldVal){
				this.neworderno=newVal;
				this.order=this.$options.data().order;
				this.getOrderInfo();
			}
		}
		
	})
</script>

<style>
</style>
