var plugin = module.exports = {},
  generateCmd = require('./commands/generate');
  installCmd = require('./commands/install');
  librariesCmd = require('./commands/libraries');

plugin.name = 'File Builder';


plugin.init = function () {
  "use strict";
  generateCmd.init();
  installCmd.init();
  librariesCmd.init();
};


return module.exports;