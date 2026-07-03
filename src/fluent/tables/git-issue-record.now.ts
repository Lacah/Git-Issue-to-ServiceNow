import "@servicenow/sdk/global";
import {
    Table,
    IntegerColumn,
    UrlColumn,
    ChoiceColumn,
    StringColumn,
    ReferenceColumn,
    DateTimeColumn,
    HtmlColumn,
} from "@servicenow/sdk/core";

export const x_snc_git_issue_record = Table({
    name: "x_snc_git_issue_record",
    label: "GitHub Issue",
    extends: "task",
    display: "short_description",
    allowWebServiceAccess: true,
    accessibleFrom: "package_private",
    autoNumber: {
        prefix: "GHI",
        number: 1000,
        numberOfDigits: 7,
    },
    schema: {
        github_issue_number: IntegerColumn({
            label: "GitHub Issue Number",
            mandatory: true,
        }),
        repository_url: UrlColumn({
            label: "Repository URL",
            mandatory: true,
        }),
        github_url: UrlColumn({
            label: "GitHub URL",
        }),
        github_state: ChoiceColumn({
            label: "GitHub State",
            mandatory: true,
            dropdown: "dropdown_with_none",
            choices: {
                open: { label: "Open", sequence: 0 },
                closed: { label: "Closed", sequence: 1 },
            },
        }),
        github_author: StringColumn({
            label: "Opened By",
            maxLength: 255,
        }),
        milestone: ReferenceColumn({
            label: "Milestone",
            referenceTable: "x_snc_git_issue_milestone",
        }),
        github_created_at: DateTimeColumn({
            label: "GitHub Created At",
        }),
        github_updated_at: DateTimeColumn({
            label: "GitHub Updated At",
        }),
        github_closed_at: DateTimeColumn({
            label: "GitHub Closed At",
        }),
        body_html: HtmlColumn({
            label: "Body HTML",
        }),
    },
});
