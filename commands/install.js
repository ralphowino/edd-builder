var program = require('commander');
import {Installer} from '../components/install';

class Install {
    /**
     * Initialize the install commands for:
     * 1. Library
     * 2. Plugin
     */
    init(){
        // Installing edd library
        program
            .command('library:install')
            .description("Installs edd's libraries from github.com")
            .arguments('<library>', "The library you want to install to edd e.g. username/repo_name")
            .arguments('[version]', "The version you want [default=master]")
            .action(this.handleLibraryInstallation)
            .parse(process.argv);

        // Installing edd plugins
        program
            .command('install:plugin')
            .description("Installs edd's plugins from github.com")
            .arguments('<plugin>', "The plugin you want to install to edd e.g. username/repo_name")
            .action(this.handlePluginInstallation)
            .parse(process.argv);
    }

    /**
     * Handles the installation of the libraries
     *
     * @param library
     */
    handleLibraryInstallation(library, version) {
        Installer.installLibrary(library, version).then((response) => {
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
    handlePluginInstallation(plugin) {
        Installer.installPlugin(plugin).then((response) => {
            console.log(response);
        }, (err) => {
            console.log(err);
        })
    }
}
export let CommandInstall = new Install();