import { Meteor } from 'meteor/meteor';
import { Sessions } from '../imports/collections/sessions';
import Session from '../imports/classes/Session';

Meteor.startup(() => {
  //Sessions.rawCollection().drop();
  Meteor.publish('sessions', function() {
    return Sessions.find({ ownerId: this.userId });
  });

  Meteor.publish('user_sessions_for_admins', function(userid) {
    return Sessions.find();
  });

  Meteor.publish('allUsers', function () {
    return Meteor.users.find();
  });

});
