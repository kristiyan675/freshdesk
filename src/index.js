const axios = require("axios");
const readline = require("readline");
require("dotenv").config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const getGithubUser = async (username) => {
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

const createOrUpdateFreshdeskContact = async (
  userData,
  freshdeskSubdomain,
  freshdeskApiKey,
  avatarPath
) => {
  try {
    const url = `https://${freshdeskSubdomain}.freshdesk.com/api/v2/contacts`;

    const form = new FormData();
    form.append("name", userData.name || userData.login);
    form.append("email", userData.email || `${userData.login}@github.com`);
    form.append("twitter_id", userData.twitter_username || "");
    form.append("unique_external_id", userData.id);

    if (avatarPath) {
      form.append("avatar", fs.createReadStream(avatarPath));
    } else if (userData.avatar_url) {
      // Download the avatar image
      const response = await axios.get(userData.avatar_url, {
        responseType: "arraybuffer",
      });
      const buffer = Buffer.from(response.data, "binary");
      form.append("avatar", buffer, "avatar.jpg");
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
    console.error("Error creating/updating Freshdesk contact:", error.message);
  }
};

const main = async () => {
  rl.question("Please enter the GitHub username: ", async (username) => {
    if (!username) {
      console.error("GitHub username is required.");
      rl.close();
      return;
    }

    const userData = await getGithubUser(username);
    if (userData) {
      console.log("GitHub User Data:", userData);

      const freshdeskSubdomain = process.env.FRESHDESK_SUBDOMAIN;
      const freshdeskApiKey = process.env.FRESHDESK_TOKEN;

      if (freshdeskSubdomain && freshdeskApiKey) {
        const avatarPath = null; // Set to your local avatar path if available
        const freshdeskContact = await createOrUpdateFreshdeskContact(
          userData,
          freshdeskSubdomain,
          freshdeskApiKey,
          avatarPath
        );
        if (freshdeskContact) {
          console.log("Freshdesk Contact Created/Updated:", freshdeskContact);
        }
      } else {
        console.error("Freshdesk subdomain and API key are required.");
      }
    }

    rl.close();
  });
};

main();
