<template>
	<div class="wrap">
	<el-row>
		<el-col :span='2'>头像</el-col>
		<el-col :span='6' :offset="1">
		<el-upload
		  class="avatar-uploader"
		  action="http://iot.chnagiot.com:8099/file/avatar"
		  :headers='headers'
		  :show-file-list="false"
		  :on-success="handleAvatarSuccess"
		  :before-upload="beforeAvatarUpload">
		  <img v-if="imageUrl" :src="imageUrl" class="avatar">
		  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
		</el-upload>
		</el-col>
	</el-row>
	<el-row>
		<el-col :span='2'>姓名</el-col>
		<el-col :span='6' :offset="1">
			<span v-text='name'></span>
		</el-col>
	</el-row>
	<el-row>
		<el-col :span='2'>手机号</el-col>
		<el-col :span='6' :offset="1">
			<span>{{phoneInput}}</span>
		</el-col>
	</el-row>
	<el-row>
		<el-col :span='2'>性别</el-col>
		<el-col :span='6' :offset="1">
			<el-radio class="radio" v-model="radio" label="1">男</el-radio>
  			<el-radio class="radio" v-model="radio" label="2">女</el-radio>
		</el-col>
	</el-row>
	<el-row>
		<el-col :span='2'>公司名称</el-col>
		<el-col :span='6' :offset="1">
		<span v-text='companyName'></span>
		</el-col>
	</el-row>
	<el-row>
		<el-col :span='2'>公司网址</el-col>
		<el-col :span='6' :offset="1">
		<span v-text='companyArea'></span>
		</el-col>
	</el-row>
	</div>
</template>
<script type="text/javascript">
import { initUserInfo,saveInfo,newUserToken} from '../../api/api'
import {getCookie} from '../../api/common'
 export  default{
 	data(){
 		return{
 			radio:'1',
 			phoneInput: null,
 			imageUrl: null,
 			userInfo: [],
 			name: null,
 			companyName: null,
 			companyArea: null,
 			headers: {}
 		}
 	},
 	methods:{
 		 handleAvatarSuccess(res, file) {
 		 	this.imageUrl = URL.createObjectURL(file.raw);
	        this.$message({
				type: 'success',
				message: '头像修改成功'
			 });
	        setTimeout(()=>{
	        	location.reload();
	        },500)
	      },
	      beforeAvatarUpload(file) {
	        const isJPG = file.type === 'image/jpeg'||'image.png';
	        const isLt2M = file.size / 1024 / 1024 < 2;
	        if (!isJPG) {
	          this.$message.error('上传头像图片只能是 JPG / PNG格式!');
	        }
	        if (!isLt2M) {
	          this.$message.error('上传头像图片大小不能超过 2MB!');
	        }
	        return isJPG && isLt2M;
	      },
 		save(){
 			saveInfo().then(res=>{
 				let {msg,code} = res;
 				if (code !== 0 ) {
 					if (code === -1001 || code === -1010) {
 						saveInfo().then(res1=>{
 							let code1 = res1.code;
 							if (code1 !==0) {
 								this.$router.push({path: '/entry'});
 							}else{
 								this.$message({
						            type: 'success',
						            message: '保存信息成功'
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
 					this.$message({
						type: 'success',
						message: '保存信息成功'
						 });
 				}
 			})
 		},
 		back(){
 			this.$router.go(-1);
 		},
 		getToken(){
 			let user_token = getCookie("user_token");
 			this.headers= {
 				'Dms-Access-Token' : '12bab2592caa4d8ab54286f3808b0dbc',
 				'Dms-User-Token' : user_token
 			}
 		},
 		init(){
 			initUserInfo().then(res=>{
	 				let {msg,code,data} = res ;
	 				if (code !== 0) {
	 					if (code === -1001 || code === -1010) {
	 						newUserToken();
	 						initUserInfo().then(res2=>{
	 							let  msg2 = res2.msg ;
								let  code2 = res2.code ;
								let  data2 = res2.data ;
								if (code2 !== 0) {
									this.$router.push({path: '/entry'});
								}else{
									this.userInfo = data2 ;
				 					this.name = this.userInfo.name;
				 					this.radio = this.sex=='男'?"1":"2";
				 					this.companyArea = this.userInfo.enterprise.url;
				 					this.companyName = this.userInfo.enterprise.name;
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
	 					this.userInfo = data ;
	 					this.name = this.userInfo.name;
	 					this.radio = this.userInfo.sex=='男'?"1":"2";
	 					this.companyArea = this.userInfo.enterprise.url;
	 					this.companyName = this.userInfo.enterprise.name;
	 					this.phoneInput = this.userInfo.mobile;
	 				}
	 			});
 		}
 	},
 	mounted(){
 		this.$nextTick(()=>{
 			setTimeout(()=>{
 				this.init();
 			},500)
 			this.getToken();
 		})
 	}
 	
 }
</script>
<style lang='scss' scoped>
.wrap{
	margin-left: 10px;
		.el-row{
			margin-bottom: 20px;
			.avatarImg{
			width:178px;
			height:178px;
			border: 1px dashed #ddd;
			margin-left: 12px;
		 }
		}
	  .avatar-uploader .el-upload {
	    border: 1px dashed #d9d9d9;
	    border-radius: 6px;
	    cursor: pointer;
	    position: relative;
	    overflow: hidden;
	  }
	  .avatar-uploader .el-upload:hover {
	    border-color: #20a0ff;
	  }
	  .avatar-uploader-icon {
	    font-size: 28px;
	    color: #8c939d;
	    width: 178px;
	    height: 178px;
	    line-height: 178px;
	    text-align: center;
	    border: 1px dashed #ddd;
	    margin-left: 12px;
	  }
	  .avatar {
	    width: 178px;
	    height: 178px;
	    display: block;
	  }
	.el-row{
		margin-bottom: 20px;
		.el-col-2{
			text-align: right;
		}
		.el-col-6{
			margin-left: 12px;
		}
		img{
			width: 120px;
			height: 120px;
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
</style>