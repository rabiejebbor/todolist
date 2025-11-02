import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Tasks = new Mongo.Collection("tasks");

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish("tasks", function tasksPublication(from) {
    check(from, Number);

    Counts.publish(
      this,
      "totalTasks",
      Tasks.find({
        $or: [{ private: { $ne: true } }, { owner: this.userId }],
      })
    );

    // console.log(Tasks);
    return Tasks.find(
      {
        $or: [{ private: { $ne: true } }, { owner: this.userId }],
      },
      {
        sort: { createdAt: -1 },
        skip: from,
        limit: 10,
      }
    );
  });
}

Meteor.methods({
  "tasks.insert"(text, priority = "medium", dueDate) {
    check(text, String);
    check(priority, String);
    check(dueDate, Match.Optional(String));

    // Make sure the user is logged in before inserting a task
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }

    // if (!text) {
    //   throw new Meteor.Error("no-textValue");
    // }

    const taskData = {
      text,
      priority,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
    };

    if (dueDate) {
      taskData.dueDate = new Date(dueDate);
    }

    Tasks.insert(taskData);
  },
  "tasks.remove"(taskId) {
    check(taskId, String);

    const task = Tasks.findOne(taskId);
    if (task.private && task.owner !== this.userId) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }

    Tasks.remove(taskId);
  },
  "tasks.setChecked"(taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);

    const task = Tasks.findOne(taskId);
    if (task.private && task.owner !== this.userId) {
      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error("not-authorized");
    }

    Tasks.update(taskId, { $set: { checked: setChecked } });
  },
  "tasks.setPrivate"(taskId, setToPrivate) {
    check(taskId, String);
    check(setToPrivate, Boolean);

    const task = Tasks.findOne(taskId);

    // Make sure only the task owner can make a task private
    if (task.owner !== this.userId) {
      throw new Meteor.Error("not-authorized");
    }

    Tasks.update(taskId, { $set: { private: setToPrivate } });
  },
  "tasks.update"(taskId, newText, newPriority, newDueDate) {
    check(taskId, String);
    check(newText, String);
    check(newPriority, String);
    check(newDueDate, Match.Optional(String));

    const task = Tasks.findOne(taskId);

    // Make sure only the task owner can edit the task
    if (task.owner !== this.userId) {
      throw new Meteor.Error("not-authorized");
    }

    const updateData = { text: newText, priority: newPriority };

    if (newDueDate) {
      updateData.dueDate = new Date(newDueDate);
    } else {
      updateData.dueDate = null;
    }

    Tasks.update(taskId, { $set: updateData });
  },
  "tasks.count"() {
    return Tasks.find().count();
  },
});
