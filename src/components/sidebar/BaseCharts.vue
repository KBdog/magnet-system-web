<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-pie-chart"></i> Magnet收录趋势图表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
<!--            <div class="plugins-tips">-->
<!--                vue-schart：vue.js封装sChart.js的图表组件。-->
<!--                访问地址：-->
<!--                <a-->
<!--                    href="https://github.com/lin-xin/vue-schart"-->
<!--                    target="_blank"-->
<!--                >vue-schart</a>-->
<!--            </div>-->
            <div class="schart-box">
                <div class="content-title">磁力收录趋势</div>
                <schart class="schart" canvasId="line" :options="options2"></schart>
            </div>

<!--            <div class="schart-box">-->
<!--                <div class="content-title">柱状图</div>-->
<!--                <schart class="schart" canvasId="bar" :options="options1"></schart>-->
<!--            </div>-->
<!--            <div class="schart-box">-->
<!--                <div class="content-title">饼状图</div>-->
<!--                <schart class="schart" canvasId="pie" :options="options3"></schart>-->
<!--            </div>-->
<!--            <div class="schart-box">-->
<!--                <div class="content-title">环形图</div>-->
<!--                <schart class="schart" canvasId="ring" :options="options4"></schart>-->
<!--            </div>-->
        </div>
    </div>
</template>

<script>
import Schart from 'vue-schart';
export default {
    name: 'basecharts',
    components: {
        Schart
    },
    data() {
        return {
            // options1: {
            //     type: 'bar',
            //     title: {
            //         text: '最近一周各品类销售图'
            //     },
            //     bgColor: '#fbfbfb',
            //     labels: ['周一', '周二', '周三', '周四', '周五'],
            //     datasets: [
            //         {
            //             label: '家电',
            //             fillColor: 'rgba(241, 49, 74, 0.5)',
            //             data: [234, 278, 270, 190, 230]
            //         },
            //         {
            //             label: '百货',
            //             data: [164, 178, 190, 135, 160]
            //         },
            //         {
            //             label: '食品',
            //             data: [144, 198, 150, 235, 120]
            //         }
            //     ]
            // },
            options2: {
                type: 'line',
                title: {
                    text: '最近五个月磁力链接录入趋势图'
                },
                bgColor: '#fbfbfb',
                labels: ['', '', '', '', ''],
                datasets:[
                    {
                        label: '磁力链接数量',
                        data:[]
                    }
                ]
            },
            // options3: {
            //     type: 'pie',
            //     title: {
            //         text: '服装品类销售饼状图'
            //     },
            //     legend: {
            //         position: 'left'
            //     },
            //     bgColor: '#fbfbfb',
            //     labels: ['T恤', '牛仔裤', '连衣裙', '毛衣', '七分裤', '短裙', '羽绒服'],
            //     datasets: [
            //         {
            //             data: [334, 278, 190, 235, 260, 200, 141]
            //         }
            //     ]
            // },
            // options4: {
            //     type: 'ring',
            //     title: {
            //         text: '环形三等分'
            //     },
            //     showValue: false,
            //     legend: {
            //         position: 'bottom',
            //         bottom: 40
            //     },
            //     bgColor: '#fbfbfb',
            //     labels: ['vue', 'react', 'angular'],
            //     datasets: [
            //         {
            //             data: [500, 500, 500]
            //         }
            //     ]
            // }

        };
    },

    methods:{

    },
    //初始化
    created() {
        const _this=this;
        //当前时间
        var date=new Date();
        var localYear=date.getFullYear();
        var localDay=date.getDate();
        var month_one=countMonth(date.getMonth()-4);
        var month_two=countMonth(date.getMonth()-3);
        var month_three=countMonth(date.getMonth()-2);
        var month_four=countMonth(date.getMonth()-1);
        var month_five=countMonth(date.getMonth());
        //拼接查询数据
        var dates=new Array();
        dates[0]=countYear(date.getMonth()-4)+"-"+month_one+"-"+"1";
        dates[1]=countYear(date.getMonth()-3)+"-"+month_two+"-"+"1";
        dates[2]=countYear(date.getMonth()-2)+"-"+month_three+"-"+"1";
        dates[3]=countYear(date.getMonth()-1)+"-"+month_four+"-"+"1";
        dates[4]=countYear(date.getMonth())+"-"+month_five+"-"+"01";
        dates[5]=countYear(date.getMonth())+"-"+month_five+"-"+localDay;
        //每月磁力统计数量
        var counts=new Array();
        //图标底部字段
        _this.options2.labels=[month_one+"月",month_two+"月",month_three+"月",month_four+"月",month_five+"月"];
        _this.options2.datasets[0].label='磁力链接数量';
        _this.options2.datasets[0].data=[0,0,0,0,0];
        //调用计算收录磁力方法
        countMagnet();
        //同步请求计算数量
        async function countMagnet() {
            for(var i=0;i<dates.length-1;i++){
                counts[i]=0;
                await _this.$axios({
                    method:'get',
                    url: 'http://localhost:8082/queryMagnet/count?start='+dates[i]+'&end='+dates[i+1]
                }).then(function (response) {
                    counts[i]=response.data;
                })
                //请求数据写入
                _this.options2.datasets[0].data=[counts[0],counts[1],counts[2],counts[3],counts[4]];
            }
        }
        //计算月份
        function countMonth(month) {
            var localMonth=month+1;
            if((localMonth%12)<=0){
                localMonth=12+localMonth;
            }else {
                localMonth=localMonth%12;
            }
            return localMonth;
        }
        //计算年份
        function countYear(month) {
            var localMonth=month+1;
            if((localMonth%12)<0){
                return localYear-1;
            }else {
                return localYear;
            }
        }
    }
};
</script>

<style scoped>
.schart-box {
    display: inline-block;
    margin: 20px;
}
.schart {
    width: 1000px;
    height: 500px;
}
.content-title {
    clear: both;
    font-weight: 400;
    line-height: 50px;
    margin: 10px 0;
    font-size: 22px;
    color: #1f2f3d;
}
</style>
