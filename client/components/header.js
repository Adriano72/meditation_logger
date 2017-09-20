import React, { Component } from 'react';
import Accounts from './accounts';
import { Link, browserHistory } from 'react-router';

class Header extends Component {
  onBindClick(event) {
    event.preventDefault();

    browserHistory.push(`/new_session`);
  }

  render () {
    return (
      <nav className="nav navbar-default">
        <div className="navbar-header">
          <Link to="/" className="navbar-brand">Meditation Logger</Link>
        </div>
        <ul className="nav navbar-nav">
          <li>
            <Accounts />
          </li>
          <li>
            <a href="#" onClick={this.onBindClick.bind(this)}>New session</a>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Header;
