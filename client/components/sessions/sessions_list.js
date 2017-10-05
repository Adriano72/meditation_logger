import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Sessions } from '../../../imports/collections/sessions';
import { Link } from 'react-router';
import moment from 'moment';

class SessionsList extends Component {


  renderRows() {
    return this.props.sessions.map(session => {
      const { _id, sessionDay, morningSession, eveningSession, journalText  } = session;
      //console.log("SessionDay ", sessionDay);
      const sessionEditUrl = `/edit_session/${session._id}`;
      const cdate = (moment(sessionDay).format('MMMM Do YYYY'));
      const morning = morningSession?"Yes":"No";
      const evening = eveningSession?"Yes":"No";
      const text = lodash.truncate(journalText, {
        'length': 54
      });

      return (
        <tr key={_id}>
          <td><Link to={sessionEditUrl}>{cdate}</Link></td>
          <td>{morning}</td>
          <td>{evening}</td>
          <td>{text}</td>
        </tr>
      )
    })
  }
  render() {
    //Sessions.remove({})
    console.log("PROPS: ", this.props.sessions);
    return (
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Morning session</th>
            <th>Evening session</th>
            <th>Journal</th>
          </tr>
        </thead>
        <tbody>
          {this.renderRows()}
        </tbody>
      </table>
    );
  }
}

export default createContainer(() => {
  Meteor.subscribe('sessions');

  return { sessions: Sessions.find({}, { sort: { sessionDay: -1 } }).fetch() };
}, SessionsList);
