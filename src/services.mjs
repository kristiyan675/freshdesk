import axios from "axios";
import FormData from "form-data";
import fs from "fs";

export const getGithubUser = async (username) => {
  try {
    const token = process.env.GITHUB_TOKEN;
    const response = await axios.get(
      `https://api.github.com/users/${username}`,
      {
        headers: {
          Authorization: `token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching GitHub user:", error.message);
  }
};

export const createFreshdeskContact = async (
  userData,
  freshdeskSubdomain,
  freshdeskApiKey,
  avatarPath
) => {
  try {
    const url = `https://${freshdeskSubdomain}.freshdesk.com/api/v2/contacts`;

    const form = new FormData();

    //  @dev For demo purposes - adding Math.random().toFixed(2).toString() because the freshdesk api
    //  doesn't allow same entry twice even after deleting it from the site's UI.
    form.append(
      "name",
      `${userData.login + Math.random().toFixed(2).toString()}` ||
        userData.login
    );
    form.append(
      "email",
      userData.email ||
        `${userData.login + Math.random().toFixed(2).toString()}@github.com`
    );
    form.append(
      "twitter_id",
      userData.twitter_username + Math.random().toFixed(2).toString() || ""
    );
    form.append(
      "unique_external_id",
      userData.id + Math.random().toFixed(2).toString()
    );

    if (avatarPath) {
      form.append("avatar", fs.createReadStream(avatarPath));
    } else if (userData.avatar_url) {
      // Download the avatar image
      const response = await axios.get(userData.avatar_url, {
        responseType: "stream",
      });
      const buffer = [];
      response.data.on("data", (chunk) => {
        buffer.push(chunk);
      });
      response.data.on("end", () => {
        const bufferData = Buffer.concat(buffer);
        form.append("avatar", bufferData, {
          filename: "avatar.jpg",
          contentType: response.headers["content-type"],
        });
      });
      await new Promise((resolve) => response.data.on("end", resolve)); // Wait for stream to end
    }

    const response = await axios.post(url, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Basic ${Buffer.from(freshdeskApiKey + ":X").toString(
          "base64"
        )}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating Freshdesk contact:", error.message);
  }
};
