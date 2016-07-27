var plugin = module.exports = {},
  generateCmd = require('./commands/generate'),
  librariesCmd = require('./commands/libraries');

plugin.name = 'File Builder';


plugin.init = function () {
  "use strict";
  generateCmd.init();
  librariesCmd.init();
};


return module.exports;