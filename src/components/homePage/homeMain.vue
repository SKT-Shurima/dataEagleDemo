<template>
	<div class="wrap">
		<h2 style="text-align: left;">我的物联网</h2>
		<el-row class="box">
			<el-card class="box-card" v-for="(item,index) in deviceInfo" :class="{'cardLeft':index%2}" :key='item.unitId'>
			  <div slot="header" class="clearfix">
			    <strong v-text="item.name"></strong>
			    <span>
			    	<i>{{item.lastReceived | dateStyle}}&nbsp;{{item.lastReceived | timeStyle}}更新</i>
			    	<span class="online"  v-if='item.online'> 在线</span>
			    	<span class="outline" v-else> 离线</span>
			    </span>
			  </div>
			  <el-row type="flex" justify="space-around" class="cardContent">
			  	<el-col :span='6' class="collect" v-if='item.sensor'>
			  		<img :src="item.sensor.icon" class="card">
			  		<strong v-text='item.sensor.name'></strong>
			  		<button @click='check(index,0)'>查看</button>
			  	</el-col>
			  	<el-col :span='6' class="control" v-if='item.device'>
			  		<img :src="item.device.icon" class="card">
			  		<strong  v-text='item.device.name'></strong>
			  		<button @click='check(index,1)'>查看</button>
			  	</el-col>
			  	<el-col :span='6' class="monitor" v-if='item.camera'>
			  		<img :src="item.camera.icon" class="card">
			  		<strong  v-text='item.camera.name'></strong>
			  		<button  @click='check(index,2)'>查看</button>
			  	</el-col>
			  </el-row>
			</el-card>
		</el-row>
	</div>
</template>
<script type="text/javascript">
import { deviceList,newUserToken} from '../../api/api'
import { timeStyle,dateStyle} from '../../api/common'

	export default {
		data(){
			return{
			   deviceInfo: []
			}
		},
		filters: {
			dateStyle,
			timeStyle
		},
		methods:{
			check(index,type){
				sessionStorage.index = index;
				if (type === 0) {
				   this.$router.push("./data");
				}else if (type === 1) {
					this.$router.push("./control");
				}else if (type === 2) {
					this.$router.push("./video");
				}
				
			}
		},
		mounted(){
	      this.$nextTick(()=>{
	      	let routePath = this.$route.path;
	        routePath = routePath.substring(1);
	        this.$store.commit("changeState",routePath);
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
	                    	this.deviceInfo = data1.units;
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
	            	this.deviceInfo = data.units;
	            }
	          });
	      })
	    }
	}
</script>
<style lang='scss' scoped>
.wrap{
	margin-left: 10px;
	text-align: left;
	h2{
		line-height: 40px;
		font-weight: 600;
	}
	.box{
		display: flex;
		flex-wrap: wrap;
		.cardLeft{
			margin-left: 20px;
		}
		.box-card{
			width: 455px;
			margin-top: 36px;
			.clearfix{
				height: 44px;
				background-color: #fbfbfb;
				strong{
					line-height: 44px;
					font-weight: 600;
				}
				span{
					float: right;
					line-height: 44px;
					i{
						font-size: 14px;
					    color: #666;
					}
					.online,.outline{
					   margin-left: 6px;
					   margin-top: 10px;
					   
					   border-radius: 4px;
					   font-size: 14px;
					   line-height: 24px;
					   padding-left: 8px;
					   padding-right: 8px;
					}
					.online{
						border: 1px solid #16bf86;
						color: #16bf86;
					}
					.outline{
						border: 1px solid #666;
						color: #666;
					}
				}
			}
			.cardContent{
				height: 230px;
				.collect,.control,.monitor{
					height: 220px;
					display: flex;
					justify-content: space-between;
					align-items: center;
					flex-direction: column;
					padding: 24px 0px;
				}
				.collect,.control,.monitor{
					button{
						cursor: pointer;
					}
				}
				.collect{
					img{
						border: 1px solid #fb7252;
					}
					button{
						background-color: #fb7252;
					}
				}
				.control{
					img{
						border: 1px solid #16bf86;
					}
					button{
						background-color: #16bf86;
					}
				}
				.monitor{
					img{
						border: 1px solid #3daddd;
					}
					button{
						background-color: #3daddd;
					}
				}
				img{
					width: 92px;
					height: 92px;
					border-radius: 50%;
				}
				strong{
					font-size: 14px;
				}
				button{
					width: 50px;
					height: 24px;
					box-sizing: border-box;
					outline: none;
					border-radius: 4px;
					border-width: 0px;
					color: #fff;
				}
			}
		}
	}
}
	
</style>