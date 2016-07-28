'use strict';

var program = require('commander');
var installer = require('../components/install');

/**
 * Initialize the install commands for:
 * 1. Library
 * 2. Plugin
 */
function init() {
    // Installing eddie library
    program
        .command('install:library')
        .description("Installs eddie's libraries from github.com")
        .arguments('<library>', "The library you want to install to eddie e.g. username/repo_name")
        .action(handleLibraryInstallation)
        .parse(process.argv);

    // Installing eddie plugins
    program
        .command('install:plugin')
        .description("Installs eddie's plugins from github.com")
        .arguments('<plugin>', "The plugin you want to install to eddie e.g. username/repo_name")
        .action(handlePluginInstallation)
        .parse(process.argv);
}

/**
 * Handles the installation of the libraries
 *
 * @param library
 */
function handleLibraryInstallation(library) {
    installer.installLibrary(library).then((response) => {
        console.log(response);
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


