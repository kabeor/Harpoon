import Basedata from "../pages/dashboard/base_analyzer/Basedata"
import protodata from "../pages/dashboard/proto_analyzer/protodata"
import PageNotFound from "../pages/PageNotFound";
import mainpage from "../pages/mainpage";
import flowdata from "../pages/dashboard/flow_analyzer/flowdata";
import ipdata from "../pages/dashboard/ip_analyzer/ipdata";

export const mainRoutes = [{
    path:'/mainpage',
    component: mainpage
},{
    path:'/404',
    component: PageNotFound
}];

export const dashboardRoutes=[{
    path:'/dashboard/base_analyzer',
    component: Basedata,
    isShow: true,
    title: '基础分析'
},{
    path:'/dashboard/proto_analyzer',
    component: protodata,
    isShow: true,
    title: '协议分析'
},{
    path:'/dashboard/flow_analyzer',
    component: flowdata,
    isShow: true,
    title: '流量分析'
},{
    path:'/dashboard/ip_analyzer',
    component: ipdata,
    isShow: true,
    title: 'IP分析'
}];