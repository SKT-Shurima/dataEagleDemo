import VueRouter from 'vue-router'
import Vue from 'vue'
import Home from '@/components/Home'

import entry from '@/components/entry'

import homeMain from '@/components/homePage/homeMain'
import dataMain from '@/components/dataPage/dataMain'
import controlMain from '@/components/controlPage/controlMain'
import videoMain from '@/components/videoPage/videoMain'
import farmMain from '@/components/farmPage/farmMain'
import personInfo from '@/components/personalInfo/personalInfo'
import modifyPassword from '@/components/personalInfo/modifyPassword'
import techSuport from '@/components/personalInfo/techSuport'
import impowerMain from '@/components/impowerPage/impowerMain'
Vue.use(VueRouter)

export default  new VueRouter({
   routes :[
    {
      path: "/",
      component: entry
    },
   {
      path: "/entry",
      component: entry
    },
    {
      path: "/home",
      component:Home,
      children: [
            { 
              path: '/',
              component: homeMain
            },
            { 
              path: '/homeMain',
              component: homeMain
            },
            { 
              path: '/data',
              component: dataMain
            },
            { 
              path: '/control',
              component: controlMain
            },
            { 
              path: '/video',
              component: videoMain
            },
            { 
              path: '/farm',
              component: farmMain
            },
            { 
              path: '/impower',
              component: impowerMain
            },
            {
              path: "/personInfo",
              component: personInfo
            },
            {
              path: "/modifyPassword",
              component: modifyPassword
            },
            {
              path: "/techSuport",
              component: techSuport
            }
          ]
    }
    
  ]
})