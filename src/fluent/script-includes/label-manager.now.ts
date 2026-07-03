import "@servicenow/sdk/global";
import { ScriptInclude } from "@servicenow/sdk/core";

ScriptInclude({
    $id: Now.ID['LabelManager'],
    name: 'LabelManager',
    script: Now.include('../../server/script-includes/LabelManager.js'),
    description: 'Manages GitHub label synchronization by finding or creating label records and associating them with synced issue records.',
    accessibleFrom: 'package_private',
});
