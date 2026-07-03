import { gs, GlideRecord } from '@servicenow/glide';

export function getProgress(request: any, response: any) {
    try {
        var syncId = request.pathParams.sync_id;

        if (!syncId) {
            response.setStatus(400);
            response.setBody({ success: false, error: 'sync_id path parameter is required' });
            return;
        }

        var gr = new GlideRecord('x_snc_git_issue_sync_history');
        if (!gr.get(syncId)) {
            response.setStatus(404);
            response.setBody({ success: false, error: 'Sync record not found' });
            return;
        }

        response.setStatus(200);
        response.setBody({
            success: true,
            data: {
                sys_id: gr.getUniqueValue(),
                status: gr.getValue('status'),
                current_phase: gr.getValue('current_phase'),
                current_item: parseInt(gr.getValue('current_item') || '0'),
                total_items: parseInt(gr.getValue('total_items') || '0'),
                percent_complete: parseInt(gr.getValue('percent_complete') || '0'),
                progress_message: gr.getValue('progress_message') || '',
                issues_created: parseInt(gr.getValue('issues_created') || '0'),
                issues_updated: parseInt(gr.getValue('issues_updated') || '0'),
                issues_skipped: parseInt(gr.getValue('issues_skipped') || '0'),
                milestones_created: parseInt(gr.getValue('milestones_created') || '0'),
                milestones_updated: parseInt(gr.getValue('milestones_updated') || '0'),
                labels_created: parseInt(gr.getValue('labels_created') || '0'),
                error_message: gr.getValue('error_message') || '',
                sync_mode: gr.getValue('sync_mode'),
                repository_url: gr.getValue('repository_url')
            }
        });
    } catch (e: any) {
        response.setStatus(500);
        response.setBody({ success: false, error: 'Internal server error: ' + e.message });
    }
}
