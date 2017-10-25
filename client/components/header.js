import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Accounts from './accounts';
import { Link, browserHistory } from 'react-router';

class Header extends Component {

  onBindClick(event) {
    event.preventDefault();
    if(Meteor.user()){
      browserHistory.push(`/new_session`);
    }
  }

  logout(e){
    e.preventDefault();
    Meteor.logout( (err) => {
        if (err) {
            console.log( err.reason );
        } else {
            browserHistory.push('/login');
        }
    });
  }

  openStudentsList() {
    event.preventDefault();
    browserHistory.push('/students_list');
  }

  renderAdminMenu(){
    var loggedInUser = Meteor.user();
    console.log("USER - header.js: ", Meteor.user());
    if ( Roles.userIsInRole(loggedInUser, 'admin', 'Meditation and Leadership Oct 2017') ) {
     return (<a href="#" onClick={this.openStudentsList.bind(this)}>Students list</a>)// NOTE: This example assumes the user is not using groups.
    }
    return;
  }

  render () {
    return (
      <nav className="nav navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <Link to="/" className="navbar-brand">Meditation Logger</Link>
          </div>
          <ul className="nav navbar-nav">
            <li>
              <a href="#" onClick={this.onBindClick.bind(this)}>Add Session</a>
            </li>
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <li>{this.renderAdminMenu()}</li>
            <li className="dropdown">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{this.props.currentUser.emails?this.props.currentUser.emails[0].address: "Sign In"}<span className="caret"></span></a>
              <ul className="dropdown-menu">
                <li><a href="#" onClick={this.logout}>Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default createContainer(() => {
  return {
    currentUser: Meteor.user() || {}, // default to plain object
  };
}, Header);
