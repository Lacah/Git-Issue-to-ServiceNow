import "@servicenow/sdk/global";
import {
    Table,
    UrlColumn,
    ChoiceColumn,
    BooleanColumn,
    ReferenceColumn,
    DateTimeColumn,
    IntegerColumn,
    StringColumn,
} from "@servicenow/sdk/core";

export const x_snc_git_issue_sync_history = Table({
    name: "x_snc_git_issue_sync_history",
    label: "Sync History",
    allowWebServiceAccess: true,
    accessibleFrom: "package_private",
    schema: {
        repository_url: UrlColumn({
            label: "Repository URL",
            mandatory: true,
        }),
        sync_mode: ChoiceColumn({
            label: "Sync Mode",
            mandatory: true,
            dropdown: "dropdown_without_none",
            choices: {
                mirror: { label: "Mirror Repository", sequence: 0 },
                user_story: { label: "Map to User Stories", sequence: 1 },
            },
        }),
        state_filter: ChoiceColumn({
            label: "State Filter",
            mandatory: true,
            dropdown: "dropdown_without_none",
            choices: {
                open: { label: "Open", sequence: 0 },
                closed: { label: "Closed", sequence: 1 },
                all: { label: "All", sequence: 2 },
            },
        }),
        update_existing: BooleanColumn({
            label: "Update Existing",
            default: false,
        }),
        synced_by: ReferenceColumn({
            label: "Synced By",
            referenceTable: "sys_user",
            mandatory: true,
        }),
        sync_start: DateTimeColumn({
            label: "Sync Start",
            mandatory: true,
        }),
        sync_end: DateTimeColumn({
            label: "Sync End",
        }),
        status: ChoiceColumn({
            label: "Status",
            mandatory: true,
            dropdown: "dropdown_without_none",
            choices: {
                in_progress: { label: "In Progress", sequence: 0 },
                completed: { label: "Completed", sequence: 1 },
                completed_with_errors: { label: "Completed with Errors", sequence: 2 },
                failed: { label: "Failed", sequence: 3 },
            },
        }),
        issues_created: IntegerColumn({
            label: "Issues Created",
            default: "0",
        }),
        issues_updated: IntegerColumn({
            label: "Issues Updated",
            default: "0",
        }),
        issues_skipped: IntegerColumn({
            label: "Issues Skipped",
            default: "0",
        }),
        milestones_created: IntegerColumn({
            label: "Milestones Created",
            default: "0",
        }),
        milestones_updated: IntegerColumn({
            label: "Milestones Updated",
            default: "0",
        }),
        labels_created: IntegerColumn({
            label: "Labels Created",
            default: "0",
        }),
        error_message: StringColumn({
            label: "Error Message",
            maxLength: 4000,
        }),
        credential: ReferenceColumn({
            label: "Credential",
            referenceTable: "sys_auth_credential",
        }),
        current_phase: StringColumn({
            label: "Current Phase",
            maxLength: 100,
        }),
        current_item: IntegerColumn({
            label: "Current Item",
            default: "0",
        }),
        total_items: IntegerColumn({
            label: "Total Items",
            default: "0",
        }),
        percent_complete: IntegerColumn({
            label: "Percent Complete",
            default: "0",
        }),
        progress_message: StringColumn({
            label: "Progress Message",
            maxLength: 500,
        }),
    },
});
