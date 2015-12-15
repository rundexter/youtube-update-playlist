var _ = require('lodash'),
    google = require('googleapis'),
    util = require('./util.js');

var service = google.youtube('v3');

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
     * Get auth data.
     *
     * @param step
     * @param dexter
     * @returns {*}
     */
    authOptions: function (step, dexter) {
        var OAuth2 = google.auth.OAuth2,
            oauth2Client = new OAuth2();

        if(!dexter.environment('google_access_token')) {

            this.fail('A [google_access_token] environment variable is required for this module');

            return false;
        } else {

            oauth2Client.setCredentials({
                access_token: dexter.environment('google_access_token')
            });

            return oauth2Client;
        }
    },

    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var auth = this.authOptions(step, dexter);

        if (!auth)
            return;
        // set credential
        google.options({ auth: auth });

        service.playlists.update(util.pickStringInputs(step, pickInputs), function (error, data) {

            if (error)
                this.fail(error);
            else
                this.complete(util.pickResult(data, pickOutputs));
        }.bind(this));
    }
};
