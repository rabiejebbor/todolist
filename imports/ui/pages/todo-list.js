import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { FlowRouter } from "meteor/kadira:flow-router";
// import { ReactiveDict } from "meteor/reactive-dict";

import { Tasks } from "../../api/tasks.js";
import { Users } from "../../api/users.js";

import "../components/task.js";
import "./todo-list.html";

const itemsPerPage = 10;

Template.todoList.onCreated(function bodyOnCreated() {
  // this.state = new ReactiveDict();
  // Meteor.subscribe("tasks");
  Meteor.subscribe("userx");

  const getFromParam = () => FlowRouter.getQueryParam("from");
  this.autorun(() => {
    Meteor.subscribe("tasks", +getFromParam());
  });
});

Template.todoList.helpers({
  tasks() {
    // const instance = Template.instance();
    // if (instance.state.get("hideCompleted")) {
    if (TemplateVar.get("hideCompleted")) {
      // If hide completed is checked, filter tasks
      return Tasks.find(
        { checked: { $ne: true } }
        // { sort: { createdAt: -1 } }
      );
    }
    // Otherwise, return all of the tasks
    // return Tasks.find({}, { sort: { createdAt: -1 } });
    return Tasks.find({});
  },
  incompleteCount() {
    return Tasks.find({ checked: { $ne: true } }).count();
  },
  currUserIsBanned() {
    const userId = Meteor.userId();
    if (userId) {
      const user = Users.findOne({ _id: userId }, { fields: { isBanned: 1 } });
      console.log("user", user);
      return user?.isBanned;
    }
  },
  paginationNeeded() {
    if (Counts.get("totalTasks") > itemsPerPage) {
      return true;
    }
  },
  paginationNumbers() {
    const numberOfPages = Math.ceil(Counts.get("totalTasks") / itemsPerPage);
    array = Array.from({ length: numberOfPages }, (_, i) => ({
      num: i + 1,
    }));

    return array;
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

  "click .next-button"(event) {
    console.log("clicked");
    let number = +FlowRouter.getQueryParam("from") || 0;
    number += itemsPerPage;
    if (number <= Counts.get("totalTasks")) {
      FlowRouter.go(`/?from=${number}`);
    }
  },

  "click .prev-button"(event) {
    console.log("clicked");
    let number = +FlowRouter.getQueryParam("from") || 0;
    if (number >= itemsPerPage) {
      FlowRouter.go(`/?from=${number - itemsPerPage}`);
    }
  },

  "click .page-number"(event) {
    const pageNum = event.target.value;
    FlowRouter.go(`/?from=${(+pageNum - 1) * itemsPerPage}`);
  },
});
