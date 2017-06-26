<template>
	<el-row class="leftNav">
      <el-menu default-active="2" class="el-menu-vertical-demo">
      <router-link to="/home">
      <el-menu-item index="1" :path='"home"' @click="select('home')" :class="{'is-click':currentPath=='home'}" class='is-normal' >
       <i class="el-icon-minus" v-if="currentPath!='home'"></i>
       <img src="../../static/navImg/home.png" width="18" height="18" v-else>
            首页
            <span :class="{'is-click':currentPath=='home'}"></span>
      </el-menu-item>
       </router-link>
       <router-link to="/data">
       <el-menu-item index="2" :path='"data"' @click="select('data')" :class="{'is-click':currentPath=='data'}" class='is-normal' >
       <i class="el-icon-minus" v-if="currentPath!='data'"></i>
       <img src="../../static/navImg/data.png" width="18" height="18" v-else>
            数据
            <span :class="{'is-click':currentPath=='data'}"></span>
      </el-menu-item>
       </router-link>
       <router-link to="/control">
      <el-menu-item index="3" :path='"control"' @click="select('control')" :class="{'is-click':currentPath=='control'}" class='is-normal' >
      <i class="el-icon-minus"  v-if="currentPath!='control'"></i>
       <img src="../../static/navImg/control.png" width="18" height="18" v-else>
	          控制
            <span :class="{'is-click':currentPath=='control'}"></span>
      </el-menu-item>
       </router-link>
       <router-link to="./video">
      <el-menu-item index="4" :path='"video"' @click="select('video')" :class="{'is-click':currentPath=='video'}" class='is-normal' >
      <i class="el-icon-minus" v-if="currentPath!='video'"></i>
       <img src="../../static/navImg/video.png" width="16" height="16" v-else>
             视频
             <span :class="{'is-click':currentPath=='video'}"></span>
      </el-menu-item>
       </router-link>
       <router-link to="/farm">
      <el-menu-item index="5" :path='"farm"' @click="select('farm')" :class="{'is-click':currentPath=='farm'}" class='is-normal' >
      <i class="el-icon-minus" v-if="currentPath!='farm'"></i>
       <img src="../../static/navImg/farm.png"  width="16" height="16" v-else>
             农事
             <span :class="{'is-click':currentPath=='farm'}"></span>
       </el-menu-item>
        </router-link>
      <router-link to="/impower">
      <el-menu-item index="6" :path='"impower"' @click="select('impower')" :class="{'is-click':currentPath=='impower'}" class='is-normal' >
      <i class="el-icon-minus" v-if="currentPath!='impower'"></i>
       <img src="../../static/navImg/impower.png"  width="16" height="16" v-else>
             授权
             <span :class="{'is-click':currentPath=='impower'}"></span>
       </el-menu-item>
        </router-link>
    </el-menu>
	</el-row>
</template>
<script type="text/javascript">
	export default {
		name:'leftNav',
		data(){
			return{
			}
		},
    props:["status"],
    watch:{
        
    },
    computed:{
       currentPath(){
        return this.$store.state.curPath 
       }
    },
		methods:{
			select(path){
       this.$store.commit('changeState',path);
			}
		},
		mounted(){
			this.$nextTick(()=>{
        let routePath = this.$route.path;
        routePath = routePath.substring(1);
        this.$store.commit("changeState",routePath);
      })
		}
	}
</script>
<style lang='scss' scoped>
.leftNav{
	float: left;
  width: 120px;
  padding-top: 100px;
  ul.el-menu,.el-menu-vertical-demo{
    background-color: #f2f2f2;
  }
    img{
    	vertical-align: sub;
    	margin-right: 6px;
    }
    .el-menu-item{
      span{
        width: 12px;
        height: 12px;
        display: inline-block;
        float: right;
        background-color: transparent;
        -webkit-transform: translateX(26px) translateY(14px) rotateZ(45deg);
        -moz-transform: translateX(26px) translateY(-24px) rotateZ(45deg);
        /*z-index: -1;*/
      }
      .is-click{
        background-color: #16bf86;
      }
    }
    .el-menu-item:hover span{
      background-color: #d1e5e1;
    }
    .el-menu-item.is-click:hover span{
      background-color: #16bf86;
    }
    .el-menu-vertical-demo{
    	background-color: #fff;
    }
    .el-menu-item.is-click.is-normal {
    	color: #fff;
      background-color: #16bf86;
    }
    .el-menu-item.is-normal {
      color: #16bf86;
    } 
    .el-menu-item, .el-submenu__title{
    	height: 40px;
    	line-height: 40px;
    }
}
	
</style>