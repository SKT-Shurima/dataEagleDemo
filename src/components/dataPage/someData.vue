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
		<div v-if="unitBol">
			<el-row v-if='sensorsList.length>0'>
			<table cellpadding="10px" cellspacing="0" class="table">
				<tr class="bg-light">
					<th>传感器</th>
					<th>更新时间</th>
					<th>数值</th>
					<th>单位</th>
					<th>详情</th>
				</tr>
				<tr  @click='detailData(item,index)' v-for='(item,index) in  sensorsList' :index='index' class="sensorsList" :class='{"clickMe":index==currentUnit}'>
					<td><span class='clickMeIcon' v-show="index==currentUnit"></span>{{item.sensorName}}</td>
					<td>{{item.updateTime | dateStyle}}&nbsp;{{item.updateTime | timeStyle}}</td>
					<td v-text='item.value'></td>
					<td v-text='item.unit'></td>
					<td><el-button type="text" size="mini"  @click.stop='moreData(index)'>更多数据</el-button></td>
				</tr>
			</table>
		</el-row>
		<transition name='fade' v-else>
			<div class="noData">
			该单元暂无数据，请重新选择
		    </div>
		</transition>
		<transition name="fade">
			<div v-if='sensorsList.length>0'>
				<temperature :appointData='appointData'></temperature>
			</div>
		</transition>
		</div>
	</div>
</template>
<script type="text/javascript">
    import { deviceList,dataSensors,appointedData,newUserToken } from '../../api/api'
    import { timeStyle,dateStyle} from '../../api/common'
    import temperature from "./temperature"
	export default {
		data(){
			return{
			   unitBol: false,
			   unit: 0,
			   currentUnit: null,
		       units: [],
		       sensorsList: [],
		       appointData: [],
		       start: null,
		       end: null
			}
		},
		filters:{
			dateStyle,
			timeStyle
		},
		components:{
			temperature
		},
		methods: {
			changeUnit(index){
				let _this = this ;
				let para = {
					unitId: _this.units[index].unitId
				} 
				dataSensors(para).then((res)=>{
					let { msg, code, data } = res;
		            if(code !== 0) {
		            	if (code === -1001 || code === -1010) {
		            		newUserToken();
		            		dataSensors(para).then(res1=>{
		            			let code1 = res1.code ;
		            			let data1 = res1.data;
		            			if (code1 !==0) {
		            				this.$router.push({path: '/entry'});
		            			}else{
		            				this.sensorsList = data1.sensors;
					            	this.unitBol = true;
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
		            	this.sensorsList = data.sensors;
		            	this.unitBol = true;
		            	let item = this.sensorsList[0];
		            	if (item) {
		            		this.detailData(item,0);
		            	}
		            }
				});
			},
			detailData(item,index){
				let _this = this ;
				let now = new Date(); 
				_this.end = now.getTime();
				_this.start = now - 8*3600*1000;
				let para = {
					sensorId: item.sensorId,
					start: _this.start.toString(),
					end: _this.end.toString(),
					page: 0,
					pageSize: 20
				} 
				appointedData(para).then((res)=>{
					let { msg, code, data } = res;
		            if(code !== 0) {
		            	if (code === -1001 || code === -1010) {
		            		newUserToken();
		            		appointedData(para).then((res)=>{
		            			let msg1 = res1.msg ;
				            	let code1 = res1.code ;
				            	let data1 = res1.data ;
				            	if (code1 !==0 ) {
				            		this.$router.push({path: '/entry'});
				            	}else{
				            		this.appointData = data;
		            				_this.currentUnit = index;
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
		            	this.appointData = data;
		            	_this.currentUnit = index;
		            	this.$store.commit("changeAppointed",this.appointData);
		            }
				});
			},
			moreData(index){
				let _this = this ;
				let moreData = {
					sensorsList: _this.sensorsList,
					currentUnit: index,
					name: _this.units[_this.unit].name
				}
				this.$emit('getMore',moreData);
			}
		},
		mounted(){
			this.$nextTick(()=>{
			deviceList().then((res)=>{
	          let { msg, code, data } = res;
	            if(code !== 0) {
	              if(code === -1001 || code === -1010 ){
	                 newUserToken();
	                 deviceList().then(res1=>{
	                 	let msg1 = res1.msg ;
		            	let code1 = res1.code ;
		            	let data1 = res1.data ;
		            	if (code1 !==0 ) {
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
					        let item = this.sensorsList[0];
			            	if (item) {
			            		this.detailData(item,0)
			            	}
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
	            	this.units = data.units;
	            	if(sessionStorage.index){
			        	let index = sessionStorage.index - 0;
			        	this.changeUnit(index);
			        	this.unit = index;
			        	sessionStorage.removeItem("index");
			        }else{
			        	this.changeUnit(0);
			        }
	            	let item = this.sensorsList[0];
	            	if (item) {
	            		this.detailData(item,0)
	            	}
	            }
	          });
			})
		}
	}
</script>
<style lang='scss' scoped>
.wrap{
	.select {
		height: 40px;
	}
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
              .sensorsList{
              	cursor: pointer;
              	.clickMeIcon{
              		display: inline-block;
              		width: 10px;
              		height: 10px;
              		float: left;
              		background-color: #16bf86;
              	}
              }
              .sensorsList:hover{
              	background-color: #eef6f5;
              }
              .clickMe{
              	color: #16bf86;
              }
		}
		 .noData{
	    	width: 100%;
	    	height: 300px;
	    	line-height: 300px;
	    	text-align: center;
	    }
}
.fade-enter-active, .fade-leave-active{
		  transition: all 0.5s ease ;    
	    }
		.fade-enter, {
		  opacity: 1;
		}
		.fade-leave-active{
		  opacity: 0;
		  position: absolute;
		  z-index: -100;
		}
</style>