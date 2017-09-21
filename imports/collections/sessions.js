import { Mongo } from 'meteor/mongo';

Meteor.methods({
  'sessions.insert': function(date, morning, evening, journal) {
    return Sessions.insert({
      sessionDay: new Date(date),
      morningSession: morning,
      eveningSession: evening,
      journalText: journal,
      ownerId: this.userId
    })
  }
});

export const Sessions = new Mongo.Collection('sessions');
