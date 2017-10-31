import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Accounts from './accounts';
import { Link, browserHistory } from 'react-router';

class Header extends Component {

  onBindNewSession(event) {
    event.preventDefault();
    if(Meteor.user()){
      browserHistory.push(`/new_session`);
    }
  }

  onBindDashboard(event) {
    event.preventDefault();
    if(Meteor.user()){
      browserHistory.push(`/announcements_list`);
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

  openCreateNewAnnouncement() {
    event.preventDefault();
    browserHistory.push('/new_announcement');
  }

  renderStudentListLink(){
    var loggedInUser = Meteor.user();
    console.log("USER - header.js: ", Meteor.user());
    if ( Roles.userIsInRole(loggedInUser, 'admin') ) { // il gruppo va messo dinamico o globale
     return (<a href="#" onClick={this.openStudentsList.bind(this)}>Students list</a>);
    }
    return;
  }

  renderCreateAnnouncementLink(){
    var loggedInUser = Meteor.user();
    console.log("USER - header.js: ", Meteor.user());
    if ( Roles.userIsInRole(loggedInUser, 'admin') ) { // il gruppo va messo dinamico o globale
     return (<a href="#" onClick={this.openCreateNewAnnouncement.bind(this)}>New announcement</a>);
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
              <a href="#" onClick={this.onBindDashboard.bind(this)}>Dashboard</a>
            </li>
            <li>
              <a href="#" onClick={this.onBindNewSession.bind(this)}>Add session</a>
            </li>
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <li>{this.renderCreateAnnouncementLink()}</li>
            <li>{this.renderStudentListLink()}</li>
            <li><a href="https://www.mediafire.com/folder/78gv0qbdnnbby/Leadership_Course_2017_Repository" target="_blank">Resources directory</a></li>
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
