const request = require("supertest");
const { app } = require("../src/index");
const fs = require("fs");
const path = require("path");
const { loadEnv } = require("../src");

describe("AppController (e2e)", () => {
  let server;

  beforeAll(async () => {
    loadEnv(path.join(__dirname, '..'));
  });

  beforeEach(async () => {
    server = app();
  });

  it("/search (GET)", async () => {
    const path = "/search";
    const params = new URLSearchParams({
      jql: process.env["JQL"],
      raw: false
    });

    const url = `${path}?${params.toString()}`;
    console.log(url);
    const response = await request(server).get(url);
    console.log("status", response.status, "body", JSON.stringify(response.body, null, 2));
  });
});
