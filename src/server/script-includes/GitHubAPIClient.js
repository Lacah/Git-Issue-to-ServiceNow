var GitHubAPIClient = Class.create();
GitHubAPIClient.prototype = {
    initialize: function(repoUrl, credentialSysId) {
        this._repoUrl = repoUrl;
        this._credentialSysId = credentialSysId;
        this._baseUrl = 'https://api.github.com';
        this._parseRepoUrl(repoUrl);
        this._loadCredential();
    },

    _parseRepoUrl: function(url) {
        var match = url.match(/github\.com[\/:]([^\/]+)\/([^\/\.]+)/);
        if (!match) {
            throw new Error('Invalid GitHub repository URL: ' + url);
        }
        this._owner = match[1];
        this._repo = match[2];
    },

    _loadCredential: function() {
        this._token = '';
        if (!this._credentialSysId) return;

        var credGr = new GlideRecord('sys_auth_credential');
        if (credGr.get(this._credentialSysId)) {
            var provider = new sn_cc.StandardCredentialsProvider();
            var credential = provider.getCredentialByID(this._credentialSysId);
            if (credential) {
                this._token = credential.getAttribute('password') || credential.getAttribute('token') || '';
            }
        }
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
