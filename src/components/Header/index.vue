<template>
	<div>
		<van-nav-bar
		  :title="title"
		  left-arrow
		  safe-area-inset-top
		  fixed
		  placeholder 
		>
			<template #left>
				<div class="left-icon" v-if="menuList" @click="popupShow=true">
					<van-icon name="wap-nav" />
				</div>
				<div class="left-icon" v-else @click="back">
					<van-icon name="arrow-left" />
				</div>
			</template>
			<template #right>
				<div class="logout" v-if="menuList" @click="logout">
					退出登录
				</div>
				<slot name='search'></slot>
			</template>
		</van-nav-bar>
		<van-popup position="left" v-model="popupShow" :style="{ height: '100vh',width:'60vw' }">
			<div class="user-info">
				<img :src="userInfo.img"/>
				<span>{{userInfo.name}}</span>
				<p>{{userInfo.identity}}</p>
			</div>
			<van-collapse v-model="activeNames" accordion>
			  <van-collapse-item v-for="(item,index) in newmenulist" :key="index" :title="item.name" :name="index">
				  <template #default>
					  <div class="menu-nav" v-for="(children,index2) in item.children" :key="index2" @click="toPath(children)">{{children.name}}</div>
				  </template>
			  </van-collapse-item>
			</van-collapse>
		</van-popup>
	</div>
</template>

<script>
	const userItem=[
		{
			"id":"50",
			"name":"卖家端",
			"icon":require("../../assets/images/poho-01.png")
		},{
			"id":"51",
			"name":"买家端",
			"icon":require("../../assets/images/poho-02.png")
		},{
			"id":"52",
			"name":"财务",
			"icon":require("../../assets/images/poho-03.png")
		},{
			"id":"53",
			"name":"管理员",
			"icon":require("../../assets/images/poho-04.png")
		}
	];
	
	import {NavBar,Popup,Collapse, CollapseItem} from 'vant'
	import { mapGetters } from "vuex";
	
	export default({
		name:'Header',
		components:{
			[NavBar.name]:NavBar,
			[Popup.name]:Popup,
			[Collapse.name]:Collapse,
			[CollapseItem.name]:CollapseItem
		},
		props:{
			title:{
				type:String,
				default:''
			},
			menuList:{
				type:Boolean,
				default:false
			}
		},
		computed:{
			...mapGetters(['permission_routes','menulist','account'])
		},
		data(){
			return{
				popupShow:false,
				newmenulist:[],
				activeNames:0,
				userInfo:{}
			}
		},
		mounted() {
			this.getmenudata();
			this.userIdentity();
			
		},
		methods:{
			getmenudata(){
				// console.log(this.menuList);
				let newmenuList=[];
				if(this.menulist.length>0){
					for(let i=0;i<this.menulist.length;i++){
						//构造新的路由菜单
						newmenuList.push({"name":this.menulist[i].text,"path":"/clientorder"+i,children:[]});
						let items=this.menulist[i].items;
						for(let ii=0;ii<items.length;ii++){
							if(items[ii].id!="m1181"){
								for(let n=0;n<this.permission_routes.length;n++){
									if(this.permission_routes[n].meta && this.permission_routes[n].meta.roles){
										if(items[ii].id==this.permission_routes[n].meta.roles[0]){
											newmenuList[i].children.push(this.permission_routes[n]);
										}
									}
								}
							}
						}
					}
				}
				//newmenuList.unshift(menudata[0]);
				this.newmenulist=newmenuList;
				
			},
			//用户身份
			userIdentity(){
			  for(let i=0;i<userItem.length;i++){
			   if(userItem[i].id==this.account[1]){
				   this.userInfo.identity=userItem[i].name
				   this.userInfo.img=userItem[i].icon
				   this.userInfo.name=this.account[0]
			   }
			  }
			},
			toPath(item){
				this.$router.push({path:item.path})
			},
			back(){
				this.$back('/');
			},
			logout(){
				this.$store.dispatch('user/resetToken');
			}
		}
	})
</script>

<style scoped>
	.left-icon i{font-size:26px;color: #000;}
	.logout{color:#888}
	.menu-nav{padding: 10px 0;color: #666;}
	.user-info{display: flex;flex-direction: column;align-items: center;padding:20px 0;background-color: #f7f7f7;}
	.user-info span{margin-top:20px;}
	.user-info p{color: #e41c1d;margin-top: 5px;}
</style>
