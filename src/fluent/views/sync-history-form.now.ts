import "@servicenow/sdk/global";
import { Form, default_view } from "@servicenow/sdk/core";

Form({
    table: "x_snc_git_issue_sync_history",
    view: default_view,
    sections: [
        {
            caption: "General",
            content: [
                {
                    layout: "two-column",
                    leftElements: [
                        { field: "repository_url", type: "table_field" },
                        { field: "sync_mode", type: "table_field" },
                        { field: "state_filter", type: "table_field" },
                        { field: "update_existing", type: "table_field" },
                        { field: "synced_by", type: "table_field" },
                        { field: "credential", type: "table_field" },
                        { field: "status", type: "table_field" },
                    ],
                    rightElements: [
                        { field: "sync_start", type: "table_field" },
                        { field: "sync_end", type: "table_field" },
                        { field: "issues_created", type: "table_field" },
                        { field: "issues_updated", type: "table_field" },
                        { field: "issues_skipped", type: "table_field" },
                        { field: "milestones_created", type: "table_field" },
                        { field: "milestones_updated", type: "table_field" },
                    ],
                },
                {
                    layout: "two-column",
                    leftElements: [
                        { field: "labels_created", type: "table_field" },
                        { field: "current_phase", type: "table_field" },
                        { field: "current_item", type: "table_field" },
                    ],
                    rightElements: [
                        { field: "total_items", type: "table_field" },
                        { field: "percent_complete", type: "table_field" },
                        { field: "progress_message", type: "table_field" },
                    ],
                },
                {
                    layout: "one-column",
                    elements: [
                        { field: "error_message", type: "table_field" },
                    ],
                },
            ],
        },
    ],
});
