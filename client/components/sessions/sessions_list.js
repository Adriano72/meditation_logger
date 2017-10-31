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
      isAuthenticated: this.getAuthState(),
      rateOfSuccess: "..."
    }
    setTimeout(() => {
      this.calculateSuccessRate();
    }, 2000);
  }

  getAuthState(){
    return Meteor.userId() !== null ;
  }

  componentWillMount(){
    if (!this.state.isAuthenticated) {
      browserHistory.push('/login');
    }
  }

  componentDidUpdate(prevProps, prevState){

    this.calculateSuccessRate();

    const userGroup = Object.keys( Meteor.users.find().fetch()[0].roles )[0];
    const groupData = _.find(courses, function(o){
      return o.courseName == userGroup
    });

    const startDate = moment(groupData.startDate);
    const endCourse = moment(groupData.endDate);
    const endDate = (moment().isBefore(endCourse))?moment():endCourse;
    const ascissa = [];
    const sessionsThatDay = [];

    for (var m = moment(startDate); m.isBefore(endDate); m.add('days', 1)) {
        //console.log(m.format('MMM Do'));
        ascissa.push(m.format('MMM D'));

        var t_date = moment(m).startOf('day').format();

        let foundEntry = _.find(this.props.sessions, function(value, key){
          return moment(value.sessionDay).startOf('day').isSame(t_date)
        });

        if(foundEntry){
          let totSessionsToday = 0;
          if(foundEntry.morningSession) totSessionsToday++;
          if(foundEntry.eveningSession) totSessionsToday++;
          sessionsThatDay.push(totSessionsToday);
        }else {
          sessionsThatDay.push(0);
        }

    };
    //console.log("sessionsThatDay: "+sessionsThatDay);

    const daysAxis = this.props.sessions.map(session => {

      return moment(session.sessionDay).date();

    });
    //console.log("AXIS X: ", lodash.reverse(daysAxis));

    //_-----------------------
    //console.log("PROPS: "+ JSON.stringify(this.props.sessions) );

    new Chartist.Line('.ct-chart',{
        labels: ascissa,
        series: [
          sessionsThatDay
        ]
      },
      {
        fullWidth: false,
        height: 200,
        chartPadding: {
          right: 40,
          left: 40,
          bottom: 50
        },
        axisY: {
          onlyInteger: true,
          offset: 1
        },
        plugins: [
          Chartist.plugins.ctAxisTitle({
            axisX: {
              axisTitle: 'Days',
              axisClass: 'ct-axis-title',
              offset: {
                x: 0,
                y: 50
              },
              textAnchor: 'middle'
            },
            axisY: {
              axisTitle: 'Sessions',
              axisClass: 'ct-axis-title',
              offset: {
                x: 0,
                y: 0
              },
              textAnchor: 'middle',
              flipTitle: false
            }
          })
        ]
    });
  }

  calculateSuccessRateDayByDayBasys(p_day){

  }

  calculateSuccessRate(){
    if(!this.state.isAuthenticated) {
      return;
    }
    const userGroup = Object.keys( Meteor.users.find().fetch()[0].roles )[0];

    const groupData = _.find(courses, function(o){
      return o.courseName == userGroup
    });

    const startDate = moment(groupData.startDate);
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

  componentWillUpdate(prevProps, prevState){
    if (!this.state.isAuthenticated) {
      browserHistory.push('/login');
    };

    //this.calculateSuccessRate();
  }

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
    });
  }

  render() {

    return (
      <div className="container-fluid top-buffer">
        <pre>
          <span><h2>Sessions archive</h2></span><h4>Percentage of Success: <mark>{this.state.rateOfSuccess}</mark></h4><br />
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
        </pre>
      </div>
    );
  }
}

export default createContainer(() => {
  Meteor.subscribe('sessions');
  return { sessions: Sessions.find({}, { sort: { sessionDay: -1 } }).fetch() };
}, SessionsList);
