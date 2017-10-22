import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link, browserHistory } from 'react-router';
import courses from '../../../data/courses';

class StudentsList extends Component {

  constructor(props){
    super(props);
    this.state = {
      isAdmin: this.getAdminState(),
      rateOfSuccess: "Computing..."
    }
  }

  getAdminState(){
    var loggedInUser = Meteor.user();

    if ( !Roles.userIsInRole(loggedInUser, 'admin', 'Meditation and Leadership Oct 2017') ) {
      return false
    }
    return true
  }

  componentWillMount(){
    if (!this.state.isAdmin) {
      browserHistory.push('/session_list');
    }
  }

  testRender() {

        let users = this.props.allUsers;
        console.log("PROP USERS: ",users);
        return (<div>
            <h4>Students list</h4>

            <div>
                {users.map((user)=>{
                    if ('emails' in user ) {
                        email = user.emails[0].address;
                    } else {
                        email = '?'
                    }
                    return <div key={user._id}>{user._id} - {email}</div>
                })
                }
            </div>
        </div>)


  }


  renderRows() {
    let users = this.props.allUsers;
    console.log("*** RENDER FUNCTION *** STATE IS: ", this.state);

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
  };

  render() {

    return (
      <div className="container-fluid top-buffer">
        <pre>
          <span><h2>Students List</h2></span><br />
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
