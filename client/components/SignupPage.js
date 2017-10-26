import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import { Accounts } from 'meteor/accounts-base';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';

import courses from '../../data/courses';

export default class SignupPage extends Component {

  constructor(props){
    super(props);
    this.state = {
      error: '',
      groupSelected: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateValue = this.updateValue.bind(this);
  }

  handleSubmit(e){
    e.preventDefault();
    let name = document.getElementById("signup-name").value;
    let email = document.getElementById("signup-email").value;
    let password = document.getElementById("signup-password").value;

    if(name == "" || email == "" || this.state.groupSelected == '') {
      Alert.error('Name, Email and Group are mandatory', {
        position: 'top-left',
        effect: 'slide',
        timeout: 3000,
        offset: 20
      });

      return;
    }


    var newUserData = {
     username: name,
     email: email,
     password: password,
     roles: ['student'],
     group: this.state.groupSelected.value
    };

    Meteor.call('mCreateUser', newUserData, (error, result) => {
        if (error) {
             console.log(error);
              return;
        }
        Alert.success('User created, you can now login.', {
          position: 'top-left',
          effect: 'jelly',
          onShow: function () {
            setTimeout(function(){
              console.log("Result: ", result);
              browserHistory.push('/login');
            }, 2000);
          },
          timeout: 1500,
          offset: 20
        });

    });
  }


  logChange(val) {
    console.log("Selected: " + JSON.stringify(val));
  }

  updateValue (newValue) {
    console.log('State changed to ', newValue);
		this.setState({
			groupSelected: newValue,
		});
	}


  render(){

    var coursesList = [];

    _.each(courses, (data, key) => {
      coursesList.push({value: data.courseName, label: data.courseName});
    });

    const error = this.state.error;
    return (
      <div className="modal show">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="text-center">Sign up</h1>
            </div>
            <div className="modal-body">
              { error.length > 0 ?
                <div className="alert alert-danger fade in">{error}</div>
                :''}
              <form  id="login-form"
                    className="form col-md-12 center-block"
                    onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <input type="text" id="signup-name"
                        className="form-control input-lg" placeholder="Full name"/>
                </div>
                <div className="form-group">

                  <Select name="form-field-name" value={this.state.groupSelected} placeholder="Select a Group" searchable options={coursesList} onChange={this.updateValue} />

                </div>
                <div className="form-group">
                  <input type="email" id="signup-email"
                        className="form-control input-lg" placeholder="email"/>
                </div>
                <div className="form-group">
                  <input type="password" id="signup-password"
                        className="form-control input-lg"
                        placeholder="password"/>
                </div>
                <div className="form-group">
                  <input type="submit" id="login-button"
                        className="btn btn-lg btn-primary btn-block"
                        value="Sign Up" />
                </div>
                <div className="form-group">
                  <p className="text-center">
                    Already have an account? Login <Link to="/login">here</Link>
                  </p>
                </div>
              </form>
            </div>
            <div className="modal-footer" style={{borderTop: 0}}></div>
          </div>
        </div>
        <Alert stack={{limit: 3}} />
      </div>
    );
  }
}
