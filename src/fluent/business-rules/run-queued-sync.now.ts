import "@servicenow/sdk/global";
import { BusinessRule } from "@servicenow/sdk/core";
import { runQueuedSync } from "../../server/business-rules/run-queued-sync";

BusinessRule({
    $id: Now.ID["br-run-queued-sync"],
    name: "Run Queued Sync",
    table: "x_snc_git_issue_sync_history",
    when: "async",
    action: ["insert"],
    condition: "current.status == 'queued'",
    order: 100,
    active: true,
    script: runQueuedSync,
    description: "Runs a GitHub sync in the background when a queued sync history record is inserted.",
});
