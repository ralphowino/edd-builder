var plugin = module.exports = {};
var installCmd = require('./commands/install');
var generateCmd = require('./commands/generate');
//var librariesCmd = require('./commands/libraries');

plugin.name = 'File Builder';


plugin.init = function () {
    "use strict";
    installCmd.init();
    generateCmd.init();
};


return module.exports;