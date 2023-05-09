const http = require('http');
const url = require('url');
const querystring = require('querystring');
const path = require('path');
const fs = require('fs');

/**
 * Maps results from JIRA model to easier to handle model (flatten) and
 * replaces internal JIRA fields with their display names
 * @param body
 * @param fields
 * @returns {*}
 */
function flatten(body, fields) {
  const data = body.issues;
  const names = body.names;
  return data.map((i) => {
    const values = {};
    fields.forEach((field) => {
      switch (field) {
        case 'assignee':
          values[names[field]] = i.fields.assignee
            ? {
                name: i.fields.assignee.displayName,
                email: i.fields.assignee.emailAddress,
              }
            : {};
          break;
        case 'issuetype':
          values[names[field]] = i.fields.issuetype.name;
          break;
        case 'priority':
          values[names[field]] = i.fields.priority.name;
          break;
        case 'resolution':
          values[names[field]] = i.fields.resolution.name;
          break;
        case 'status':
          values[names[field]] = i.fields.status.name;
          break;
        case 'timetracking':
          break;
        default:
          values[names[field]] = i.fields[field];
      }
    });

    return {
      id: i.id,
      key: i.key,
      self: i.self,
      ...values,
    };
  });
}

/**
 * Execute a search query against a server
 * @param auth
 * @param base
 * @param searchApi
 * @param jql
 * @param fields
 * @returns {Promise<*>}
 */
async function proxySearch(auth, base, searchApi, jql, fields) {
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${auth}`);

  const query = querystring.stringify({
    jql,
    maxResults: 100,
    fields,
    expand: 'names',
  });
  const url = `${base}${searchApi}?${query}`;
  console.log(url);

  const response = await fetch(url, {
    method: 'GET',
    headers,
    redirect: 'follow',
  });

  if (response.status !== 200) {
    const error = new Error(
      response.statusText || 'Failed to execute proxy call',
    );
    error.statusCode = response.status;
    throw error;
  }

  // TODO paginate
  const data = JSON.parse(await response.text());
  return data;
}

/**
 * Handles a search using JQL query (via jql query parameter)
 *   * jql
 *   * auth
 *   * fields
 *   * base
 *   * api
 * @param req
 * @param res
 * @param query
 * @returns {Promise<*>}
 */
async function handleSearch(req, res, query) {
  const jql = query.jql;
  const auth = query.auth || process.env.JIRA_AUTH;
  const fieldsString = query.fields || process.env.JIRA_FIELDS;
  const base = query.base || process.env.JIRA_BASE;
  const searchApi = query.api || '/rest/api/2/search';
  const raw = query.raw;

  const fields = fieldsString.split(',');
  let data = await proxySearch(auth, base, searchApi, jql, fields);
  if (raw !== 'true') {
    data = flatten(data, fields);
  }
  return data;
}

/**
 * Handles a route that does not exists
 * @param req
 * @param res
 */
function handleNotFound(req, res) {
  const error = new Error('Page not found!');
  error.statusCode = 404;
  throw error;
}

/**
 * Writes data to response as json object
 * @param res
 * @param statusCode
 * @param data
 */
function writeResponse(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify(data));
  res.end();
}

/**
 * Setups an server/app
 * @returns {Server<typeof IncomingMessage, typeof ServerResponse>}
 */
function app() {
  console.log('Setup of App server');
  const server = http.createServer(async (req, res) => {
    const { pathname, query } = url.parse(req.url, true);
    console.log('Processing request', pathname, JSON.stringify(query));

    try {
      let data;
      switch (pathname) {
        case '/search':
          data = await handleSearch(req, res, query);
          break;
        default:
          handleNotFound(req, res);
          break;
      }
      writeResponse(res, 200, data);
    } catch (error) {
      console.error(error);
      const statusCode = error.statusCode || 500;
      writeResponse(res, statusCode, {
        code: statusCode,
        message: error.message,
      });
    }
  });
  return server;
}

/**
 * Loads environment variables from specified path if env file exists
 * @param fromPath
 * @returns {Promise<void>}
 */
function loadEnv(fromPath) {
  const envFile = path.join(fromPath, 'env');
  const stats = fs.statSync(envFile);
  if (!stats.isFile()) {
    return;
  }

  let env = fs.readFileSync(envFile, {
    encoding: 'utf8',
  });
  env = env.split('\n').filter((line) => line.length > 0);
  env.forEach((line) => {
    const i = line.indexOf('=');
    const k = line.substring(0, i);
    const v = line.substring(i + 1);
    process.env[k] = v;
  });
}

if (require.main === module) {
  loadEnv(path.join(__dirname, '..'));

  // validate that we have all required information
  if (!process.env.JIRA_BASE) {
    throw new Error('Missing JIRA_BASE environment variable');
  }
  if (!process.env.JIRA_AUTH) {
    throw new Error('Missing JIRA_AUTH environment variable');
  }
  const port = process.env.PORT || 3000;

  app().listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
} else {
  // This module is being included as a dependency
  module.exports = { flatten, app, loadEnv };
}
