import { FlowRouter } from "meteor/kadira:flow-router";
import { BlazeLayout } from "meteor/kadira:blaze-layout";

import "../../ui/pages/todo-list.js";
import "../../ui/pages/admin-panel.js";
import "../../ui/layouts/body.js";

FlowRouter.route("/", {
  action: function (params, queryParams) {
    BlazeLayout.render("app-body", { main: "todoList" });
  },
});
FlowRouter.route("/admin", {
  action: function (params, queryParams) {
    BlazeLayout.render("app-body", { main: "adminPanel" });
  },
});
