import readline from "readline";
import { config } from "dotenv";
import { getGithubUser, createOrUpdateFreshdeskContact } from "./services.mjs";

config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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
      const freshdeskApiKey = process.env.FRESHDESK_API_KEY;

      if (freshdeskSubdomain && freshdeskApiKey) {
        const avatarPath = null;
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
