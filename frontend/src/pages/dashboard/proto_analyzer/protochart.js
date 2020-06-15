import React, { useEffect, useState } from 'react'
import { Card } from 'antd'

import ReactEcharts from 'echarts-for-react';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts'
// 引入饼图
import 'echarts/lib/chart/bar'
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import { pcaplenApi, protokindApi, mostprotoApi, httpprotokeyApi, httpprotovalueApi, dnsprotokeyApi, dnsprotovalueApi } from '../../../services/datapkts.js'
import theme from '../theme.js'

function Chart(props) {
    echarts.registerTheme('my_theme', theme);

    const [pcaplendata, setPcapLen] = useState([])
    useEffect(() => {
        pcaplenApi().then(res => {
            setPcapLen(res.data)
        });
    }, []);
    let pcaplen_option = {
        title: {
            text: '数据包长度统计'
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            data: [
                '0-300', '301-600', '601-900', '901-1200', '1201-1500'
            ]
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '数据包长度',
                type: 'bar',
                data: [
                    { value: pcaplendata['0-300'], name: '0-300' },
                    { value: pcaplendata['301-600'], name: '301-600' },
                    { value: pcaplendata['601-900'], name: '601-900' },
                    { value: pcaplendata['901-1200'], name: '901-1200' },
                    { value: pcaplendata['1201-1500'], name: '1201-1500' }
                ]
            }
        ]
    }

    const [protokinddata, setProtoKind] = useState([])
    useEffect(() => {
        protokindApi().then(res => {
            setProtoKind(res.data)
        });
    }, []);
    let protokind_option = {
        title: {
            text: '协议统计',
            x: 'center'
        },
        tooltip: {
            show: true
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                name: '协议类型',
                boundaryGap: true,
                data: ["IP", "IPv6", "TCP", "UDP", "ARP", "ICMP", "DNS", "HTTP", "HTTPS", "Others"]
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '数据包个数'
            }
        ],
        series: [
            {
                "name": "数量",
                "type": "bar",
                // itemStyle:{
                //     normal:{
                //         label:{show:true},
                //         color:'#87cefa' //图例颜色设置
                //         },
                //     emphasis:{label:{show:true}}
                //         },
                "data": protokinddata
            }
        ]
    }

    const [mostprotodata, setMostProto] = useState([])
    useEffect(() => {
        mostprotoApi().then(res => {
            var data = [];
            for (const i in res.data) {
                data.push({ value: res.data[i], name: i })
            }

            setMostProto(data)
        });
    }, []);
    let mostproto_option = {
        title: {
            text: '数量最多协议统计',
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            data: []
        },
        calculable: false,
        series: [
            {
                name: '协议数量',
                type: 'pie',
                radius: '60%',
                center: ['50%', '50%'],
                data: mostprotodata
            }
        ]
    }

    const [httpprotokeydata, sethttpProtokey] = useState([])
    const [httpprotovaluedata, sethttpProtovalue] = useState([])
    useEffect(() => {
        httpprotokeyApi().then(res => {
            sethttpProtokey(res.data)
        });
    },[]);
    useEffect(() => {
        httpprotovalueApi().then(res => {
            sethttpProtovalue(res.data)
        });
    },[])
    let httpproto_option={
        title : {
            text: 'HTTP/HTTPS访问统计',
        },
        tooltip : {
            trigger: 'axis'
        },
        xAxis : [
            {
                type : 'value',
                name : '数据包个数'
            }
        ],
        yAxis : [
            {
                type : 'category',
                name : '访问IP',
                data : httpprotokeydata
            }
        ],
        series : [
            {
                name:'数据包个数',
                itemStyle:{
                    normal:{
                        label:{show:true},
                        color:'#6495ed' //图例颜色设置
                        },
                    emphasis:{label:{show:true}}
                        },
                type:'bar',
                data:httpprotovaluedata
            }
        ]
    }

    const [dnsprotokeydata, setdnsProtokey] = useState([])
    const [dnsprotovaluedata, setdnsProtovalue] = useState([])
    useEffect(() => {
        dnsprotokeyApi().then(res => {
            setdnsProtokey(res.data)
        });
    },[]);
    useEffect(() => {
        dnsprotovalueApi().then(res => {
            setdnsProtovalue(res.data)
        });
    },[]);
    let dnsproto_option={
        title : {
            text: 'DNS访问统计',
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
                name : '请求网址',
                data : dnsprotokeydata
            }
        ],
         grid: { // 控制图的大小，调整下面这些值就可以
              x: 150,
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
                data:dnsprotovaluedata
            }
        ]
    }

    return (
        <div>
            <Card>
                <ReactEcharts option={pcaplen_option} theme='my_theme' notMerge={true} lazyUpdate={true} style={{ height: 300, width: '30%', float: "left" }} />
                <ReactEcharts option={protokind_option} theme='my_theme' notMerge={true} lazyUpdate={true} style={{ height: 300, width: '70%', float: "left" }} />
                <br></br>
                <ReactEcharts option={httpproto_option} theme='my_theme' notMerge={true} lazyUpdate={true} style={{ height: 380, width: '100%', float: "right" }} />
                <ReactEcharts option={mostproto_option} theme='my_theme' notMerge={true} lazyUpdate={true} style={{ height: 380, width: '30%', float: "left" }} />
                <ReactEcharts option={dnsproto_option} theme='my_theme' notMerge={true} lazyUpdate={true} style={{ height: 380, width: '70%', float: "left" }} />
            </Card>
        </div>
    );
}

export default Chart
