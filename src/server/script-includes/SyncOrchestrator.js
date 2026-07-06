var SyncOrchestrator = Class.create();
SyncOrchestrator.prototype = {
    initialize: function(config) {
        this._config = config;
        this._apiClient = new x_snc_git_issue.GitHubAPIClient(config.repoUrl, { token: config.token, credentialAlias: config.credential_alias });
        this._markdownConverter = new x_snc_git_issue.MarkdownConverter();
        this._acParser = new x_snc_git_issue.AcceptanceCriteriaParser();
        this._labelManager = new x_snc_git_issue.LabelManager();
        this._syncHistorySysId = '';
        this._milestoneMap = {};
        this._epicMap = {};
    },

    startSync: function() {
        this._createSyncHistory();
        return this._run();
    },

    runExisting: function(syncHistorySysId) {
        this._syncHistorySysId = syncHistorySysId;
        var gr = new GlideRecord('x_snc_git_issue_sync_history');
        if (gr.get(syncHistorySysId)) {
            gr.setValue('status', 'in_progress');
            gr.setValue('sync_start', new GlideDateTime().getDisplayValue());
            gr.update();
        }
        return this._run();
    },

    _run: function() {
        try {
            this._updateProgress('Validating', 0, 1, 0, 'Validating repository access...');
            this._apiClient.getRepoInfo();

            this._updateProgress('Milestones', 0, 0, 5, 'Fetching milestones...');
            var milestones = this._apiClient.getMilestones(this._config.stateFilter === 'all' ? 'all' : this._config.stateFilter);
            this._updateProgress('Milestones', 0, milestones.length, 10, 'Processing milestones...');
            this._processMilestones(milestones);

            this._updateProgress('Issues', 0, 0, 30, 'Fetching issues...');
            var issues = this._apiClient.getIssues(this._config.stateFilter === 'all' ? 'all' : this._config.stateFilter);

            var filteredIssues = [];
            for (var i = 0; i < issues.length; i++) {
                if (!issues[i].pull_request) {
                    filteredIssues.push(issues[i]);
                }
            }

            this._updateProgress('Issues', 0, filteredIssues.length, 35, 'Processing issues...');
            this._processIssues(filteredIssues);

            this._completeSyncHistory('completed');
        } catch (e) {
            this._failSyncHistory(e.message || String(e));
            throw e;
        }

        return this._syncHistorySysId;
    },

    _createSyncHistory: function() {
        var gr = new GlideRecord('x_snc_git_issue_sync_history');
        gr.initialize();
        gr.setValue('repository_url', this._config.repoUrl);
        gr.setValue('sync_mode', this._config.syncMode);
        gr.setValue('state_filter', this._config.stateFilter);
        gr.setValue('update_existing', this._config.updateExisting);
        gr.setValue('synced_by', gs.getUserID());
        gr.setValue('sync_start', new GlideDateTime().getDisplayValue());
        gr.setValue('status', 'in_progress');
        // Token is passed directly and never stored in the sync history record
        this._syncHistorySysId = gr.insert();
    },

    _updateProgress: function(phase, currentItem, totalItems, percent, message) {
        var gr = new GlideRecord('x_snc_git_issue_sync_history');
        if (gr.get(this._syncHistorySysId)) {
            gr.setValue('current_phase', phase);
            gr.setValue('current_item', currentItem);
            gr.setValue('total_items', totalItems);
            gr.setValue('percent_complete', percent);
            gr.setValue('progress_message', message);
            gr.update();
        }
    },

    _processMilestones: function(milestones) {
        var created = 0;
        var updated = 0;

        for (var i = 0; i < milestones.length; i++) {
            var ms = milestones[i];
            var percent = 10 + Math.round((i / milestones.length) * 20);
            this._updateProgress('Milestones', i + 1, milestones.length, percent, 'Processing milestone: ' + ms.title);

            var gr = new GlideRecord('x_snc_git_issue_milestone');
            gr.addQuery('milestone_number', ms.number);
            gr.addQuery('repository_url', this._config.repoUrl);
            gr.query();

            if (gr.next()) {
                this._milestoneMap[ms.number] = gr.getUniqueValue();
                if (this._config.updateExisting) {
                    gr.setValue('title', ms.title);
                    gr.setValue('description', ms.description || '');
                    gr.setValue('state', ms.state);
                    gr.setValue('github_url', ms.html_url);
                    if (ms.due_on) {
                        gr.setValue('due_date', this._convertDate(ms.due_on));
                    }
                    gr.setValue('github_updated_at', this._convertDateTime(ms.updated_at));
                    if (ms.closed_at) {
                        gr.setValue('github_closed_at', this._convertDateTime(ms.closed_at));
                    }
                    gr.update();
                    updated++;
                }
            } else {
                gr.initialize();
                gr.setValue('title', ms.title);
                gr.setValue('description', ms.description || '');
                gr.setValue('milestone_number', ms.number);
                gr.setValue('repository_url', this._config.repoUrl);
                gr.setValue('github_url', ms.html_url);
                gr.setValue('state', ms.state);
                if (ms.due_on) {
                    gr.setValue('due_date', this._convertDate(ms.due_on));
                }
                gr.setValue('github_created_at', this._convertDateTime(ms.created_at));
                gr.setValue('github_updated_at', this._convertDateTime(ms.updated_at));
                if (ms.closed_at) {
                    gr.setValue('github_closed_at', this._convertDateTime(ms.closed_at));
                }
                var sysId = gr.insert();
                this._milestoneMap[ms.number] = sysId;
                created++;
            }
        }

        this._updateSyncHistoryCounters({ milestones_created: created, milestones_updated: updated });

        // In user_story mode, also create/update rm_epic records from milestones
        if (this._config.syncMode === 'user_story') {
            for (var j = 0; j < milestones.length; j++) {
                var msEpic = milestones[j];
                var epicGr = new GlideRecord('rm_epic');
                epicGr.addQuery('short_description', msEpic.title);
                epicGr.query();
                if (epicGr.next()) {
                    this._epicMap[msEpic.number] = epicGr.getUniqueValue();
                } else {
                    epicGr.initialize();
                    epicGr.setValue('short_description', msEpic.title);
                    var epicSysId = epicGr.insert();
                    this._epicMap[msEpic.number] = epicSysId;
                }
            }
        }
    },

    _processIssues: function(issues) {
        var created = 0;
        var updated = 0;
        var skipped = 0;

        for (var i = 0; i < issues.length; i++) {
            var issue = issues[i];
            var percent = 35 + Math.round((i / issues.length) * 60);
            this._updateProgress('Issues', i + 1, issues.length, percent, 'Processing issue #' + issue.number + ': ' + issue.title);

            if (this._config.syncMode === 'mirror') {
                this._processIssueMirror(issue, function(result) {
                    if (result === 'created') created++;
                    else if (result === 'updated') updated++;
                    else skipped++;
                });
            } else {
                this._processIssueUserStory(issue, function(result) {
                    if (result === 'created') created++;
                    else if (result === 'updated') updated++;
                    else skipped++;
                });
            }
        }

        this._updateSyncHistoryCounters({ issues_created: created, issues_updated: updated, issues_skipped: skipped });
        this._updateSyncHistoryCounters({ labels_created: this._labelManager.getLabelsCreated() });
    },

    _processIssueMirror: function(issue, callback) {
        var gr = new GlideRecord('x_snc_git_issue_record');
        gr.addQuery('github_issue_number', issue.number);
        gr.addQuery('repository_url', this._config.repoUrl);
        gr.query();

        if (gr.next()) {
            if (this._config.updateExisting) {
                this._populateIssueRecord(gr, issue);
                gr.update();
                this._labelManager.processLabels(gr.getUniqueValue(), 'x_snc_git_issue_record', issue.labels);
                callback('updated');
            } else {
                callback('skipped');
            }
        } else {
            gr.initialize();
            this._populateIssueRecord(gr, issue);
            var sysId = gr.insert();
            this._labelManager.processLabels(sysId, 'x_snc_git_issue_record', issue.labels);
            callback('created');
        }
    },

    _processIssueUserStory: function(issue, callback) {
        // Check for existing cross-reference
        var xref = new GlideRecord('x_snc_git_issue_story_xref');
        xref.addQuery('github_issue_number', issue.number);
        xref.addQuery('repository_url', this._config.repoUrl);
        xref.query();

        if (xref.next()) {
            if (this._config.updateExisting) {
                var storyGr = new GlideRecord('rm_story');
                if (storyGr.get(xref.getValue('story'))) {
                    this._populateStoryRecord(storyGr, issue);

                    // Update epic link if milestone exists in the epicMap
                    if (issue.milestone && this._epicMap[issue.milestone.number]) {
                        storyGr.setValue('epic', this._epicMap[issue.milestone.number]);
                    }

                    storyGr.update();
                    this._labelManager.processLabels(storyGr.getUniqueValue(), 'rm_story', issue.labels);
                    callback('updated');
                } else {
                    callback('skipped');
                }
            } else {
                callback('skipped');
            }
        } else {
            var story = new GlideRecord('rm_story');
            story.initialize();
            this._populateStoryRecord(story, issue);

            // Link to epic if milestone exists
            if (issue.milestone && this._epicMap[issue.milestone.number]) {
                story.setValue('epic', this._epicMap[issue.milestone.number]);
            }

            var storySysId = story.insert();
            this._labelManager.processLabels(storySysId, 'rm_story', issue.labels);

            // Create cross-reference
            xref.initialize();
            xref.setValue('story', storySysId);
            xref.setValue('repository_url', this._config.repoUrl);
            xref.setValue('github_issue_number', issue.number);
            xref.insert();

            callback('created');
        }
    },

    _populateIssueRecord: function(gr, issue) {
        gr.setValue('short_description', issue.title);
        gr.setValue('github_issue_number', issue.number);
        gr.setValue('repository_url', this._config.repoUrl);
        gr.setValue('github_url', issue.html_url);
        gr.setValue('github_state', issue.state);
        gr.setValue('github_author', issue.user ? issue.user.login : '');

        if (issue.milestone && this._milestoneMap[issue.milestone.number]) {
            gr.setValue('milestone', this._milestoneMap[issue.milestone.number]);
        }

        var bodyHtml = this._markdownConverter.toHTML(issue.body || '');
        gr.setValue('body_html', bodyHtml);

        gr.setValue('github_created_at', this._convertDateTime(issue.created_at));
        gr.setValue('github_updated_at', this._convertDateTime(issue.updated_at));
        if (issue.closed_at) {
            gr.setValue('github_closed_at', this._convertDateTime(issue.closed_at));
        }
    },

    _populateStoryRecord: function(gr, issue) {
        gr.setValue('short_description', issue.title);

        var parsed = this._acParser.parse(issue.body || '');
        var descHtml = this._markdownConverter.toHTML(parsed.description);
        gr.setValue('description', this._stripHtml(descHtml));

        if (parsed.acceptanceCriteria) {
            var acHtml = this._markdownConverter.toHTML(parsed.acceptanceCriteria);
            gr.setValue('acceptance_criteria', acHtml);
        }
    },

    _stripHtml: function(html) {
        if (!html) return '';
        // Remove HTML tags
        var text = html.replace(/<[^>]+>/g, '');
        // Decode common HTML entities
        text = text.replace(/&amp;/g, '&');
        text = text.replace(/&lt;/g, '<');
        text = text.replace(/&gt;/g, '>');
        text = text.replace(/&quot;/g, '"');
        text = text.replace(/&#39;/g, "'");
        text = text.replace(/&nbsp;/g, ' ');
        // Collapse multiple newlines
        text = text.replace(/\n{3,}/g, '\n\n');
        return text.trim();
    },

    _completeSyncHistory: function(status) {
        var gr = new GlideRecord('x_snc_git_issue_sync_history');
        if (gr.get(this._syncHistorySysId)) {
            gr.setValue('status', status);
            gr.setValue('sync_end', new GlideDateTime().getDisplayValue());
            gr.setValue('percent_complete', 100);
            gr.setValue('progress_message', 'Sync completed successfully');
            gr.update();
        }
    },

    _failSyncHistory: function(errorMessage) {
        var gr = new GlideRecord('x_snc_git_issue_sync_history');
        if (gr.get(this._syncHistorySysId)) {
            gr.setValue('status', 'failed');
            gr.setValue('sync_end', new GlideDateTime().getDisplayValue());
            gr.setValue('error_message', errorMessage);
            gr.setValue('progress_message', 'Sync failed: ' + errorMessage);
            gr.update();
        }
    },

    _updateSyncHistoryCounters: function(counters) {
        var gr = new GlideRecord('x_snc_git_issue_sync_history');
        if (gr.get(this._syncHistorySysId)) {
            for (var key in counters) {
                if (counters.hasOwnProperty(key)) {
                    gr.setValue(key, counters[key]);
                }
            }
            gr.update();
        }
    },

    _convertDateTime: function(iso) {
        if (!iso) return '';
        var gdt = new GlideDateTime();
        gdt.setDisplayValue(iso.replace('T', ' ').replace('Z', ''));
        return gdt.getDisplayValue();
    },

    _convertDate: function(iso) {
        if (!iso) return '';
        return iso.substring(0, 10);
    },

    type: 'SyncOrchestrator'
};
