import "@servicenow/sdk/global";
import {
    Table,
    ReferenceColumn,
    UrlColumn,
    IntegerColumn,
} from "@servicenow/sdk/core";

export const x_snc_git_issue_story_xref = Table({
    name: "x_snc_git_issue_story_xref",
    label: "Story Cross-Reference",
    allowWebServiceAccess: true,
    accessibleFrom: "package_private",
    schema: {
        story: ReferenceColumn({
            label: "Story",
            referenceTable: "rm_story",
            mandatory: true,
        }),
        repository_url: UrlColumn({
            label: "Repository URL",
            mandatory: true,
        }),
        github_issue_number: IntegerColumn({
            label: "GitHub Issue Number",
            mandatory: true,
        }),
    },
});
