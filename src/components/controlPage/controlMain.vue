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
		<el-row v-if='unit>-1&&unit!=null' v-loading='loading'>
			<div class="title">
			<strong>在线操作</strong>
			<el-button type="primary" @click='getUnitData(units[unit].unitId)' size="small">刷新状态</el-button>
			<span>状态更新时间:&nbsp;<em v-if='deviceStatus.updateTime'>{{deviceStatus.updateTime | timeTrans}}</em><i v-else>未知</i></span>
			</div>
			<div class="operationOnline">
				<dl v-for='(item,index) in deviceStatus.devices' :class="{'marginRight': !index%5}" v-if='deviceNum>0' >
					<dt>
					<i v-text='item.deviceName'></i><img :src="item.icon" height="210" width="210">
					<span v-if='!item.status'>状态:关</span>
					<span v-else>状态:开</span>
					</dt>
					<dd v-if='item.switchType == 1'>
						<el-button size='small' :class="{'bg-on':!item.status,'bg-run':item.status}" type='text' @click='statusFn(item.deviceId,1)' :disabled="item.status!=0">开</el-button>
						<el-button size='small' :class="{'bg-off':item.status,'bg-run':!item.status}" type='text'  @click='statusFn(item.deviceId,0)' :disabled="item.status==0">关</el-button>
					</dd>
					<dd v-else>
						<el-button size='small' :class="{'bg-on':item.status<1,'bg-run':item.status>0}" type='text' @click='statusFn(item.deviceId)' :disabled='item.status>0' v-text='item.switchName[2]'></el-button>
						<el-button size='small' :class="{'bg-off':item.status!=0,'bg-run':item.status==0}" type='text' @click='statusFn(item.deviceId)' :disabled="item.status==0" style='width: 30px' v-text='item.switchName[1]'></el-button>
						<el-button size='small' :class="{'bg-on':item.status>-1,'bg-run': item.status<0}" type='text' @click='statusFn(item.deviceId)' :disabled="item.status<0" v-text='item.switchName[0]'></el-button>
					</dd>
				</dl>
				<div v-if='deviceNum==0' >
					暂无可操作的设备
				</div>
			</div>
		</el-row>
		<div v-if='unit>-1&&unit!=null'>
			<el-row class="records" >
		     <div class="title"> <strong v-text='operaData.unitName'></strong>&nbsp;<strong>操作记录</strong></div>
		     <div v-if='operaData.length>0'>
		     	<table cellpadding="10px" cellspacing="0" class="table">
					<tr class="bg-light">
						<th>操作人</th>
						<th>操作内容</th>
						<th>操作时间</th>
					</tr>
					<tr v-for='item in operaData.logs'>
						<td v-text='item.name'></td>
						<td v-text='item.opration'></td>
						<td>{{item.time | dateStyle}}&nbsp;{{item.time | timeStyle}}</td>
					</tr>
				</table>
				<el-row class="pagination">
					<el-col :span="4" :offset='20'>
						<span>第{{currentPage}}/{{totalPage}}页</span>
						<el-button type="text" size="mini" :disabled="currentPage<=1" @click="pageChange(-1)">上一页</el-button>
						<el-button type="text" size="mini" :disabled="currentPage>=totalPage" @click="pageChange(1)">下一页</el-button>
					</el-col>
				</el-row>
		     </div>
		     <transition name='fade' v-else>
				<div class="noData">
				该单元暂无操作记录，请重新选择
			    </div>
			</transition>
			 
		</el-row> 
		
		</div>
		
	</div>
</template>
<script type="text/javascript">
import { deviceList,unitStatus,operDeviceStatus,operaRecords,newUserToken} from '../../api/api'
import { timeStyle,dateStyle,timeTrans} from '../../api/common'
	export default {
		data(){
			return{
				unit: 0,
				units: [],
				deviceStatus: [],
				deviceNum: 0,
				operaData: [],
			    currentPage: 1,
			    totalPage: null,
			    showBol: true,
			    loading: false
			}
		},
		filters: {
			timeStyle,
			dateStyle,
			timeTrans
		},
		methods: {
			getUnitData(para){
				unitStatus(para).then((res)=>{
					let { msg, code, data } = res;
		            if(code !== 0) {
		            	if (code === -1001 || code === -1010 ) {
		            		newUserToken();
		            		unitStatus(para).then((res1)=>{
		            			let msg1 = res1.msg ;
		            			let code1 = res1.code ;
		            			let data1 = res1.data ;
		            			if (code1 !== 0) {
		            				this.$router.push({path: '/entry'});
		            			}else{
		            				this.deviceStatus = data1;
		            				this.deviceNum = this.deviceStatus.devices.length;
		            			}
		            		})
		            	}else if (code !== -1000){
		            		this.$notify({
			                    title: "请求失败",
			                    message: msg,
			                    type: 'error'
			                  });
		            	}
		            }else{
		            	this.deviceStatus = data;
		            	this.deviceNum = this.deviceStatus.devices.length;
		            }
				});
				// 记录
				let params = {
					unitId: para,
					pageSize: 20,
					page: 0
				}
				operaRecords(params).then((res2)=>{
					let  msg2 = res2.msg ;
					let  code2 = res2.code ;
					let  data2 = res2.data ;
		            if(code2 !== 0) {
		            	if (code2 == -1001|| code2 === -1010) {
		            		newUserToken();
		            		operaRecords(params).then((res3)=>{
		            			let msg3 = res3.msg;
		            			let code3 = res3.code;
		            			let data3 = res3.data;
		            			if (code3 !== 0) {
		            				this.$router.push({path: '/entry'});
		            			}else{
		            				this.operaData = data3;
					            	this.totalPage = this.operaData.totalPage;
					            	if(this.totalPage == 0){
					            		this.currentPage =0;
					            	}
		            			}
		            		})
		            	}else if(code2 !== -1000){
		            		this.$notify({
			                    title: "请求失败",
			                    message: msg2,
			                    type: 'error'
			                  });
		            	}
		            }else{
		            	this.operaData = data2;
		            	this.totalPage = this.operaData.totalPage;
		            	if(this.totalPage == 0){
		            		this.currentPage =0;
		            	}
		            }
				});
			},
			changeUnit(ev) {
				let _this = this ;
				// 设备状态
				let para =  _this.units[ev].unitId;
				this.getUnitData(para);
				
			},
			// 设备状态
			statusFn(deviceId,status){
				let _this = this; 
				_this.loading = true ;
				let para = {
					deviceId: deviceId,
					status: status
				} ;
				operDeviceStatus(para).then((res)=>{
					let { msg, code, data } = res;
					_this.loading = false
		            if(code !== 0) {
		               if (code === -1001 || code === -1010) {
		               	newUserToken();
		               	operDeviceStatus(para).then(res1 =>{
		               		let msg1 = res1.msg ;
                            let code1 = res1.code ;
                            let data1 = res1.data ;
                            if (code1 !== 0) {
                            	this.$router.push({path: '/entry'});
                            }else{
                            	this.deviceStatus = data1;
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
		            	this.deviceStatus = data;
		            }
				})
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
	                    	this.units = data1.units;
	                    	if(sessionStorage.index){
				        	let index = sessionStorage.index - 0;
				        	this.changeUnit(index);
				        	this.unit = index;
				        	sessionStorage.removeItem("index");
					        }else{
					        	this.changeUnit(0);
					        }
					        if(sessionStorage.unitId){
					        	let para = sessionStorage.unitId;
					        	this.getUnitData(para);
					        	sessionStorage.removeItem("unitId");
					        };
					        
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
			        if(sessionStorage.unitId){
			        	let para = sessionStorage.unitId;
			        	this.getUnitData(para);
			        	sessionStorage.removeItem("unitId");
			        };
			        
			     }
	          });

	      })
		}
	}
</script>
<style lang='scss' scoped>
.wrap{
	margin-left: 10px;
	margin-bottom: 300px;
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
	.title {
		height:  40px;
		line-height: 40px;
		overflow: hidden;
		strong {
           font-size: 24px;
		}
		span{
			float: right;
			color: #666;
		}
		button{
			float: right;
			margin-top: 6px;
			margin-left: 10px;
		}
	}
	.operationOnline {
		display: flex;
		flex-wrap: wrap;
		margin-top: 20px;
		.marginRight{
			margin-right: 50px;
		}
		dl{
			width: 148px;
			height: 200px;
			border: 1px solid #ddd;
			dt{
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				align-items: center;
				height: 80%;
				padding-top: 16px;
				padding-bottom: 10px;
				font-size: 14px;
				img {
				   width: 100px;
				   height: 100px;
				}
				span{
					color: #666;
				}
			}
			dd{
				display: flex;
				justify-content: space-around;
				align-items: center;
				border-top: 1px solid #ddd;
				height: 20%;
				padding-left: 16px;
				padding-right: 16px;
				button {
					width: 44px;
					padding: 5px 7px;
					color: #fff;
				}
				.bg-on{
					background-color: #16bf86;
				}
				.bg-run{
					background-color: #cdcdcd;
				}
				.bg-off{
					background-color: #ff6565;
				}
			}
		}
	}
	.records{
		margin-top: 48px;
		.table {
              width: 100%;
              margin-top: 18px;
              border-collapse:collapse;
              text-align: center;
              th,td{
              	font-size: 14px;
              	border:1px solid #dfe6ec;
              }
              .bg-light{
              	background-color: #eef6f5;
              }
		}
		.noData{
	    	width: 100%;
	    	height: 300px;
	    	line-height: 300px;
	    	text-align: center;
	    }
	}
	.pagination{
			margin-top: 24px;
			span{
				font-size: 14px;
			}
		}
}
</style>