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
    const hideCompleted = TemplateVar.get("hideCompleted");
    const searchQuery = TemplateVar.get("searchQuery") || "";
    const sortBy = TemplateVar.get("sortBy") || "date";
    const filterPriority = TemplateVar.get("filterPriority") || "all";

    // Build query
    const query = {};

    if (hideCompleted) {
      query.checked = { $ne: true };
    }

    if (filterPriority !== "all") {
      query.priority = filterPriority;
    }

    // Get all tasks matching the query
    let tasks = Tasks.find(query).fetch();

    // Apply search filter
    if (searchQuery) {
      tasks = tasks.filter(task =>
        task.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    if (sortBy === "priority") {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      tasks.sort((a, b) => {
        const aPriority = priorityOrder[a.priority || "medium"];
        const bPriority = priorityOrder[b.priority || "medium"];
        return aPriority - bPriority;
      });
    } else if (sortBy === "name") {
      tasks.sort((a, b) => a.text.localeCompare(b.text));
    } else {
      // Sort by date (default)
      tasks.sort((a, b) => b.createdAt - a.createdAt);
    }

    return tasks;
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
    const currentPage = Math.floor((+FlowRouter.getQueryParam("from") || 0) / itemsPerPage) + 1;

    array = Array.from({ length: numberOfPages }, (_, i) => ({
      num: i + 1,
      isCurrentPage: i + 1 === currentPage,
    }));

    return array;
  },
  hasPrevPage() {
    const currentFrom = +FlowRouter.getQueryParam("from") || 0;
    return currentFrom >= itemsPerPage;
  },
  hasNextPage() {
    const currentFrom = +FlowRouter.getQueryParam("from") || 0;
    return currentFrom + itemsPerPage < Counts.get("totalTasks");
  },
});

Template.todoList.events({
  "submit .new-task"(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;
    const priority = target.priority.value;
    const dueDate = target.dueDate.value;

    if (!text) return;

    // Insert a task into the collection
    Meteor.call("tasks.insert", text, priority, dueDate);

    // Clear form
    target.text.value = "";
    target.priority.value = "medium";
    target.dueDate.value = "";
  },
  "change .hide-completed input"(event, instance) {
    // instance.state.set("hideCompleted", event.target.checked);
    TemplateVar.set("hideCompleted", event.target.checked);
  },
  "input .search-input"(event) {
    TemplateVar.set("searchQuery", event.target.value);
  },
  "change .sort-select"(event) {
    TemplateVar.set("sortBy", event.target.value);
  },
  "change .filter-priority"(event) {
    TemplateVar.set("filterPriority", event.target.value);
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
