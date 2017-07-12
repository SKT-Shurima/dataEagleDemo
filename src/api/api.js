import axios from 'axios';

import router from '../router';

// let base = 'http://183.129.196.138:8099';
let base = 'http://iot.chnagiot.com:8099' 
// let base = '/hongsui'

// let appKey = "293479a0babc0134689d1801a7b3b3c7";
let appKey = '8d540bb849d811e6beb89e71128cae77';
// let appSecret = "xPRWVOi3nAnxkw6dWQirav3ossxcTi14JVCwkY9rUgxUvOulPNMrdBz4813Rdaag";
let appSecret = 'f9q2WKdG4njC5lpN0J6Hnccw6Q1ZRJ7qaVv0sTA8i71enra9LErFvnrT1rC8AOnu';
let sign = "";
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.get['Content-Type'] = 'application/json';
// 测试
// axios.defaults.headers['Dms-Access-Token'] = '4ebe0748902643dc9e41bc8c8366cb5e';
// 正式
axios.defaults.headers['Dms-Access-Token'] = '12bab2592caa4d8ab54286f3808b0dbc';
axios.defaults.withCredentials = true;

axios.interceptors.response.use(
    response => {

        return response;
    },
    error => {
        router.replace({
              path: 'entry',
              query: {redirect: router.currentRoute.fullPath}
          })
        return {code : -1010, msg : '错误'};   // 返回接口返回的错误信息
    });



let transformData = function(data){
    // Do whatever you want to transform the data
    let ret = ''
    for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    }
    return ret
}


 const setCookie = (c_name,value,expiredays)=>{
        var exdate=new Date()
        exdate.setDate(exdate.getDate()+expiredays);
        document.cookie=c_name+ "=" +escape(value)+
        ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
        }

 const getCookie = (c_name)=>{
      if (document.cookie.length>0)
        {
        let c_start=document.cookie.indexOf(c_name + "=")
        if (c_start!=-1)
          { 
          c_start=c_start + c_name.length+1 
          let c_end=document.cookie.indexOf(";",c_start)
          if (c_end==-1) c_end=document.cookie.length
          return unescape(document.cookie.substring(c_start,c_end))
          } 
        }
      return ""
      }

  const delCookie = (c_name)=>{  
    var exp = new Date();  
    exp.setTime(exp.getTime() - 1);  
    var cval = getCookie(c_name);  
    if(cval!=null){  
        document.cookie = c_name + "=" + cval + ";expires=" + exp.toGMTString();  
    }  
}

// 初始进入页面获得访问许可
 // export const initGetToken = () =>{
 //    let params = transformData({appKey: appKey, appSecret : appSecret, sign: sign});
 //    return axios.get(`${base}/app/token?` + params).then(res => { 
 //        let data = res.data;
 //        if(data.code === 0 ){
 //            setCookie("access_token",data.data.token,7);
 //        }
 //        return res.data;
 //    }); 
 //  };

// 用户token过期后刷新用户token
export const newUserToken = ()=>{ getUserToken(); return axios.get(`${base}/user/token/refresh`).then(res=>{
       let {msg,code,data} = res ;
       if (code !== 0) {
            // alert("刷新失败")
       }else{
          delCookie('user_token');
          setCookie("user_token",data.token,1);
       } 
})}


  const getUserToken = params =>{
        let user_token = getCookie("user_token"); 
        axios.defaults.headers['Dms-User-Token'] = user_token;    
  }

// 注册接口
// 1.创建用户接口
 export const createUser = params => { return axios.post(`${base}/user/create`, params).then(res => res.data); };
// 2. 完善用户信息接口
export const reg = params => { return 
    let fn = axios.post(`${base}/user/perfect`, params).then(res => res.data);
     getToken(fn); };

// 获取验证码
 export const getCode = params => {  return axios.post(`${base}/sms/send`, params) };
// 登录接口
export const requestLogin = params => { return axios.post(`${base}/user/login`,
 params).then(res => {
          let {code,data} = res.data;
          if(code===0){
             setCookie("user_token",data.token,1);
          }
          return res.data;
        }); };
 //  验证验证码
 export const verify = params  =>{return axios.post(`${base}/sms/verify`,params).then(res=>res.data)}
// 忘记密码
 export const forgetPassword = params => {  return axios.post(`${base}/user/password/modify`, params)
        .then(res => res.data); };


// 初始化用户信息
  export const initUserInfo = params => {  getUserToken();  return axios.get(`${base}/user/info`).then(res => res.data); };

// 初始化首页数据
  export const deviceList = params => { getUserToken(); return axios.get(`${base}/device/summary`).then(res => res.data); };

// 单元设备状态
  export const unitStatus = params => {  getUserToken(); return axios.get(`${base}/device/`+ params +`/status`).then(res=> res.data);}

// 操作单元设备状态
 export const operDeviceStatus = params => {  getUserToken(); return axios.post(`${base}/device/`+ params.deviceId +`/state`, params).then(res=> res.data);}
// 操作记录
export const operaRecords = params => {  getUserToken(); return axios.get(`${base}/device/`+params.unitId+`/log?pageSize=`+params.pageSize+`&page=`+params.page).then(res=> res.data);}

// 数据相关
// 取得传感器数据
export const dataSensors = params => {  getUserToken(); return axios.get(`${base}/data/`+params.unitId+`/sensors`).then(res=> res.data);}
// 获取指定传感器的历史数据
export const appointedData = params => {  getUserToken();  return axios.get(`${base}/data/sensor/${params.sensorId}?start=${params.start}&end=${params.end}&page=${params.page}&pageSize=${params.pageSize}`).then(res=> res.data);}




// 摄像头相关
// 取得单元的摄像头列表
export const cameraList = params => {  getUserToken(); return axios.get(`${base}/camera/list?unitId=`+params).then(res=> res.data);}

// 取得摄像头历史图片
export const historyPic = params => {  getUserToken(); return axios.get(`${base}/camera/`+ params.cameraId + `/history?page=`+params.page).then(res=> res.data);}

// 农事
// 取得播种记录
 export const seed = params => {  getUserToken(); return axios.get(`${base}/farming/seed?unitId=${params.unitId}&page=${params.page}&pageSize=${params.pageSize}`).then(res=> res.data);}
// 取得施撒记录
 export const splash = params => {  getUserToken(); return axios.get(`${base}/farming/splash?unitId=${params.unitId}&page=${params.page}&pageSize=${params.pageSize}`).then(res=> res.data);}
// 取得农事记录
 export const other = params => {  getUserToken(); return axios.get(`${base}/farming/other?unitId=${params.unitId}&page=${params.page}&pageSize=${params.pageSize}`).then(res=> res.data);}
// 取得采摘记录
 export const pick = params => {  getUserToken(); return axios.get(`${base}/farming/pick?unitId=${params.unitId}&page=${params.page}&pageSize=${params.pageSize}`).then(res=> res.data);}
// 保存播种记录
 export const saveSeed = params => {  getUserToken(); return axios.post(`${base}/farming/seed/create`,params).then(res=> res.data);}
// 保存施撒记录
 export const saveSplash = params => {  getUserToken(); return axios.post(`${base}/farming/splash/create`,params).then(res=> res.data);}
// 保存农事记录
 export const saveOther = params => {  getUserToken(); return axios.post(`${base}/farming/other/create`,params).then(res=> res.data);}
// 保存采摘记录
 export const savePick = params => {  getUserToken(); return axios.post(`${base}/farming/pick/create`,params).then(res=> res.data);} 
// 删除记录 
export const deleteInfo = params => {  getUserToken(); return axios.delete(`${base}/farming/`+params.recordId).then(res=> res.data);}


// 授权
export const boundUsers = params =>{  getUserToken();   return axios.get(`${base}/entity/boundUsers`).then(res=>res.data)};
// 取得用户的权限
export const  permissions = params =>{ getUserToken(); return axios.get(`${base}/entity/${params.entityId}/${params.userId}/permissions`).then(res=>res.data)}
// 解除用户与实体的绑定
export const unbind = params =>{ getUserToken(); return axios.post(`${base}/entity/${params.entityId}/unbind/${params.userId}`,{}).then(res=>res.data)}
// 给用户授权
export const authorize = params =>{ getUserToken(); return axios.post(`${base}/entity/${params.entityId}/authorize`,params.postBody).then(res=>res.data)}
// 添加用户查询简略信息
export const query = params =>{getUserToken(); return axios.get(`${base}/user/query/${params.mobile}`).then(res=>res.data) }
// 用户与实体绑定
export const bind = params => {getUserToken(); return axios.post(`${base}/entity/${params.entityId}/bind/${params.userId}`).then(res=>res.data)} 



// 技术支持列表
export const supportList = params => {  getUserToken(); return axios.get(`${base}/support/list?page=`+params.page).then(res=> res.data);}
// 问题提交
export const supportSubmit = params => {  getUserToken(); return axios.post(`${base}/support/submit`,params).then(res=> res.data);} 
// 对话列表
export const supportDialogue = params => {  getUserToken(); return axios.get(`${base}/support/dialogue/`+params.topicId).then(res=> res.data);}
// 回复
export const supportRealy = params => {  getUserToken(); return axios.post(`${base}/support/reply`,params).then(res=> res.data);} 

// 关于我们
export const aboutUs = params => { return axios.get(`${base}app/about`).then(res=> res.data);}


// 保存用户信息
export const saveInfo = ()=>{return axios.post(`${base}/user/info`,{}).then(res=> res.data);}