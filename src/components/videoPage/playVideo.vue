<template>
	<div class="wrap">
		<el-row class="select">
		    <el-col :span="8">
		      选择单元
			 <el-select v-model="unit" placeholder="请选择" style="margin-left:10px;width: 160px;" size="small" @change='changeUnit($event)'>
			    <el-option v-for="(item,index) in units" :label="item.name" :value="index" :key='item.unitId'>
			    </el-option>
			 </el-select>
			 </el-col>
		</el-row>
		<transition name="fade">
			<div v-if='videoBol' style="margin-bottom: 100px;">
			<el-row  v-loading="!videoBol" element-loading-text="拼命加载中...">
		        <div class="videoWrap" >
			 		<div class="videoBox">
		  				<video id="myPlayer" :poster="videoParam.coverPic"  playsInline webkit-playsinline autoplay ></video>
			  			<div class="sliderWrap">
					  	 	<div class="sliderBox">
						  	    <div class="playBox">
						  	    	<i class="iconfont  icon-play playBtn" v-if='videoParam.playBol' @click='play'></i>
						  	    	<i class="iconfont  icon-pause playBtn" v-else @click='pause'></i>
						  	    </div>
						  	    <div class="progressBox">
						  	    	<el-slider v-model="videoParam.currentTime" @change='slider' :format-tooltip="formatTooltip"></el-slider>
						  	    </div>
						  	    <div class="videoTime">
						  	    	{{videoParam.currentTime/100*videoParam.duration | videoTime}}/{{videoParam.duration | videoTime}}
						  	    </div>
						  	    <div class="changeHd">
						  	    	<el-select v-model="clarity" size="mini" @change='changeClarity($event)'>
									    <el-option
									      v-for="(item,index) in options"
									      :label="item.label"
									      :value="item.value" :key='index'>
									    </el-option>
									</el-select>
						  	    </div>
						  	    <div class="voice">
						  	    	<div><i class="iconfont icon-audio" @click='voiceParam.voiceBol=true'></i></div>
					  	    		<div class="voiceSlider">
					  	    			<el-slider v-model="voiceParam.voiceVal" @change='voiceSlider'></el-slider>
					  	    	    </div>
						  	    </div>
						  	    <div class="magnify" @click='magnify'>
						  	    	<i class="iconfont icon-magnify" ></i>
						  	    </div>
					  	 	</div>
			  			</div>
			 		 </div> 	
	     		</div>
			    <div class="checkPic">
			     	<el-button type='text'  @click='checkPic'>查看历史图片</el-button>
			    </div>
			    <div class="picBox">
			     	<h1>摄像头列表 <el-button type='text' @click='checkMore'>查看更多</el-button></h1>
			     	<ul class="picList">
			     		<li v-for='(item,index) in currentList' :index='index' :class="{'marginRight':(index+1)%5}" @click='checkVideo(item)' style="cursor: pointer;">
			     			<img :src="item.coverPic">
			     			<span v-text='item.cameraName'></span>
			     		</li>
			     	</ul>
			     	<div v-if='currentList.length>5' style="overflow:hidden;">
			     		<el-button type='text' size='small' style='float:right;' @click='packUp'>
			     			收起&#8593
			     		</el-button>
			     	</div>
			    </div>
			</el-row>
		</div>
		</transition>
		<transition name='fade'>
			<div v-if='dataBol' class="noData">
			该单元暂无实时视频，请重新选择
		    </div>
		</transition>
	</div>
</template>
<script type="text/javascript">
import { cameraList,deviceList,newUserToken } from '../../api/api'
	export default {
		data(){
			return{
				unit: 0,
				units: [],
				videoBol: false,
				dataBol: false,
				maskBol:true,
				currentList: null,
				camerasInfoList: null,
				camerasInfoUnit: null,
				cameraId: null,
				videoSrc: "",
				coverPic: '',
				voiceParam: {
				    voiceBol: true,
				    voiceVal: 0
				},
				videoParam:{
					coverPic:'',
					playBol: true,
					duration: 0,
					currentTime: 0
				},
				options: [{
		          value: '1',
		          label: '高清'
		        }, {
		          value: '2',
		          label: '标清'
		        }],
		        clarity:""
			}
		},
		filters:{
			videoTime(time){
				let h = parseInt(time/3600);
				let m = parseInt(time/60);
				let s = parseInt(time%60);
				m = trans(m);
				s = trans(s);
				 function trans (val){
			      	if (val < 10) {
			      		val = "0" + val ;
			      	}
			      	return val ;
			      };
				if (h) {
					h = trans(h);
					return h +":"+m+":"+s;
				}else{
					return m+":"+s;
				}
			}
		},
		methods: {
			changeUnit(ev){
				let _this = this ;
				let para =  _this.units[ev].unitId;
				cameraList(para).then((res)=>{
					let { msg, code, data } = res;
		            if(code !== 0) {
		              if(code === -1001 || code === -1010 ){
		                  newUserToken();
		                  cameraList(para).then(res1=>{
		                  	let msg1 = res1.msg ;
		                    let code1 = res1.code ;
		                    let data1 = res1.data ;
		                    if (code1 != 0) {
		                    	this.$router.push({path: '/entry'});
		                    }else{
		                    	this.camerasInfoList = data1.cameras;
				            	this.camerasInfoUnit = this.camerasInfoList[0];
				            	if (this.camerasInfoList.length) {
				            		if (this.camerasInfoList.length>5) {
				            			this.currentList = this.camerasInfoList.slice(0,5);
				            		}else{
				            			this.currentList = this.camerasInfoList;
				            		}
				            		this.videoBol = true;
				            		this.dataBol = false;
				            		this.videoSrc = this.camerasInfoUnit.url;
				            	}else{
				            		this.videoBol = false;
				            		this.dataBol  = true;
				            	}
				            	this.initVideo();
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
		            	this.camerasInfoList = data.cameras;
		            	this.camerasInfoUnit = this.camerasInfoList[0];
		            	if (this.camerasInfoList.length) {
		            		if (this.camerasInfoList.length>5) {
		            			this.currentList = this.camerasInfoList.slice(0,5);
		            		}else{
		            			this.currentList = this.camerasInfoList;
		            		}
		            		this.videoBol = true;
		            		this.dataBol = false;
		            		this.videoSrc = this.camerasInfoUnit.url;
		            	}else{
		            		this.videoBol = false;
		            		this.dataBol  = true;
		            	}
		            		this.initVideo();
		            }
				});
			},
			checkPic(){
				this.$emit('checkPicBox',this.camerasInfoUnit);
			},
			checkMore(){
				this.currentList = this.camerasInfoList;
			},
			checkVideo(item){
				let _this = this ;
				_this.camerasInfoUnit = item;
				_this.initVideo();
				_this.videoSrc = _this.camerasInfoUnit.hdUrl;
				_this.videoParam.coverPic = _this.camerasInfoUnit.coverPic ;
				_this.play();
			},
			packUp(){
		        this.currentList = this.camerasInfoList.slice(0,5);
		        },
		    initVideo(){
		    	let _this =this ;
		    	_this.clarity = _this.options[0].label;
		    	_this.videoParam.coverPic = _this.camerasInfoUnit.coverPic ;
		    },
		    initPlay(){
		    	let _this = this ;
		    	_this.videoParam.playBol = false;
		    	let p = document.getElementById('myPlayer'); 
		    	_this.voiceParam.voiceVal = p.volume ;
		    },
		    play(){
		    	let _this =this;
		        let p = document.getElementById('myPlayer');
		        p.setAttribute('src',this.videoSrc);
		        window.player = new EZUIPlayer('myPlayer');
		        _this.initPlay();
		    },
		    pause(){
		    	let _this = this ;
		    	let p = document.getElementById('myPlayer');
		    	console.log("test");
		    	p.pause();
		    	window.player.stop();
		    	_this.videoParam.playBol = true;
			 },
		    slider(){
		    	let _this =this ;
		    	_this.videoParam.currentTime = 0;
		    },
		    voiceSlider(){
		    	let _this = this;
		    	let p = document.getElementById('myPlayer');
		    	p.volume = _this.voiceParam.voiceVal/100 ;
		    },
		    magnify(){
		    	var docElm = document.documentElement;
		    	let p = document.getElementById('myPlayer');
					//W3C 
					if (docElm.requestFullscreen) { 
					    p.requestFullscreen(); 
					} 
					//FireFox 
					else if (docElm.mozRequestFullScreen) { 
					    p.mozRequestFullScreen(); 
					} 
					//Chrome等 
					else if (docElm.webkitRequestFullScreen) { 
					    p.webkitRequestFullScreen(); 
					} 
					//IE11 
					else if (docElm.msRequestFullscreen) { 
					    docElm.msRequestFullscreen(); 
					}
		    },
		    formatTooltip(val) {
		    	// let totalTime = parseInt(this.videoParam.duration) ;
		    	// val = val/100* totalTime;
		    	// this.videoParam.currentTime = val;
		        return val/100 ;
		      },
		      changeClarity(ev){
		      	   let _this = this ;
		      		if (ev == '2') {
		      			_this.videoSrc = _this.camerasInfoUnit.url
		      			_this.play();
		      		}else{
		      			_this.videoSrc = _this.camerasInfoUnit.hdUrl;
		      			_this.play();
		      		}

		      }     	
		    },
		mounted() {
			this.$nextTick(()=>{
	       	deviceList().then((res)=>{
	          let { msg, code, data } = res;
	            if(code !== 0) {
	               if (code === -1001 ||　code === -1010 ) {
	               	  newUserToken();
	               	  deviceList().then(res1=>{
	               	  	let msg1 = res1.msg ;
	                    let code1 = res1.code ;
	                    let data1 = res1.data ;
	                    if (code1 !== 0) {
	                    	this.$router.push({path: '/entry'});
	                    }else{
	                    	this.units = data1.units;
	                    	this.changeUnit(0);
	                    }
	               	  })
	               }else{
	               		this.$notify({
	                        title: "请求失败",
	                        message: msg,
	                        type: 'error'
	                      });
	               }
	            }else{
	            	this.units = data.units;
	            	if(sessionStorage.index){
			        	let index = sessionStorage.index - 0;
			        	this.changeUnit(index);
			        	this.unit = index;
			        	sessionStorage.removeItem("index");
			        }else{
			        	this.changeUnit(0);
			        }
	            }
	          });
	      })
		}
	}
</script>
<style lang='scss' scoped>
@import url("./css/iconfont.css");

@media screen and (max-width: 640px) {
            #a1{width:100%;margin:0 auto;height:400px;}
        }
.wrap{
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
	.select {
		height: 40px;
	}
	.videoWrap{ 
		width: 100%; 
		height: 580px; 
		margin-top: 20px;
		position: relative;
		.videoBox{
			width: 100%;
			height: 580px;
			position: relative;
			border:1px solid #16bf86;
			#myPlayer{
				width:100%;
				margin:0 auto;
				height:530px;
			}
			.mask{
				width: 100%;
				height: 530px;
				position: absolute;
				background-color: rgba(0,0,0,0.3);
				i{
					width: 100px;
					height: 100px;
					position: absolute;
					left: 0px;
					right: 0px;
					top:0px;
					bottom: 0px;
					margin:auto;
					z-index: 3;
					cursor: pointer;
					font-size: 100px;
				}
			}
			.sliderWrap{
				width: 920px;
				height: 30px;
				background-color: #fff;
				position: absolute;
				left: 0px;
				bottom: 10px;
				padding: 1px;
				margin-top: 10px;
				.sliderBox{
					width: 100%;
					height: 30px;
					color: #16bf86;
					padding-left: 18px;
					margin-left: 0px;
					position: relative;
					i{
						cursor: pointer;
					}
					.playBox{
						float: left;
						.playBtn{
						clear: both;
						font-size: 20px;
						margin-left: 4px;
						margin-right: 4px;
						}
					}
					.progressBox{
						float: left;
					    width: 480px;
					    height: 30px;
					    margin-top: -8px;
					    padding-left: 18px;
					    .el-tooltip{
					    	vertical-align: -20px;
					    }
					}
					.videoTime{
						float: left;
						font-size: 14px;
						padding-left: 18px;
						padding-top:4px;
					},
					.changeHd{
						float: left;
						padding-left: 18px;
						.el-select{
							width: 80px;
						}
					},
					.voice{
						float: left;
						padding-left: 18px;
						position: relative;
						i{
							font-size: 20px;
							vertical-align: middle;
						}
						.voiceSlider{
							clear: both;
							width: 80px;
							position: absolute;
							left: 44px;
							top: -10px;
							z-index: 10;
							.el-slider{
								position: relative;
							}
						}
					}
					.magnify{
						float: right;
						padding-right:30px;
						i{
							font-size: 20px;
							vertical-align: middle;
						}
					}
				}
			}
	  }
	}
	.checkPic{
		height: 50px;
		line-height: 50px;
		text-align: center;
		a{
			font-size: 14px;
			color: rgb(0, 0, 204);
		    text-decoration: underline;
		}
	}
	.picBox{
		  h1{
			   font-size: 20px;
			   overflow: hidden;
			   button{
			   	   float: right;
				   font-size: 14px;
				   margin-top: 6px;
				}
		    }
			.picList{
				display: flex;
				flex-wrap: wrap;
		    	margin-top: 10px;
		    	li{
	    		display: flex;
	    		flex-direction: column;
	    		justify-content: space-between;
	    		width: 160px;
	    		height: 118px;
	    		margin-top: 10px;
	    		img{
	    			width: 100%;
	    			height: 88px;
	    		}
	    		span{
	    			line-height: 30px;
	    			font-size: 12px;
	    		}
	    	}
	    	.marginRight{
	    		margin-right: 20px;
	    	}
			}
	    }
	    .noData{
	    	width: 100%;
	    	height: 300px;
	    	line-height: 300px;
	    	text-align: center;
	    }
	    .mask{
	    	position: fixed;
	    	top: 0px;
	    	left: 0px;
	    	width: 100%;
	    	height: 100%;
	    	background-color: rgba(0,0,0,0.8);
	    	z-index: 100;
	    }
	    
}
.fade-enter-active, .fade-leave-active{
		  transition: all 0.5s ease     
	    }
		.fade-enter, .fade-leave-active{
		  opacity: 0
		}
</style>