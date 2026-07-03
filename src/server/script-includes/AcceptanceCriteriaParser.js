var AcceptanceCriteriaParser = Class.create();
AcceptanceCriteriaParser.prototype = {
    initialize: function() {
        var patternsProperty = gs.getProperty('x_snc_git_issue.ac_patterns', '');
        if (patternsProperty) {
            try {
                var patternStrings = JSON.parse(patternsProperty);
                this._patterns = patternStrings.map(function(p) {
                    return new RegExp(p, 'im');
                });
            } catch (e) {
                this._patterns = this._getDefaultPatterns();
            }
        } else {
            this._patterns = this._getDefaultPatterns();
        }
    },

    _getDefaultPatterns: function() {
        return [
            /^#{1,3}\s*Acceptance\s*Criteria\s*:?\s*$/im,
            /^\*\*Acceptance\s*Criteria\*\*\s*:?\s*$/im,
            /^#{1,3}\s*AC\s*:?\s*$/im
        ];
    },

    parse: function(body) {
        if (!body) {
            return { description: '', acceptanceCriteria: '' };
        }

        var lines = body.split('\n');
        var splitIndex = -1;

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            for (var p = 0; p < this._patterns.length; p++) {
                if (this._patterns[p].test(line)) {
                    splitIndex = i;
                    break;
                }
            }
            if (splitIndex !== -1) break;
        }

        if (splitIndex === -1) {
            return { description: body, acceptanceCriteria: '' };
        }

        var description = lines.slice(0, splitIndex).join('\n').trim();
        var acceptanceCriteria = lines.slice(splitIndex + 1).join('\n').trim();

        return {
            description: description,
            acceptanceCriteria: acceptanceCriteria
        };
    },

    type: 'AcceptanceCriteriaParser'
};
