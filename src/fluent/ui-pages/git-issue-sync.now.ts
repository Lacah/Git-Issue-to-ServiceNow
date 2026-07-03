import "@servicenow/sdk/global";
import { UiPage } from "@servicenow/sdk/core";
import page from "../../client/index.html";

export const git_issue_sync_page = UiPage({
  $id: Now.ID["git-issue-sync"],
  endpoint: "x_snc_git_issue_sync.do",
  html: page,
  direct: true,
  description: "Git Issue Sync - Synchronize GitHub issues to ServiceNow"
});
