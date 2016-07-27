'use strict';
var
  _ = require('lodash'),
  q = require('q'),
  io = require('../../eddie-io'),
  fm = require('../../eddie-fs'),
  loader = require('./loader'),
  nunjucks = require('nunjucks');

class Builder {
  generate(uses) {
    loader.findPattern(uses).then((pattern)=> {

      io.queries(pattern.pattern.variables.schema, pattern.pattern.variables.form).then((definitions)=> {

        this.build(uses, definitions).then((files)=> {

          _.each(files, (file)=> {
            fm.write(file.name, file.content).then(()=> {
              io.success('Successfully created ' + file.name);
            });
          })
        });
      });

    });
  }

  build(uses, definitions) {

    var files = [], env, dynamicLoader = require('./dynamic-loader'), deferred = q.defer();

    env = new nunjucks.Environment(new dynamicLoader(), {preserve_linebreaks: true});

    env.render(uses, definitions, function(err, content){
      files.push({
        name: content.substr(0, content.indexOf("\n")),
        content: content.substr(content.indexOf("\n") + 1)
      });
      deferred.fulfill(files);
    });
    return deferred.promise;
  };

}


module.exports = new Builder;