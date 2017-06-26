<template>
	<div class="wrap">
	<transition name="fade">
		<some-data v-if='showBol' @getMore='getMoreInfo'></some-data>
	    <more-data v-else :sensors-list='sensorList' @backSomeData='backSomeData'></more-data>
	</transition>
	</div>
</template>
<script type="text/javascript">
    import moreData from "./moreData"
    import someData from "./someData"
	export default {
		data(){
			return{
			   showBol: true,
			   sensorList: null
			}
		},
		components: {
			moreData,
			someData
		},
		methods: {
			getMoreInfo(list){
				let _this = this;
				if (list) {
					_this.showBol = false;
					_this.sensorList = list;
				}
			},
			backSomeData(){
				let _this = this;
				_this.showBol = true;
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
	margin-bottom: 100px;
	.fade-enter-active, .fade-leave-active{
		  transition: all 0.5s ease     
	    }
		.fade-enter,.fade-leave-active{
		  opacity: 0;
		  display: inline-block;
		  transform: translateX(2000px);
		}
}
</style>