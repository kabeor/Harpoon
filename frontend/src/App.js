import React from 'react';
import './App.css';
import { Switch, Route, Redirect } from 'react-router-dom'
import { dashboardRoutes } from './routes'
import Frame from './components/Frame/Index'

function App() {
  return (
    <Frame>
      <Switch>
        {dashboardRoutes.map(route => {
          return (
            <Route key={route.path} path={route.path} exact={route.exact} render={routeProps => {
              return <route.component {...routeProps} />;
            }}
            />
          );
        })}
        {/* <Redirect to={dashboardRoutes[0].path} from="/dashboard" /> */}
        <Redirect to='/mainpage'/>
        <Redirect to='/404'/>
      </Switch>
    </Frame>
  );
}

export default App;
