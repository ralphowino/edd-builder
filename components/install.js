'use strict';

var q = require('q');
var exec = require('exec');
var fs = require('fs-plus');
var io = require('../../edd-io');
var ghdownload = require('github-download');
var Spinner = require('cli-spinner').Spinner;
var fileSys = require('../../edd-fs/components/Filesystem/index');

class Installer {
    /**
     * Install the libraries from github
     *
     * @param library
     * @returns {Promise}
     */
    installLibrary(library) {
        let defered = q.defer();
        var spinner = new Spinner('Installing library.. %s');
        spinner.setSpinnerString('|/-\\');
        let localFolder = Installer.localFolderExist();
        // check if the user has a local .edd folder for the project
        if(localFolder) {
            // fetch the library credentials passed by the user
            let credentials = Installer.getLibraryCredentials(library);
            //Start the library installer loader
            spinner.start();
            // download the library to the libraries folder in the local .edd folder
            this.download(credentials, localFolder + '/libraries/').then((response) => {
                // successful download of the library
                return defered.resolve('\nLibrary successfully added.');
            }, (err) => {
                // report any errors that occur
                return defered.reject(err);
            }).finally(() => {
                spinner.stop();

            });
        } else {
            // report no local folder was found
            return defered.reject(new Error('You should initialize eddie for this project first'));
        }

        return defered.promise;
    }

    /**
     * Install a plugin from github
     *
     * @param plugin
     * @returns {*}
     */
    installPlugin(plugin) {
        let defered = q.defer();
        var spinner = new Spinner('Installing plugin.. %s');
        spinner.setSpinnerString('|/-\\');
        let localFolder = Installer.localFolderExist();
        // check if the user has a local .edd folder for the project
        if(localFolder) {
            // fetch the library credentials passed by the user
            let credentials = Installer.getPluginCredentials(plugin);
            //Start the library installer loader
            spinner.start();
            // download the library to the libraries folder in the local .edd folder
            this.download(credentials, localFolder + '/plugins/').then(() => {
                // successful download of the library
                return defered.resolve('\nPlugin successfully installed');
            }, (err) => {
                // report any errors that occur
                return defered.reject(err);
            }).finally(() => {
                spinner.stop();
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
    static getLibraryCredentials(library) {
        let credentials = library.split("/");

        return {
            user: credentials[0],
            repo: credentials[1],
            branch: credentials[2]
        }
    }

    /**
     * Parse the plugin credentials
     *
     * @param plugin
     * @returns {{user: *, repo: *, branch: *}}
     */
    static getPluginCredentials(plugin) {
        let credentials = plugin.split("/");

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
        let tmp = destination + credentials.repo;

        //Check if the library already exists
        if(fs.existsSync(tmp)){
            return q.reject(new Error('Library already exists'));
        } else {
            ghdownload({user: credentials.user, repo: credentials.repo, ref: credentials.branch}, tmp)
                .on('error', function(err) {
                    return defered.reject(err);
                })
                .on('end', function() {
                    return defered.resolve()
                });
        }

        return defered.promise;
    }
}

module.exports = new Installer;
