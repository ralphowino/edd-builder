'use strict';

var q = require('q');
var exec = require('exec');
var fs = require('fs-plus');
var io = require('../../eddie-io');
var fileSys = require('../../eddie-fs/components/Filesystem/index');
var ghdownload = require('github-download');

class Installer {
    /**
     * Install the libraries
     *
     * @param library
     * @returns {Promise}
     */
    install(library) {
        let defered = q.defer();
        let localFolder = Installer.localFolderExist();
        // check if the user has a local .edd folder for the project
        if(localFolder) {
            // fetch the library credentials passed by the user
            let credentials = Installer.getLibrariesCredentials(library);

            // download the library to the libraries folder in the local .edd folder
            this.download(credentials, localFolder).then((response) => {
                // successful download of the library
                return defered.resolve(response);
            }, (err) => {
                // report any errors that occur
                return defered.reject(err);
            });
        } else {
            // report no local folder was found
            return defered.reject(new Error('You should initialize eddie for this project first'));
        }

        return defered.promise;
    }

    /**
     * Checks if a local .edd folder exists
     *
     * @returns {Boolean}
     */
    static localFolderExist() {
        return fileSys.getLocalFolder()
    }

    /**
     * Parse the library credentials
     *
     * @param library
     * @returns {{user: *, repo: *}}
     */
    static getLibrariesCredentials(library) {
        let credentials = library.split("/");

        return {
            user: credentials[0],
            repo: credentials[1],
            branch: credentials[2]
        }
    }

    /**
     * Download library from github and move to the specified destination
     *
     * @param credentials
     * @param destination
     */
    download(credentials, destination) {
        let defered = q.defer();
        let tmp = destination + '/libraries/' + credentials.repo;

        //Check if the library already exists
        if(fs.existsSync(tmp)){
            return q.reject(new Error('Library already exists'));
        } else {
            ghdownload({user: credentials.user, repo: credentials.repo, ref: credentials.branch}, tmp)
                .on('error', function(err) {
                    return defered.reject(err);
                })
                .on('end', function() {
                    return defered.resolve('Library successfully installed')
                });
        }

        return defered.promise;
    }
}

module.exports = new Installer;