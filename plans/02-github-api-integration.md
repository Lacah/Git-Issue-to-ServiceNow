# Plan 02: GitHub API Integration

## Overview

Build a Script Include that handles all communication with the GitHub REST API,
including authentication, pagination, rate limit awareness, and error handling.

---

## GitHub REST API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `GET /repos/{owner}/{repo}/issues` | GET | List issues (includes PRs by default — filter them out) |
| `GET /repos/{owner}/{repo}/issues?state=open\|closed\|all` | GET | Filter by state |
| `GET /repos/{owner}/{repo}/milestones` | GET | List milestones |
| `GET /repos/{owner}/{repo}/milestones?state=open\|closed\|all` | GET | Filter milestone state |

### Important Notes

- GitHub's Issues API returns **both issues and pull requests**. Filter out PRs by checking `pull_request` key is absent.
- Pagination: GitHub uses `Link` header with `rel="next"` for pagination. Default page size is 30, max is 100 (use `per_page=100`).
- Rate limits returned in headers: `X-RateLimit-Remaining`, `X-RateLimit-Reset`.

---

## Script Include: `GitHubAPIClient`

### Responsibilities

1. Parse repo URL → extract `owner` and `repo`
2. Authenticate using credential record (PAT → `Authorization: token <PAT>`, OAuth → `Authorization: Bearer <token>`)
3. Handle pagination (follow `Link: <url>; rel="next"` headers)
4. Handle rate limiting (check remaining, inform caller if exhausted)
5. Handle errors (404 = repo not found, 401 = bad auth, 403 = rate limited, etc.)
6. Return structured data to caller

### API Design

```javascript
// Constructor
GitHubAPIClient(repoUrl, credentialSysId)

// Methods
.getIssues(state)        // Returns array of all issues (paginated), state: 'open'|'closed'|'all'
.getMilestones(state)    // Returns array of all milestones (paginated)
.getRepoInfo()           // Returns basic repo info (validates access)
.getRateLimit()          // Returns current rate limit status

// Internal
._makeRequest(endpoint, params)   // Core HTTP call
._parseLinkHeader(header)         // Extract next page URL
._authenticate()                  // Set auth headers from credential
._parseRepoUrl(url)               // Extract owner/repo from URL
```

### URL Parsing

Accept multiple formats:
- `https://github.com/owner/repo`
- `https://github.com/owner/repo.git`
- `https://github.com/owner/repo/`
- `github.com/owner/repo`

Extract: `owner` and `repo` from the path.

### Pagination Strategy

```
1. Make initial request with per_page=100
2. Check response headers for 'Link' header
3. Parse Link header for rel="next" URL
4. If next URL exists, make another request
5. Concatenate results
6. Repeat until no more "next" links
7. Report progress (page X fetched, total items so far)
```

### Rate Limit Handling

```
Before each request:
1. Check X-RateLimit-Remaining from last response
2. If remaining < 5, warn caller
3. If remaining == 0, return error with reset time
4. Include rate limit info in response metadata
```

### Error Response Format

```javascript
{
  success: false,
  error: {
    code: 404,           // HTTP status
    message: "Repository not found",
    type: "NOT_FOUND",   // Enum: NOT_FOUND, UNAUTHORIZED, RATE_LIMITED, SERVER_ERROR
    rateLimitReset: null  // Unix timestamp if rate limited
  }
}
```

### Success Response Format

```javascript
{
  success: true,
  data: [...],           // Array of issues/milestones
  metadata: {
    totalItems: 47,
    pages: 1,
    rateLimitRemaining: 4952,
    rateLimitReset: 1699999999
  }
}
```

---

## Credential Handling

### Lookup Priority

1. **Explicit credential**: User selects a credential record in the UI → use that
2. **Linked credential** (future enhancement): Check if repo URL matches a `sys_repo_config` or similar → reuse that credential

### Credential Types Supported

| Type | Auth Header |
|------|-------------|
| Personal Access Token (basic_auth or token) | `Authorization: token <PAT>` |
| OAuth Token | `Authorization: Bearer <token>` |

### Reading Credential Value

```javascript
// Use GlideOAuthClientRequest or credential resolver
var provider = new sn_cc.StandardCredentialsProvider();
var credential = provider.getCredentialAttribute(credSysId, 'password'); // PAT stored as password
```

Or use `sn_cc.ConnectionInfoProvider` depending on credential type.

---

## GitHub Issue Object Shape (What We Receive)

```json
{
  "id": 1,
  "number": 42,
  "title": "Found a bug",
  "body": "## Description\nSomething is broken\n\n## Acceptance Criteria\n- [ ] Fix it",
  "state": "open",
  "html_url": "https://github.com/owner/repo/issues/42",
  "user": {
    "login": "octocat"
  },
  "labels": [
    { "id": 1, "name": "bug", "color": "fc2929" }
  ],
  "milestone": {
    "id": 1,
    "number": 1,
    "title": "v1.0",
    "description": "First release",
    "due_on": "2024-01-01T00:00:00Z",
    "state": "open",
    "html_url": "https://github.com/owner/repo/milestone/1"
  },
  "pull_request": null,  // ABSENT for real issues, PRESENT for PRs
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-02T00:00:00Z",
  "closed_at": null
}
```

---

## GitHub Milestone Object Shape

```json
{
  "id": 1,
  "number": 1,
  "title": "v1.0",
  "description": "Track all v1.0 work",
  "state": "open",
  "html_url": "https://github.com/owner/repo/milestone/1",
  "due_on": "2024-06-01T00:00:00Z",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-15T00:00:00Z",
  "closed_at": null,
  "open_issues": 10,
  "closed_issues": 5
}
```

---

## Implementation Approach

Use **scripted REST** (`sn_ws.RESTMessageV2`) rather than a REST Message record because:
- Dynamic URL construction (different repos each time)
- Complex pagination logic with Link header parsing
- Need to handle variable number of sequential requests
- More flexible error handling

### Example Pattern

```javascript
var rm = new sn_ws.RESTMessageV2();
rm.setEndpoint('https://api.github.com/repos/' + owner + '/' + repo + '/issues');
rm.setHttpMethod('GET');
rm.setRequestHeader('Accept', 'application/vnd.github.v3+json');
rm.setRequestHeader('Authorization', 'token ' + pat);
rm.setRequestHeader('User-Agent', 'ServiceNow-GitIssueSync');
rm.setQueryParameter('state', 'open');
rm.setQueryParameter('per_page', '100');
rm.setQueryParameter('page', '1');

var response = rm.execute();
var statusCode = response.getStatusCode();
var body = response.getBody();
var headers = response.getHeaders();
```

---

## Testing Considerations

- Test with public repo (no auth needed, limited rate)
- Test with private repo (auth required)
- Test with repo that has >100 issues (pagination)
- Test with non-existent repo (404 handling)
- Test with invalid credential (401 handling)
- Test rate limit behavior
