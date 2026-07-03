var MarkdownConverter = Class.create();
MarkdownConverter.prototype = {
    initialize: function() {
        this._mod = require('./dist/modules/server/markdown-converter.js');
    },

    toHTML: function(markdown) {
        return this._mod.toHTML(markdown);
    },

    toPlainText: function(markdown) {
        return this._mod.toPlainText(markdown);
    },

    type: 'MarkdownConverter'
};
