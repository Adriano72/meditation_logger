import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link, browserHistory } from 'react-router';
import { Announcements } from '../../../imports/collections/announcements';
import moment from 'moment';
import Alert from 'react-s-alert';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';
import Announcement from '../../../imports/classes/Announcement';
import { ValidationError } from 'meteor/jagi:astronomy';
import courses from '../../../data/courses';

class AnnouncementsCreate extends Component {

  constructor(props) {
    super(props);

    this.state = {
      error: '',
      groupSelected: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.updateValue = this.updateValue.bind(this);
  }

  handleChange(date) {
    this.setState({
      date: date
    });
  }

  updateValue (newValue) {
		this.setState({
			groupSelected: newValue,
		});
	}

  onSaveClick() {

    var newAnnouncement = new Announcement();
    newAnnouncement.insert(
      moment().format(),
      this.refs.title.value,
      this.refs.body.value,
      this.state.groupSelected.value,
      this.refs.sticky.checked
    );
    Alert.success('Announcement created', {
      position: 'top-left',
      effect: 'jelly',
      onShow: function () {
        setTimeout(function(){
          browserHistory.push('/session_list');
        }, 2000);
      },
      timeout: 1500,
      offset: 20
    });
  }

  render() {

    var coursesList = [];

    _.each(courses, (data, key) => {
      coursesList.push({value: data.courseName, label: data.courseName});
    });

    return (
        <div className="container-fluid top-buffer">
          <pre>
            <div className="form-group">
            <h2>New Announcement for the group: </h2>
            <div className="form-group" >

              <Select name="form-field-name" value={this.state.groupSelected} placeholder="select a group..." searchable options={coursesList} onChange={this.updateValue} />

            </div>
            <br />
            <div className="checkbox">
              <label>
                <input type="checkbox" ref="sticky" value="" />
                Sticky on top
              </label>
            </div>
            <div><label>Title</label></div>
            <div className="form-group">
              <input type="text" id="title" ref="title" className="form-control input-lg"/>
            </div>
            <div><label>Body</label></div>
            <textarea className="form-control" ref="body" rows="4" />


            </div>
            <div className="text-danger">{this.state.error}</div>
            <button
              className="btn btn-primary"
              onClick={this.onSaveClick.bind(this)}>
              Save
            </button>
            <Alert stack={{limit: 3}} />
          </pre>
        </div>
    )
  }
}

//export default SessionsCreate;

export default AnnouncementsCreate;
