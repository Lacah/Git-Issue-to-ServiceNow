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
        var provider = new sn_cc.ConnectionInfoProvider();

        // Strategy 1: getConnectionExtended returns ConnectionInfoValue with getCredentialAttribute
        try {
            var connInfo = provider.getConnectionExtended(aliasId);
            if (connInfo) {
                var pwd = connInfo.getCredentialAttribute('password');
                if (pwd) { this._token = pwd; return; }
            }
        } catch (e1) {
            // Strategy 1 failed, try next
        }

        // Strategy 2: getCredential might return credential object directly
        try {
            if (typeof provider.getCredential === 'function') {
                var cred = provider.getCredential(aliasId);
                if (cred && typeof cred.getAttribute === 'function') {
                    var p = cred.getAttribute('password');
                    if (p) { this._token = p; return; }
                }
            }
        } catch (e2) {
            // Strategy 2 failed, try next
        }

        // Strategy 3: Use RESTMessageV2 auth profile approach with alias sys_id
        // Store alias for use in _makeRequest instead of direct token
        this._useAliasAuth = true;
        this._aliasSysId = aliasId;
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
        } else if (this._useAliasAuth) {
            rm.setAuthenticationProfile('basic', this._aliasSysId);
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
            } else if (this._useAliasAuth) {
                rm.setAuthenticationProfile('basic', this._aliasSysId);
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
