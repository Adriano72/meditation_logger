import { Meteor } from 'meteor/meteor';
import { Sessions } from '../imports/collections/sessions';
import Session from '../imports/classes/Session';

Meteor.startup(() => {
  Sessions.rawCollection().drop();
  Meteor.publish('sessions', function() {
    return Sessions.find({ ownerId: this.userId });
  });
});
