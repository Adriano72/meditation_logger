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

class SessionsCreate extends Component {

  constructor(props) {
    super(props);

    this.state = {
      error: '',
      date: moment()
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(date) {
    this.setState({
      date: date
    });
  }

  checkDuplicates() {
    var stateDate = new Date(moment(this.state.date).startOf('day').format());
    var test = _.find(this.props.sessions, function(o) {
      return (o.sessionDay.getTime() === stateDate.getTime());
    });
    return(test);
  }

  onSaveClick() {
    if(this.checkDuplicates()){
      //console.log("A session has already been entered for this day!");
      Alert.error('A session has already been entered for this day!', {
        position: 'top-left',
        effect: 'slide',
        timeout: 3000,
        offset: 360
      });
    } else {
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
  }

  render() {
    return (
        <div>
          <div className="form-group">
            <label>Date</label>
            <DatePicker ref="date"
              selected={this.state.date}
              onChange={this.handleChange}
            />

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
          <button
            className="btn btn-primary"
            onClick={this.onSaveClick.bind(this)}>
            Save
          </button>
          <Alert stack={{limit: 3}} />
        </div>
    )
  }
}

//export default SessionsCreate;

export default createContainer(() => {
  Meteor.subscribe('sessions');

  return { sessions: Sessions.find({}).fetch() };
}, SessionsCreate);
