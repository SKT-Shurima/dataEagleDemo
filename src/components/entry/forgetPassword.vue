<template>
   <div class='wrap'>
	   <div class="box">
		   <el-row>
		   </el-row>
	   		 <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="0px" class="demo-ruleForm">
			    <el-form-item>
          <div>手机号</div>
			      <el-input type="text" v-model="ruleForm.phone" auto-complete="off" placeholder="请输入手机号">
           <img src="./img/PxCook-Temp_19.png" slot='prepend' width="30">   
            </el-input>
			    </el-form-item>
			    <el-form-item>
          <div>验证码</div>
			      <el-input type="text" v-model="ruleForm.validateCode" auto-complete="off" placeholder="请输入验证码" style='width: 60%;'>
           <img src="./img/PxCook-Temp_23.png" slot='prepend' width="30">   
            </el-input>
			      <el-button type='primary' style='float: right;'  v-text='getCodeText' :disabled='butBol' @click='authCode'>
			      </el-button>	
			    </el-form-item>
			    <el-form-item prop="checkPass">
          <div>输入密码</div>
			      <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="请输入密码">
           <img src="./img/PxCook-Temp_10.png" slot='prepend' width="30">   
            </el-input>
			    </el-form-item>
			    <el-form-item>
          <div>确认密码</div>
			      <el-input type="password" v-model="ruleForm.comfirmPassword" auto-complete="off" placeholder="请确认密码">
           <img src="./img/PxCook-Temp_10.png" slot='prepend' width="30">   
            </el-input>
			    </el-form-item>
			    <el-form-item >
			      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit" :loading="logining">重置密码</el-button>
			    </el-form-item>
			  </el-form>
			  
	   </div>
   </div>
	
</template>
<script type="text/javascript">
import { forgetPassword,getCode,newUserToken} from '../../api/api'
export default {
    data() {
      return {
        logining: false,
        butBol: false,
        getCodeText: '获取验证码',
        ruleForm: {
          phone: null,
          validateCode: null,
          realName: null,
          username: null,
          password: null,
          comfirmPassword: null
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
      authCode() {
        let _this = this;
        let regPhone = /^1[34578]\d{9}$/g ; 
        if (regPhone.test(_this.ruleForm.phone)) {
          let params = {
          mobile: _this.ruleForm.phone,
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
      handleSubmit(ev) {
        let _this = this ;
      let regPhone = /^1[34578]\d{9}$/g ;
      if (!regPhone.test(_this.ruleForm.phone)) {
        this.$alert('您输入的手机号有误', '错误', {
              confirmButtonText: '确定'
            });
      }else if(!_this.ruleForm.validateCode){
        this.$alert('请输入验证码', '错误', {
              confirmButtonText: '确定'
            });
      }else if(!_this.ruleForm.password){
            this.$alert('请输入密码', '错误', {
              confirmButtonText: '确定'
            });
      }else if (_this.ruleForm.password !== _this.ruleForm.comfirmPassword) {
          this.$alert('两次输入密码不一致', '错误', {
              confirmButtonText: '确定'
            });
      }else{
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.logining = true;
            var loginParams = { 
              sign: _this.ruleForm.validateCode,
              mobile: _this.ruleForm.phone,
              password: _this.ruleForm.password };
            forgetPassword(loginParams).then(res => {
              this.logining = false;
              let { msg, code, data } = res;
              if (code !== 0) {
                if (code === -1001 || code === -1010) {
                  newUserToken();
                  forgetPassword(loginParams).then(res1=>{
                      let msg1 = res1.msg ;
                      let code1 = res1.code ;
                      let data1 = res1.data ;
                      if (code1 !== 0) {
                        this.$router.push({path: '/entry'});
                      }else{
                        this.$emit('regSuccess');
                      }
                  })
                }else{
                  this.$notify({
                    title: '错误',
                    message: msg,
                    type: 'error'
                  });
                }
              } else {
                 this.$emit('regSuccess');
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
         
      }
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
	}
}
   
</style>