import React from 'react'
// 引入柱状图
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import Chart from './protochart.js'

function protodata(props) {
    return (
        <Chart />
    );
}

export default protodata;
