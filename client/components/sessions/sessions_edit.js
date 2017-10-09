import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link, browserHistory } from 'react-router';
import DatePicker from 'react-datepicker';
import { Sessions } from '../../../imports/collections/sessions';
import moment from 'moment';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';
import Session from '../../../imports/classes/Session';
import { ValidationError } from 'meteor/jagi:astronomy';
import 'react-datepicker/dist/react-datepicker.css';

class SessionsEdit extends Component {


  onSaveClick() {

    var newSession = new Session();
    newSession.insert(
      moment(this.state.date).startOf('day').format(),
      this.refs.morning.checked,
      this.refs.evening.checked,
      this.refs.journal.value
    );
    Alert.success('Session created', {
      position: 'top-left',
      effect: 'jelly',
      onShow: function () {
        setTimeout(function(){
          browserHistory.push('/session_list');
        }, 2000);
      },
      timeout: 1500,
      offset: 360
    });

  }

  render() {
    console.log("SESSION : ",this.props);
    const cdate = (moment(this.props.sessions.sessionDay).format('MMMM Do YYYY'));
    return (
        <div className="container-fluid">
          <div className="form-group">
            <label>Date</label>
            <div>
              {cdate}
            </div>

            <div className="checkbox">
              <label>
                <input type="checkbox" ref="morning" value="" />
                Morning Session Done
              </label>
            </div>
            <div className="checkbox disabled">
              <label>
                <input type="checkbox" ref="evening" value="" />
                Evening Session Done
              </label>
            </div>
            <div><label>Journal</label></div>
            <textarea className="form-control" ref="journal" rows="4" />


          </div>
          <div className="text-danger">{this.state.error}</div>
          <div className="btn-toolbar">
          <button
            className="btn btn-primary"
            onClick={this.onSaveClick.bind(this)}>
            Update
          </button>
          <button
            className="btn btn-danger"
            onClick={this.onSaveClick.bind(this)}>
            Delete
          </button>
          </div>
          <Alert stack={{limit: 3}} />
        </div>
    )
  }
}

//export default SessionsEdit;

export default createContainer((props) => {
  console.log("PROPS: ", props);
  const { sessionId } = props.params;
  console.log("SESSION ID: ", { sessionId });

  Meteor.subscribe('sessions');

  return { sessions: Sessions.findOne(sessionId) };
}, SessionsEdit);
