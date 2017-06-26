<template>
	<div class="wrap">
		<el-row class="back">
			<button @click='goBack'>返回</button>
	    </el-row>
	    <div class="box">
	    	 <el-row>
		    	<strong class="title">
		    		技术支持
		    	</strong>
		    	 <el-button type='primary' size="small"  @click='maskBol=true'>
			   	 	<i class="el-icon-plus" style="margin-right: 2px;"></i>
			   	     提问
			   	 </el-button>
	   		 </el-row>
	   		 <el-row v-for='(item,index) in topics' :index='index' class='topicsList' :key='item.topicId' >
	   		 <div @click='talkTopics(index,currentPage)'>
	   		 	<el-col :span="18"  ><span v-if='item.newReply'>[未读]</span>{{item.title}}</el-col>
	   		 	<el-col :span="6" v-if='item.replyTime'>最后回复&nbsp;{{item.replyTime|dateStyle}}&nbsp;{{item.replyTime|timeStyle}}</el-col>
	   		 </div>
	   		 </el-row>
	   		 <el-row class="pagination">
				<el-col :span="4" :offset='20'>
					<span>第{{currentPage}}/{{totalPage}}页</span>
					<el-button type="text" size="mini" :disabled="currentPage<=1" @click="pageChange(-1)">上一页</el-button>
					<el-button type="text" size="mini" :disabled="currentPage>=totalPage" @click="pageChange(1)">下一页</el-button>
				</el-col>
			</el-row>
	    </div>
	    <el-row>
	        <transition name='fade'>
	        	<div class="mask" v-show='maskBol'>
				<div class="maskBox">
					<h1 class="maskTitle">
						提问
						<i class="el-icon-circle-close" @click='maskBol=false'></i>
					</h1>
					<div class="maskInfo">
						<el-row>
							<el-col :span='8'>标题</el-col>
							<el-col :span='16'>
							<el-input v-model="title" placeholder="请输入问题" size="small"></el-input>
							</el-col>
						</el-row>
						<el-row class='textarea'>
							<el-col :span='8'>问题详情</el-col>
							<el-col :span='16'>
							<el-input
							  type="textarea"
							  :rows="6"
							  placeholder="请输入内容"
							  v-model="textarea"
							  resize='none'>
							</el-input>
							</el-col>
						</el-row>
						<el-row class='opera'>
							<el-col :span='16' :offset='8'>
							 <el-button type='primary' size="small" @click='add'>添加</el-button>
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
import { supportList,supportSubmit,newUserToken} from '../../api/api'
import { timeStyle,dateStyle} from '../../api/common'
 export  default{
 	data(){
 		return{
 			maskBol:false,
 			title: null,
 			textarea: null,
 			currentPage: 1,
 			totalPage: null,
 			topics: [],
 			passData: null
 		}
 	},
 	filters: {
			dateStyle,
			timeStyle
	},
 	methods:{
 		talkTopics(topicIndex,page){
 			this.passData={
 				topicIndex:topicIndex,
 				page:page
 			}
 			this.$emit("getTopic",this.passData);
 		},
 		add(){
 			let _this = this;
 			let params = {
 				title: _this.title,
 				content: _this.textarea
 			}
 			supportSubmit(params).then((res)=>{
	          let { msg, code, data } = res;
	            if(code !== 0) {
	              if(code === -1001 || code === -1010 ){
	                 newUserToken();
	                 supportSubmit(params).then(res1=>{
	                 	let msg1 = res1.msg ;
		            	let code1 = res1.code ;
		            	let data1 = res1.data ;
		            	if (code1 !== 0) {
		            		this.$router.push({path: '/entry'});
		            	}else{
		            		this.$alert('提问成功', '提示', {
					         confirmButtonText: '确定',
					         callback: action => {
					           this.maskBol = false;
					         }
					       });
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
	            	this.$alert('提问成功', '提示', {
					         confirmButtonText: '确定',
					         callback: action => {
					           this.maskBol = false;
					         }
					       });
	            }
	          })
 		},
 		pageChange (mark){
				let _this = this ;
				if (mark < 0) {
  					_this.currentPage--;
  					if(_this.currentPage <= 1 ){
  						_this.currentPage == 1;
  					}
				}else {
					_this.currentPage++;
					if(_this.currentPage >= _this.totalPage ){
  						_this.currentPage == _this.totalPage;
  					}
				}
				this.initList();
			},
		initList(){
			let params = {
 				page: this.currentPage-1
 			}
 			supportList(params).then((res)=>{
	          let { msg, code, data } = res;
	            if(code !== 0) {
	              if(code === -1001 || code === -1010 ){
	                 newUserToken();
	                 supportList(params).then(res1=>{
	                 	let msg1 = res1.msg ;
		            	let code1 = res1.code ;
		            	let data1 = res1.data ;
		            	if (code1 !== 0) {
		            		this.$router.push({path: '/entry'});
		            	}else{
		            		this.topics = data1.topics;
	            			this.totalPage = data1.totalPage;
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
	            	this.topics = data.topics;
	            	this.totalPage = data.totalPage;
	            }
	          })
		},
		goBack(){
 			this.$router.go(-1);
 		}
 	},
 	created(){
 		this.$nextTick(()=>{
 			this.initList();
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
	.box{
		width: 100%;
		.topicsList{
			cursor: pointer;
		}
		.topicsList:hover{
			background-color:#eef6f5;
		}
		.el-row{
			border-bottom: 1px solid #ddd;
			height: 50px;
			line-height: 50px;
			.title{
			font-size: 22px;
			}
			.el-col-18{
				white-space:nowrap;
			    overflow:hidden;
			    text-overflow:ellipsis;
			    span{
			    	color: #f24d49;
			    }
			}
			.el-col-6{
				text-align: right;
				color: #666;
				font-size: 14px;
			}
		}
		.el-row:first-child{
			height: 70px;
			button{
				margin-top: 18px;
				float: right;
			}
		}
		.pagination{
			margin-top: 24px;
			span{
				font-size: 14px;
			}
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
	    		width: 450px;
	    		height: 380px;
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
	    		}
	    	}
	    }
}
</style>