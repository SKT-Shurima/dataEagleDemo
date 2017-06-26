import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'

Vue.use(Vuex)

// 应用初始状态
const state = {
    curPath: null,
    controlUnitId: null,
    appointed: ""
}

// 定义所需的 mutations
const mutations = {
    changeState(state,path){
        state.curPath =  path;
    },
    checkControlData(state,unitId){
        state.controlUnitId = unitId; 
    },
    changeAppointed(state,appointed){
        state.appointed = appointed;
    }
}

// 创建 store 实例
export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations
})