<template>
	<el-dialog title="添加用户" v-model="visable" top='30%' @close='esc'>
	  <div class="container">
	  	 <el-row>
	  	 	<el-col :span='4'>手机</el-col>
	  	 	<el-col :span='18' :offset= '2' v-text='userInfo.mobile'></el-col>
	  	 </el-row>
	  	 <el-row>
	  	 	<el-col :span='4'>姓名</el-col>
	  	 	<el-col :span='18' :offset= '2' v-text='userInfo.name'></el-col>
	  	 </el-row>
	  </div>
	  <div slot="footer" class="dialog-footer">
	    <el-button  @click="esc">取 消</el-button>
	    <el-button type="primary"  @click='addUser' style='margin-left: 60px;'>确 定</el-button>
	  </div>
</el-dialog>
</template>
<script>
import {bind} from '../../api/api'
	 export default {
    props:{
    	userInfo:{
    		type: Object,
    		required: true
    	}
    },
    computed:{
    	visable(){
    		let _this = this;
    		if (_this.userInfo.userId) {
    			return true
    		}else{
    			return false
    		}
    	}
    },
    methods: {
    	addUser(){
    		let _this = this ;
    		let params = {
    			entityId:　_this.userInfo.entityId,
    			userId: _this.userInfo.userId
    		}
    		bind(params).then(res=>{
    			let {code,msg,data} = res;
	 			 if(code !== 0) {
	            	if (code === -1001 || code === -1010 ) {
	            		bind(params).then((res1)=>{
	            			let msg1 = res1.msg ;
	            			let code1 = res1.code ;
	            			let data1 = res1.data ;
	            			if (code1 !== 0) {
	            				this.$router.push({path: '/entry'});
	            			}else{
	            				 this.$message({
						          message: '添加成功',
						          type: 'success'
						        });
	            				 this.$emit('hiddenView',true)
	            			}
	            		})
	            	}else if (code !== -1000){
	            		this.$notify({
		                    title: "请求失败",
		                    message: msg,
		                    type: 'error'
		                  });
	            		this.$emit('hiddenView',false)
	            	}
	            }else{
	            	this.$message({
			          message: '添加成功',
			          type: 'success'
			        });
	            	this.$emit('hiddenView',true)
	            }
    		})
    	},
    	esc(){
    		let _this = this ;
    		_this.$emit('hiddenView',false)
    	}
    }
  };
</script>
<style lang='scss'>
	.el-dialog.el-dialog--small{
		width: 420px;
		.container{
			.el-row{
				height: 36px;
				line-height: 36px;
				.el-col-4{
					text-align: right;
				}
			}
			
		}
	}
	.dialog-footer{
		text-align: center;
	}

</style>