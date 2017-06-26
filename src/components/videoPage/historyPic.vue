<template>
	<div class="wrap">
		<el-row class="back" v-if="!showBol">
	    	<button @click='goBack'>返回</button>
	    </el-row>
		<!-- <el-row class="select"> -->
		    <!-- <el-col :span="8">
		      选择单元
			 <el-select v-model="unit" placeholder="请选择" style="margin-left:10px;width: 160px;" size="small" @change='changeUnit($event)'>
			    <el-option v-for="(item,index) in units" :label="item.name" :value="index" :key='item.unitId'>
			    </el-option>
			 </el-select>
			 </el-col> -->
			<!--  <el-col :span="12">
			 	时间段
			 	<el-date-picker v-model="startDate" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptionsStart"style="width:110px;margin-left:10px;" size="small">
			    </el-date-picker>
			    <span>—</span>
			    <el-date-picker v-model="endDate" align="left" type="date" placeholder="选择日期" :picker-options="pickerOptionsEnd"style="width:110px" size="small">
			    </el-date-picker>
			    <el-button type='primary' size="small" style="width: 56px;margin-left:10px;" >查询</el-button>
			 </el-col> -->
		<!-- </el-row> -->
		<el-row class='contentList' v-if='picList.length>0'>
	        <div v-for="(items,indexs) in picList" :key='indexs'>
	        	<h1 class="title"> {{items[0].captureTime | dateStyle}}</h1>
	        	<ul class="pictureList">
	        		<li @click='checkPic(items)' v-for='(item,index) in  items' :index="index" :class="{'marginRight':(index+1)%5}" :key='index'>
	        			<img :src="item.coverUrl">
	        			<span>{{item.captureTime | dateStyle}}&nbsp;{{item.captureTime | timeStyle}}</span>
	        		</li>
	        	</ul>
	        </div>
	        <transition name='fade'>
	        	<div class="mask" v-show='maskBol' >
				<div class="maskBox">
					<dl>
						<dt>
							<span v-text='cameraInfo.cameraName'></span>
							<el-button type="text" @click='maskBol=false'>
								关闭
							</el-button>
						</dt>
						<dd>
							<div class="imgBox">
								<span class="left" @click='browserImg(-1)'><i class="iconfont icon-left"></i></span>
								<img :src="currentImg.imgSrc" width="736">
								<span class="right" @click='browserImg(1)'><i class="iconfont icon-right"></i></span>
							</div>
						    
						</dd>
					</dl>
					<ul>
						<li>当前浏览第{{currentImg.cPage}}/{{currentImg.tPage}}张</li>
						<li>抓拍时间:&nbsp;&nbsp;{{currentImg.time | dateStyle }}&nbsp;&nbsp;{{currentImg.time | timeStyle}}</li>
					</ul>
				</div>
			</div>
	        </transition>
		</el-row>
		<transition name='fade' v-else>
			<div  class="noData">
			 暂无历史图片
		    </div>
		</transition>
	</div>
</template>
<script type="text/javascript">
import { deviceList,historyPic,newUserToken} from '../../api/api'
import { timeStyle,dateStyle} from '../../api/common'
	export default {
		data(){
			return{
				unit: null,
				units: [],
				showBol: false,
				startDate: null,
				endDate: null,
				maskBol: false,
				currentPage: 0,
				currentList:[],
				currentImg: {
					imgSrc:null,
					cPage: 1,
					tPage:1,
					time:0
				},
				picList:[],
				classPicList: [],
				pickerOptionsStart: {
				  disabledDate(time) {
		            return time.getTime() > Date.now();
		          },
		          shortcuts: [{
		            text: '今天',
		            onClick(picker) {
		              picker.$emit('pick', new Date());
		            }
		          }, {
		            text: '昨天',
		            onClick(picker) {
		              const date = new Date();
		              date.setTime(date.getTime() - 3600 * 1000 * 24);
		              picker.$emit('pick', date);
		            }
		          }, {
		            text: '一周前',
		            onClick(picker) {
		              const date = new Date();
		              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
		              picker.$emit('pick', date);
		            }
		          }]
		        },
		        pickerOptionsEnd: {
				  disabledDate(time) {
		            return time.getTime() > Date.now();
		          }
		       }
			}
		},
	    props:["cameraInfo"],
	    filters: {
			timeStyle,
			dateStyle
		},
		methods: {
			goBack(){
				this.$emit('showVideo');
			},
			browserImg(mask){
				let _this = this;
				let item = _this.currentList;
				if (mask<0) {
					_this.currentImg.cPage--;
					if (_this.currentImg.cPage <1) {
						_this.currentImg.cPage = 1 ;
					}
					let index = _this.currentImg.cPage;
					_this.currentImg.imgSrc =item[index-1].picUrl;
					_this.currentImg.time = item[index-1].captureTime;
				}else{
					_this.currentImg.cPage++;
					if (_this.currentImg.cPage >_this.currentImg.tPage) {
						_this.currentImg.cPage = _this.currentImg.tPage ;
					}
					let index = _this.currentImg.cPage;
					_this.currentImg.imgSrc =item[index-1].picUrl;
					_this.currentImg.time = item[index-1].captureTime;
				}
			},
			checkPic(item){
				let _this = this ;
				_this.maskBol = true;
				_this.currentImg.imgSrc = item[0].picUrl;
				_this.currentImg.cPage = 1;
				_this.currentImg.tPage = item.length ;
				_this.currentImg.time = item[0].captureTime;
				_this.currentList = item; 
			},
			initPic(){
				let list = this.picList;
				let oldTime = new Date(new Date(list[0].captureTime).setHours(0,0,0,0));
				oldTime  = oldTime.getTime();
				let j = 0;
				let dbArr = [];
				let  arr ;
				for(let i = 0 ;i < list.length ;i++){
					let time = list[i].captureTime;
					let timer = new Date(new Date(time).setHours(0,0,0,0));
					timer = timer.getTime();
					if(i==j){
						if (i!==0) {
							dbArr.push(arr);
						}
						arr =[];
					};
					if (timer == oldTime) {
						arr.push(list[i]);
					}else{
						oldTime = timer;
						j=i;
						i--;
					}
					if (i===list.length-1) {
						dbArr.push(arr);
					}
				}
				this.picList = dbArr;
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
	            }
	          });
	        let params = {
	        	cameraId: this.cameraInfo.cameraId,
	        	page: this.currentPage
	        }
	        historyPic(params).then((res)=>{
	          let { msg, code, data } = res;
	            if(code !== 0) {
	              if(code === -1001 || code === -1010 ){
	                 newUserToken();
	                 historyPic(params).then(res1=>{
	                 	let msg1 = res1.msg ;
	                    let code1 = res1.code ;
	                    let data1 = res1.data ;
	                    if (code1 !== 0) {
	                    	this.$router.push({path: '/entry'});
	                    }else{
	                    	this.picList = data1.screenshots;
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
	            	this.picList = data.screenshots;
	            	this.initPic();
	            }
	          })
	      })
		}
	}
</script>
<style lang='scss' scoped>
@import url("./css/iconfont.css");
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
	.select {
		height: 40px;
	}
	.contentList{
		margin-top: 10px;
		overflow: hidden;
		.title {
			height:  40px;
			line-height: 40px;
			font-weight: 500;
			font-size: 20px;
	    }
	    .pictureList{
	    	display: flex;
	    	flex-wrap: wrap;
	    	margin-top: 10px;
	    	li{
	    		display: flex;
	    		flex-direction: column;
	    		justify-content: space-between;
	    		align-items: center;
	    		width: 160px;
	    		img{
	    			width: 100%;
	    		}
	    		span{
	    			text-align: center;
	    			line-height: 30px;
	    			font-size: 12px;
	    		}
	    	}
	    	.marginRight{
	    		margin-right: 30px;
	    	}
	    }
	    .mask{
	    	position: fixed;
	    	top: 0px;
	    	left: 0px;
	    	width: 100%;
	    	height: 100%;
	    	background-color: rgba(0,0,0,0.8);
	    	z-index: 10;
	    	.maskBox{
	    		width: 1080px;
	    		height: 680px;
	    		text-align: center;
	    		position: absolute;
	    		left: 0px;
	    		right: 0px;
	    		top: 0px;
	    		bottom: 0px;
	    		margin: auto;
	    		z-index: 20;
	    		dl{
	    			width: 984px;
	    			margin: 0 auto;
	    			overflow: hidden;
	    			dt{
	    				position: relative;
	    				display: inline-block;
	    				width: 736px;
	    				height: 56px;
	    				color: #fff;
	    				span{
	    					line-height: 56px;
	    					font-size: 20px;
	    				}
	    				button{
	    					position: absolute;
	    					right: 0px;
	    					line-height: 44px;
	    					color: #fff;
	    				}
	    				button:hover{
	    					color: #16bf86;
	    				}
	    			}
	    			dd{
	    				.imgBox{
	    					width: 736px;
	    					margin: 0 auto;
	    					position: relative;
	    					.left,.right{
		    					display: inline-block;
		    					width: 30px;
		    					height: 54px;
		    					line-height: 54px;
		    					font-size: 36px;
		    					position: absolute;
								top: 0px;
								bottom: 0px;
								margin: auto;
								border-radius: 5px;
		    					color: #fff;
		    					background-color: rgba(0,0,0,0.6);
		    					i{
		    						font-size: 30px;
		    						vertical-align: super;
		    					}
		    				}
		    				.left{
		    					left: 16px;
		    				}
		    				.right{
		    					right: 16px;
		    				}

	    				}
	    				
	    			}
	    		}
	    		ul{
	    			width: 984px;
	    			margin: 20px auto;
	    			li{
	    				width: 736px;
	    				margin: 0 auto;
	    				color: #fff;
	    				line-height: 36px;
	    			}
	    		}
	    	}
	    }
	    .fade-enter-active, .fade-leave-active{
		  transition: all 0.5s ease     
	    }
		.fade-enter, .fade-leave-active{
		  opacity: 0
		}
	}
}
</style>