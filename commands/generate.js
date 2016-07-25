var program = require('commander'),
  builder = require('./../lib/builder.js');

var command = {};
command.init = init;
command.handle = handle;

module.exports = command;


function init() {
  program
    .command('generate [uses]')
    .alias('g')
    .description('Generate files based on a library')
    .action(command.handle);

};

function handle(uses) {
  "use strict";
  builder.generate(uses);

};



