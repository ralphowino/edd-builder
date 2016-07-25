var program = require('commander'),
  library = require('./../lib/library.js');

var command = {};
command.init = init;
command.handle = handle;

module.exports = command;


function init() {
  program
    .command('library install <name> [version]')
    .alias('lib')
    .description('Install a library')
    .option('-g, --global', 'Install a library globally')
    .action(command.handle);

};

function handle() {
  "use strict";
  library.install(program.global);

};



