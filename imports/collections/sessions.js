import { Mongo } from 'meteor/mongo';

Meteor.methods({
  'sessions.insert': function() {
    return Sessions.insert({
      sessionDay: new Date(),
      morningSession: false,
      eveningSession: false,
      journalText: '',
      ownerId: this.userId
    })
  }
});

export const Sessions = new Mongo.Collection('sessions');
