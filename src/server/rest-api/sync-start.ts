import { gs, GlideRecord, GlideDateTime } from '@servicenow/glide';

declare const SyncOrchestrator: any;

function categorizeError(message: string): { error: string; hint: string; code: string } {
    var msg = message || 'Unknown error';

    // GitHub auth errors
    if (msg.indexOf('HTTP 401') !== -1 || msg.indexOf('Bad credentials') !== -1) {
        return {
            error: 'Authentication failed — GitHub rejected the provided token.',
            hint: 'Your token may be expired or revoked. Generate a new personal access token with "repo" scope.',
            code: 'auth_failed'
        };
    }
    if (msg.indexOf('HTTP 403') !== -1) {
        return {
            error: 'Access forbidden — the token does not have sufficient permissions.',
            hint: 'Ensure your personal access token has the "repo" scope (for private repos) or "public_repo" scope (for public repos).',
            code: 'forbidden'
        };
    }

    // Repo not found
    if (msg.indexOf('HTTP 404') !== -1) {
        return {
            error: 'Repository not found.',
            hint: 'Double-check the repository URL. For private repos, ensure you provided a valid token that has access to this repository.',
            code: 'not_found'
        };
    }

    // Rate limiting
    if (msg.indexOf('HTTP 429') !== -1 || msg.indexOf('rate limit') !== -1) {
        return {
            error: 'GitHub API rate limit exceeded.',
            hint: 'Wait a few minutes and try again, or provide a personal access token to get a higher rate limit (5000 requests/hour vs 60).',
            code: 'rate_limited'
        };
    }

    // Invalid repo URL
    if (msg.indexOf('Invalid GitHub repository URL') !== -1) {
        return {
            error: msg,
            hint: 'Use the full URL format: https://github.com/owner/repo',
            code: 'invalid_url'
        };
    }

    // Generic fallback
    return {
        error: msg,
        hint: 'Check System Logs for additional details.',
        code: 'unknown'
    };
}

export function startSync(request: any, response: any) {
    try {
        var body = request.body.data;

        var repoUrl = body.repository_url || '';
        var token = body.token || '';
        var credentialAlias = body.credential_alias || '';
        var syncMode = body.sync_mode || 'mirror';
        var stateFilter = body.state_filter || 'open';
        var updateExisting = body.update_existing || false;

        if (!repoUrl) {
            response.setStatus(400);
            response.setBody({ success: false, error: 'Repository URL is required.', hint: 'Enter a GitHub repository URL in the format: https://github.com/owner/repo', code: 'missing_url' });
            return;
        }

        if (syncMode !== 'mirror' && syncMode !== 'user_story') {
            response.setStatus(400);
            response.setBody({ success: false, error: 'Invalid sync mode.', hint: 'sync_mode must be "mirror" or "user_story"', code: 'invalid_mode' });
            return;
        }

        // Initialize and start the sync orchestrator
        var orchestrator = new SyncOrchestrator({
            repoUrl: repoUrl,
            token: token,
            credential_alias: credentialAlias,
            syncMode: syncMode,
            stateFilter: stateFilter,
            updateExisting: updateExisting
        });

        var syncId = orchestrator.startSync();

        response.setStatus(200);
        response.setBody({
            success: true,
            sync_id: syncId
        });
    } catch (e: any) {
        var categorized = categorizeError(e.message || String(e));
        gs.error('GitIssueSync: Sync failed — ' + categorized.error);
        response.setStatus(200);
        response.setBody({
            success: false,
            error: categorized.error,
            hint: categorized.hint,
            code: categorized.code
        });
    }
}
