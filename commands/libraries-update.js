var program = require('commander'),
  library = require('./../lib/library.js');

var command = {};
command.init = init;
command.handle = handle;

module.exports = command;


function init() {
  program
    .command('library update [name] [version]')
    .alias('lib')
    .description('Update installed libraries. You can specify a specific library and version to upgrade to')
    .option('-g, --global', 'Update global library')
    .action(command.handle);

};

function handle() {
  "use strict";
  library.update(program.global);

};



