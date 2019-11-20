import React from 'react';
import { createBrowserHistory } from 'history';
import { BrowserRouter as Router, Route, withRouter } from "react-router-dom";
import { Redirect } from 'react-router';

import SignIn from './containers/SignIn';
import Home from './containers/Home';
import Project from './containers/Project';
import store from 'store';
import './App.css';

const history =  createBrowserHistory();

const AppComponent = withRouter(SignIn);

function RouterComponent () {
  return(
    <Router history={history}>
      <div style={{ width: '100%' }}>
        <Route path="/" exact component={AppComponent} />
        <PrivateRoute history={history} path="/home" component={Home} />
        <PrivateRoute history={history} path="/project/:id" component={Project} />
      </div>
    </Router>
  );
}

const PrivateRoute = ({ component: Component, history, ...rest }) => (
  <Route {...rest} render={(props) => {
    return store.get('logged')
      ? <Component {...props} />
      : <Redirect to='/' />
   }} />
);

export default RouterComponent;
