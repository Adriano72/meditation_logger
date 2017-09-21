import { Meteor } from 'meteor/meteor';
import { Sessions } from '../imports/collections/sessions';

Meteor.startup(() => {
  Meteor.publish('sessions', function() {
    return Sessions.find({ ownerId: this.userId });
  });
});
