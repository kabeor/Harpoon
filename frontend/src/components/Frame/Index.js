import React from 'react'
import { withRouter } from 'react-router-dom'
import ReactDOM from 'react-dom'
import './frame.css'
import { dashboardRoutes } from '../../routes'
import logo from './logo.png'

import { Layout, Menu } from 'antd';

const { Header, Content, Footer, Sider } = Layout;
const routes = dashboardRoutes.filter(route => route.isShow)

class Index extends React.Component {
    state = {
        collapsed: false,
    };

    onCollapse = collapsed => {
        this.setState({ collapsed });
    };

    render(props) {
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                    <div className="logo">
                        <img src={logo} alt="logo" width='200' height='64'/>
                    </div>
                    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                        {routes.map(route => {
                            return (
                                <Menu.Item key={route.path} onClick={p=>this.props.history.push(p.key)}>
                                    {route.title}
                                </Menu.Item>
                            );
                        })}
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{ padding: 0 }} />
                    <Content style={{ margin: '0 16px' }}>
                        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                            {this.props.children}
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>kabeor Design ©2020 Created by kabeor</Footer>
                </Layout>
            </Layout>
        );
    }
}

ReactDOM.render(<Index />, window.root);

export default withRouter(Index);
