import React from 'react'
import { Upload, message, Card } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import './mainpage.css'

function mainpage() {
    const { Dragger } = Upload;

    const props = {
        name: 'file',
        multiple: false,
        action: 'http://127.0.0.1:5000/upload',
        type: 'file',
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
                // console.log(info)
                setTimeout(20000)
                window.location.href = "http://127.0.0.1:3000/#/dashboard/base_analyzer"
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    return (
        <div id="box">
        <div>
            <h1 id='tit' style={{textAlign:'center',color: ''}}>Harpoon</h1>
            <Card style={{width: 600, backgroundColor: 'rgba(255,255,255,0.2)'}}>
                <Dragger {...props} style={{ height: '100%', backgroundColor: 'rgba(255,255,255,0.2)'}}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">点击或拖拽上传文件</p>
                    <p className="ant-upload-hint">
                        请上传要进行分析的pcap包     
                </p>
                </Dragger>
            </Card>
        </div>
        </div>
    )
}

export default mainpage;
