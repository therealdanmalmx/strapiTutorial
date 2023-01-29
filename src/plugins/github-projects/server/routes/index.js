module.exports = [
  {
    method: "GET",
    path: "/",
    handler: "myController.index",
    config: {
      policies: [],
    },
    method: "GET",
    path: "/repos",
    handler: "getReposControllers.index",
    config: {
      policies: [],
      auth: false,
    },
  },
];
