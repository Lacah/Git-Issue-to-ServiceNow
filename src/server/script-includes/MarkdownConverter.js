var MarkdownConverter = Class.create();
MarkdownConverter.prototype = {
    initialize: function() {
        // No external dependencies — all conversion is inline
    },

    toHTML: function(markdown) {
        if (!markdown) return '';
        var text = String(markdown);

        // Escape HTML entities first
        text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        // Code blocks (fenced with ```)
        text = text.replace(/```(\w*)\n([\s\S]*?)```/g, function(m, lang, code) {
            return '<pre><code>' + code.trim() + '</code></pre>';
        });

        // Inline code
        text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Headers
        text = text.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
        text = text.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
        text = text.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
        text = text.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
        text = text.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
        text = text.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');

        // Horizontal rules
        text = text.replace(/^---+$/gm, '<hr>');
        text = text.replace(/^\*\*\*+$/gm, '<hr>');

        // Bold + Italic
        text = text.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
        text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
        text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');
        text = text.replace(/_(.+?)_/g, '<em>$1</em>');

        // Strikethrough
        text = text.replace(/~~(.+?)~~/g, '<del>$1</del>');

        // Images (before links so ![alt](url) doesn't get caught by link regex)
        text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

        // Links
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

        // Blockquotes
        text = text.replace(/^&gt;\s+(.+)$/gm, '<blockquote>$1</blockquote>');

        // Unordered lists
        text = text.replace(/^[\s]*[-*+]\s+(.+)$/gm, '<li>$1</li>');

        // Ordered lists
        text = text.replace(/^[\s]*\d+\.\s+(.+)$/gm, '<li>$1</li>');

        // Wrap consecutive <li> in <ul>
        text = text.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');
        text = text.replace(/<\/ul>\s*<ul>/g, '');

        // Task lists (GitHub-style checkboxes)
        text = text.replace(/<li>\[x\]\s*/gi, '<li>&#9745; ');
        text = text.replace(/<li>\[ \]\s*/g, '<li>&#9744; ');

        // Paragraphs: wrap remaining lines
        var lines = text.split('\n');
        var result = [];
        var inBlock = false;
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            if (line === '') {
                if (!inBlock) result.push('');
                inBlock = false;
            } else if (line.match(/^<(h[1-6]|pre|ul|ol|li|blockquote|hr|div|table|p)/)) {
                result.push(line);
                inBlock = true;
            } else if (!inBlock) {
                result.push('<p>' + line + '</p>');
            } else {
                result.push(line);
            }
        }

        return result.join('\n');
    },

    toPlainText: function(markdown) {
        if (!markdown) return '';
        var text = String(markdown);

        // Remove code blocks
        text = text.replace(/```[\s\S]*?```/g, '');
        // Remove inline code backticks
        text = text.replace(/`([^`]+)`/g, '$1');
        // Remove headers markers
        text = text.replace(/^#{1,6}\s+/gm, '');
        // Remove bold/italic markers
        text = text.replace(/\*\*\*(.+?)\*\*\*/g, '$1');
        text = text.replace(/\*\*(.+?)\*\*/g, '$1');
        text = text.replace(/\*(.+?)\*/g, '$1');
        text = text.replace(/__(.+?)__/g, '$1');
        text = text.replace(/_(.+?)_/g, '$1');
        // Remove strikethrough
        text = text.replace(/~~(.+?)~~/g, '$1');
        // Convert links to text
        text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1');
        text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
        // Remove blockquote markers
        text = text.replace(/^>\s+/gm, '');
        // Remove list markers
        text = text.replace(/^[\s]*[-*+]\s+/gm, '');
        text = text.replace(/^[\s]*\d+\.\s+/gm, '');
        // Remove horizontal rules
        text = text.replace(/^---+$/gm, '');
        text = text.replace(/^\*\*\*+$/gm, '');
        // Collapse whitespace
        text = text.replace(/\n{3,}/g, '\n\n');

        return text.trim();
    },

    type: 'MarkdownConverter'
};
