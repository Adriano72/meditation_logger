import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Sessions } from '../../../imports/collections/sessions';
import { Link, browserHistory } from 'react-router';
import moment from 'moment';
import courses from '../../../data/courses';

class SessionsList extends Component {

  constructor(props){
    super(props);
    this.state = {
      isAdmin: this.getAdminState(),
      rateOfSuccess: "Computing..."
    }
    setTimeout(() => {
      this.calculateSuccessRate();
    }, 2000);

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

  componentDidUpdate(prevProps, prevState){
    this.calculateSuccessRate();
  }

  calculateSuccessRate(){
    const userGroup = Object.keys( Meteor.users.find().fetch()[0].roles )[0];

    const groupData = _.find(courses, function(o){
      return o.courseName == userGroup
    });

    const firstDay = moment(groupData.startDate);

    const startDate = moment(firstDay);
    const endDate = moment();
    const duration = moment.duration(endDate.diff(startDate));
    var sessioniDisponibili = 2*(Math.round(Math.abs(duration.asDays()))); // Giorni trascorsi dall'inizio del corso

    var numSessioniFatte = 0; // Numero sessioni effettivamente fatte

    _.forEach(this.props.sessions, function(value, key) {
        if(value.morningSession) numSessioniFatte++;
        if(value.eveningSession) numSessioniFatte++;
    });

    var percentualeSuccesso = Math.round( (100 * numSessioniFatte)/sessioniDisponibili * 10 ) / 10;

    if(percentualeSuccesso+"%" !== this.state.rateOfSuccess){
      this.setState({
        rateOfSuccess: percentualeSuccesso+"%"
      });
    }
  }
  componentDidUpdate(){
    new Chartist.Line('.ct-chart', {
      labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      series: [
        [12, 9, 7, 8, 5],
        [2, 1, 3.5, 7, 3],
        [1, 3, 4, 5, 6]
      ]
    }, {
      fullWidth: false,
      chartPadding: {
        right: 40
      }
    });
  }
  
  componentWillUpdate(prevProps, prevState){
    if (!this.state.isAdmin) {
      browserHistory.push('/login');
    };

    //this.calculateSuccessRate();
  }

  printPage() {
    window.print();
  }

  renderRows() {

    console.log("*** RENDER FUNCTION *** STATE IS: ", this.state);
    return this.props.sessions.map(session => {
      const { _id, sessionDay, morningSession, eveningSession, journalText  } = session;
      console.log("SESSION ID $$$$$$$$$ ", session._id);
      const sessionEditUrl = `/view_single_session/${session._id}`;
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
    });


  }

  render() {
    const userName = Meteor.users.find({_id: this.props.params.idStudent}).fetch()[0].username;
    return (
      <div className="container-fluid top-buffer">
        <pre>
          <span><h2>Sessions entered by {userName}</h2></span><h4>Percentage of Success: <mark>{this.state.rateOfSuccess}</mark></h4><br />
          <div className="ct-chart"></div>
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
          <div className="btn-toolbar">
            <button
              className="btn btn-default"
              onClick={browserHistory.goBack}>
              Back
            </button>
            <button
              className="btn btn-warning"
              onClick={this.printPage.bind(this)}>
              Print
            </button>
          </div>
        </pre>
      </div>
    );
  }
}

export default createContainer((props) => {
  console.log("PROPS PARAMS: ", props.params.idStudent);
  const p_student = props.params.idStudent;
  Meteor.subscribe('user_sessions_for_admins');
  return { sessions: Sessions.find({ ownerId: props.params.idStudent }, { sort: { sessionDay: -1 } }).fetch() };
}, SessionsList);
