<template>
<div id="app">
   <router-view></router-view>
</div>
   
</template>

<script>
import {getCookie} from './api/common'
window.onpopstate = function() {
  if (window.player) {
    window.player.stop();
  }
  let user_token = getCookie('user_token');  
        if (!user_token) {
          location.hash='/entry'
        }
  }; 
export default {
}
</script>

<style>
body {
    margin: 0px;
    padding: 0px;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
  }
  i,em{
    font-style: normal;
  }
html {
  height: 100%;
}
html,
body,
div,
span,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
pre,
a,
em,
img,
strong,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
article,
aside,
footer,
header,
menu,
nav,
audio,
video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
  font-family: "microsoft yahei";
  box-sizing: border-box;
}
/* ------- HTML5 display-role reset for older browsers ------- */
article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
  display: block;
}
body {
  line-height: 1;
}
ol,
ul,
li {
  list-style: none;
}
blockquote,
q {
  quotes: none;
}
blockquote:before,
blockquote:after,
q:before,
q:after {
  content: '';
  content: none;
}
a {
  color: #343434;
  text-decoration: none;
}
body{
position: relative;
background-color: #f2f2f2;
height: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}

</style>
