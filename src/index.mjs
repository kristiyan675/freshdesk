import readline from "readline";
import { config } from "dotenv";
import { getGithubUser, createFreshdeskContact } from "./services.mjs";

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

    rl.question("Please enter the Freshdesk subdomain: ", async (subdomain) => {
      if (!subdomain) {
        console.error("Freshdesk subdomain is required.");
        rl.close();
        return;
      }

      const userData = await getGithubUser(username);
      if (userData) {
        console.log("GitHub User Data:", userData);

        const freshdeskApiKey = process.env.FRESHDESK_API_KEY;

        if (freshdeskApiKey) {
          const avatarPath = null;
          const freshdeskContact = await createFreshdeskContact(
            userData,
            subdomain,
            freshdeskApiKey,
            avatarPath
          );
          if (freshdeskContact) {
            console.log("Freshdesk Contact Created/Updated:", freshdeskContact);
          }
        } else {
          console.error("Freshdesk API key is required.");
        }
      }

      rl.close();
    });
  });
};

main();
