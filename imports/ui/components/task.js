import { Template } from "meteor/templating";
import { ReactiveDict } from "meteor/reactive-dict";

import "./task.html";

Template.task.onCreated(function () {
  this.editMode = new ReactiveDict();
  this.editMode.set("isEditing", false);
});

Template.task.helpers({
  isOwner() {
    // console.log(Template.instance());
    return this.owner === Meteor.userId();
  },
  isEditing() {
    return Template.instance().editMode.get("isEditing");
  },
  priority() {
    return this.priority || "medium";
  },
  priorityLabel() {
    const priority = this.priority || "medium";
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  },
  isLowPriority() {
    return (this.priority || "medium") === "low";
  },
  isMediumPriority() {
    return (this.priority || "medium") === "medium";
  },
  isHighPriority() {
    return (this.priority || "medium") === "high";
  },
  dueDate() {
    return this.dueDate;
  },
  dueDateValue() {
    if (this.dueDate) {
      const date = new Date(this.dueDate);
      return date.toISOString().split("T")[0];
    }
    return "";
  },
  formattedDueDate() {
    if (this.dueDate) {
      const date = new Date(this.dueDate);
      return date.toLocaleDateString();
    }
    return "";
  },
  isOverdue() {
    if (this.dueDate && !this.checked) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const due = new Date(this.dueDate);
      due.setHours(0, 0, 0, 0);
      return due < today;
    }
    return false;
  },
});

Template.task.events({
  "click .toggle-checked"() {
    // Set the checked property to the opposite of its current value
    Meteor.call("tasks.setChecked", this._id, !this.checked);
  },
  "click .delete"() {
    Meteor.call("tasks.remove", this._id);
  },
  "click .toggle-private"() {
    Meteor.call("tasks.setPrivate", this._id, !this.private);
  },
  "click .edit-task"(event, instance) {
    instance.editMode.set("isEditing", true);
    // Focus the input after the template re-renders
    Meteor.setTimeout(() => {
      instance.$(".edit-task-input").focus();
    }, 0);
  },
  "click .save-edit"(event, instance) {
    const newText = instance.$(".edit-task-input").val().trim();
    const newPriority = instance.$(".edit-priority-select").val();
    const newDueDate = instance.$(".edit-due-date").val();
    if (newText) {
      Meteor.call("tasks.update", this._id, newText, newPriority, newDueDate);
      instance.editMode.set("isEditing", false);
    }
  },
  "click .cancel-edit"(event, instance) {
    instance.editMode.set("isEditing", false);
  },
  "keypress .edit-task-input"(event, instance) {
    // Handle Enter key to save
    if (event.which === 13) {
      const newText = instance.$(".edit-task-input").val().trim();
      const newPriority = instance.$(".edit-priority-select").val();
      const newDueDate = instance.$(".edit-due-date").val();
      if (newText) {
        Meteor.call("tasks.update", this._id, newText, newPriority, newDueDate);
        instance.editMode.set("isEditing", false);
      }
    }
    // Handle Escape key to cancel
    if (event.which === 27) {
      instance.editMode.set("isEditing", false);
    }
  },
});
