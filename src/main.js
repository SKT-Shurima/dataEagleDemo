// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import routes from './router'
import Vuex from "vuex"
import store from './vuex/store'
import ElementUi from '.1.2.7@element-ui'
import '.1.2.7@element-ui/lib/theme-default/index.css'
import '../theme/index.css'
import echarts from '.3.5.2@echarts'

Vue.use(ElementUi)
Vue.use(Vuex)
Vue.use(VueRouter)
Vue.config.productionTip = false

 
 const getCookie = (c_name)=>{
      if (document.cookie.length>0)
        {
        let c_start=document.cookie.indexOf(c_name + "=")
        if (c_start!=-1)
          { 
          c_start=c_start + c_name.length+1 
          let c_end=document.cookie.indexOf(";",c_start)
          if (c_end==-1) c_end=document.cookie.length
          return unescape(document.cookie.substring(c_start,c_end))
          } 
        }
      return ""
      }

const delCookie = (c_name)=>
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(c_name);
    if(cval!=null){
      document.cookie= c_name + "="+cval+";expires="+exp.toGMTString();
    }   
}

const router = new VueRouter({
  routes
})
 // let user_token = getCookie("user_token");
//  if(user_token){
//  delCookie("user_token")
// }







/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})