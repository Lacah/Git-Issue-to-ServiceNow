import "@servicenow/sdk/global";
import { Form, default_view } from "@servicenow/sdk/core";

Form({
    table: "x_snc_git_issue_story_xref",
    view: default_view,
    sections: [
        {
            caption: "General",
            content: [
                {
                    layout: "two-column",
                    leftElements: [
                        { field: "story", type: "table_field" },
                        { field: "github_issue_number", type: "table_field" },
                    ],
                    rightElements: [
                        { field: "repository_url", type: "table_field" },
                    ],
                },
            ],
        },
    ],
});
