const {
  likePostMutation,
  getLikePostResolver,
  likePostMutationConfig,
} = require("./api/post/graphql/post");
export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    const extensionService = strapi.plugin("graphql").service("extension");

    const extension = ({ nexus }) => ({
      // GraphQL SDL
      typeDefs: likePostMutation,
      resolvers: {
        Mutation: {
          likePost: getLikePostResolver(strapi),
        },
      },
      resolversConfig: {
        "Mutation.likePost": likePostMutationConfig,
      },
    });
    extensionService.use(extension);
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    strapi.db.lifecycles.subscribe({
      models: ["admin::user"],
      afterCreate: async ({ result }) => {
        const {
          id,
          firstname,
          lastname,
          username,
          email,
          createdAt,
          updatedAt,
        } = result;
        await strapi.service("api::author.author").create({
          data: {
            firstname,
            lastname,
            username,
            email,
            createdAt,
            updatedAt,
            admin_user: [id],
          },
        });
      },
      afterUpdate: async ({ result }) => {
        const correspondingAuthor = (
          await strapi.service("api::author.author").find({
            admin_user: [result.id],
          })
        ).results[0];

        const { firstname, lastname, username, email, updatedAt } = result;
        await strapi
          .service("api::author.author")
          .update(correspondingAuthor.id, {
            data: {
              firstname,
              lastname,
              username,
              email,
              updatedAt,
            },
          });
      },
    });
  },
};
