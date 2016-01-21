var _ = require('lodash'),
    google = require('googleapis'),
    util = require('./util.js'),
    service = google.youtube('v3');

var pickInputs = {
        part: 'part',
        onBehalfOfContentOwner: 'onBehalfOfContentOwner',
        'id': 'resource.id',
        'title': 'resource.snippet.title',
        'description': 'resource.snippet.description',
        'tags': { type: 'array', key: 'resource.snippet.tags' },
        'privacyStatus': 'resource.status.privacyStatus'
    },
    pickOutputs = {
        'id': 'id',
        'kind': 'kind',
        'etag': 'etag',
        'publishedAt': 'snippet.publishedAt',
        'title': 'snippet.title',
        'description': 'snippet.description',
        'tags': 'snippet.tags',
        'privacyStatus': 'status.privacyStatus'
    };

module.exports = {
    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var OAuth2 = google.auth.OAuth2,
            oauth2Client = new OAuth2(),
            credentials = dexter.provider('google').credentials();
        // set credential
        oauth2Client.setCredentials({
            access_token: _.get(credentials, 'access_token')
        });
        google.options({ auth: oauth2Client });
        service.playlists.update(util.pickInputs(step, pickInputs), function (error, data) {
            error? this.fail(error) : this.complete(util.pickOutputs(data, pickOutputs));
        }.bind(this));
    }
};
