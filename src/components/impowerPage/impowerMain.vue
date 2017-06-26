<template>
	<div class="wrap">
		<div class="title">
			<div class="name">
				添加用户
			</div>
			<div style="margin-top:10px;">
				手机
				<el-input type='text' size='small' style='width:240px;' v-model='phone'></el-input>
				<el-button type='primary' size='small' style='margin-left: 20px;width: 64px;' @click='addUser'>
					确定
				</el-button>
			</div>
		</div>
		<div class="container">
			<div class="slider">
				<ul v-if='userInfo'>
					<li v-for='(item,index) in userInfo.users' :class='{"active":currentIndex===index}'><span @click='getList(item.userId,index)' v-text='item.name' style="padding-right: 140px;cursor: pointer;"></span> <i class="el-icon-minus" @click='delUser(item.userId)' style="cursor: pointer;"></i></li>
				</ul>
			</div>
			<div class="list">
				<el-row>
				     <div v-if='impowerInfo'>
				     	<table cellpadding="10px" cellspacing="0" class="table">
							<tr class="bg-light">
								<th>单元</th>
								<th>授权日期</th>
								<th>查看</th>
								<th>控制</th>
							</tr>
							<tr v-for='item in impowerInfo.units'>
								<td v-text='item.name'></td>
								<td>{{item.time|dateStyle}}</td>
								<td><el-checkbox v-model='item.canView'></el-checkbox></td>
								<td><el-checkbox v-model='item.canControl'></el-checkbox></td>
							</tr>
						</table>
						<!-- <el-row class="pagination">
							<el-col :span="6" :offset='18'>
								<span>第{{currentPage}}/{{totalPage}}页</span>
								<el-button type="text" size="mini" :disabled="currentPage<=1" @click="pageChange(-1)">上一页</el-button>
								<el-button type="text" size="mini" :disabled="currentPage>=totalPage" @click="pageChange(1)">下一页</el-button>
							</el-col>
						</el-row> -->
						<div style="float:right;margin-top:10px;">
							<el-button type='primary' size='small' @click='saveAuthorize'>保存授权</el-button>
						</div>
				     </div>
				</el-row> 
		</div>
		</div>
		<add-user :user-info='addUserInfo' @hiddenView='addSuccess'></add-user>
	</div>
</template>
<script>
import {boundUsers,permissions,unbind,authorize,query} from '../../api/api'
import {dateStyle} from '../../api/common'
import addUser from './addUser'
	 export default {
	 	data(){
	 		return {
	 			phone: "",
	 			currentPage: 1,
	 			totalPage: null,
	 			userInfo: null,
	 			impowerInfo: null,
	 			currentIndex: 0,
	 			userId: "",
	 			maskBol: false,
	 			addUserInfo: {}
	 		}
	 	},
	 	filters:{
	 		dateStyle
	 	},
	 	components:{
	 		addUser
	 	},
	 	methods:{
	 		getList(userId,index){
	 			let _this = this ;
	 			_this.currentIndex = index;
	 			let params ={
	 				entityId: _this.userInfo.id,
	 				userId: userId
	 			}
	 			_this.userId = userId ;
	 			permissions(params).then(res=>{
	 				let {code,msg,data} = res;
		 			 if(code !== 0) {
		            	if (code === -1001 || code === -1010 ) {
		            		permissions().then((res1)=>{
		            			let msg1 = res1.msg ;
		            			let code1 = res1.code ;
		            			let data1 = res1.data ;
		            			if (code1 !== 0) {
		            				this.$router.push({path: '/entry'});
		            			}else{
		            				this.impowerInfo = data;
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
		            	this.impowerInfo = data;
		            }
	 			})
	 		},
	 		addUser(){
	 			let _this = this ;
	 			let regPhone = /^1[34578]\d{9}$/g ;
	 			// 判断查询手机号是否正确
	 			if (!regPhone.test(_this.phone)) {
	 				 this.$alert('手机号输入有误', '提示', {
			          confirmButtonText: '确定'
			        });
	 			}else {
	 				// 查询是否有此用户
	 				let params = {
	 					mobile: _this.phone
	 				}
	 				query(params).then(res=>{
	 					let {code,msg,data} = res;
			 			 if(code !== 0) {
			            	if (code === -1001 || code === -1010 ) {
			            		query().then((res1)=>{
			            			let msg1 = res1.msg ;
			            			let code1 = res1.code ;
			            			let data1 = res1.data ;
			            			if (code1 !== 0) {
			            				this.$router.push({path: '/entry'});
			            			}else{
			            				this.addUserInfo = data ;
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
			            	this.addUserInfo = data ;
			            	this.addUserInfo.entityId = _this.userInfo.id ;
			            }
	 				})
	 			}
	 		},
	 		delUser(userId){
	 			let _this = this ;
	 			let params ={
	 				entityId: _this.userInfo.id,
	 				userId: userId
	 			}
	 			unbind(params).then(res=>{
	 				let {code,msg,data} = res;
		 			 if(code !== 0) {
		            	if (code === -1001 || code === -1010 ) {
		            		unbind().then((res1)=>{
		            			let msg1 = res1.msg ;
		            			let code1 = res1.code ;
		            			let data1 = res1.data ;
		            			if (code1 !== 0) {
		            				this.$router.push({path: '/entry'});
		            			}else{
		            				this.$message({
							          message: '解绑成功',
							          type: 'success'
							        });
		            				this.init();
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
		            	this.$message({
				          message: '解绑成功',
				          type: 'success'
				        });
		            	this.init();
		            }
	 			})
	 		},
	 		saveAuthorize(){
	 			let _this = this ;
	 			let params ={
	 				entityId: this.userInfo.id,
	 			}
	 			let arr = _this.impowerInfo.units;
	 			let postBody = {
	 				userId: _this.userId,
	 				authorizations: []
	 			};
	 			for(let i = 0 ; i < arr.length ;i++){
	 				let obj = {};
	 				obj.unitId = arr[i].id;
	 				if (arr[i].canView) {
	 					obj.canRead = 1 ;
	 				}else {
	 					obj.canRead = 0 ;
	 				};
	 				if (arr[i].canControl) {
	 					obj.canControl = 1 ;
	 				}else {
	 					obj.canControl = 0 ;
	 				};
	 				postBody.authorizations.push(obj);
	 			}
	 			params.postBody = postBody ;
	 			authorize(params).then(res=>{
	 				let {code,msg,data} = res;
		 			 if(code !== 0) {
		            	if (code === -1001 || code === -1010 ) {
		            		authorize().then((res1)=>{
		            			let msg1 = res1.msg ;
		            			let code1 = res1.code ;
		            			let data1 = res1.data ;
		            			if (code1 !== 0) {
		            				this.$router.push({path: '/entry'});
		            			}else{
		            				this.$message({
							          message: '成功授权',
							          type: 'success'
							        });
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
		            	this.$message({
				          message: '成功授权',
				          type: 'success'
				        });
		            }
	 			})
	 		},
	 		addSuccess(mask){
	 			console.log(mask)
	 			let _this = this ;
	 			if (mask) {
	 				_this.init();
	 			}
 				_this.addUserInfo  = {};
	 		},
	 		init(){
		 		boundUsers().then( res=>{
		 			let {code,msg,data} = res;
		 			 if(code !== 0) {
		            	if (code === -1001 || code === -1010 ) {
		            		boundUsers().then((res1)=>{
		            			let msg1 = res1.msg ;
		            			let code1 = res1.code ;
		            			let data1 = res1.data ;
		            			if (code1 !== 0) {
		            				this.$router.push({path: '/entry'});
		            			}else{
		            				this.userInfo = data;
		            				this.getList(this.userInfo.users[0].userId,0);
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
		            	this.userInfo = data;
		            	this.getList(this.userInfo.users[0].userId,0);
		            }
		 		})
		 	},
		 },
	 	mounted(){
	 		this.$nextTick(()=>{
	 			this.init();
	 		})
	 	}
	 }
</script>
<style lang='scss' scoped>
	.wrap{
		width: 100%;
		.title{
			line-height: 40px;
			.name{
				border-bottom: 1px solid #16bf86;
			}
		}
		.container{
			overflow: hidden;
			margin-top: 6px;
			.slider{
				float: left;
				width: 280px;
				min-height: 600px;
				margin-right: 20px;
				margin-top: 18px;
				border: 1px solid rgb(191, 217, 211);
				border-radius: 4px;
				li{
					height: 36px;
					line-height: 36px;
					padding: 0px 10px;
					i{
						display: inline-block;
						float: right;
						margin-top: 8px;
						width: 20px;
						height: 20px;
						font-size: 12px;
						line-height: 20px;
						text-align: center;
						border-radius: 10px;
						border: 1px solid rgb(191, 217, 211);
						color: rgb(191, 217, 211) ;
					}
				}
				li:hover{
					background-color: rgb(191, 217, 211);
					i{
						border-color: #16bf86;
						color: #16bf86;
					}
					i:hover {
						border-color: #c71724;
						color: #c71724;
					} 
				}
				li.active:hover{
					background-color: #16bf86;
					color: #fff;
					i{
						border-color:rgb(191, 217, 211);
						color: rgb(191, 217, 211) ;
					} 
				}
				.active{
					background-color: #16bf86;
					color: #fff;
				}
			}
			.list{
				float: left;
				width: 600px;
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
	}
</style>