<template>
   <div class='wrap'>
	   <data-head></data-head>
	   <div class="conCenter">
	   	   <div class="header">
	   	   	<span :class="{'clickMe':currentView=='view_0'}" @click="currentView='view_0'"  >注册</span>
	   	   	<span :class="{'clickMe':currentView=='view_1'}" @click="currentView='view_1'">登录</span>
	   	   </div>
	   	   <div class="con">
	   	   	  <component :is="currentView" keep-alive
	      transition="fade"  @changeView='changeViewFn' @regSucess='regSucessFn' ></component>
	   	   </div>
	   </div>
	 
   </div>
	
</template>
<script type="text/javascript">
import {newUserToken} from '../api/api'
import dataHead from "./head"
import reg from "./entry/reg"
import login from "./entry/login"
import forgetPassword from "./entry/forgetPassword"
import {getCookie,delCookie} from '../api/common'
export default {
	data () {
	  return 	{
	  	currentView:'view_1'
	   }
	  },
	  components:{
	  	dataHead,
	  	'view_0': reg,
	  	'view_1': login,
	  	'view_2': forgetPassword
	  },
	  methods:{
	  	changeViewFn(mask){
	  		let _this = this ;
	  		if (mask) {
	  			_this.currentView = 'view_2' ;
	  		}
	  	},
	  	regSucessFn(){
	  		let _this = this ;
	  		_this.currentView = 'view_1' ;
	  	}
	  },
    mounted(){
    	this.$nextTick(()=>{
    		let user_token = getCookie('user_token');
		    if(user_token){
		        delCookie('user_token');
		    }
    	})
    }
  }

</script>

<style lang='scss' scoped>
.wrap{
	width: 100%;
	.conCenter {
		width: 1080px;
		padding-top: 100px;
		margin: 0 auto;
		.header{
			background-color: #ccc;
			height:50px;
			span{
				display: inline-block;
				width: 100px;
				height: 50px;
				line-height: 50px;
				text-align: center;
				color: #fff;
				cursor: pointer;
			}
			.clickMe{
				background-color: #fff;
				color: #000;
			}
		}
		.con{
			background-color: #fff;
			padding: 30px 0px 100px; 
		}
	}
	.fade-enter-active, .fade-leave-active{
      transition: all 0.5s ease     
      }
    .fade-enter, .fade-leave-active{
      opacity: 0
    }
}
   
</style>