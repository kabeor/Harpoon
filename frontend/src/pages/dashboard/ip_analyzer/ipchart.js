import React from 'react'
import ReactEcharts from 'echarts-for-react';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts'

import {ipflowApi} from '../../../services/datapkts.js'
import theme from '../theme.js'
import { Card } from 'antd';
import { useState, useEffect } from 'react';

function Ipchart(props) {
    echarts.registerTheme('my_theme', theme);

    const [ipflow, setIpFlow] = useState([])
    useEffect(() => {
        ipflowApi().then(res=>{
            setIpFlow(res.data)
        })
    }, [])
    let ipflowpktin_option={
        title : {
            text: '流入IP流量数据包个数图',
        },
        tooltip : {
            trigger: 'axis'
        },
        calculable : true,
        xAxis : [
            {
                type : 'value',
                name : '数据包个数'
            }
        ],
        yAxis : [
            {
                type : 'category',
                name : '流入IP',
                data : ipflow['in_keyp']
            }
        ],
         grid: { // 控制图的大小，调整下面这些值就可以
              x: 100,
         },
        series : [
            {
                name:'数据包个数',
                type:'bar',
                itemStyle:{
                    normal:{
                        label:{show:true},
                        color:'#6495ed' //图例颜色设置
                        },
                    emphasis:{label:{show:true}}
                        },
                data: ipflow['in_packet']
            }
        ]
    }

    let ipflowpktout_option={
        title : {
            text: '流出IP流量数据包个数图',
        },
        tooltip : {
            trigger: 'axis'
        },
        calculable : true,
        xAxis : [
            {
                type : 'value',
                name : '数据包个数'
            }
        ],
        yAxis : [
            {
                type : 'category',
                name : '流出IP',
                data : ipflow['out_keyp']
            }
        ],
         grid: { // 控制图的大小，调整下面这些值就可以
              x: 100,
         },
        series : [
            {
                name:'数据包个数',
                type:'bar',
                itemStyle:{
                    normal:{
                        label:{show:true},
                        color:'#ff7f50' //图例颜色设置
                        },
                    emphasis:{label:{show:true}}
                        },
                data: ipflow['out_packet']
            }
        ]
    }

    let ipflowin_option={
        title : {
            text: '流入IP总流量图',
        },
        tooltip : {
            trigger: 'axis'
        },
        calculable : true,
        xAxis : [
            {
                type : 'value',
                name : '数据包总流量'
            }
        ],
        yAxis : [
            {
                type : 'category',
                name : '流入IP',
                data : ipflow['in_keyl']
            }
        ],
         grid: { // 控制图的大小，调整下面这些值就可以
              x: 100,
         },
        series : [
            {
                name:'数据包总流量',
                type:'bar',
                itemStyle:{
                    normal:{
                        label:{show:true},
                        color:'#6495ed' //图例颜色设置
                        },
                    emphasis:{label:{show:true}}
                        },
                data: ipflow['in_len']
            }
        ]
    }

    let ipflowout_option={
        title : {
            text: '流出IP总流量图',
        },
        tooltip : {
            trigger: 'axis'
        },
        calculable : true,
        xAxis : [
            {
                type : 'value',
                name : '数据包总流量'
            }
        ],
        yAxis : [
            {
                type : 'category',
                name : '流出IP',
                data : ipflow['out_keyl']
            }
        ],
         grid: { // 控制图的大小，调整下面这些值就可以
              x: 100,
         },
        series : [
            {
                name:'数据包总流量',
                type:'bar',
                itemStyle:{
                    normal:{
                        label:{show:true},
                        color:'#ff7f50' //图例颜色设置
                        },
                    emphasis:{label:{show:true}}
                        },
                data: ipflow['out_len']
            }
        ]
    }

    return (
        <div>
            <Card>
                <ReactEcharts option={ipflowpktin_option} theme='my_theme' notMerge={true} lazyUpdate={true} style={{ height: 400, width: '50%', float: "left" }} />
                <ReactEcharts option={ipflowpktout_option} theme='my_theme' notMerge={true} lazyUpdate={true} style={{ height: 400, width: '50%', float: "left" }} />
                <br/>
                <ReactEcharts option={ipflowin_option} theme='my_theme' notMerge={true} lazyUpdate={true} style={{ height: 400, width: '50%', float: "left" }} />
                <ReactEcharts option={ipflowout_option} theme='my_theme' notMerge={true} lazyUpdate={true} style={{ height: 400, width: '50%', float: "left" }} />
            </Card>
        </div>
    )
}

export default Ipchart
