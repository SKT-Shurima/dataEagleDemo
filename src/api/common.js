//日期格式转换
export const dateStyle  = time =>{
    var newDate = new Date(time);
    let {y,m,d}={y:newDate.getFullYear(),m:newDate.getMonth()+1,d:newDate.getDate()};
    m = trans(m);
    d = trans(d);
    function trans (val){
      		if (val < 10) {
      			val = "0" + val ;
      		}
      		return val ;
      };
       return y +'-' + m + "-" + d ;
    
}
//时间日期格式转换
export const timeStyle  = time =>{
    var newDate = new Date(time);
    let {h,m,s}={h:newDate.getHours(),m:newDate.getMinutes(),s:newDate.getSeconds()};
    h = trans(h);
    m = trans(m);
    s = trans(s);
    function trans (val){
      		if (val < 10) {
      			val = "0" + val ;
      		}
      		return val ;
      };
       return h +':' + m + ":" + s ;
}


// 时间大于一个小时显示一小时前
 export const timeTrans  = time =>{
        time-=0;
        var date = new Date(time);
         let {hh,mm} = {hh:date.getHours(),mm:date.getMinutes()};
         var newDate = new Date(time);
         let {h,m} = {h:newDate.getHours(),m:newDate.getMinutes()};
           h=hh-h;
           m = mm -m ;
           if (h >= 1) {
            return '1小时前'
           }else{
            return m + '分钟前'
           }
}

// 读取cookie  
   export const  getCookie = (c_name)=>{  
        if (document.cookie.length>0)  
        {  
            var c_start=document.cookie.indexOf(c_name + "=");  
            if (c_start!=-1)  
            {   
            c_start=c_start + c_name.length+1;  
            var c_end=document.cookie.indexOf(";",c_start);  
            if (c_end==-1)   
                c_end = document.cookie.length  
                return unescape(document.cookie.substring(c_start, c_end))  
            }  
        }  
        return ""     
    }
    // 删除cookie  
   export const   delCookie = (c_name)=>{  
        var exp = new Date();  
        exp.setTime(exp.getTime() - 1);  
        var cval = getCookie(c_name);  
        if(cval!=null){  
            document.cookie = c_name + "=" + cval + ";expires=" + exp.toGMTString();  
        }  
    }
    // 设置cookie
   export const  setCookie=(c_name,value,expTime)=>{  
          var exdate = new Date();  
          exdate.setTime(exdate.getTime() + expTime *24 *60 * 60 * 1000);  
          document.cookie= c_name + "=" + escape(value)+((expTime==null) ? "" : ";expires="+exdate.toGMTString());  
      }