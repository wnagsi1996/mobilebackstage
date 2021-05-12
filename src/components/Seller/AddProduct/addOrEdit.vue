<template>
	<div>
		<div class="popup-title">
			新建订单
		</div>
		<van-form @submit="submitOrder">
			<van-cell-group>
				<van-field v-model.trim="order.title" label="商品标题" placeholder="商品标题" 
				:rules="[{required: true, message: '商品标题不能为空'}]" />
			</van-cell-group>
			<van-cell-group>
				<van-field v-model.trim="order.stornName" label="店铺名称" placeholder="店铺名称" 
				:rules="[{required: true, message: '店铺名称不能为空'}]" />
			</van-cell-group>
			<van-cell-group>
				<van-field v-model.trim="order.brand" label="品牌" placeholder="品牌" 
				:rules="[{required: true, message: '品牌不能为空'}]" />
			</van-cell-group>
			<van-cell-group>
				<van-field v-model.trim="order.asin" label="ASIN" placeholder="ASIN" 
				:rules="[{required: true, message: 'ASIN不能为空'}]" />
			</van-cell-group>
			<van-cell-group>
				<van-field v-model.trim="order.url" label="产品URL链接" placeholder="产品URL链接" 
				:rules="[{required: true, message: '产品URL链接不能为空'}]" />
			</van-cell-group>
			<van-cell-group>
				<van-field v-model.trim="order.imgUrl" label="产品图片链接" placeholder="产品图片链接" 
				:rules="[{required: true, message: '产品图片链接不能为空'}]" />
			</van-cell-group>
			<van-cell-group>
				<van-field v-model.trim="order.keyword" label="关键词" placeholder="关键词" 
				:rules="[{required: true, message: '关键词不能为空'}]" />
			</van-cell-group>
			<van-cell-group>
				<van-field type="digit" v-model.trim="order.keywordPage" label="页码" placeholder="关键词大概在第几页" 
				:rules="[{required: true, message: '关键词大概在第几页不能为空'}]" />
			</van-cell-group>
			<van-cell-group>
				<van-field v-model.trim="order.code" label="折扣码" placeholder="折扣码"  />
			</van-cell-group>
			<van-cell-group>
				<van-field type="number" v-model="order.price" label="客单价" placeholder="客单价(单位:美金)" 
				:rules="[{required: true, message: '客单价不能为空'}]" />
			</van-cell-group>
			<van-cell-group>
				<van-field type="digit" v-model="order.lpnum" label="留评单数量" placeholder="留评单数量" 
				:rules="[{required: true, message: '留评单数量不能为空'}]" @blur="total()" />
			</van-cell-group>
			<van-cell-group>
				<van-field type="digit" v-model="order.mpnum" label="免评单数量" placeholder="免评单数量" 
				:rules="[{required: true, message: '免评单数量不能为空'}]" @blur="total()" />
			</van-cell-group>
			<van-cell-group>
				<van-field type="number" v-model.trim="order.pp" label="PP费" placeholder="客单费加PP费（单位：美金)" 
				:rules="[{required: true, message: 'PP费不能为空'}]" @blur="total()" />
			</van-cell-group>
			<van-cell-group>
				<van-field type="number" v-model.trim="order.commission" label="佣金" placeholder="佣金(单位：人民币)" 
				:rules="[{required: true, message: '佣金不能为空'}]" @blur="total()" />
			</van-cell-group>
			<van-cell-group>
				<van-field type="number" v-model.trim="order.ytotalPrice" label="应收款" placeholder="应收款总金额(单位：人民币)" 
				:rules="[{required: true, message: '应收款不能为空'}]" />
			</van-cell-group>
			<template v-if="newDataObj.state==0">
				<van-cell-group>
					<van-field type="number" v-model.trim="order.stotalPrice" label="实收款" placeholder="实收款总金额(单位：人民币)" 
					:rules="[{required: true, message: '实收款不能为空'}]" />
				</van-cell-group>
				<van-cell-group>
					<van-field readonly clickable right-icon="arrow-down" name="picker"
					:value="order.channel.text" label="支付选择" placeholder="支付选择"
					:rules="[{required: true, message: '请选择支付选择'}]" @click="PopupShowPicker=true"/>
				</van-cell-group>
			</template>
			<van-cell-group>
				<van-field v-model.trim="order.reviewUrl" label="点赞" placeholder="点赞（评论URL)" />
			</van-cell-group>
			<van-cell-group>
				<van-field type="textarea" rows="1" autosize v-model.trim="order.xdReamrk" label="下单要求" placeholder="下单要求" />
			</van-cell-group>
			<van-cell-group>
				<van-field type="textarea" rows="1" autosize v-model.trim="order.remark" label="备注" placeholder="备注,自己看" />
			</van-cell-group>
			<van-cell-group v-if="newDataObj.state==0">
				<van-field type="textarea" rows="1" autosize v-model.trim="order.cwRemark" label="财务备注" placeholder="给财务审核看" />
			</van-cell-group>
			<div class="search-btn">
				<van-button type="info" block round native-type="submit" :loading="btnLoading">提交</van-button>
			</div>
		</van-form>
		
		<van-popup v-model="PopupShowPicker" round position="bottom">
			<van-picker
			    show-toolbar
			    :columns="columns"
				:loading="pickLoading"
			    @confirm="onConfirm"
			    @cancel="PopupShowPicker = false"
			  />
		</van-popup>
	</div>
</template>

<script>
	import {Button,Popup,Form,Field,CellGroup,Picker} from 'vant'
	import {aisleSub} from '@/utils/searchCondition.js'
	export default({
		name:'ClientOrder-addOrder',
		components:{
			[Button.name]:Button,
			[Popup.name]:Popup,
			[Form.name]:Form,
			[Field.name]:Field,
			[CellGroup.name]:CellGroup,
			[Picker.name]:Picker
		},
		props:{
			orderno:{
				type:String,
				default:''
			},
			dataObj:{
				type:Object,
				default:new Object
			}
		},
		data(){
			return{
				order:{
					title:'',
					stornName:'',
					brand:'',
					asin:'',
					url:'',
					imgUrl:'',
					keyword:'',
					keywordPage:'',
					code:'',
					price:'',
					lpnum:'',
					mpnum:'',
					pp:'',
					commission:'',
					ytotalPrice:'',
					stotalPrice:'',
					channel:{
						text:'',
						value:''
					},
					reviewUrl:'',
					xdReamrk:'',
					remark:'',
					cwRemark:''
				},
				btnLoading:false,
				sellerdata:[],
				columns:aisleSub,
				PopupShowPicker:false,
				pickLoading:false,
				type:0,
				neworderno:'',
				newDataObj:{},
			}
		},
		created() {
			this.newDataObj=this.dataObj;
			this.neworderno=this.orderno;
			if(this.neworderno!=''){
				this.getProductInfo()
			}
		},
		methods:{
			total(){
				if(!isNaN(this.order.mpnum)!='' && !isNaN(this.order.lpnum)!='' && this.order.pp!='' && this.order.commission!=''){
					if(this.newDataObj.rate){
						let totalPrice=(eval(this.order.mpnum)+eval(this.order.lpnum))*eval(this.order.pp)*eval(this.newDataObj.rate)+eval(this.order.commission);
						this.order.ytotalPrice=totalPrice.toFixed(2);
					}
					
				}
			},
			//获取产品信息
			getProductInfo(){
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=getCPOrderInfo&orderno="+this.neworderno).then(res=>{
					//console.log(res);
					if(res.data!=''){
						this.order.title=res.data.ProductTitle;
						this.order.stornName=res.data.StoreName;
						this.order.brand=res.data.Brand;
						this.order.asin=res.data.Asin;
						this.order.url=res.data.ProductUrl;
						this.order.imgUrl=res.data.ProductImgUrl;
						this.order.keyword=res.data.KeyWord;
						this.order.keywordPage=eval(res.data.KeyWordPage);
						this.order.code=res.data.CouponCode;
						this.order.price=res.data.productdj;
						this.order.pp=res.data.ProductPPMoney;
						this.order.lpnum=res.data.lpnum;
						this.order.mpnum=res.data.mpnum;
						this.order.commission=res.data.cpyj;
						this.order.ytotalPrice=res.data.sktotalmoney;
						this.order.stotalPrice=res.data.realsktotalmoney;
						this.order.reviewUrl=res.data.HelpFulUrl;
						this.order.xdReamrk=res.data.xdyq;
						this.order.remark=res.data.remark;
					}else{
						this.order=this.$options.data().order
					}
				}).catch(xhr=>{
					console.log(xhr);
				})
			},
			//订单提交
			submitOrder(){
				if(this.order.KeyWord!=''){
				  if(this.order.keyword.includes("\“")||this.order.keyword.includes("\"")){
					  this.$toast('关键词不能用双引号')
					  return false
				  }					  
				}
				this.btnLoading=true;
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=addProduct",{
					 params:{
						"orderno":this.dataObj.orderno, //总的订单号
						"cporderno":this.neworderno, //编辑的测评订单号
						"rate":this.newDataObj.rate,
						"state":this.newDataObj.state,
						"realtotalmoney":this.order.stotalPrice,
						"sktype":this.order.channel.value,
						"cwremark":this.order.cwRemark,
						"KeyWord":this.order.keyword,
						"KeyWordPage":this.order.keywordPage?this.order.keywordPage:'',
						"CouponCode":this.order.code,
						"HelpFulUrl":this.order.reviewUrl,
						"producttype":0,
						"lpnum":eval(this.order.lpnum),
						"mpnum":eval(this.order.mpnum),
						"cpyj":eval(this.order.commission),
						"remark":this.order.remark,
						"xdyq":this.order.xdReamrk,
						"productdj":eval(this.order.price),
						"ProductPPMoney":eval(this.order.pp),
						"sktotalmoney":eval(this.order.ytotalPrice),
						"Asin":this.order.asin,
						"ProductTitle":this.order.title,
						"StoreName":this.order.stornName,
						"Brand":this.order.brand,
						"ProductUrl":this.order.url,
						"ProductImgUrl":this.order.imgUrl
					 }
				}).then(res=>{
					console.log(res);
					let txt=''
					if(this.newOrderNo==''){
						txt='创建'
					}else{
						txt='编辑'
					}
					if(res.data.rescode>0){
						this.$toast(`${txt}成功`)
						this.order=this.$options.data().order
						this.$emit("loadproductdata",'1');
					}else{
						this.$toast(res.data.resdesc)
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
			dataObj(newVal,oldVal){
				this.newDataObj=newVal;
				
			},
			orderno(newVal,oldVal){
				this.neworderno=newVal;
				if(this.neworderno!=''){
					this.getProductInfo()
				}else{
					this.order=this.$options.data().order
				}
			}
		}
		
	})
</script>

<style>
</style>
