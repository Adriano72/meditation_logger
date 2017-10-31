import { Meteor } from 'meteor/meteor';
import { Sessions } from '../imports/collections/sessions';
import { Announcements } from '../imports/collections/announcements';
import Session from '../imports/classes/Session';
import Announcement from '../imports/classes/Announcement';

Meteor.startup(() => {
  //Sessions.rawCollection().drop();
  Meteor.publish('sessions', function() {
    return Sessions.find({ ownerId: this.userId });
  });

  Meteor.publish('announcements', function() {
    return Announcements.find();
  });

  Meteor.publish('user_sessions_for_admins', function(userid) {
    return Sessions.find();
  });

  Meteor.publish('allUsers', function () {
    return Meteor.users.find();
  });

});
