var builder = {},
  _ = require('lodash'),
  q = require('q'),
  io = require('../../eddie-io'),
  fm = require('../../eddie-fs'),
  libraries = require('../libraries.json'),

  nunjucks = require('nunjucks');

builder.generate = function (uses) {
  "use strict";
  uses = builder.explode(uses);
  if (!uses.library) {
    uses.library = io.ask('Library');
  }
  q.resolve(uses.library).then(function (library) {
    if (!uses.version) {
      uses.version = io.ask('Version')
    }

    q.resolve(uses.version).then(function (version) {
      if (!uses.pattern) {
        uses.pattern = io.ask('Pattern');
      }

      q.resolve(uses.pattern).then(function (pattern) {
        uses = library.concat(':', version, ':', pattern);

        pattern = builder.getPattern(uses);

        io.queries(pattern.variables.schema, pattern.variables.form).then(function (definitions) {
          io.decide('Should we over');

          builder.build(uses, definitions).then(function (files) {

            _.each(files, function (file) {
              fm.write(file.name, file.content).then(function(){
                console.log(arguments);
                io.success('Successfully created '+file.name);
              });
            })
          });
        })
      });
    });
  });
}

builder.build = function (uses, definitions) {

  var files = [], env, content, dynamicLoader = require('./dynamic-loader');

  env = new nunjucks.Environment(new dynamicLoader(), {preserve_linebreaks: true});

  content = env.render(uses, definitions);
  files.push({
    name: content.substr(0, content.indexOf("\n")),
    content: content.substr(content.indexOf("\n") + 1)
  });

  return q.resolve(files);
};

builder.getPattern = function (uses) {
  var library;
  uses = builder.explode(uses);
  if (uses.library) {
    library = _.get(libraries, uses.library);
  }
  if (library) {
    if (!uses.version) {
      uses.version = library.mainVersion;
    }
    if (uses.version && uses.pattern) {
      return _.get(library, ['versions', uses.version, 'patterns', uses.pattern]);
    }
  }
};

builder.explode = function (uses) {
  var result = {
    library: undefined,
    version: undefined,
    pattern: undefined
  };
  if (uses) {
    uses = uses.split(':');
    result.library = uses.shift();
    if (uses.length == 1) {
      result.pattern = uses.shift();
    } else {
      result.version = uses.shift();
      result.pattern = uses.shift();
    }
  }

  return result;

};

exports = module.exports = builder;