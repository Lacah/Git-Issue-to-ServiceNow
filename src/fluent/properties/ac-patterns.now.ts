import "@servicenow/sdk/global";
import { Property } from "@servicenow/sdk/core";

Property({
    $id: Now.ID['ac-patterns-property'],
    name: 'x_snc_git_issue.ac_patterns',
    type: 'string',
    value: '^#{1,3}\\s*Acceptance\\s*Criteria\\s*:?\\s*$\n^\\*\\*Acceptance\\s*Criteria\\*\\*\\s*:?\\s*$\n^#{1,3}\\s*AC\\s*:?\\s*$',
    description: 'Newline-separated list of regex patterns used to detect the Acceptance Criteria section heading in GitHub issue bodies. Each pattern is tested against individual lines of the issue body. The first match splits the body into description (above) and acceptance criteria (below).',
    roles: {
        read: ['admin'],
        write: ['admin']
    }
});
