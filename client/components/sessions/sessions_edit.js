import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link, browserHistory } from 'react-router';
import DatePicker from 'react-datepicker';
import { Sessions } from '../../../imports/collections/sessions';
import moment from 'moment';
import bootbox from 'bootbox';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';
import Session from '../../../imports/classes/Session';
import { ValidationError } from 'meteor/jagi:astronomy';
import 'react-datepicker/dist/react-datepicker.css';

class SessionsEdit extends Component {



  updateSession() {
    var newSession = new Session(this.props.sessions);
    newSession.insert(
      moment(this.props.sessions.sessionDay).startOf('day').format(),
      this.refs.morning.checked,
      this.refs.evening.checked,
      this.refs.journal.value
    );
    Alert.success('Session Updated', {
      position: 'top-left',
      effect: 'jelly',
      onShow: function () {
        setTimeout(function(){
          browserHistory.push('/session_list');
        }, 2000);
      },
      timeout: 1500,
      offset: 450
    });

  };

  confirmDelete(){
    const presentSession = this.props.sessions;
    bootbox.confirm({
        message: "Are you sure you want to delete this session?",
        buttons: {
            confirm: {
                label: 'Yes',
                className: 'btn-success'
            },
            cancel: {
                label: 'No',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            if(result){
              console.log("SESSIONS NELLA DIALOG: ", presentSession);
              var newSession = new Session(presentSession);
              newSession.delete(newSession);
              return browserHistory.push('/session_list');
            };
        }
    });
  }

  componentWillMount() {
    if(_.isUndefined(this.props.sessions)){
      console.log("COMP WILL MOUNT ", _.isUndefined(this.props.sessions));
      return browserHistory.push('/session_list');
    };

  };

  render() {

    if(_.isUndefined(this.props.sessions)){
      //console.log("COMP WILL MOUNT ", _.isUndefined(this.props.sessions));
      return <div>Updating...</div>;
    };

    console.log("SESSION : ",this.props);
    console.log("CHECKED: ", this.props.sessions.morningSession?"checked":"");
    const cdate = (moment(this.props.sessions.sessionDay).format('MMMM Do YYYY'));
    const morningSession = this.props.sessions.morningSession?"checked":"";
    const eveningSession = this.props.sessions.eveningSession?"checked":"";
    const journalEntry = this.props.sessions.journalText;

    return (
        <div className="container-fluid">
          <pre>
          <div className="form-group">
            <h2>Edit Session</h2>
            <label>Date</label>
            <div>
              {cdate}
            </div>

            <div className="checkbox">
              <label>
                <input type="checkbox" ref="morning" defaultChecked={morningSession} />
                Morning Session Done
              </label>
            </div>
            <div className="checkbox disabled">
              <label>
                <input type="checkbox" ref="evening" defaultChecked={eveningSession} />
                Evening Session Done
              </label>
            </div>
            <div><label>Journal</label></div>
            <textarea className="form-control" ref="journal" rows="4" defaultValue={journalEntry} />
          </div>
          <div className="btn-toolbar">
            <button
              className="btn btn-primary"
              onClick={this.updateSession.bind(this)}>
              Save
            </button>
            <button
              className="btn btn-danger"
              onClick={this.confirmDelete.bind(this)}>
              Delete
            </button>
          </div>
          <Alert stack={{limit: 3}} />
          </pre>
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
