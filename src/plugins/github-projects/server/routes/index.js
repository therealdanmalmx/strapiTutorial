module.exports = [
  {
    method: "GET",
    path: "/repos",
    handler: "getReposControllers.index",
    config: {
      policies: ["admin::isAuthenticatedAdmin"],
    },
  },
  {
    method: "POST",
    path: "/project",
    handler: "projectController.create",
    config: {
      policies: ["admin::isAuthenticatedAdmin"],
    },
  },
];
