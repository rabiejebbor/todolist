import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";

import { Users } from "../../api/users.js";

import "../components/user.js";
import "./admin-panel.html";

const usersPerPage = 10;

Template.adminPanel.onCreated(function bodyOnCreated() {
  Meteor.subscribe("userData");
  const getLimitParam = () => FlowRouter.getQueryParam("limit");
  this.autorun(() => {
    Meteor.subscribe("userData", +getLimitParam());
  });
});

Template.adminPanel.helpers({
  users() {
    console.log(Users.find({}).fetch());
    return Users.find({});
  },
  usersCount() {
    return Users.find({}).count();
  },
  moreNeeded() {
    //add limit
    if (
      Counts.get("totalUsers") >
      (FlowRouter.getQueryParam("limit") || usersPerPage)
    ) {
      return true;
    }
  },
});

Template.adminPanel.events({
  "click .more-button"(event) {
    const oldLimit = FlowRouter.getQueryParam("limit") || usersPerPage;
    const newLimit = +oldLimit + usersPerPage;
    FlowRouter.go(`/admin?limit=${newLimit}`);
  },
});

Template.adminPanel.event;
