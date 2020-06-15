import React from 'react'
import ReactEcharts from 'echarts-for-react';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts'

import {timeflowkeyApi, timeflowvalueApi, dataflowApi, protoflowApi, mostflow_keysApi, mostflowApi} from '../../../services/datapkts.js'
import theme from '../theme.js'
import { Card } from 'antd';
import { useState, useEffect } from 'react';

function Flowchart(props) {
    echarts.registerTheme('my_theme', theme);

    const [timeflowkeydata, setTimeFlowKey] = useState([])
    const [timeflowvaluedata, setTimeFlowValue] = useState([])
    useEffect(() => {
        timeflowkeyApi().then(res => {
            setTimeFlowKey(res.data)
        })
    }, [])
    useEffect(() => {
        timeflowvalueApi().then(res => {
            setTimeFlowValue(res.data)
        })
    }, [])
    let timeflow_option={
        title : {
            text: '时间流量图',
            x:'center'
        },
        tooltip : {
            trigger: 'axis'
        },
        calculable : false,
        xAxis : [
            {
                type : 'category',
                name : '相对时间',
                boundaryGap : true,
                data : timeflowkeydata
            }
        ],
        yAxis : [
            {
                type : 'value',
                name : '数据包字节',
                axisLabel : {
                    formatter: '{value} byte'
                }
            }
        ],
        series : [
            {
                name:'数据包字节',
                type:'line',
                smooth:true,
                symbol: 'none',
                itemStyle:{
                    normal:{
                        label:{show:true},
                        color:'#6495ed', //图例颜色设置
                        },
                    emphasis:{label:{show:true}}
                        },
                data: timeflowvaluedata
            }
        ]
    }

    const [dataflow, setDataFlow] = useState([])
    useEffect(() => {
        dataflowApi().then(res=>{
            setDataFlow(res.data)
        })
    }, [])
    let dataflow_option={
        title : {
            text: '数据流入流出统计',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient : 'vertidata_in_lencal',
            x : 'left',
            data:['流入','流出']
        },
        calculable : false,
        series : [
            {
                name:'数据流入流出',
                type:'pie',
                radius : '60%',
                center: ['50%', '50%'],
                data:[
                    {value: dataflow['IN'], name:'流入'},
                    {value: dataflow['OUT'], name:'流出'}
                ]
            }
        ]
    }

    const [protoflow, setProtoFlow] = useState([])
    useEffect(() => {
        protoflowApi().then(res=>{
            setProtoFlow(res.data)
        })
    }, [])
    let protoflow_option={
                    title : {
                        text: '常见协议流量统计',
                        x:'center'
                    },
                    tooltip: {
                        show: true
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            name : '协议类型',
                            boundaryGap : true,
                            data : ["IP","IPv6","TCP","UDP","ARP","ICMP","DNS","HTTP","HTTPS","Others"]
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            name : '协议数据包总流量'
                        }
                    ],
                    series : [
                        {
                            "name":"协议数据包总流量",
                            "type":"bar",
                            itemStyle:{
                                normal:{
                                    label:{show:true},
                                    color:'#87cefa' //图例颜色设置
                                    },
                                emphasis:{label:{show:true}}
                                    },
                            "data": protoflow
                        }
                    ]
    }

    let protoflowlen_option={
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient : 'horizontal',
            x : 'left',
            data:["IP","IPv6","TCP","UDP","ARP","ICMP","DNS","HTTP","HTTPS","Others"]
        },
        calculable : false,
        series : [
            {
                name:'协议数据包总流量',
                type:'pie',
                radius : '60%',
                center: ['50%', '50%'],
                data:[
                    {value: protoflow[0], name:'IP'},
                    {value: protoflow[1], name:'IPv6'},
                    {value: protoflow[2], name:'TCP'},
                    {value: protoflow[3], name:'UDP'},
                    {value: protoflow[4], name:'ARP'},
                    {value: protoflow[5], name:'ICMP'},
                    {value: protoflow[6], name:'DNS'},
                    {value: protoflow[7], name:'HTTP'},
                    {value: protoflow[8], name:'HTTPS'},
                    {value: protoflow[9], name:'Others'}
                ]
            }
        ]
    }

    const [mostflowkey, setmostFlowKey] = useState([])
    const [mostflow, setmostFlow] = useState([])
    useEffect(() => {
        mostflow_keysApi().then(res=>{
            setmostFlowKey(res.data)
        })
    }, [])
    useEffect(() => {
        mostflowApi().then(res=>{
            var data = [];
            for (const i in res.data) {
                data.push({ value: res.data[i][1], name: res.data[i][0] })
            }
            setmostFlow(data)
        })
    }, [])
    let mostflow_option={
        title : {
            text: '流量最多协议统计',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} KB"
        },
        legend: {
            orient : 'vertical',
            x : 'left',
            data: mostflowkey
        },
        calculable : false,
        series : [
            {
                name:'协议数据包总流量',
                type:'pie',
                radius : '60%',
                center: ['50%', '55%'],
                data: mostflow
            }
        ]
    }

    return (
        <div>
            <Card>
                <ReactEcharts option={timeflow_option} theme='my_theme' notMerge={true} lazyUpdate={true} style={{ height: 400, width: '75%', float: "left" }} />
                <ReactEcharts option={dataflow_option} theme='my_theme' notMerge={true} lazyUpdate={true} style={{ height: 400, width: '25%', float: "left" }} />
                <br></br>
                <ReactEcharts option={protoflow_option} theme='my_theme' notMerge={true} lazyUpdate={true} style={{ height: 400, width: '50%', float: "left" }} />
                <ReactEcharts option={protoflowlen_option} theme='my_theme' notMerge={true} lazyUpdate={true} style={{ height: 400, width: '25%', float: "left" }} />
                <ReactEcharts option={mostflow_option} theme='my_theme' notMerge={true} lazyUpdate={true} style={{ height: 400, width: '25%', float: "left" }} />
            </Card>
        </div>
    )
}

export default Flowchart
