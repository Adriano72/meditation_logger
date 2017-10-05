import { Class } from 'meteor/jagi:astronomy';
import { Sessions } from '../collections/sessions';

const Session = Class.create({
  name: 'Session',
  collection: Sessions,
  fields: {
    sessionDay: Date,
    morningSession: Boolean,
    eveningSession: Boolean,
    journalText: String,
    ownerId: String
  },
  indexes: {
    sessionDay: {
      fields: {
        sessionDay: 1
      },
      options: {
        //unique: true
      }
    }
  },
  meteorMethods: {
    insert(date, morning, evening, journal) {
      this.sessionDay = new Date(date);
      this.morningSession = morning;
      this.eveningSession = evening;
      this.journalText = journal;
      this.ownerId = Meteor.userId();
      return this.save((err, result) => {
        if(err){
          console.log("ERROR: ", err);
        }else{
          console.log("RESULT: ", result);
        }
      });
    },
    update(session, comtent) {
      return this.update(session._id, { $set: { content } });
    }
  }
});

export default Session;
