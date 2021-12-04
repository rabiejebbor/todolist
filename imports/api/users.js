import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";

export const Users = Meteor.users;

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish("userData", function usersPublication() {
    return Users.find({}, { fields: { username: 1, isBanned: 1 } });
  });
  Meteor.publish("userx", function userxPublication() {
    return Users.find(
      { _id: this.userId },
      { fields: { username: 1, isBanned: 1 } }
    );
  });
}

Meteor.methods({
  "users.setBanned"(userId, setBanned) {
    check(userId, String);
    check(setBanned, Boolean);

    Users.update(userId, { $set: { isBanned: setBanned } });
  },
  "users.remove"(userId) {
    check(userId, String);

    Users.remove(userId);
  },
});
