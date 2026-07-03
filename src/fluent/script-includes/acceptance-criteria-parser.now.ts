import "@servicenow/sdk/global";
import { ScriptInclude } from "@servicenow/sdk/core";

ScriptInclude({
    $id: Now.ID['AcceptanceCriteriaParser'],
    name: 'AcceptanceCriteriaParser',
    script: Now.include('../../server/script-includes/AcceptanceCriteriaParser.js'),
    description: 'Parses GitHub issue bodies to extract acceptance criteria sections from markdown content.',
    accessibleFrom: 'package_private',
});
