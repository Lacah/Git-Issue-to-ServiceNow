import "@servicenow/sdk/global";
import { ScriptInclude } from "@servicenow/sdk/core";

ScriptInclude({
    $id: Now.ID['MarkdownConverter'],
    name: 'MarkdownConverter',
    script: Now.include('../../server/script-includes/MarkdownConverter.js'),
    description: 'Converts GitHub markdown to HTML and plain text using the marked library. Bridge to the markdown-converter module.',
    accessibleFrom: 'package_private',
});
