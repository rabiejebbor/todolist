import { Template } from "meteor/templating";

import "./user.html";

Template.user.events({
  "click .toggle-banned"() {
    Meteor.call("users.setBanned", this._id, !this.isBanned);
  },
  "click .delete"() {
    Meteor.call("users.remove", this._id);
  },
});
