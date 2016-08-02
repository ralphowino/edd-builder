var program = require('commander'),
  library = require('./../lib/library.js');

var command = {};
command.init = init;
command.handle = handle;

module.exports = command;


function init() {
  program
    .command('libraries')
    .alias('lib')
    .action(command.handle)
    .on('--help', function () {
      console.log('  Examples:');
      console.log('');
      console.log('    $ custom-help --help');
      console.log('    $ custom-help -h');
      console.log('');
    });


};

function handle() {
  "use strict";
  library.info(program.global);

};



