<template>
		<div class="wrap">
		<el-row class="back">
			<button @click='goBackList'>返回</button>
	    </el-row>
			<dl class="title" v-if='questioner.title&&dialogueList.userInfo'>
				<dt class="quesHeader" >
					<h1 v-text='questioner.title'></h1>
					<div class="userInfo">
						<img :src="dialogueList.userInfo.avatar">
						<span v-text='dialogueList.userInfo.name'></span>
					</div>
				</dt>
				<dd class="time">
					{{questioner.submitTime | dateStyle}}&nbsp;{{questioner.submitTime | timeStyle}}
				</dd>
			</dl>
			<div v-for='(item,index) in dialogueList.dialogues' :index='index'>
				<dl class="content"  v-if='item.direction==1'>
						<dt class="listHeaer">
						<div class="listInfo">
							<img :src="dialogueList.userInfo.avatar">
							<span v-text='dialogueList.userInfo.name'></span>
						</div>
						</dt>
					<dd class="listCon">
						<p v-text='item.content'></p>
					</dd>
					<dd class="time">
						<span class="userTimeCon">
					   		{{item.time|dateStyle}}&nbsp;{{item.time|timeStyle}}
					   </span>
					</dd>
			   </dl>
			   <dl class="content" :index='index' v-if='item.direction==2'>
					<dt class="listHeaer">
						<div class="userListInfo">
						<img :src="dialogueList.managerInfo.avatar">
							<span v-text='dialogueList.managerInfo.name'></span>
						</div>
					</dt>
					<dd class="userListCon" >
					  <p v-text='item.content'></p>
					</dd>
					<dd class="userTime">
					   <span class="userTimeCon">
					   {{item.time|dateStyle}}&nbsp;{{item.time|timeStyle}}
						</span>
					</dd>
			    </dl>
			</div>
			<div class="reply">
				<el-button type='primary' size="small" @click='reply'>回复</el-button>
			</div>
			<el-row style='margin-top:40px;'>
		        <transition name='fade'>
		        	<div class="mask" v-show='maskBol'>
						<div class="maskBox">
							<h1 class="maskTitle">
								回复
								<i class="el-icon-circle-close" @click='maskBol=false'></i>
							</h1>
							<div class="maskInfo">
								<el-row class='textarea'>
									<el-input
									  type="textarea"
									  :rows="6"
									  placeholder="请输入内容"
									  v-model="textarea"
									  resize='none'>
									</el-input>
								</el-row>
								<el-row>
									<el-col :span='16' :offset="4">
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
	import { supportDialogue,supportList,supportRealy,newUserToken } from '../../api/api'
	import { timeStyle,dateStyle} from '../../api/common'
	export default {
		data(){
			return {
				dialogueList: [],
				questioner: [],
				maskBol: false,
				textarea: null
			}
		},
		props:["passData"],
		filters: {
			timeStyle,
			dateStyle
		},
		computed:{
		},
		methods:{
			goBackList(){
				this.$emit('backList');
			},
			reply(){
				let _this = this;
				_this.maskBol = true;
				_this.textarea = null;
			},
			save(){
				let _this = this;
				let text = this.textarea;
				if (text) {
					text = text.replace(/^(\s+)|(\s+$)/g,"");
					text = text.replace(/\s/g,"");
					if (text) {
						let params = {
				          	topicId: this.questioner.topicId,
				          	content: this.textarea
				          }
				          supportRealy(params).then((res)=>{
							let { msg, code, data } = res;
				            if(code !== 0) {
				              if (code === -1001 || code === -1010) {
				              	newUserToken();
				              	supportRealy(params).then(res1=>{
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
								           this.init();
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
							           this.init();
							         }
							       });
				            }
						});
					}else{
						this.$alert('请输入内容', '提示', {
							         confirmButtonText: '确定'
							       });
					}
				}else{
					this.$alert('请输入内容', '提示', {
							         confirmButtonText: '确定'
							       });
				}
		          
			},
			dialogueListFn(topicId){
				let params = {
					topicId: topicId
					};
				supportDialogue(params).then((res)=>{
					let { msg, code, data } = res;
					if(code !== 0) {
						 if(code === -1001 || code === -1010 ){
						    newUserToken();
						    supportDialogue(params).then(res1=>{
								let  code1=res1.code;
								let  data1=res1.data;
								if (code1 !==0) {
									this.$router.push({path: '/entry'});
								}else{
									this.dialogueList = data1;
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
						this.dialogueList = data;
					}
				});
			},
			init(){
				let params = {
					page: this.passData.page -1
				}
				supportList(params).then((res)=>{
					let { msg, code, data } = res;
		            if(code !== 0) {
		              if(code === -1001 || code === -1010 ){
		                 newUserToken();
		                 supportList(params).then(res1=>{
		            		let code1 = res1.code ;
		            		let data1 = res1.data ;
		            		if (code1 !== 0) {
		            			this.$router.push({path: '/entry'});
		            		}else{
		            			this.questioner = data1.topics[this.passData.topicIndex];
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
		               this.questioner = data.topics[this.passData.topicIndex];
		               this.dialogueListFn(this.questioner.topicId);
		            }
				})
			}
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
	.title{
		border-bottom: 1px solid #ddd;
		padding: 6px 0px;
		.quesHeader{
			overflow: hidden;
			height: 40px;
			line-height: 40px;
			h1{
				font-size: 20px;
				font-weight: 500;
				float: left;
			}
			.userInfo{
				float: right;
				img{
					clear: both;
					width: 30px;
					height: 30px;
					border-radius: 50%;
					vertical-align: middle;
				}
				span{
					clear: both;
				}
				
			}
		}
	}
	.content{
		border-bottom: 1px solid #ddd;
		padding: 6px 0px;
		.listHeaer{
			width: 100%;
			overflow: hidden;
			.listInfo{
				float: left;
				img{
					width: 30px;
					height: 30px;
					border-radius: 50%;
					vertical-align: middle;
				}
			},
			.userListInfo{
				float: right;
				overflow: hidden;
				height: 40px;
				img{
					width: 30px;
					height: 30px;
					border-radius: 50%;
					vertical-align: middle;
				}
			}
		}
		.userListCon{
			width: 100%;
			padding-right: 20px;
			overflow: hidden;
			p{
				width: 90%;
				float: right;
			}
		}
		.userTime{
			width: 100%;
			height: 40px;
			line-height: 40px;
			font-size: 12px;
			color: #666;
			overflow: hidden;
			padding-right: 20px;
			.userTimeCon{
				float: right;
			}
		}
	}
	.listCon{
			width: 100%;
			padding-left: 20px;
			overflow: hidden;
			p{
				width: 86%;
				float: left;
			}
		}
	.time{
			height: 40px;
			line-height: 40px;
			font-size: 12px;
			color: #666;
			overflow: hidden;
			button{
				float: right;
				margin-top: 10px;
				margin-right: 10px;
			}
		}
	.reply{
		float: right;
		margin-top: 20px;
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
	    		height: 284px;
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
	    			padding-top: 30px;
	    			margin: 0px auto;
	    			overflow: hidden;
	    			background-color: #fff;
	    			.el-row{
	    				width: 90%;
	    				margin: 0px auto;
	    				line-height: 30px;
	    				margin-bottom: 18px;
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