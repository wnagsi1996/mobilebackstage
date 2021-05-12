import axios from 'axios'
 


// 登录信息
export const ajaxFun = (url) => {
 return axios.get(url, {
  withCredentials: true, // 跨域凭证
  transformRequest: [function(data) {
   let ret = ''
   for (const it in data) {
    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
   } // axios官方文档关于怎么用每个参数是什么说的特别特别清楚，我百度过的
   return ret
  }],
  headers: {
   'Content-Type': 'application/x-www-form-urlencoded'
  }
 }).then(res => {
  return Promise.resolve(res.data)
 }, err => {
  console.log(err)
 })
}

