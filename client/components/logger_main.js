import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Sessions } from '../../imports/collections/sessions';
import SessionsCreate from './sessions/sessions_create';

class LoggerMain extends Component {
  render() {
    return (
      <div className="container-fluid">
        <SessionsCreate />
      </div>
    );
  }
}

export default LoggerMain;
