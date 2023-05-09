const { flatten } = require('./index');

describe('Main Suite', () => {
  it('should flatten simple object', () => {
    const data = {
      expand: 'names,schema',
      startAt: 0,
      maxResults: 100,
      total: 1,
      issues: [
        {
          expand:
            'operations,versionedRepresentations,editmeta,changelog,renderedFields',
          id: '1124565',
          self: 'https://jira.acme.com/rest/api/2/issue/1124565',
          key: 'ABC-74974',
          fields: {
            summary: 'Feature not working as expected',
            issuetype: {
              self: 'https://jira.acme.com/rest/api/2/issuetype/10019',
              id: '10019',
              description: '',
              iconUrl:
                'https://jira.acme.com/secure/viewavatar?size=xsmall&avatarId=10605&avatarType=issuetype',
              name: 'Bug',
              subtask: false,
              avatarId: 10605,
            },
            customfield_10000: 'ABC-26422',
            assignee: {
              self: 'https://jira.acme.com/rest/api/2/user?username=Jane_Smith%40acme.com',
              name: 'Jane_Smith@acme.com',
              key: 'JIRAUSER10903',
              emailAddress: 'Jane_Smith@acme.com',
              avatarUrls: {
                '48x48':
                  'https://jira.acme.com/secure/useravatar?ownerId=JIRAUSER10903&avatarId=11903',
                '24x24':
                  'https://jira.acme.com/secure/useravatar?size=small&ownerId=JIRAUSER10903&avatarId=11903',
                '16x16':
                  'https://jira.acme.com/secure/useravatar?size=xsmall&ownerId=JIRAUSER10903&avatarId=11903',
                '32x32':
                  'https://jira.acme.com/secure/useravatar?size=medium&ownerId=JIRAUSER10903&avatarId=11903',
              },
              displayName: 'Jane Smith',
              active: true,
              timeZone: 'America/Toronto',
            },
            fixVersions: [
              {
                self: 'https://jira.acme.com/rest/api/2/version/10911',
                id: '10911',
                description: '',
                name: 'V1.4',
                archived: false,
                released: false,
                releaseDate: '2023-05-29',
              },
            ],
            priority: {
              self: 'https://jira.acme.com/rest/api/2/priority/10004',
              iconUrl:
                'https://jira.acme.com/images/icons/priorities/blocker.svg',
              name: '1. Resolve Immediately',
              id: '10004',
            },
            resolution: {
              self: 'https://jira.acme.com/rest/api/2/resolution/10009',
              id: '10009',
              description: '',
              name: 'Done',
            },
            timetracking: {},
            status: {
              self: 'https://jira.acme.com/rest/api/2/status/10013',
              description: '',
              iconUrl: 'https://jira.acme.com/images/icons/statuses/closed.png',
              name: 'Done',
              id: '10013',
              statusCategory: {
                self: 'https://jira.acme.com/rest/api/2/statuscategory/3',
                id: 3,
                key: 'done',
                colorName: 'green',
                name: 'Done',
              },
            },
          },
        },
      ],
      names: {
        summary: 'Summary',
        issuetype: 'Issue Type',
        fixVersions: 'Fix Version/s',
        customfield_10000: 'Epic Link',
        assignee: 'Assignee',
        priority: 'Priority',
        resolution: 'Resolution',
        timetracking: 'Time Tracking',
        status: 'Status',
      },
    };

    const flattened = flatten(
      data,
      'summary,resolution,status,priority,issuetype,fixVersions,assignee,timetracking,customfield_10000'.split(
        ',',
      ),
    );
    expect(flattened).toHaveProperty('length');
    expect(flattened.length).toBe(1);
    expect(flattened[0]).toStrictEqual({
      Assignee: {
        name: 'Jane Smith',
        email: 'Jane_Smith@acme.com',
      },
      'Epic Link': 'ABC-26422',
      'Fix Version/s': [
        {
          'Release Date': '2023-05-29',
          archived: false,
          name: 'V1.4',
          released: false,
        },
      ],
      'Issue Type': 'Bug',
      Priority: '1. Resolve Immediately',
      Resolution: 'Done',
      Summary: 'Feature not working as expected',
      id: '1124565',
      key: 'ABC-74974',
      self: 'https://jira.acme.com/rest/api/2/issue/1124565',
      Status: 'Done',
    });
  });
});
