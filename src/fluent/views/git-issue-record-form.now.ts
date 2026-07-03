import "@servicenow/sdk/global";
import { Form, default_view } from "@servicenow/sdk/core";

Form({
    table: "x_snc_git_issue_record",
    view: default_view,
    sections: [
        {
            caption: "General",
            content: [
                {
                    layout: "two-column",
                    leftElements: [
                        { field: "github_issue_number", type: "table_field" },
                        { field: "github_state", type: "table_field" },
                        { field: "github_author", type: "table_field" },
                        { field: "milestone", type: "table_field" },
                    ],
                    rightElements: [
                        { field: "repository_url", type: "table_field" },
                        { field: "github_url", type: "table_field" },
                        { field: "github_created_at", type: "table_field" },
                        { field: "github_updated_at", type: "table_field" },
                    ],
                },
                {
                    layout: "one-column",
                    elements: [
                        { field: "github_closed_at", type: "table_field" },
                        { field: "body_html", type: "table_field" },
                    ],
                },
            ],
        },
    ],
});
