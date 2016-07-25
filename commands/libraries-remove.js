var program = require('commander'),
  library = require('./../lib/library.js');

var command = {};
command.init = init;
command.handle = handle;

module.exports = command;


function init() {
  program
    .command('library remove <name> [version]')
    .alias('lib')
    .description('Remove a library')
    .option('-g, --global', 'Remove a global library')
    .action(command.handle);

};

function handle() {
  "use strict";
  library.remove(program.global);

};



