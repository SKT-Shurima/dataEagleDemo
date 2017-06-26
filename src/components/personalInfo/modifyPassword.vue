<template>
	<div class="wrap">
		<el-row class="back">
	    	<button @click='goBack'>返回</button>
	    </el-row>
	    <h1>
	    	修改密码
	    </h1>
	    <div class="box">
	    	<el-row>
	    	  <el-input type='text' placeholder="请输入手机号" v-model='phoneInput'>
	    	  </el-input>
	        </el-row>
	        <el-row>
	        <el-col :span="14">
	        	<el-input type='text' placeholder="请输入验证码" v-model='verifyInput'>
	    	  	</el-input>
	        </el-col>
	    	  <el-col :span="9" :offset="1">
	    	  	 <el-button type='primary' @click='getAuthCode' v-text='getCodeText' :disabled='butBol'>
	    	  	 </el-button>
	    	  </el-col>
	        </el-row>
	        <el-row>
	    	  <el-input type='password' placeholder="请设置新密码" v-model='passwordInput'>
	    	  	
	    	  </el-input>
	        </el-row>
	        <el-row>
	    	  <el-input type='password' placeholder="请确认新密码" v-model='comfirmInput'>
	    	  </el-input>
	        </el-row>
	        <el-row  style='padding-top: 10px;'>
	        <el-button type='primary' @click='submitInfo'>
	        	确认修改
	        </el-button>
	        </el-row>
	    </div>
	    
	</div>
</template>
<script type="text/javascript">
import { getCode,forgetPassword,newUserToken,verify} from '../../api/api'
 export  default{
 	data(){
 		return{
 			phoneInput: null,
 			verifyInput: null,
 			passwordInput: null,
 			comfirmInput: null,
 			sign: "",
 			butBol: false,
 			getCodeText: '获取验证码'
 		}
 	},
 	methods:{
 		getAuthCode(){
 			let _this = this;
 			let regPhone = /^1[34578]\d{9}$/g ;	
 			if (regPhone.test(_this.phoneInput)) {
 				let params = {
 				mobile: _this.phoneInput,
 				type:3
 			    }
 			    getCode(params).then(()=>{
 					this.butBol = true;
 					let time = 60 ;
 					this.getCodeText = time + 's后重新获取' ;
 					let timer = setInterval(()=>{
 						time--;
 						this.getCodeText = time + 's后重新获取' ;
 						if (time<0) {
 							clearInterval(timer);
 							this.butBol = false;
 							this.getCodeText = '获取验证码' ;
 						}
 					},1000);
 			  })
 			}else{
 				this.$alert('您输入的手机号有误', '错误', {
		          confirmButtonText: '确定'
		        });
 			}
 			
 		},
 		verifyCode(){
 			let _this = this ;
 			let params = {
 				code: _this.verifyInput,
 				mobile: _this.phoneInput
 			}
 			verify(params).then(res=>{
 				let {msg,code,data}=res;
 				if (code !== 0) {
 					if(code === -1001 || code === -1010 ){
	                   newUserToken();
	                   forgetPassword(params).then(res1=>{
	            			let code1 = res1.code ;
	            			if (code1 !== 0) {
	            				this.$router.push({path: '/entry'});
	            			}else{
	            				this.$router.push({path: '/home'});
	            			}
	                   })
	              }else{
	                    this.$notify({
	                    title: "请求失败",
	                    message: msg,
	                    type: 'error'
	                  })
	                }
 				}else{
 					this.sign= data.sign;
 					this.editPw();
 				}
 			})
 		},
 		editPw(){
 			let _this = this ;
 			let params = {
 					sign: _this.sign,
 					mobile: _this.phoneInput,
 					password: _this.passwordInput
 				};
 				forgetPassword(params).then(res=>{
 					let {msg,code,data}=res;
	 				if (code !== 0) {
	 					if(code === -1001 || code === -1010 ){
		                   newUserToken();
		                   forgetPassword(params).then(res1=>{
		            			let code1 = res1.code ;
		            			if (code1 !== 0) {
		            				this.$router.push({path: '/entry'});
		            			}else{
		            				this.$router.push({path: '/home'});
		            			}
		                   })
		              }else{
		                    this.$notify({
		                    title: "请求失败",
		                    message: msg,
		                    type: 'error'
		                  })
		                }
	 				}else{
	 					this.$router.push({path: '/home'});
	 				}
 				})
 		},
 		submitInfo(){
 			let _this = this ;
 			let regPhone = /^1[34578]\d{9}$/g ;
 			if (!regPhone.test(_this.phoneInput)) {
 				this.$alert('您输入的手机号有误', '错误', {
		          confirmButtonText: '确定'
		        });
 			}else if(!_this.verifyInput){
 				this.$alert('请输入验证码', '错误', {
		          confirmButtonText: '确定'
		        });
 			}else if(!_this.passwordInput){
	            this.$alert('请输入密码', '错误', {
	              confirmButtonText: '确定'
	            });
	      }else if (_this.passwordInput !== _this.comfirmInput) {
 					this.$alert('两次输入密码不一致', '错误', {
		           confirmButtonText: '确定'
		        });
 			}else{
 				this.verifyCode();
 			}
 		},
 		goBack(){
 			this.$router.go(-1);
 		}
 	}
}
</script>
<style lang='scss' scoped>
.wrap{
	margin-left: 10px;
	.back{
		height: 40px;
		button{
			width: 58px;
			height: 26px;
			background-color: #fff;
			border: 1px solid #ddd;
			border-radius: 4px;
		}
	}
	h1{
			font-size: 20px;
			height: 30px;
		}
	.box{
		width: 356px;
		button{
			width: 100%;
		}
		.el-row{
			margin-top: 20px;
		}
	}
}
</style>