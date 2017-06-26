<template>
	<div id="temperature" style="background-color: #fbfbfb; ">
		
	</div>
</template>
<script type="text/javascript">
import { sensor} from '../../api/api'
	export default {
		data (){
			return {
				time : [],
				val: [],
				name: ""
			}
		},
		computed:{
			appointed(){
				return this.$store.state.appointed 
			}
		},
		watch:{
			appointed(){
				let _this = this ;
				let value = _this.appointed.values;
				_this.name = _this.appointed.sensorName;
				_this.time = _this.getTimes(value);
				_this.val =  _this.getValue(value);
				_this.init(_this.time,_this.val,_this.name);
			}
		},
		methods:{
			getTimes(val){
				let arr = [];
				for(let i = 0 ; i < val.length; i++){
					let t = this.trans(val[i].time);
					arr.push(t);
				};
				return arr ;
			},
			trans(time){
				let timer = new Date(time);
				let h = timer.getHours();
				let m = timer.getMinutes();
				if (h<10) {
					h = `0${h}`;
				};
				if (m<10) {
					m = `0${m}`;
				};
				return  `${h}:${m}`
			},
			getValue(val){
				let arr = [];
				for(let i = 0; i < val.length;i++){
					let t = val[i].value;
					t = t .toFixed(2);
					arr.push(t);
				};
				return arr;
			},
			init(timeArr,valArr,name){
				// 引入 ECharts 主模块
				var echarts = require('.3.5.2@echarts/lib/echarts');
				// 引入柱状图
				require('.3.5.2@echarts/lib/chart/line');
				// 引入提示框和标题组件
				require('.3.5.2@echarts/lib/component/tooltip');
				require('.3.5.2@echarts/lib/component/title');

				// 基于准备好的dom，初始化echarts实例
				var myChart = echarts.init(document.getElementById('temperature'));
				// 绘制图表
				myChart.showLoading();
				myChart.setOption({
				    title: { text: name },
				    tooltip: {},
				    xAxis: {
				        data: timeArr
				    },
				    yAxis: {},
				    series: [{
				        name: name,
				        type: 'line',
				        data: valArr
				    }]
				});
				myChart.hideLoading();
			}
		},
		mounted(){
			this.$nextTick(()=>{
				this.init();
			})
		}
	}
</script>
<style type="text/css" lang='scss' scoped>
	#temperature{
		width: 940px;
		height: 560px;
		margin-top: 40px;
	}
</style>