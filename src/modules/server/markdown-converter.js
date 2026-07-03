import { marked } from 'marked';

export function toHTML(markdown) {
    if (!markdown) return '';
    var html = marked.parse(markdown, { breaks: true, gfm: true });
    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    html = html.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '');
    return html;
}

export function toPlainText(markdown) {
    if (!markdown) return '';
    var html = marked.parse(markdown, { breaks: true, gfm: true });
    var text = html.replace(/<[^>]+>/g, '');
    text = text.replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ');
    text = text.replace(/\n{3,}/g, '\n\n');
    return text.trim();
}
