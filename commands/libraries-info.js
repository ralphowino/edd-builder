var program = require('commander'),
  library = require('./../lib/library.js');

var command = {};
command.init = init;
command.handle = handle;

module.exports = command;


function init() {
  program
    .command('library info')
    .alias('lib')
    .description('Get info about installed libraries')
    .option('-g, --global', 'Show global libraries')
    .action(command.handle);

};

function handle() {
  "use strict";
  library.info(program.global);

};



