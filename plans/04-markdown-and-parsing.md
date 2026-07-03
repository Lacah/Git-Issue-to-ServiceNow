# Plan 04: Markdown Conversion & Acceptance Criteria Parsing

## Overview

Two distinct concerns:
1. **Markdown → HTML / Plain Text**: Convert GitHub-flavored markdown to HTML (for HTML fields) or strip to plain text (for string fields).
2. **Acceptance Criteria Parsing**: Split an issue body into "description" and "acceptance criteria" sections.

---

## Part A: Markdown Converter

### Script Include: `MarkdownConverter`

### Approach: Use npm library `marked`

[`marked`](https://github.com/markedjs/marked) is a well-established, fast, lightweight markdown parser. It handles GitHub-Flavored Markdown (GFM) including:
- Headers, bold, italic, strikethrough
- Links and images
- Code blocks (fenced and indented)
- Lists (ordered, unordered, task lists)
- Tables
- Blockquotes
- Horizontal rules

### Why `marked`?

| Library | Size | GFM Support | Active | Notes |
|---------|------|-------------|--------|-------|
| `marked` | ~40KB | Yes | Yes | Fast, configurable, widely used |
| `showdown` | ~150KB | Yes | Less active | More features, larger |
| `markdown-it` | ~100KB | Yes (plugins) | Yes | Plugin-based, heavier |

**Recommendation**: Use `marked` — smallest footprint, GFM support built-in, well-maintained.

### Installation

Add to `package.json`:
```json
{
  "dependencies": {
    "marked": "9.1.6"
  }
}
```

### API Design

```javascript
// MarkdownConverter Script Include

/**
 * Convert GitHub-flavored markdown to sanitized HTML
 * @param {string} markdown - Raw markdown text
 * @returns {string} HTML output
 */
MarkdownConverter.toHTML(markdown)

/**
 * Convert markdown to plain text (strip all formatting)
 * @param {string} markdown - Raw markdown text  
 * @returns {string} Plain text output
 */
MarkdownConverter.toPlainText(markdown)
```

### HTML Conversion Notes

- Sanitize output to prevent XSS (strip `<script>`, event handlers, etc.)
- Convert GitHub-specific syntax:
  - `- [ ]` → unchecked checkbox (HTML: `<input type="checkbox" disabled>`)
  - `- [x]` → checked checkbox (HTML: `<input type="checkbox" checked disabled>`)
  - `@mentions` → plain text (no GitHub linking in SN)
  - `#123` issue references → link back to GitHub if possible

### Plain Text Conversion

For fields that only accept plain text (like OOTB `description` on rm_story):

```javascript
// Strategy: Convert MD → HTML → strip HTML tags → clean up whitespace
function toPlainText(markdown) {
    // Option 1: Use marked to parse, then strip tags
    var html = marked.parse(markdown);
    var text = html.replace(/<[^>]+>/g, '');  // Strip HTML tags
    text = text.replace(/&amp;/g, '&');
    text = text.replace(/&lt;/g, '<');
    text = text.replace(/&gt;/g, '>');
    text = text.replace(/&quot;/g, '"');
    text = text.replace(/&#39;/g, "'");
    text = text.replace(/\n{3,}/g, '\n\n');   // Collapse multiple newlines
    return text.trim();
}
```

---

## Part B: Acceptance Criteria Parser

### Script Include: `AcceptanceCriteriaParser`

### Purpose

Split a GitHub issue body into two parts:
1. **Description**: Everything above the acceptance criteria heading
2. **Acceptance Criteria**: Everything from the AC heading to the end (or to the next same-level heading)

### Configurable Patterns

The parser should look for these headings (configurable via system property or constant):

```javascript
var AC_PATTERNS = [
    /^#{1,3}\s*Acceptance\s*Criteria\s*$/im,       // ## Acceptance Criteria
    /^\*\*Acceptance\s*Criteria\*\*\s*$/im,        // **Acceptance Criteria**
    /^_{2}Acceptance\s*Criteria_{2}\s*$/im,        // __Acceptance Criteria__
    /^#{1,3}\s*AC\s*$/im,                          // ## AC (shorthand)
    /^#{1,3}\s*Acceptance\s*Criteria\s*[:]\s*$/im  // ## Acceptance Criteria:
];
```

### Pattern Configurability

Store patterns in a system property (`x_snc_git_issue.ac_patterns`) as a
newline-separated list of regex strings. This allows easy modification without
code changes.

Default property value:
```
^#{1,3}\s*Acceptance\s*Criteria\s*:?\s*$
^\*\*Acceptance\s*Criteria\*\*\s*:?\s*$
^#{1,3}\s*AC\s*:?\s*$
```

### API Design

```javascript
/**
 * Parse issue body into description and acceptance criteria
 * @param {string} body - Full issue body (markdown)
 * @returns {object} { description: string, acceptanceCriteria: string }
 */
AcceptanceCriteriaParser.parse(body)
```

### Parsing Algorithm

```
1. Load AC patterns (from property or defaults)
2. Split body into lines
3. Scan each line against all patterns
4. If match found at line N:
   a. description = lines[0..N-1] (trimmed)
   b. acceptanceCriteria = lines[N+1..end] (trimmed, heading itself excluded)
5. If NO match found:
   a. description = entire body
   b. acceptanceCriteria = '' (empty)
6. Return { description, acceptanceCriteria }
```

### Edge Cases

| Case | Behavior |
|------|----------|
| No AC section found | description = full body, acceptanceCriteria = '' |
| AC section at very top | description = '', acceptanceCriteria = rest of body |
| Multiple AC headings | Use the FIRST match only |
| Empty body | description = '', acceptanceCriteria = '' |
| AC heading with nothing below | acceptanceCriteria = '' |
| Body is only an AC section | description = '', acceptanceCriteria = content after heading |

### Example

**Input** (GitHub issue body):
```markdown
## Description
This feature should allow users to sync GitHub issues.

We need to support both public and private repos.

## Acceptance Criteria
- [ ] Public repos can be synced without auth
- [ ] Private repos require a credential
- [ ] Duplicate issues are not created
- [ ] Progress is shown during sync
```

**Output**:
```javascript
{
  description: "## Description\nThis feature should allow users to sync GitHub issues.\n\nWe need to support both public and private repos.",
  acceptanceCriteria: "- [ ] Public repos can be synced without auth\n- [ ] Private repos require a credential\n- [ ] Duplicate issues are not created\n- [ ] Progress is shown during sync"
}
```

---

## Integration With Sync Modes

### Mirror Mode
- `body_html` = `MarkdownConverter.toHTML(fullBody)` (no AC splitting needed)
- `description` = `MarkdownConverter.toHTML(fullBody)` (same, uses full body)

### Story Mode
- Parse body with `AcceptanceCriteriaParser.parse(body)`
- `rm_story.description` = `MarkdownConverter.toPlainText(parsed.description)`
- `rm_story.acceptance_criteria` = `MarkdownConverter.toPlainText(parsed.acceptanceCriteria)`

*Note: Check if rm_story.acceptance_criteria is HTML type — if so, use toHTML() instead of toPlainText().*

---

## Implementation Notes

1. **`marked` in ServiceNow**: Since this runs server-side in a Script Include,
   we'll import `marked` as a JavaScript module dependency. The Fluent SDK
   supports npm dependencies in script includes.

2. **Sanitization**: Even though this is internal, sanitize HTML output:
   - Strip `<script>` tags
   - Strip `on*` event attributes
   - Allow safe tags: p, h1-h6, ul, ol, li, a, strong, em, code, pre, blockquote, table, tr, td, th, img, br, hr, input

3. **Performance**: For large repos with 100+ issues, the markdown conversion
   should be efficient. `marked` is synchronous and fast — no concerns here.

4. **Testing**:
   - Test with various markdown formats
   - Test with GFM-specific features (task lists, tables, fenced code)
   - Test AC parsing with different heading styles
   - Test with issues that have no AC section
   - Test with empty bodies
   - Test with very large bodies (10K+ characters)
