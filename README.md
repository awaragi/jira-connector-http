# JIRA Connector HTTP

An HTTP proxy/connector to JIRA for easy hooking into Power BI and Excel (Power Query Web Source)

## Quick Description
The connector exposes simple http endpoints using GET methods to allow for easy integration as a web source for 
reporting tools such as Power BI, Excel and Others without having to fiddle with tokens, API.

The connector is built as a single script (src/index.js) with zero dependencies that you can easily launch without need
to perform any additional setup such as installing dependencies. Simply setup your .env file and run node src/index.js
and you are up and running.

The connector is free to use, modify and adapt to your own data model. I only ask that if you have create new mapping
functions that you share them with me so that the community would benefit from this tool.

## Setup

Really simple, I promise.
* You need to have NodeJS 18+ installed. Pre-built installers exists at https://nodejs.org/en/download
* Clone or download as a zip the current repository
* create env file (see below for examples) in the root folder using your favorite text editor (such as Notepad)
* Launch the server using npm start or using node src/index
* Point your reporting platform Web JSON source http://localhost:3000/search?jql=project=abc
* The jql query parameter should be ideally URL encoded (use online url encoder - there are plenty of them)
* To view raw JIRA result, add query parameter raw=true

### env file

Here is a sample env file
```shell
JIRA_BASE=https://jira.acme.ca
JIRA_FIELDS=summary,resolution,status,priority,issuetype,fixVersions,assignee,timetracking,customfield_10000
JIRA_AUTH=NXafzdg34Tk3ODc3Olr46mdfwWWFad3asfz9wCWgfySS
PORT=3000
```

## Output

Here is a sample output which is very easy to import into a Web JSON data source in any reporting platform
```json
[
    {
        "id": "1107395",
        "key": "ABC-74974",
        "self": "https://jira.acme.ca/rest/api/2/issue/1107395",
        "Summary": "Test issue",
        "Resolution": "Done",
        "Status": "Done",
        "Priority": "1. Resolve Immediately",
        "Issue Type": "Bug",
        "Fix Version/s": [],
        "Assignee": {
            "name": "Jane Smith",
            "email": "jane.smith@acme.com"
        },
        "Epic Link": "ABC-126122"
    }
]
```

## Additional development

To contribute to this project:
* Fork into your own repository
* Optionally create a new branch to work in
* Make code modifications
* Use test folder with e2e tests to quickly try your changes (will use the same env file as the main server)
* Add appropriate unit tests
* Create a Pull Request to add your code into main repository.

## Reference
* https://developer.atlassian.com/cloud/jira/platform/rest/v2/api-group-issue-search#api-rest-api-2-search-get