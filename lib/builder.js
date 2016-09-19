var
  _ = require('lodash'),
  q = require('q'),
  nunjucks = require('nunjucks');

import {Fields, Output} from '../../edd-io/index';
import {Writer} from '../../edd-fs/index';
import {FileLoader} from './loader';

class ClassBuilder {
  generate(uses) {
    FileLoader.findPattern(uses).then((pattern)=> {
      let variables = {};
      if (pattern.pattern.variables.schema && pattern.pattern.variables.form) {
        variables = Fields.queries(pattern.pattern.variables.schema, pattern.pattern.variables.form);
      }
      else if (pattern.pattern.variables) {
        variables = Fields.queries({type: 'object', properties: pattern.pattern.variables}, '*');
      }
      q.resolve(variables).then((definitions)=> {
        this.build(uses, definitions).then((files)=> {
          _.each(files, (file)=> {
            Writer.write(file.name, file.content).then(()=> {
              Output.success('Successfully created ' + file.name);
            });
          })
        }, (response)=> {
          Output.error(response)
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
export let Builder = new ClassBuilder();