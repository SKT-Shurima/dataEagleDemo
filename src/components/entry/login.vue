<template>
   <div class='wrap'>
	   <div class="box">
		   <el-row>
		   </el-row>
	   		 <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="0px" class="demo-ruleForm">
			    <el-form-item>
             <div>用户</div>
			      <el-input type="text" v-model="ruleForm.username" auto-complete="off" placeholder="请输入用户名/手机号">
          <img src="./img/PxCook-Temp_15.png" slot='prepend' width="30">    
            </el-input>
			    </el-form-item>
			    <el-form-item prop="checkPass">
          <div>输入密码</div>
			      <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="请输入密码"><img src="./img/PxCook-Temp_10.png" slot='prepend' width="30">  
            </el-input>
			    </el-form-item>
          <el-form-item>
          <div>验证码</div>
          <!-- <img src="./img/PxCook-Temp_20.png" height="60" width="60"> -->
          <el-input type="text" placeholder="验证码" auto-complete='off' v-model='ruleForm.validateCode' style='width: 60%;'><img src="./img/PxCook-Temp_23.png" slot='prepend' width="30"></el-input>
          <img  src="" />
        </el-form-item>
			    <el-form-item  style='margin-top: 50px;'>
			    	<el-checkbox v-model="checked" checked class="remember" style='margin-bottom: 10px;float:left;'>记住密码</el-checkbox>
			    	<el-button type='text' size='small' style='float: right;margin-top: 4px;' @click='forgetPassword'>忘记密码</el-button>
			    </el-form-item>
			    <el-form-item >
			      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit" :loading="logining">登录</el-button>
			    </el-form-item>
			  </el-form>
	   </div>
   </div>
	
</template>
<script type="text/javascript">
import { requestLogin } from '../../api/api'
import {getCookie,delCookie,setCookie} from '../../api/common'
export default {
    data() {
      return {
        logining: false,
        checked: true,
        ruleForm: {
        username: null,
        password: null
        },
        rules: {
          phone: [
            { required: true, 
              message: '请输入账号', 
              trigger: 'blur' 
            }],
          password: [
            { required: true,
              message: '请输入密码',
              trigger: 'blur'
               }],
          validateCode: [
          { required: true, 
          	message: '请输入验证码', 
          	trigger: 'blur' },
          ]
        }
      };
    },
    methods: {
    	forgetPassword(){
          this.$emit("changeView",true);
    	},
      handleSubmit(ev) {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.logining = true;
            let regPhone = /^1[34578]\d{9}$/g ;
            let loginParams;
            if (regPhone.test(this.ruleForm.username)) {
               loginParams = { mobile: this.ruleForm.username, password: this.ruleForm.password };
            }else{
              loginParams = { username: this.ruleForm.username, password: this.ruleForm.password };
            }
            requestLogin(loginParams).then(res => {
              this.logining = false;
              let { msg, code, data } = res;
              if (code !== 0) {
                this.$notify({
                  title: '错误',
                  message: msg,
                  type: 'error'
                });
              } else {
                // 判断是否记住密码
                if(this.checked){ // 记住设置cookie
                  setCookie('username',this.ruleForm.username,3)
                  setCookie('password',this.ruleForm.password,3)
                }else{ // 不记住 查找cookie  如果有 删除
                  let username = getCookie(username);
                  let password = getCookie(password);

                  if (username && password) {
                    delCookie('username');
                    delCookie('password');
                  }
                }
                this.$router.push({path: '/home'});
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
    mounted(){
        this.$nextTick(()=>{
          let username = getCookie('username');
          let password = getCookie('password');
          if (username && password) {
            this.ruleForm.username = username;
            this.ruleForm.password = password;
          }
        })
      }
  }

</script>

<style lang='scss' scoped>
.wrap{
	width: 100%;
	.box{
		width: 940px;
		margin: 0px auto;
    .demo-ruleForm{
      width: 380px;
      margin: 0 auto;
    }
	     .title {
	       margin: 0px auto 40px auto;
	       text-align: center;
	       color: #505458;
	     }
	     .remember {
	       margin: 0px 0px 35px 0px;
	     }
	     .authImg{
	     	vertical-align: baseline;
	     }
	   .info{
	   	text-align: center;
	   	font-size: 12px;
	   	a{
	   		color: rgb(16, 36, 238);
	   		text-decoration: underline;
	   	}
	   }
	}
}
</style>