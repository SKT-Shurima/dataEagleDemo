<template>
	<div class="wrap">
	    <el-row class="back">
	    	<button @click='back'>返回</button>
	    </el-row>
		<el-row class="select">
		    <el-col :span="8">
		      选择传感器
			 <el-select v-model="unit" placeholder="请选择" style="margin-left:10px;width: 160px;" size="small" @change='changeUnit($event)'>
			    <el-option v-for="(item,index) in sensorsList.sensorsList" :label="item.sensorName" :value="index" :key='item.sensorId'>
			    </el-option>
			 </el-select>
			 </el-col>
			 <el-col :span="12">
			 	时间段
			 	<el-date-picker v-model="start" align="right" type="date" :editable='false' placeholder="选择日期" :picker-options="pickerOptionsStart" style="width:130px;margin-left:10px;cursor:pointer;" size="small" @change='transTime'>
			    </el-date-picker>
			    <span>—</span>
			    <el-date-picker v-model="end" align="left" type="date" placeholder="选择日期"  :editable='false' :picker-options="pickerOptionsEnd" style="width:130px;cursor:pointer;" size="small" @change='transTime'>
			    </el-date-picker>
			    <el-button type='primary' size="small" style="width: 56px;margin-left:10px;" @click='query'>查询</el-button>
			 </el-col>
		</el-row>
		<div v-if='sensorData'>
			<el-row>
		     <div class="title" > <strong>{{sensorsList.name}}{{sensorsList.sensorsList[sensorsList.currentUnit].sensorName}}历史数据</strong><el-button type="text" @click='exportExcel'>导出Excel</el-button></div>
			 <table cellpadding="10px" cellspacing="0" class="table" id="tableExcel">
				<tr class="bg-light">
					<th>传感器</th>
					<th>更新时间</th>
					<th>数值</th>
					<th>单位</th>
				</tr>
				<tr v-for='(item,index) in  sensorData.values' :index='index' class="sensorsList" >
					<td v-text='sensorData.sensorName'></td>
					<td>{{item.time | dateStyle}}&nbsp;{{item.time | timeStyle}}</td>
					<td v-text='item.value'></td>
					<td v-text='sensorData.valueUnit'></td>
				</tr>
			</table>
			  <a id="dlink" style="display: none;"></a>
		</el-row>
		<el-row class="pagination">
			<el-pagination
		      @size-change="handleSizeChange"
		      @current-change="handleCurrentChange"
		      :current-page.sync="currentPage"
		      :page-sizes='[20,30,40,50]'
		      :page-size="pageSize"
		      layout="sizes,prev, pager, next, jumper"
		      :total="sensorData.total">
		    </el-pagination>
		</el-row>
		</div>
		<transition name='fade' v-else>
			<div class="noData">
			该单元暂无数据，请重新选择
		    </div>
		</transition>
		
	</div>
</template>
<script type="text/javascript">
    import { appointedData,downLoad,newUserToken} from '../../api/api'
    import { timeStyle,dateStyle,getCookie} from '../../api/common'
	export default {
		data(){
			return{
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
		       },
		        start: new Date().getTime() - 30*24*3600*1000,
				end: new Date().getTime(),
			    unit: null,
			    currentPage: 1,
			    pageSize: 20,
			    sensorData: null
			}
		},
		props: {
			"sensorsList": {
				type: Object,
				required: true
			}
		},
		filters: {
			dateStyle,
			timeStyle
		},
		methods: {
			back(){
				this.$emit('backSomeData',true);
			},
			transTime(){
				let _this = this ;
				_this.start = _this.start? typeof _this.start === 'object' ? _this.start.getTime() : _this.start :''; 
				_this.end = _this.end? typeof _this.end === 'object' ? _this.end.getTime() : _this.end:""; 
			},
			handleSizeChange(val) {
				let _this  = this;
				_this.pageSize = val ;
				let sensorId = _this.sensorsList.sensorsList[_this.sensorsList.currentUnit].sensorId ;
				_this.appointedDataFn(sensorId);
		    },
	        handleCurrentChange(val) {
		        let _this = this ;
		        _this.currentPage = val;
		        let sensorId = _this.sensorsList.sensorsList[_this.sensorsList.currentUnit].sensorId ;
				_this.appointedDataFn(sensorId);
		    },
			appointedDataFn(sensorId){
				let _this = this ;
				let params = {
					sensorId: sensorId,
					start: _this.start,
					end: _this.end,
					page: _this.currentPage-1,
					pageSize: _this.pageSize
				}
				appointedData(params).then((res)=>{
		          let { msg, code, data } = res;
		            if(code !== 0) {
		              if(code === -1001 || code === -1010 ){
		                 newUserToken();
		                 appointedData().then(res1=>{
			            	let code1 = res1.code ;
			            	let data1 = res1.data ;
			            	if (code1 !==0 ) {
			            		this.$router.push({path: '/entry'});
			            	}else{
			            		this.sensorData = data; ;
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
		            	this.sensorData = data;
		            }
		          });
			},
			changeUnit(index){
				let _this = this ;
				_this.sensorsList.currentUnit  = index; 
				let sensorId = _this.sensorsList.sensorsList[_this.sensorsList.currentUnit].sensorId;
				_this.appointedDataFn(sensorId);
				
			},
			query(){
				let _this = this ;
				let sensorId = _this.sensorsList.sensorsList[_this.sensorsList.currentUnit].sensorId;
				_this.appointedDataFn(sensorId);
			},
			exportExcel(){
				let _this = this ;
				let params = {
					sensorId: _this.sensorsList.sensorsList[_this.sensorsList.currentUnit].sensorId,
					user_token: getCookie('user_token'),
					start:_this.start,
					end:_this.end
				}
				window.location.href = `http://iot.chnagiot.com:8099/data/sensor/${params.sensorId}/template.xls?sensorId=${params.sensorId}&token=${params.user_token}&start=${params.start}&end=${params.end}`
			}
		},
		mounted(){
			this.$nextTick(()=>{
				let sensorId = this.sensorsList.sensorsList[this.sensorsList.currentUnit].sensorId;
				this.unit = this.sensorsList.currentUnit;
			})
		}
	}
</script>
<style lang='scss' scoped>
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
	.title {
		height:  40px;
		overflow: hidden;
		strong {
           font-size: 24px;
           line-height: 40px;
		}
		button{
			float: right;
			line-height: 40px;
		}
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
              }
              .sensorsList:hover{
              	background-color: #eef6f5;
              }
		}
		.pagination{
			overflow: hidden;
			.el-pagination{
				float: right;
				margin-top: 10px;
			}
		}
	.noData{
	    	width: 100%;
	    	height: 300px;
	    	line-height: 300px;
	    	text-align: center;
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
}
</style>