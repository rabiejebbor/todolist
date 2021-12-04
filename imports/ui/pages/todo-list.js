import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
// import { ReactiveDict } from "meteor/reactive-dict";

import { Tasks } from "../../api/tasks.js";
import { Users } from "../../api/users.js";

import "../components/task.js";
import "./todo-list.html";

Template.todoList.onCreated(function bodyOnCreated() {
  // this.state = new ReactiveDict();
  Meteor.subscribe("tasks");
  Meteor.subscribe("userx");
});

Template.todoList.helpers({
  tasks() {
    // const instance = Template.instance();
    // if (instance.state.get("hideCompleted")) {
    if (TemplateVar.get("hideCompleted")) {
      // If hide completed is checked, filter tasks
      return Tasks.find(
        { checked: { $ne: true } },
        { sort: { createdAt: -1 } }
      );
    }
    // Otherwise, return all of the tasks
    return Tasks.find({}, { sort: { createdAt: -1 } });
  },
  incompleteCount() {
    return Tasks.find({ checked: { $ne: true } }).count();
  },
  currUserIsBanned() {
    const userId = Meteor.userId();
    if (userId) {
      const user = Users.findOne({ _id: userId }, { fields: { isBanned: 1 } });
      console.log("user", user);
      return user.isBanned;
    }
  },
});

Template.todoList.events({
  "submit .new-task"(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;

    if (!text) return;

    // Insert a task into the collection
    Meteor.call("tasks.insert", text);

    // Clear form
    target.text.value = "";
  },
  "change .hide-completed input"(event, instance) {
    // instance.state.set("hideCompleted", event.target.checked);
    TemplateVar.set("hideCompleted", event.target.checked);
  },
});
