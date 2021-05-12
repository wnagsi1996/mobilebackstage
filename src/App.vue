<template>
  <div id="app">
	  <keep-alive>
			<router-view v-if="$route.meta.keepAlive" />
	  </keep-alive>
	  <router-view v-if="!$route.meta.keepAlive" />
  </div>
</template>
<script>
	export default({
		mounted () {
		    // 检测浏览器路由改变页面不刷新问题,hash模式的工作原理是hashchange事件
		    window.addEventListener('hashchange', () => {
		      let currentPath = window.location.hash.slice(1)
		      if (this.$route.path !== currentPath) {
		        this.$router.push(currentPath)
		      }
		    }, false)
		}
	})
</script>
<style>
html{
	overflow-y: scroll;
}
body{
	margin: 0;
	padding: 0;
	width: 100vw;
	background-color: #f7f7f7;	
	position: absolute;	
	left: 0;top: 0;	
	overflow: hidden;	
	overflow-y: auto;
	font-family: "Arial","Microsoft YaHei","黑体","宋体",sans-serif;
}
:root {
  overflow-y: auto;
  overflow-x: hidden;
}

:root body {
  position: absolute;
}

body, div, span,em, header, footer, nav, section, aside, article, ul, dl, dt, dd, li, a, p, h1, h2, h3, h4,h5, h6, i, b, textarea, button, input, select, figure, figcaption{
  padding: 0;
  margin: 0;
  list-style: none;
  font-style: normal;
  text-decoration: none;
  border: none;
  font-weight: normal;
  font-size: 14px;
  font-family: "Microsoft Yahei", serif;
  box-sizing: border-box;
  -webkit-tap-highlight-color:transparent;
  -webkit-font-smoothing: antialiased;
  
}
a{text-decoration: none;}
ul,li,p{margin: 0;padding: 0;list-style-type: none;}

/* 图标字体大小 */
.iconfont{font-size: 16px;}
.iconfont-lg{font-size:18px}
.iconfont-2x{font-size:22px}
.iconfont-3x{font-size:24px}
.iconfont-4x{font-size:30px}

.popup-title{margin:14px auto;font-size:18px;text-align: center;color: #111;}
.search-btn{margin: 20px 10px 10px;display: flex;justify-content: space-evenly;}
.search-btn-block{width: 30%;}

.icon-right i{margin: 0 0 0 10px;}

/* 公用模块开始，不可随便修改 */
.goal-item{display: flex;width:96vw;margin: 5px auto;background-color: #fff;border-radius: 5px;padding:8px;}
.account-item{flex-direction: column;overflow: hidden;}
.goal-item-center{align-items: center;}
.goal-item-top{display: flex;flex-wrap: wrap;flex: 1;}
.goal-item-info{width:50%;margin:5px 0;display: flex;}
.goal-item-info100{width: 100%;}
.goal-item-info span{padding-right: 10px;min-width:60px;}
.goal-item-info em{color: #666;}
.account-item-bottom{height:26px;padding-top:5px;border-top:1px solid #f7f7f7;display: flex;align-items: center;justify-content:space-around}
.account-item-bottom .account-item-operating{color: #E41C1D;text-align: center;}
.goal-item-bottom{width: 40px;text-align: center;}
.goal-item-bottom i{color: #E41C1D;}
.goal-top{display: flex;}
.goal-top-img{max-width: 100px;width: 50px;}
.goal-top-img img{max-width: 100px;}
.goal-top-right{flex: 1;padding-left: 15px;}
/* 公用模块结束 */
</style>
