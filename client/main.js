import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './components/app';
import LoggerMain from './components/logger_main';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import SessionsList from './components/sessions/sessions_list';
import SessionsEdit from './components/sessions/sessions_edit';

Accounts.ui.config({
  passwordSignupFields: "USERNAME_AND_EMAIL"
});

const routes = (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={SessionsList} />
      <Route path="login" component={LoginPage}/>
      <Route path="signup" component={SignupPage}/>
      <Route path="session_list" component={SessionsList} />
      <Route path="new_session" component={LoggerMain} />
      <Route path="edit_session/:sessionId" component={SessionsEdit} />
    </Route>
  </Router>
)

Meteor.startup(() => {
  ReactDOM.render(routes, document.querySelector('.render-target'));
});
