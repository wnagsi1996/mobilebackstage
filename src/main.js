import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import qs from 'qs'
import axios from 'axios';

//引入公共头部
import Header from '@/components/Header'
Vue.component('Header',Header) 

//字体自适应插件
import 'lib-flexible/flexible.js'

Vue.config.productionTip=false;
Vue.prototype.axios=axios
Vue.prototype.qs=qs
let curUrl=''
let devUrl='/Handler'
process.env.NODE_ENV==='development' ? curUrl=devUrl: curUrl; 
axios.defaults.baseURL=curUrl;

// 全局路由守卫
import './router/permission'

import {icon,Toast} from 'vant'
Vue.use(icon)
Vue.use(Toast)

Vue.config.productionTip = false

//后退
Vue.prototype.$back = function (route) { 
  if (window.history.length > 1) {
    this.$router.go(-1);
  } else {console.log(1)
    this.$router.push({path:route});
  }
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
