<template>
	<div class="wrap">
	    <transition name='fade'>
	    	<questionlist v-if='statusBol' @getTopic='getTopicIndex'></questionlist>
	        <question :passData="passData" v-else  @backList='statusBol=true'></question>
	    </transition>
	    
	   
	</div>
</template>
<script type="text/javascript">
import questionlist from "./questionList"
import question from "./question.vue"
 export  default{
 	data(){
 		return{
 			statusBol: true,
 			passData: null
 		}
 	},
 	components:{
 		questionlist,
 		question
 	},
 	methods:{
 		getTopicIndex(passData){
 			this.passData = passData;
 			this.statusBol = false ;
 		}
 	},
 	created(){
 		
 	}
 	
 }
</script>
<style lang='scss' scoped>
.wrap{
	margin-left: 10px;
	.fade-enter-active, .fade-leave-active{
		  transition: all 0.5s ease     
	    }
		.fade-enter, .fade-leave-active{
		  opacity: 0
		}
	
}
</style>