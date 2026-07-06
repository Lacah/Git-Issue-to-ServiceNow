var GitHubAPIClient = Class.create();
GitHubAPIClient.prototype = {
    initialize: function(repoUrl, options) {
        this._repoUrl = repoUrl;
        this._options = options || {};
        this._baseUrl = 'https://api.github.com';
        this._token = '';
        this._parseRepoUrl(repoUrl);
        this._resolveToken();
    },

    _resolveToken: function() {
        if (this._options.token) {
            this._token = this._options.token;
            return;
        }
        if (!this._options.credentialAlias) {
            return;
        }

        var aliasId = this._options.credentialAlias;
        gs.info('GitIssueSync: Resolving credential for alias: ' + aliasId);

        // Strategy 1: Use ConnectionInfoProvider.getConnectionInfo (the correct API method)
        try {
            var provider = new sn_cc.ConnectionInfoProvider();
            var connInfo = provider.getConnectionInfo(aliasId);
            if (connInfo) {
                var pwd = connInfo.getCredentialAttribute('password');
                if (pwd) {
                    gs.info('GitIssueSync: Credential resolved via getConnectionInfo');
                    this._token = String(pwd);
                    return;
                }
            }
        } catch (e1) {
            gs.info('GitIssueSync: Strategy 1 (getConnectionInfo) failed: ' + e1.message);
        }

        // Strategy 2: Look up sys_connection record for this alias, find credential, retry
        try {
            var connGr = new GlideRecord('sys_connection');
            connGr.addQuery('connection_alias', aliasId);
            connGr.addQuery('active', true);
            connGr.query();
            if (connGr.next()) {
                var credRef = connGr.getValue('credential');
                gs.info('GitIssueSync: Found connection record with credential: ' + credRef);
                // Connection record exists but Strategy 1 failed - try direct credential lookup
                if (credRef) {
                    var credGr = new GlideRecord('discovery_credentials');
                    if (credGr.get(credRef)) {
                        // Try reading username at minimum (password2 may not be readable)
                        var username = credGr.getValue('user_name');
                        gs.info('GitIssueSync: Credential username: ' + username);
                    }
                }
            } else {
                gs.info('GitIssueSync: No connection record found for alias, checking tag field');
                // Fallback: maybe this is a credential-type alias, look via tag
                var credGr2 = new GlideRecord('discovery_credentials');
                credGr2.addQuery('tag', 'CONTAINS', aliasId);
                credGr2.addQuery('active', true);
                credGr2.query();
                if (credGr2.next()) {
                    var credSysId = credGr2.getUniqueValue();
                    gs.info('GitIssueSync: Found credential via tag: ' + credSysId + ', creating connection record');
                    // Create connection record to bridge
                    var newConn = new GlideRecord('sys_connection');
                    newConn.initialize();
                    newConn.setValue('name', 'GitIssueSync - Auto-created');
                    newConn.setValue('connection_alias', aliasId);
                    newConn.setValue('credential', credSysId);
                    newConn.setValue('host', 'api.github.com');
                    newConn.setValue('protocol', 'https');
                    newConn.setValue('port', '443');
                    newConn.setValue('active', true);
                    var newConnId = newConn.insert();
                    gs.info('GitIssueSync: Created connection record: ' + newConnId);
                    // Retry Strategy 1
                    var provider3 = new sn_cc.ConnectionInfoProvider();
                    var connInfo3 = provider3.getConnectionInfo(aliasId);
                    if (connInfo3) {
                        var pwd3 = connInfo3.getCredentialAttribute('password');
                        if (pwd3) {
                            gs.info('GitIssueSync: Credential resolved after creating connection record');
                            this._token = String(pwd3);
                            return;
                        }
                    }
                }
            }
        } catch (e2) {
            gs.warn('GitIssueSync: Strategy 2 failed: ' + e2.message);
        }

        // All strategies exhausted
        throw new Error('Unable to resolve credential alias. Please paste your GitHub Personal Access Token in the Token field instead of using a credential alias, or ensure the credential alias has a properly configured connection record.');
    },

    _parseRepoUrl: function(url) {
        var match = url.match(/github\.com[\/:]([^\/]+)\/([^\/\.]+)/);
        if (!match) {
            throw new Error('Invalid GitHub repository URL: ' + url);
        }
        this._owner = match[1];
        this._repo = match[2];
    },

    _makeRequest: function(endpoint, params) {
        var url = this._baseUrl + endpoint;

        var rm = new sn_ws.RESTMessageV2();
        rm.setHttpMethod('GET');
        rm.setEndpoint(url);
        rm.setRequestHeader('Accept', 'application/vnd.github.v3+json');
        rm.setRequestHeader('User-Agent', 'ServiceNow-GitIssueSync');

        if (this._token) {
            rm.setRequestHeader('Authorization', 'token ' + this._token);
        }

        if (params) {
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    rm.setQueryParameter(key, params[key]);
                }
            }
        }

        var response = rm.execute();
        var statusCode = parseInt(response.getStatusCode(), 10);
        var body = response.getBody();
        var headers = response.getHeaders();

        if (statusCode < 200 || statusCode >= 300) {
            this._handleError(statusCode, body);
        }

        return {
            statusCode: statusCode,
            body: JSON.parse(body),
            headers: headers
        };
    },

    _parseLinkHeader: function(linkHeader) {
        if (!linkHeader) return {};
        var links = {};
        var parts = linkHeader.split(',');
        for (var i = 0; i < parts.length; i++) {
            var section = parts[i].split(';');
            if (section.length !== 2) continue;
            var url = section[0].trim().replace(/<(.+)>/, '$1');
            var name = section[1].trim().replace(/rel="(.+)"/, '$1');
            links[name] = url;
        }
        return links;
    },

    _handleError: function(statusCode, body) {
        var message = 'GitHub API error (HTTP ' + statusCode + ')';
        try {
            var parsed = JSON.parse(body);
            if (parsed.message) {
                message += ': ' + parsed.message;
            }
        } catch (e) {
            message += ': ' + body;
        }
        throw new Error(message);
    },

    getRepoInfo: function() {
        var response = this._makeRequest('/repos/' + this._owner + '/' + this._repo);
        return response.body;
    },

    getIssues: function(state) {
        var params = { state: state || 'open' };
        return this._getPaginated('/repos/' + this._owner + '/' + this._repo + '/issues', params);
    },

    getMilestones: function(state) {
        var params = { state: state || 'open' };
        return this._getPaginated('/repos/' + this._owner + '/' + this._repo + '/milestones', params);
    },

    _getPaginated: function(endpoint, params) {
        var allResults = [];
        params = params || {};
        params.per_page = '100';

        var url = this._baseUrl + endpoint;
        var hasMore = true;

        while (hasMore) {
            var rm = new sn_ws.RESTMessageV2();
            rm.setHttpMethod('GET');
            rm.setEndpoint(url);
            rm.setRequestHeader('Accept', 'application/vnd.github.v3+json');
            rm.setRequestHeader('User-Agent', 'ServiceNow-GitIssueSync');

            if (this._token) {
                rm.setRequestHeader('Authorization', 'token ' + this._token);
            }

            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    rm.setQueryParameter(key, params[key]);
                }
            }

            var response = rm.execute();
            var statusCode = parseInt(response.getStatusCode(), 10);
            var body = response.getBody();

            if (statusCode < 200 || statusCode >= 300) {
                this._handleError(statusCode, body);
            }

            var items = JSON.parse(body);
            allResults = allResults.concat(items);

            var linkHeader = response.getHeader('Link');
            var links = this._parseLinkHeader(linkHeader);

            if (links.next) {
                url = links.next;
                params = {};
            } else {
                hasMore = false;
            }
        }

        return allResults;
    },

    getRateLimit: function() {
        var response = this._makeRequest('/rate_limit');
        return response.body;
    },

    type: 'GitHubAPIClient'
};
