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

    async find(ctx) {
      console.log("ctx.query", ctx.query);
      const isRequestingNonPremium =
        ctx.query.filters &&
        (ctx.query.filters as any).premium["$eq"] == "false";
      if (ctx.state.user || isRequestingNonPremium) {
        return await super.find(ctx);
      }
      const { query } = ctx;
      const filteredPosts = strapi.service("api::post.post").find({
        ...query,
        filters: {
          ...query.filters,
          premium: false,
        },
      });
      const sanitizedPosts = await this.sanitizeOutput(
        filteredPosts,
        ctx.state
      );
      return this.transformResponse(sanitizedPosts);
    },
  })
);
