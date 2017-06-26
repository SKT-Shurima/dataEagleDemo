<template>
  <div class="bigWrap">
     <data-head @come-info='comeInfoStatus'></data-head>
     <div class="contents">
        <left-nav :status='status'></left-nav>
        <transition name='fade'>
          <div class="centerContent" @check-control='getId'>
           <router-view ></router-view>
          </div>
        </transition>
     </div>
  </div>
</template>

<script>
import dataHead from "./head.vue"
import leftNav from "./leftNav.vue"
export default {
  data(){
    return{
      status: null
    }
  },
  components: {
    dataHead,
    leftNav
  },
  methods:{
    comeInfoStatus(){
      this.status = true;
    },
    getId(data){
      console.log(data)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
.bigWrap{
  height: 100%;
  .contents{
  width: 1200px;
  height: 100%;
  margin: 0px auto;
  overflow: hidden;
  box-shadow: 2px 0px 4px 4px rgba(0,0,0,0.12);
   .fade-enter-active, .fade-leave-active{
      transition: all 0.5s ease     
      }
    .fade-enter, .fade-leave-active{
      opacity: 0
    }
  .centerContent{
    width: 1080px;
    height: 100%;
    float: left;
    overflow: hidden;
    background-color: #fff;
    padding-top: 100px;
    padding-left: 80px;
    padding-right: 40px;
    padding-bottom: 100px;
    overflow-x: hidden;
    overflow-y: scroll;

  }
}
}
/* 设置滚动条的样式 */
/*::-webkit-scrollbar {    
  width: 0px;
}*/
/* 滚动槽 */
/*::-webkit-scrollbar-track {    */
  /*-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);    */
  /*border-radius: 10px;*/
  /*}*/
  /* 滚动条滑块 */
  /*::-webkit-scrollbar-thumb {    */
    /*border-radius: 10px;    */
    /*background: rgba(0,0,0,0.1);    */
    /*-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);*/
    /*color: #fff;*/
    /*}
    ::-webkit-scrollbar-thumb:window-inactive {    
      background: rgba(255,0,0,0.4);
    }*/
</style>
