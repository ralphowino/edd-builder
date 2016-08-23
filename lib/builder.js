'use strict';
var
  _ = require('lodash'),
  q = require('q'),
  io = require('../../edd-io'),
  fm = require('../../edd-fs'),
  loader = require('./loader'),
  nunjucks = require('nunjucks');

class Builder {
  generate(uses) {
    loader.findPattern(uses).then((pattern)=> {
      let variables = {};
      if (pattern.pattern.variables.schema && pattern.pattern.variables.form) {
        variables = io.queries(pattern.pattern.variables.schema, pattern.pattern.variables.form);
      }
      else if (pattern.pattern.variables) {
        variables = io.queries({type: 'object', properties: pattern.pattern.variables}, '*');
      }
      q.resolve(variables).then((definitions)=> {
        this.build(uses, definitions).then((files)=> {
          _.each(files, (file)=> {
            fm.write(file.name, file.content).then(()=> {
              io.output.success('Successfully created ' + file.name);
            });
          })
        }, (response)=> {
          io.output.error(response)
        });
      });

    });
  }

  build(uses, definitions) {

    let files = [], env, filters,
      dynamicLoader = require('./loaders/dynamic-loader'),
      deferred = q.defer();


    env = new nunjucks.Environment(new dynamicLoader(), {preserve_linebreaks: true, autoescape: false});

    filters = {
      lodash: require('./filters/lodash-filters')
    };

    _.each(filters, (filter)=> {
      env = filter.appendFilters(env);
    });

    env.render(uses, definitions, function (err, content) {
      if (err) {
        console.log(err);
        return deferred.reject(err);
      }
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
