import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './components/app';
import SessionsCreate from './components/sessions/sessions_create';

const routes = (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
    <Route path="new_session" component={SessionsCreate} />

    </Route>
  </Router>
)

Meteor.startup(() => {
  ReactDOM.render(routes, document.querySelector('.render-target'));
});
