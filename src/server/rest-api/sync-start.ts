import { gs, GlideRecord } from '@servicenow/glide';
// @ts-ignore - types generated at build time
import { SyncOrchestrator } from '@servicenow/glide/x_snc_git_issue';

export function startSync(request: any, response: any) {
    try {
        var body = request.body.data;

        var repoUrl = body.repository_url || '';
        var credentialSysId = body.credential_sys_id || '';
        var syncMode = body.sync_mode || 'mirror';
        var stateFilter = body.state_filter || 'open';
        var updateExisting = body.update_existing || false;

        // Validate required fields
        if (!repoUrl) {
            response.setStatus(400);
            response.setBody({ success: false, error: 'repository_url is required' });
            return;
        }

        if (syncMode !== 'mirror' && syncMode !== 'user_story') {
            response.setStatus(400);
            response.setBody({ success: false, error: 'sync_mode must be "mirror" or "user_story"' });
            return;
        }

        // Initialize and start the sync orchestrator
        var orchestrator = new SyncOrchestrator({
            repoUrl: repoUrl,
            credentialSysId: credentialSysId,
            syncMode: syncMode,
            stateFilter: stateFilter,
            updateExisting: updateExisting
        });

        var result = orchestrator.startSync();

        if (result.success) {
            response.setStatus(200);
            response.setBody({
                success: true,
                sync_id: result.syncId,
                results: result.results
            });
        } else {
            response.setStatus(200);
            response.setBody({
                success: false,
                sync_id: result.syncId || '',
                error: result.error
            });
        }
    } catch (e: any) {
        response.setStatus(500);
        response.setBody({ success: false, error: 'Internal server error: ' + e.message });
    }
}
