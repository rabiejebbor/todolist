import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";

import { Users } from "../../api/users.js";

import "../components/user.js";
import "./admin-panel.html";

Template.adminPanel.onCreated(function bodyOnCreated() {
  Meteor.subscribe("userData");
});

Template.adminPanel.helpers({
  users() {
    console.log(Users.find({}).fetch());
    return Users.find({});
  },
  usersCount() {
    return Users.find({}).count();
  },
});
