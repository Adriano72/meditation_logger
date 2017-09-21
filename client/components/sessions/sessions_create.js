import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import { Sessions } from '../../../imports/collections/sessions';
import moment from 'moment';

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

    newDate = moment(this.state.date).format("MMM Do YY");


    const date = Sessions.findOne({
      'sessionDay': this.state.date
    });
    console.log("Duplicates state "+ date );
  }

  onSaveClick() {
    this.checkDuplicates();

    Meteor.call(
      'sessions.insert',
      moment(this.state.date).format(),
      this.refs.morning.checked,
      this.refs.evening.checked,
      this.refs.journal.value
    )
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
        </div>
    )
  }
}

export default SessionsCreate;
