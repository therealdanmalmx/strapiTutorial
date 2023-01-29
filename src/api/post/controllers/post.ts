/**
 * post controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::post.post",
  ({ strapi }) => ({
    // async find(ctx) {
    //   const { data, meta } = await super.find(ctx);
    //   if (ctx.state.user) {
    //     return { data, meta };
    //   }
    //   const filterData = data.filter(
    //     (post: { attributes: { premium: any } }) => !post.attributes.premium
    //   );
    //   return { data: filterData, meta };
    // },

    // async find(ctx) {
    //   console.log("ctx.query", ctx.query);
    //   const isRequestingNonPremium =
    //     ctx.query.filters &&
    //     (ctx.query.filters as any).premium["$eq"] == "false";
    //   if (ctx.state.user || isRequestingNonPremium) {
    //     return await super.find(ctx);
    //   }
    //   const { query } = ctx;
    //   const filteredPosts = strapi.service("api::post.post").find({
    //     ...query,
    //     filters: {
    //       ...(query.filters as any),
    //       premium: false,
    //     },
    //   });
    //   const sanitizedPosts = await this.sanitizeOutput(
    //     filteredPosts,
    //     ctx.state
    //   );
    //   return this.transformResponse(sanitizedPosts);
    // },

    async find(ctx) {
      const isRequestingNonPremium =
        ctx.query.filters && (ctx.query.filters as any).premium == false;

      if (ctx.state.user || isRequestingNonPremium) {
        return await super.find(ctx);
      }
      const publicPosts = await strapi
        .service("api::post.post")
        .findPublic(ctx.query);

      const sanitizedPosts = await this.sanitizeOutput(publicPosts, ctx);
      return this.transformResponse(sanitizedPosts);
    },

    async findOne(ctx) {
      const { id } = ctx.params;
      const { query } = ctx;

      if (ctx.state.user) {
        return await super.findOne(ctx);
      }

      const postIfPublic = await strapi
        .service("api::post.post")
        .findOneIfPublic({
          id,
          query,
        });

      const sanitizedEntity = await this.sanitizeOutput(postIfPublic, ctx);
      return this.transformResponse(sanitizedEntity);
    },

    async likePost(ctx) {
      const user = ctx.state.user;
      const postId = ctx.params.id;
      const { query } = ctx;
      const updatedPost = await strapi.service("api::post.post").likePost({
        postId,
        userId: user.id,
        query,
      });
      const sanitizedEntity = await this.sanitizeOutput(updatedPost, ctx);
      return this.transformResponse(sanitizedEntity);
    },
  })
);
