import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link, browserHistory } from 'react-router';
import { Announcements } from '../../../imports/collections/announcements';
import Select from 'react-select';
import moment from 'moment';
import courses from '../../../data/courses';

class AnnouncementsList extends Component {

  constructor(props){
    super(props);
    this.state = {
      isAdmin: this.getAdminState(),
      groupSelected: 'all',
      announcementCollection: props.announcements,
      rateOfSuccess: "Computing..."
    };
    this.updateValue = this.updateValue.bind(this);
    //this.renderSelectGroupControl = this.renderSelectGroupControl.bind(this);
    //this.sortListAlphabetically = this.sortListAlphabetically.bind(this);
  }

  getAdminState(){
    var loggedInUser = Meteor.user();

    if ( !Roles.userIsInRole(loggedInUser, 'admin', 'Meditation and Leadership Oct 2017') ) {
      return false
    }
    return true
  }

  updateValue (newValue) {
    console.log('NEW VALUE ', newValue);
    console.log('State was ', this.state.groupSelected);
    const passedState = newValue?newValue.label:'all';


		this.setState({
			groupSelected: passedState,
      announcementCollection: this.props.announcements
		});
    console.log('State changed to ', this.state.groupSelected);

	}

  componentDidUpdate(prevProps, prevState){
    /*
    if(this.state.groupSelected != prevState.groupSelected){
      console.log("DIFFERENT");
      console.log('COMPONENT DID UPDATE');
      let filteredUSers = [];
      let t_state = this.state.groupSelected;

      _.each(this.state.announcementCollection, function(t_user){
        if(Roles.userIsInRole(t_user,['student'], t_state)){
          console.log('PRESENTE: ', t_user, 'IN ',t_state);
          filteredUSers.push(t_user);
        }else{
          console.log('NON PRESENTE: ', t_user, 'IN ',t_state);
        };
      });

      this.setState({
        announcementCollection: this.sortListAlphabetically(filteredUSers),
      });


    }else{
      console.log("SAME");
    }
    */

  }

  /*
  sortListAlphabetically(p_list){
    return _.sortBy(p_list, ['username']);
  }
    */

  componentWillReceiveProps(nextProps){
    this.setState({
      //announcementCollection: this.sortListAlphabetically(nextprops.announcements),
      announcementCollection: nextProps.announcements,
    });
  }


  componentWillMount(){

    if (!this.state.isAdmin) {
      //browserHistory.push('/session_list');
    }
  }

  renderSelectGroupControl(){
    if (this.state.isAdmin){
      let coursesList = [];

      _.each(courses, (data, key) => {
        coursesList.push({value: data.courseName, label: data.courseName});
      });

      return(
        <div className="form-group" >
          <Select name="form-field-name" value={this.state.groupSelected} placeholder="Filter by group" searchable options={coursesList} onChange={this.updateValue} />
        </div>
      );
    }
  }

  renderRows() {
    var announcements = this.state.announcementCollection;

    console.log('*** ANNOUNCEMENTS ***: ', announcements);
    if(announcements){



      return announcements.map(announcement => {

          const userViewUrl = `/student_detail/${announcement._id}`;
          const cdate = (moment(announcement.creationDate).format('MMMM Do YYYY'));
          //const group = Object.keys(user.roles)[0];
          //const body = user.emails[0].address;
          return (
            <tr key={announcement._id}>
              <td>{cdate}</td>
              <td>{announcement.title}</td>
              <td>{announcement.body}</td>
            </tr>
          )

      });
    }
  };

  render() {



    return (
      <div className="container-fluid top-buffer">
        <pre>
          <span><h2>Announcements dashboard</h2></span><br />
          {this.renderSelectGroupControl()}
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Body</th>
              </tr>
            </thead>
            <tbody>
              {this.renderRows()}
            </tbody>
          </table>

        </pre>
      </div>
    );
  }
}

export default createContainer(() => {
  Meteor.subscribe('announcements');
  return { announcements: Announcements.find({}, { sort: { creationDate: -1 } }).fetch() };
}, AnnouncementsList);
