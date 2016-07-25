var plugin = module.exports = {},
  generateCmd = require('./commands/generate');

plugin.name = 'File Builder';


plugin.init = function () {
  "use strict";
  generateCmd.init();
};


return module.exports;