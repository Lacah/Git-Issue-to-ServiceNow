import "@servicenow/sdk/global";
import { ScriptInclude } from "@servicenow/sdk/core";

ScriptInclude({
    $id: Now.ID['SyncOrchestrator'],
    name: 'SyncOrchestrator',
    script: Now.include('../../server/script-includes/SyncOrchestrator.js'),
    description: 'Orchestrates the full GitHub-to-ServiceNow synchronization process including milestones, issues, labels, and progress tracking.',
    accessibleFrom: 'package_private',
});
