# GitHub to Freshdesk Integration

This project integrates the GitHub API and the Freshdesk API to fetch user data from GitHub and create contacts in Freshdesk.

## Features

- Fetch user data from GitHub.
- Create or update Freshdesk contacts using the fetched GitHub user data.

## Prerequisites

- Node.js
- npm

## Setup

### 1. Clone the Repository and install depenedencies

    git clone https://github.com/kristiyan675/freshdesk.git
    cd freshdesk

### 2. Install dependencies

    npm install

### 3. Environment Variables

Create a .env file in the root directory of your project and add the following environment variables:

GITHUB_TOKEN=your_github_token

FRESHDESK_SUBDOMAIN=your_freshdesk_subdomain

!NB: This for testing purposes. The input in the CLI will still be required.

FRESHDESK_API_KEY=your_freshdesk_api_key

### 4.Usage

Fetch GitHub User and Update Freshdesk Contact
Run the following command to fetch a GitHub user and create a Freshdesk contact:

    npm start

You will be prompted to enter a github username. The program will the the github and freshdesk api's to retreieve the github user and write a new entry to freshdesk.

### 5.Running Tests

To run the tests, use the following command:
npm test

#### Dependencies

axios,  
dotenv,  
esm,  
chai,  
mocha,  
nock

#### Future improvements

Apply all CRUD operations
