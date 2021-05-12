<template>
	<div>
		<div class="popup-title">
			上传留评信息
		</div>
		<van-form validate-first @submit="addConfirm">
			<van-cell-group>
				<van-field v-model.trim="reviewUrl.url" label="留评链接" placeholder="留评链接" />
			</van-cell-group>
			<van-cell-group>
				<van-field readonly clickable right-icon="arrow-down" name="datetimePicker" 
				:value="reviewUrl.date" label="留评时间" placeholder="留评时间" @click="showdate"/>
			</van-cell-group>
			<van-cell-group>
				<UploadImg title="留评截图" @getimgsrc='getimgsrc' :file="file" />
			</van-cell-group>
			<div class="search-btn">
				<van-button type="info" :loading="btnLoading" block round native-type="submit">提交</van-button>
			</div>
		</van-form>
		<van-popup v-model="PopupShowPicker" round position="bottom">
			  <van-datetime-picker
			    v-model="currentDate"
			    type="datetime"
			    title="选择年月日"
				@confirm="onConfirm"
				@cancel="PopupShowPicker = false"
			  />
		</van-popup>
	</div>
</template>

<script>
	import {Button,Form,Field,CellGroup,Picker,DatetimePicker,Popup} from 'vant'
	import UploadImg from '@/components/UploadImg'
	export default({
		name:'Review',
		components:{
			[Button.name]:Button,
			[Form.name]:Form,
			[Field.name]:Field,
			[CellGroup.name]:CellGroup,
			[Popup.name]:Popup,
			[Picker.name]:Picker,
			[DatetimePicker.name]:DatetimePicker,
			UploadImg
		},
		props:{
			orderno:{
				type:String,
				default:''
			}
		},
		data(){
			return{
				reviewUrl:{
					url:'',
					date:'',
					imgsrc:''
				},
				btnLoading:false ,//按钮加载
				PopupShowPicker:false,
				currentDate:new Date(),
				file:[]
			}
		},
		created() {
			this.getReview();
		},
		methods:{
			//获取留评信息
			getReview(){
				this.file=[]
				this.axios.get("/Handler/CPManageSystem.ashx?cmd=getCPOrderDetailLPInfo&orderno="+this.orderno).then(res=>{
					if(res.data!=''){
						this.reviewUrl.url=res.data.lpurl;
						this.reviewUrl.date=res.data.reallpdate;
						this.reviewUrl.imgsrc=res.data.lpimgurl;
						this.file.push({
							url:res.data.lpimgurl
						})
					}
				}).catch(xhr=>{
					
				})
			},
			//获取图片地址
			getimgsrc(val){
				this.reviewUrl.imgsrc=val;
			},
			//提交
			addConfirm(){
				this.btnLoading=true;
				this.axios.post("/Handler/CPManageSystem.ashx",this.qs.stringify({
					"cmd":"setCPOrderDetailLPInfo",
					"orderno":this.orderno,
					"lpurl":this.reviewUrl.url,
					"reallpdate":this.reviewUrl.date,
					"_img64":this.reviewUrl.imgsrc
				})).then(res=>{
					this.$toast(res.data.resdesc);
					if(res.data.rescode>0){
						this.order=this.$options.data().order;
						this.$emit("loadproductdata","1");
					}
					this.btnLoading=false;
				}).catch(xhr=>{
					console.log(xhr);
				})
			},
			//显示时间选择
			showdate(i){
				this.PopupShowPicker=true;
			},
			onConfirm(val){
				this.reviewUrl.date=`${val.getFullYear()}-${val.getMonth() + 1}-${val.getDate()} ${val.getHours()}:${val.getMinutes()}:0`;
				this.PopupShowPicker=false
			}
		},
		watch:{
			orderno(newVal,oldVal){
				this.orderno=newVal;
				this.getReview();

			}
		}
	})
</script>

<style>
</style>
