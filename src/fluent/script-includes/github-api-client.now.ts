import "@servicenow/sdk/global";
import { ScriptInclude } from "@servicenow/sdk/core";

ScriptInclude({
    $id: Now.ID['GitHubAPIClient'],
    name: 'GitHubAPIClient',
    script: Now.include('../../server/script-includes/GitHubAPIClient.js'),
    description: 'REST client for the GitHub API v3. Handles authentication, pagination, and rate limiting for repository, issue, and milestone endpoints.',
    accessibleFrom: 'package_private',
});
