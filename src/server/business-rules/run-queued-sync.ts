// @ts-ignore - types generated at build time
import { SyncOrchestrator } from '@servicenow/glide/x_snc_git_issue';

// `current` is the newly-inserted sync history GlideRecord, injected by the
// Business Rule runtime.
declare const current: any;

export function runQueuedSync() {
    var config = {
        repoUrl: current.getValue('repository_url'),
        credentialSysId: current.getValue('credential') || '',
        syncMode: current.getValue('sync_mode'),
        stateFilter: current.getValue('state_filter'),
        updateExisting: current.getValue('update_existing') == '1'
    };

    var orchestrator = new SyncOrchestrator(config);
    orchestrator.runExisting(current.getUniqueValue());
}
