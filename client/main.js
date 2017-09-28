import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './components/app';
import LoggerMain from './components/logger_main';
import SessionsList from './components/sessions/sessions_list';

const routes = (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={SessionsList} />
      <Route path="session_list" component={SessionsList} />
      <Route path="new_session" component={LoggerMain} />
    </Route>
  </Router>
)

Meteor.startup(() => {
  ReactDOM.render(routes, document.querySelector('.render-target'));
});
