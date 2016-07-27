'use strict';

var program = require('commander');
var installer = require('../components/install');

function init() {
    program
        .command('install')
        .description("Installs eddie's libraries from github.com")
        .arguments('<library>', "The library you want to install to eddie e.g. username/repo_name")
        .action(handle)
        .parse(process.argv);
}

function handle(library) {
    "use strict";

    installer.install(library).then((response) => {
        console.log(response);
    }, (err) => {
        console.log(err);
    });
}

module.exports = {
    init: init,
    handle: handle
};


