var LabelManager = Class.create();
LabelManager.prototype = {
    initialize: function() {
        this._labelsCreated = 0;
    },

    processLabels: function(recordSysId, tableName, githubLabels) {
        if (!githubLabels || !githubLabels.length) return;

        for (var i = 0; i < githubLabels.length; i++) {
            var labelName = githubLabels[i].name || githubLabels[i];
            var labelSysId = this._findOrCreateLabel(labelName);
            this._createLabelEntry(labelSysId, recordSysId, tableName);
        }
    },

    _findOrCreateLabel: function(name) {
        var gr = new GlideRecord('label');
        gr.addQuery('name', name);
        gr.query();

        if (gr.next()) {
            return gr.getUniqueValue();
        }

        gr.initialize();
        gr.setValue('name', name);
        var sysId = gr.insert();
        this._labelsCreated++;
        return sysId;
    },

    _createLabelEntry: function(labelSysId, recordSysId, tableName) {
        var gr = new GlideRecord('label_entry');
        gr.addQuery('label', labelSysId);
        gr.addQuery('table', tableName);
        gr.addQuery('table_key', recordSysId);
        gr.query();

        if (gr.next()) return;

        gr.initialize();
        gr.setValue('label', labelSysId);
        gr.setValue('table', tableName);
        gr.setValue('table_key', recordSysId);
        gr.insert();
    },

    getLabelsCreated: function() {
        return this._labelsCreated;
    },

    type: 'LabelManager'
};
