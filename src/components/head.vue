<template>
	<div class="container">
	<el-row class='wrap'>
      <el-col :span="24" class="header" style='height:70px;'>
      <div :span="18" class="logo" ><span v-if="!comName">通用物联网平台</span><span v-else>{{userinfo.enterprise.name}}</span></div>
      <el-col :span="3" class="userinfo" v-if='userinfo.id'>
        <el-dropdown>
            <span class="el-dropdown-link userinfo-inner"><i>{{userinfo.name}}<i class="el-icon-caret-bottom" style="vertical-align:middle;margin-left: 10px;"></i></i>
            <img :src='userinfo.avatar'/>
            </span>
          <el-dropdown-menu slot="dropdown">
           <router-link to="/personInfo">
            <el-dropdown-item ><div @click="select"><img src="./img/info@2x.png">个人资料</div></el-dropdown-item>
            </router-link>
            <router-link to="/techSuport">
            <el-dropdown-item @click="select"><img src="./img/support@2x.png"  >技术支持</el-dropdown-item>
			      </router-link>
            <el-dropdown-item @click="select"><div  @click='aboutUsFn'> <img src="./img/aboutus@2x.png">关于我们</div></el-dropdown-item>
            <router-link to="/modifyPassword">
            <el-dropdown-item @click="select"><img src="./img/edit@2x.png"  >修改密码</el-dropdown-item>
            </router-link>
            <router-link to="/entry">
            <el-dropdown-item @click="select"><img src="./img/out@2x.png"  >退出登录</el-dropdown-item>
            </router-link>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-col>
</el-row></div>
</template>
<script>
import { initUserInfo,aboutUs,newUserToken} from '../api/api'
import {getCookie} from '../api/common'
	export default{
		data(){
      return {
          userinfo: [],
          comName:  false
      }
    },
    methods:{
        reLogin(){
            this.$msgbox({
              title: '提示',
              message: '权限过期，是否需要重新登录',
              showCancelButton: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              beforeClose: (action, instance, done) => {
                if (action === 'confirm') {
                  this.$router.push({path: '/entry'});
                  done();
                }else{
                  done();
                } 
              }
            });
      },
        aboutUsFn(){
          aboutUs().then(res=>{
            let { msg, code, data } = res;
             if (code !== 0) {
                  if(code === -1001 || code === -1010 ){
                     newUserToken();
                     aboutUs().then(res1=>{
                      let msg1 = res1.msg ;
                      let code1 = res1.code ;
                      let data1 = res1.data ;
                      if (code1 !== 0) {
                        this.reLogin();
                      }else{
                         window.location = data1;
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
                    window.location = data;
                  }
          })
        },
        select(){
          this.$store.commit('changeState',null);
          this.$emit('comeInfo');
        }
    },
    mounted(){
       this.$nextTick(()=>{
        let user_token = getCookie('user_token');
        if (user_token) {
          initUserInfo().then((res)=>{
          let { msg, code, data } = res;
            if(code !== 0) {
            
            }else{
                this.userinfo = data;
                if (this.userinfo.enterprise.name) {
                  this.comName = true;
                }
            }
          })
        }
      })
    }
	}
</script>
<style lang='scss' scoped>
.container {
    width: 100%;
    height: 70px;
    background: #16bf86;
    position: fixed;
    z-index: 10;
    .wrap{
     width: 1200px;
     margin: 0px auto;
     height: 70px;
    .header {
      line-height: 70px;
      color:#fff;
      overflow: hidden;
      .msgBox{
        float: right;
        padding-left: 30px;
        .msgNum{
          clear: both;
          vertical-align: middle;
          padding: 0px 6px;
          border-radius: 50%;
          background-color: #ff8628;
          color: #fff;
          }
          .msgBtn{
            clear: both;
            color: #fff;
          }
      }
      .userinfo{
        float: right;
        .el-dropdown{
          float: left;
          height: 70px;
        }
        .userinfo-inner {
          cursor: pointer;
          color:#fff;
          img {
            width: 40px;
            height: 40px;
            border-radius: 20px;
            margin: 16px 10px 10px 10px;
            float: left;
          }
          i{
            display: inline-block;
            width: 80px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
      .logo {
        float: left;
        width:500px;
        height:60px;
        font-size: 22px;
        padding-left:20px;
        padding-right:20px;
      }
    }
    }
  }
  .el-dropdown-menu{
            width: 200px; 
            background-color: #16bf86;
            .el-dropdown-menu__item{
              color: #fff;
            }
            .el-dropdown-menu__item:hover{
              background-color: #13ac76;
            }
            img{
              vertical-align: sub;
              width: 24px;
              margin-right: 12px;
            }
          }
          
</style>