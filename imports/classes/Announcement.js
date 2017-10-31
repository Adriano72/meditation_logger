import { Class } from 'meteor/jagi:astronomy';
import { Announcements } from '../collections/announcements';

const Announcement = Class.create({
  name: 'Announcement',
  collection: Announcements,
  fields: {
    creationDate: Date,
    title: String,
    body: String,
    sticky: Boolean,
    group: String,
    ownerId: String
  },
  indexes: {
    creationDate: {
      fields: {
        creationDate: 1
      },
      options: {
        //unique: true
      }
    }
  },
  meteorMethods: {
    insert(date, title, body, group, sticky) {
      this.creationDate = new Date(date);
      this.title = title;
      this.body = body;
      this.sticky = sticky;
      this.group = group;
      this.ownerId = Meteor.userId();
      return this.save((err, result) => {
        if(err){
          console.log("ERROR: ", err);
        }else{
          console.log("RESULT: ", result);
        }
      });
    },
    update(announcement, content) {
      return this.update(announcement._id, { $set: { content } });
    },
    delete(announcement) {
      return this.remove(announcement._id);
    }
  }
});

export default Announcement;
