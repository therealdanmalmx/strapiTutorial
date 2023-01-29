/**
 * post service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService("api::post.post", {
  //@ts-ignore
  async findPublic(args) {
    const newQuery = {
      ...args,
      filters: {
        ...args.filters,
        premium: false,
      },
    };

    const publicPost = await strapi.entityService.findMany(
      "api::post.post",
      this.getFetchParams(newQuery)
    );

    return publicPost;
  },

  //@ts-ignore
  async findOneIfPublic(args) {
    const { id, query } = args;

    const post = await strapi.entityService.findOne(
      "api::post.post",
      id,
      this.getFetchParams(query)
    );

    return post.premium ? null : post;
  },

  //@ts-ignore
  async likePost(args) {
    const { postId, userId, query } = args;

    const postToLike = await strapi.entityService.findOne(
      "api::post.post",
      postId,
      {
        populate: ["likedBy"],
      }
    );

    const updatePost = await strapi.entityService.update(
      "api::post.post",
      postId,
      {
        data: {
          likedBy: [...postToLike.likedBy, userId],
        },
        ...query,
      }
    );
    return updatePost;
  },
});
