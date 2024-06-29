import { describe, it, beforeEach } from "mocha";
import * as chai from "chai";
import nock from "nock";
import { getGithubUser, createFreshdeskContact } from "./services.mjs";

const { expect } = chai;

describe("GitHub to Freshdesk Integration", () => {
  const githubUsername = "octocat";
  const freshdeskSubdomain = process.env.FRESHDESK_SUBDOMAIN;
  const freshdeskApiKey = process.env.FRESHDESK_API_KEY;
  const githubApiUrl = `https://api.github.com`;
  const freshdeskApiUrl = `https://${freshdeskSubdomain}.freshdesk.com`;

  beforeEach(() => {
    nock.cleanAll();
  });

  it("should fetch GitHub user data", async () => {
    const mockGithubResponse = {
      login: "octocat",
      id: 1,
      avatar_url: "https://avatars.githubusercontent.com/u/1?v=4",
      name: "monalisa octocat",
      email: "octocat@github.com",
      twitter_username: "monalisa",
    };

    nock(githubApiUrl)
      .get(`/users/${githubUsername}`)
      .reply(200, mockGithubResponse);

    const userData = await getGithubUser(githubUsername);
    expect(userData).to.deep.equal(mockGithubResponse);
  });

  it("should create Freshdesk contact", async () => {
    const mockGithubResponse = {
      login: "octocat",
      id: 1,
      avatar_url: "https://avatars.githubusercontent.com/u/1?v=4",
      name: "monalisa octocat",
      email: "octocat@github.com",
      twitter_username: "monalisa",
    };

    const mockFreshdeskResponse = {
      id: 1,
      name: "monalisa octocat",
      email: "octocat@github.com",
    };

    nock(githubApiUrl)
      .get(`/users/${githubUsername}`)
      .reply(200, mockGithubResponse);

    nock(freshdeskApiUrl)
      .post("/api/v2/contacts")
      .reply(201, mockFreshdeskResponse);

    const userData = await getGithubUser(githubUsername);
    const contact = await createFreshdeskContact(
      userData,
      freshdeskSubdomain,
      freshdeskApiKey
    );

    expect(contact).to.deep.equal(mockFreshdeskResponse);
  });
});
