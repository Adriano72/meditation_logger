import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link, browserHistory } from 'react-router';
import Select from 'react-select';
import courses from '../../../data/courses';

class StudentsList extends Component {

  constructor(props){
    super(props);
    this.state = {
      isAdmin: this.getAdminState(),
      groupSelected: 'all',
      userCollection: props.allUsers,
      rateOfSuccess: "Computing..."
    };
    this.updateValue = this.updateValue.bind(this);
    this.sortListAlphabetically = this.sortListAlphabetically.bind(this);
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
      userCollection: this.props.allUsers
		});
    console.log('State changed to ', this.state.groupSelected);

	}

  componentDidUpdate(prevProps, prevState){

    if(this.state.groupSelected != prevState.groupSelected){
      console.log("DIFFERENT");
      console.log('COMPONENT DID UPDATE');
      let filteredUSers = [];
      let t_state = this.state.groupSelected;

      _.each(this.state.userCollection, function(t_user){
        if(Roles.userIsInRole(t_user,['student'], t_state)){
          console.log('PRESENTE: ', t_user, 'IN ',t_state);
          filteredUSers.push(t_user);
        }else{
          console.log('NON PRESENTE: ', t_user, 'IN ',t_state);
        };
      });

      this.setState({
        userCollection: this.sortListAlphabetically(filteredUSers),
      });


    }else{
      console.log("SAME");
    }

  }

  sortListAlphabetically(p_list){
    return _.sortBy(p_list, ['username']);
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      userCollection: this.sortListAlphabetically(nextProps.allUsers),
    });
  }

  componentWillMount(){

    if (!this.state.isAdmin) {
      browserHistory.push('/session_list');
    }
  }

  renderRows() {
    var users = this.state.userCollection;

    console.log('*** USERS ***: ', users);
    if(users){
      return users.map(user => {

          const userViewUrl = `/student_detail/${user._id}`;
          const group = Object.keys(user.roles)[0];
          const email = user.emails[0].address;
          return (
            <tr key={user._id}>
              <td><Link to={userViewUrl}>{user.username}</Link></td>
              <td>{email}</td>
              <td>{group}</td>
            </tr>
          )

      });
    }
  };

  render() {

    let coursesList = [];

    _.each(courses, (data, key) => {
      coursesList.push({value: data.courseName, label: data.courseName});
    });

    return (
      <div className="container-fluid top-buffer">
        <pre>
          <span><h2>Students List</h2></span><br />
            <div className="form-group" >

              <Select name="form-field-name" value={this.state.groupSelected} placeholder="Filter by group" searchable options={coursesList} onChange={this.updateValue} />

            </div>
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Group</th>
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
  Meteor.subscribe('allUsers');
  return {
    allUsers: Meteor.users.find({}).fetch(),
  };
}, StudentsList);
