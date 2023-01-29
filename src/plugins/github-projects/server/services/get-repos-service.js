"use strict";

// import { request } from "@octokit/request";
const { request } = require("@octokit/request");
const axios = require("axios");

module.exports = ({ strapi }) => ({
  getPublicRepos: async () => {
    const result = await request("GET /user/repos", {
      headers: {
        authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
      type: "public",
    });

    // id, name, shortDescription, url, longDescription
    //https://raw.githubusercontent.com/${}/GetHubbers/main/README.md

    return Promise.all(
      result.data.map(async (item) => {
        let longDescription;
        const { id, name, description, html_url, owner, default_branch } = item;
        const reademeUrl = `https://raw.githubusercontent.com/${owner.login}/${name}/${default_branch}/README.md`;

        try {
          longDescription = (await axios.get(reademeUrl)).data;
        } catch (error) {
          console.log("Error fetching", reademeUrl);
        }

        return {
          id,
          name,
          shortDescription: description,
          url: html_url,
          longDescription,
        };
      })
    );
  },
});
