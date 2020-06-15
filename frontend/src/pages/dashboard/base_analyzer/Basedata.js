import React, { useEffect, useState } from 'react'
import { Input, Divider, Table, Button, Modal, Select, Space } from 'antd'
import { listpktsApi, getpktdatabyidApi, filterpcapApi } from '../../../services/datapkts'
const { Option } = Select;
const { Search } = Input;

function Basedata(props) {
    const [filterkind, setFilterKind] = useState("All")
    const [vis, setVisibleStates] = useState([])
    const [pkthtml, setPktHtmlData] = useState()
    function showpktdata(id) {
        getpktdatabyidApi(id).then(res => {
            setPktHtmlData(res.data)
        })
    }

    const [dataSource, setDataSource] = useState([])
    useEffect(() => {
        listpktsApi().then(res => {
            setDataSource(res.data)
        });
    }, []);

    const columns = [{
        title: '序号',
        key: 'id',
        width: 80,
        align: 'center',
        render: (txt, record, index) => index + 1
    }, {
        title: '时间',
        dataIndex: 'time'
    }, {
        title: '源IP',
        dataIndex: 'Source'
    }, {
        title: '目标IP',
        dataIndex: 'Destination'
    },
    {
        title: '长度',
        dataIndex: 'len'
    }, {
        title: '协议',
        dataIndex: 'Procotol'
    }, {
        title: '操作',
        render: (txt, record, index) => {
            return (
                <div>
                    <Button type="primary" onClick={() => {
                        const delModalVisible = [];
                        delModalVisible[record.id] = true;
                        setVisibleStates(delModalVisible);
                    }}
                    > Info </Button>

                    {vis[record.id] ?
                        <Modal title='数据包详细信息' visible='true' onOk={() => {
                            const delModalVisible = [];
                            delModalVisible[record.id] = false;
                            setVisibleStates(delModalVisible);
                        }}
                            onCancel={() => {
                                const delModalVisible = [];
                                delModalVisible[record.id] = false;
                                setVisibleStates(delModalVisible);
                            }}>
                            {showpktdata(record.id)}
                            <div dangerouslySetInnerHTML={{ __html: pkthtml }} />
                        </Modal> : null}
                </div>
            )
        }
    }]

    return (
        <>
            <Divider dashed={true}>过滤规则</Divider>
            <Space align="center">
                 <Select defaultValue="All" onChange={(kindvalue)=>{setFilterKind(kindvalue)}} filterOption={false} style={{width: 180}}>
                     <Option value="All">全部</Option>
                    <Option value="Procotol">协议</Option>
                    <Option value="Source">源IP地址(:端口)</Option>
                    <Option value="Destination">目的IP地址(:端口)</Option>
                </Select>
                <Search
                    placeholder="input search text"
                    onSearch={(datavalue) => {
                        filterpcapApi(filterkind+'-'+datavalue).then(res=>{
                            setDataSource(res.data)
                        })
                    }}
                    style={{ width: 500 }}
                />
            </Space>
            <Divider>数据包信息</Divider>
            <Table rowKey={record => record.id} columns={columns} bordered dataSource={dataSource}></Table>
        </>

    )
}

export default Basedata;
