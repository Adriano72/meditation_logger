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


  onDataChange() {

    var newSession = new Session(this.props.sessions);
    newSession.insert(
      moment(this.props.sessions.sessionDay).startOf('day').format(),
      this.refs.morning.checked,
      this.refs.evening.checked,
      this.refs.journal.value
    );
    Alert.success('Session updated', {
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
    console.log("CHECKED: ", this.props.sessions.morningSession?"checked":"");
    const cdate = (moment(this.props.sessions.sessionDay).format('MMMM Do YYYY'));
    const morningSession = this.props.sessions.morningSession?"checked":"";
    const eveningSession = this.props.sessions.eveningSession?"checked":"";
    const journalEntry = this.props.sessions.journalText;

    return (
        <div className="container-fluid">
          <div className="form-group">
            <label>Date</label>
            <div>
              {cdate}
            </div>

            <div className="checkbox">
              <label>
                <input type="checkbox" ref="morning" checked={morningSession} onChange={this.onDataChange.bind(this)} />
                Morning Session Done
              </label>
            </div>
            <div className="checkbox disabled">
              <label>
                <input type="checkbox" ref="evening" checked={eveningSession} onChange={this.onDataChange.bind(this)} />
                Evening Session Done
              </label>
            </div>
            <div><label>Journal</label></div>
            <textarea className="form-control" ref="journal" rows="4" value={journalEntry} onChange={this.onDataChange.bind(this)} />
          </div>
          <div className="btn-toolbar">
          <button
            className="btn btn-primary"
            onClick={this.onDataChange.bind(this)}>
            Update
          </button>
          <button
            className="btn btn-danger"
            onClick={this.onDataChange.bind(this)}>
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
