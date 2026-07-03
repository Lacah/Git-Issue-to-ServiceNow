import "@servicenow/sdk/global";
import {
    Table,
    StringColumn,
    HtmlColumn,
    IntegerColumn,
    UrlColumn,
    ChoiceColumn,
    DateColumn,
    DateTimeColumn,
} from "@servicenow/sdk/core";

export const x_snc_git_issue_milestone = Table({
    name: "x_snc_git_issue_milestone",
    label: "GitHub Milestone",
    display: "title",
    allowWebServiceAccess: true,
    accessibleFrom: "package_private",
    schema: {
        title: StringColumn({
            label: "Title",
            maxLength: 255,
            mandatory: true,
        }),
        description: HtmlColumn({
            label: "Description",
        }),
        milestone_number: IntegerColumn({
            label: "Milestone Number",
            mandatory: true,
        }),
        repository_url: UrlColumn({
            label: "Repository URL",
            mandatory: true,
        }),
        github_url: UrlColumn({
            label: "GitHub URL",
        }),
        state: ChoiceColumn({
            label: "State",
            mandatory: true,
            dropdown: "dropdown_with_none",
            choices: {
                open: { label: "Open", sequence: 0 },
                closed: { label: "Closed", sequence: 1 },
            },
        }),
        due_date: DateColumn({
            label: "Due Date",
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
    },
});
