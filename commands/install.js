'use strict';

var program = require('commander');
var installer = require('../components/install');

/**
 * Initialize the install commands for:
 * 1. Library
 * 2. Plugin
 */
function init() {
    // Installing edd library
    program
        .command('library:install')
        .description("Installs edd's libraries from github.com")
        .arguments('<library>', "The library you want to install to edd e.g. username/repo_name")
        .arguments('[version]', "The version you want [default=master]")
        .action(handleLibraryInstallation)
        .parse(process.argv);

    // Installing edd plugins
    program
        .command('install:plugin')
        .description("Installs edd's plugins from github.com")
        .arguments('<plugin>', "The plugin you want to install to edd e.g. username/repo_name")
        .action(handlePluginInstallation)
        .parse(process.argv);
}

/**
 * Handles the installation of the libraries
 *
 * @param library
 */
function handleLibraryInstallation(library, version) {
    installer.installLibrary(library, version).then((response) => {
        //console.log(response);
    }, (err) => {
        console.log(err);
    });
}

/**
 * Handles the installation of the plugins
 *
 * @param plugin
 */
function handlePluginInstallation(plugin) {
    installer.installPlugin(plugin).then((response) => {
        console.log(response);
    }, (err) => {
        console.log(err);
    })
}

module.exports = {
    init: init,
    handlePluginInstallation: handlePluginInstallation,
    handleLibraryInstallation: handleLibraryInstallation
};


