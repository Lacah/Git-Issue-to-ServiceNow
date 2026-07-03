import { gs, GlideRecord, GlideDateTime } from '@servicenow/glide';

export function startSync(request: any, response: any) {
    try {
        var body = request.body.data;

        var repoUrl = body.repository_url || '';
        var credentialSysId = body.credential_sys_id || '';
        var syncMode = body.sync_mode || 'mirror';
        var stateFilter = body.state_filter || 'open';
        var updateExisting = body.update_existing || false;

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

        var gr = new GlideRecord('x_snc_git_issue_sync_history');
        gr.initialize();
        gr.setValue('repository_url', repoUrl);
        gr.setValue('sync_mode', syncMode);
        gr.setValue('state_filter', stateFilter);
        gr.setValue('update_existing', updateExisting ? true : false);
        gr.setValue('synced_by', gs.getUserID());
        gr.setValue('sync_start', new GlideDateTime().getDisplayValue());
        gr.setValue('status', 'queued');
        if (credentialSysId) {
            gr.setValue('credential', credentialSysId);
        }
        var syncId = gr.insert();

        if (!syncId) {
            response.setStatus(500);
            response.setBody({ success: false, error: 'Failed to create sync record' });
            return;
        }

        response.setStatus(200);
        response.setBody({ success: true, sync_id: syncId });
    } catch (e: any) {
        response.setStatus(500);
        response.setBody({ success: false, error: 'Internal server error: ' + e.message });
    }
}
