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
		<el-row class="topNav">
		   <el-col :span='2' :class="{'nav-is-click':nav==0}">
		   	<span @click='farm(0,1)'>播种</span>
		   </el-col>
		   <el-col :span='2' :class="{'nav-is-click':nav==1}">
		   	<span @click='farm(1,1)'>施撒</span>
		   </el-col>
		   <el-col :span='2' :class="{'nav-is-click':nav==2}">
		   	<span @click='farm(2,1)'>农事</span>
		   </el-col>
		   <el-col :span='2' :class="{'nav-is-click':nav==3}">
		   	<span @click='farm(3,1)' >采摘</span>
		   </el-col>
		   <el-col :span='2' :offset='13'>
		   	 <el-button type='primary' size="small" @click='add'>
		   	 	<i class="el-icon-plus" style="margin-right: 2px;"></i>
		   	 	添加操作
		   	 </el-button>
		   </el-col>
		</el-row>
		<transition v-if='records.length>0'>
		<el-row class='tableList' >
			<table cellpadding="10px" cellspacing="0" class="table" v-loading='loading'>
				<tr class="bg-light">
					<th>时间</th>
					<th>操作人</th>
					<th>操作</th>
					<th>管理</th>
				</tr>
				<tr v-for='(item,index) in records' class="recordsList" :key='index'>
				    <td>{{item.time|dateStyle }}&nbsp;{{item.time|timeStyle}}</td>
				    <td v-text='item.operater'></td>
				    <td>为<span style='color:#3da8f5;cursor: pointer;' @click='jumpData(item)'>{{item.unit.unitName}}</span >{{item.description}}</td>
				    <td><el-button class="remove" @click='remove(item)' type='text' size='small'>
				    	删除记录
				    </el-button></td>
				</tr>
			</table>
			<el-row class="pagination">
				<el-pagination
			      @size-change="handleSizeChange"
			      @current-change="handleCurrentChange"
			      :current-page.sync="currentPage"
			      :page-sizes='[20,30,40,50]'
			      :page-size="pageSize"
			      layout="sizes,prev, pager, next, jumper"
			      :total="total">
			    </el-pagination>
			</el-row>
		</el-row>
		</transition>
		<transition name='fade' v-else>
			<div class="noData">
			该单元暂无数据，请重新选择
		    </div>
		</transition>
		<el-row>
	        <transition name='fade'>
	        	<div class="mask" v-show='maskBol'>
					<div class="maskBox">
						<h1 class="maskTitle">
							添加记录
							<i class="el-icon-circle-close" @click='maskBol=false'></i>
						</h1>
						<div class="maskInfo">
							<el-row>
								<el-col :span='8'>时间</el-col>
								<el-col :span='16'>
									<el-date-picker
								      v-model="date"
								      align="right"
								      type="date"
								      :editable='false'
								      placeholder="选择日期"
								      :picker-options="pickerOptions" class='date' size='small'>
								    </el-date-picker>
								    <el-time-picker
									    v-model="time"
									    :editable='false'
									    placeholder="任意时间点" class='time' size='small'>
									  </el-time-picker>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span='8'>作业人</el-col>
								<el-col :span='16'>
								<el-input v-model="workMan" placeholder="请输入作业人" size="small"></el-input>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span='8'>单元</el-col>
								<el-col :span='16'>
									<el-select v-model="addUnit" placeholder="请选择" style="width: 100%" size="small" @change='getId($event)'>
								    <el-option v-for="(item,index) in addUnits" :label="item.name" :value="index" :key='item.unitId'>
								    </el-option>
							 		</el-select>
								</el-col>
							</el-row>
							<el-row class='textarea'>
								<el-col :span='8'>作业内容</el-col>
								<el-col :span='16'>
								<el-input
								  type="textarea"
								  :rows="2"
								  placeholder="请输入内容"
								  v-model="textarea"
								  resize='none'>
								</el-input>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span='16' :offset='8'>
								 <el-button type='primary' size="small" @click='save'>添加</el-button>
								  <el-button  type='primary' class='esc' size="small"  @click='maskBol=false'>取消</el-button>
								</el-col>
							</el-row>
						</div>
					</div>
				</div>
	        </transition>
		</el-row>
	</div>
</template>
<script type="text/javascript">
import { deviceList,seed,splash,other,pick,saveSeed,saveSplash,saveOther,savePick,deleteInfo,newUserToken } from '../../api/api'
import { timeStyle,dateStyle} from '../../api/common'
	export default {
		data(){
			return{
				unit: 0,
				units: [{name:'',unitId:''}],
				unitId: '',
				maskBol: false,
				nav: 1,
				loading: false,
				date: null,
				time: null,
				dateTime: null,
				pickerOptions: {
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
		       	addUnit: 0,
		       	addUnits:[{name:'',unitId:''}],
		       	addUnitId: null,
		       	workMan: null,
			   	textarea: null,
		       	records: [],
		      	currentPage: 1,
			    pageSize: 20,
			    total: 0,
			    page: [
		       		{page: 1},
		       		{page: 1},
		       		{page: 1},
		       		{page: 1}
			    ]
			}
		},
		filters: {
			timeStyle,
			dateStyle
		},
		methods: {
			// 选择单元
			changeUnit($event){
				this.unitId = this.units[$event].unitId;
				this.farm(this.nav,1);
			},
			// 农事导航
			farm(mask,page){
				let _this =this ;
				_this.nav = mask;
				_this.page[mask-0].page = page;
		        _this.currentPage = _this.page[mask-0].page;
				 switch (mask){
		          	case 0:
		          	mask = seed;
		          		break;
		          	case 1:
		          	mask = splash;
		          		break;
		          	case 2:
		          	mask = other;
		          		break;
		          	case 3:
		          	mask = pick;
		          		break;
		          	default:
		          		break;
		          }
		          let params = {
		          	unitId : _this.unitId,
					page: _this.currentPage-1,
					pageSize: _this.pageSize
				}
				mask(params).then((res)=>{
					let { msg, code, data } = res;
		            if(code !== 0) {
		               if (code === -1001 || code === -1010) {
		               		newUserToken();
		               		mask(params).then(res1=>{
		               			let msg1 = res1.msg ;
		            			let code1 = res1.code ;
		            			let data1 = res1.data ;
		            			if (code1 !==0) {
		            				this.$router.push({path: '/entry'});
		            			}else{
		            				this.records = data1.records;
					            	this.totalPage = data1.totalPage ;
					            	if (data1.totalPage < 1) {
					            		this.currentPage = 0;
					            	}
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
		            	this.records = data.records;
		            	this.total = data.total ;
		            }
				});
			},
			handleSizeChange(val) {
				let _this  = this;
				_this.pageSize = val ;
				_this.farm(_this.nav,1);
		    },
	        handleCurrentChange(val) {
		        let _this = this ;
		        _this.currentPage = val;
		        _this.farm(_this.nav,_this.currentPage);
		    },
			timeTrans(){
				  let _this = this;
				  let date = dateStyle(_this.date);
		          let time = timeStyle(_this.time);
		          const dateStyle  = time =>{
				    let newDate = time;
				    let {y,m,d}={y:newDate.getFullYear(),m:newDate.getMonth()+1,d:newDate.getDate()};
				    m = trans(m);
				    d = trans(d);
				    return y +'-' + m + "-" + d ; 
				  };
				 const trans = val =>{
				      		if (val < 10) {
				      			val = "0" + val ;
				      		}
				      		return val ;
				      };
				 const timeStyle  = time =>{
				    let newDate = time;
				    let {h,m,s}={h:newDate.getHours(),m:newDate.getMinutes(),s:newDate.getSeconds()};
				    h = trans(h);
				    m = trans(m);
				    s = trans(s);
				    return h +':' + m + ":" + s ;
				};
				  _this.dateTime = date+" "+time ;
			},
			getId($event){
				this.addUnitId= this.addUnits[$event].unitId;
			},
			add(){
				let _this = this;
				_this.maskBol = true;
				_this.date = null;
				_this.time = null;
				_this.workMan = null;
				_this.addUnit = 0 ;
				_this.textarea = null;
			},
			// 保存操作记录
			save(){
				let _this = this;
				let mask;
				 switch (_this.nav){
		          	case 0:
		          	mask = saveSeed;
		          		break;
		          	case 1:
		          	mask = saveSplash;
		          		break;
		          	case 2:
		          	mask = saveOther;
		          		break;
		          	case 3:
		          	mask = savePick;
		          		break;
		          	default:
		          		break;
		          }
		          _this.timeTrans();
		          if(_this.workMan&&_this.date&&_this.time&&_this.addUnitId&&_this.textarea){
			          	let params = {
				          	operater: _this.workMan,
						    unitId: _this.addUnitId,
						    description: _this.textarea,
						    time: _this.dateTime
				        }
				        mask(params).then((res)=>{
							let { msg, code, data } = res;
				            if(code !== 0) {
				                if (code === -1001 || code === -1010) {
				              	newUserToken();
					              	mask(params).then(res1=>{
					              		let msg1 = res1.msg ;
					            	    let code1 = res1.code ;
					            		let data1 = res1.data ;
					            		if (code1 !== 0) {
					            			this.$router.push({path: '/entry'});
					            		}else{
					            			this.$alert('操作记录保存成功', '提示', {
									         confirmButtonText: '确定',
									         callback: action => {
									           this.maskBol = false;
									           this.farm(_this.nav,_this.currentPage);
									         }
									       });
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
				                this.$alert('操作记录保存成功', '提示', {
							        confirmButtonText: '确定',
							        callback: action => {
							           this.maskBol = false;
							           this.farm(_this.nav,_this.currentPage);
							        }
						       	});
				            }
						});
		          }else{
		          	this.$alert('请完善信息', '提示', {
				        confirmButtonText: '确定',
			        });
		          }
		          
			},
			//  删除记录
			remove(item){
				let _this = this;
				 _this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			          type: 'warning'
			        }).then(() => {
			        	let params = {
							recordId: item.id
						}
			            deleteInfo(params).then((res)=>{
						let { msg, code, data } = res;
					          if(code !== 0) {
					            if (code === -1001 || code === -1010) {
					            	newUserToken();
					            	deleteInfo(params).then(res1=>{
					            		let msg1 = res1.msg ;
				            			let code1 = res1.code ;
				            			let data1 = res1.data ;
				            			if (code1 !== 0) {
				            				this.$router.push({path: '/entry'});
				            			}else{
				            				this.$message({
									            type: 'success',
									            message: '删除成功!'
									          });
								            this.farm(_this.nav,1)
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
					             this.$message({
						            type: 'success',
						            message: '删除成功!'
						          });
					             this.farm(_this.nav,1)
					          }
						});
			        }).catch(() => {
			          this.$message({
			            type: 'info',
			            message: '已取消删除'
			          });          
			        });
			},
			jumpData(item){
				let unitId = item.unit.unitId;
				sessionStorage.unitId = unitId;
				this.$router.push("./control");
			}
		},
		mounted() {
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
				            	this.addUnits = data1.units;
				            	this.unitId = this.units[0].unitId ;
				            	this.farm(0,1);
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
		            	this.addUnits = data.units;
		            	this.unitId = this.units[0].unitId ;
		            	this.farm(0,1);
		            }
	          	})
			})
		}
	}
</script>
<style lang='scss' scoped>
.wrap{
	margin-left: 10px;
	.select{
		height: 40px;
	}
	.topNav{
		font-weight: 500;
		font-size: 18px;
		line-height: 36px;
		text-align: center;
		cursor: pointer;
		.nav-is-click{
			color: #16bf86;
			border-bottom: 4px solid #16bf86;
		}
	}
	.tableList{
		margin-top: 24px;
		.table{
              width: 100%;
              border-collapse:collapse;
              text-align: center;
              th{
              	font-size: 14px;
              }
              th,td{
              	font-size: 14px;
              	border:1px solid #ddd;
              }
              .bg-light{
              	background-color: #eef6f5;
              }
              .remove{
              	color: #f46662;
              }
              .recordsList:hover{
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
	    	z-index: 10;
	    	.maskBox{
	    		width: 450px;
	    		height: 400px;
	    		text-align: center;
	    		overflow: hidden;
	    		border-radius: 5px;
	    		position: absolute;
	    		left: 0px;
	    		right: 0px;
	    		top: 0px;
	    		bottom: 0px;
	    		margin: auto;
	    		z-index: 20;
	    		.maskTitle{
	    			font-size: 18px;
	    			height: 50px;
	    			line-height: 50px;
	    			color: #fff;
	    			background-color: #16bf86;
	    			.el-icon-circle-close{
	    				position: absolute;
	    				right: 12px;
	    				font-size: 22px;
	    				line-height: 50px;
	    			}
	    		}
	    		.maskInfo{
	    			padding-top: 50px;
	    			padding-right: 75px;
	    			padding-bottom: 30px;
	    			overflow: hidden;
	    			background-color: #fff;
	    			.el-row{
	    				line-height: 30px;
	    				margin-bottom: 18px;
	    				.el-col-8{
	    				    text-align: right;
		    			}
		    			.el-col-16{
		    				text-align: left;
		    				height: 30px;
		    				padding-left: 12px;
		    			}
		    			.time{
		    				margin-left: 4px;
		    			}
		    			.date,.time{
		    				width: 112px;
		    				height: 30px;
		    			}
		    			.esc{
		    				color: #000;
		    				background-color: #fff;
		    				border: 1px solid #ddd;
		    			}
		    			button{
		    				width: 68px;
		    			}
	    			}
	    			.el-row.textarea{
	    				height: 60px;
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
</style>