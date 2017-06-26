<template>
	<div class="wrap">
	<transition name='fade'>
	    <play-video v-if='showBol' @checkPicBox='showPicBox'></play-video>
		<history-pic v-else :camera-info='cameraInfo' @showVideo='showBol=true'></history-pic>
	</transition>
	</div>
</template>
<script type="text/javascript">
import playVideo from "./playVideo"
import historyPic from "./historyPic"
	export default {
		data(){
			return{
				showBol: true,
				cameraInfo: null
			}
		},
		components: {
			playVideo,
			historyPic
		},
		methods:{
			showPicBox(cameraInfo){
				this.cameraInfo = cameraInfo;
				this.showBol = false;
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