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


/*
Nesse arquivo temos as configurações de rota usando react-router
com ele controlamos apenas pessoas logadas para ver as páginas
e associamos a cada url do app um component Container que se refere
a página no geral

history - é usado porque o html5 com essa api do history nos permite
mudar a url da pãgina e navegar sem fazer refresh, com ele temos o rastreio complete
de todas as mudanças de rotas
*/

function RouterComponent () {
  return(
    <Router history={history}>
      <div style={{ width: '100%' }}>
        <Route path="/" exact component={AppComponent} />
        <Route history={history} path="/home" component={Home} />
        <Route history={history} path="/project/:id" component={Project} />
      </div>
    </Router>
  );
}

const PrivateRoute = ({ component: Component, history, ...rest }) => (
  <Route {...rest} render={(props) => {
    return <Component {...props} />
   }} />
);

export default RouterComponent;
