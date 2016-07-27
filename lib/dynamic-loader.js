'use strict';
let
  _ = require('lodash'),
  loader = require('./loader'),
  nunjucks = require('nunjucks');

let dynamicLoader = {
  async: true,
  getSource: (name, callback)=> {

    loader.getPattern(name).then(function (response) {
      let src = '';

      if (response.pattern.uses) {
        src = src.concat('{% extends "', response.pattern.uses, '" %}')
      }
      if (response.pattern.definitions) {
        _.forEach(response.pattern.definitions, function (value, attr) {
          src = src.concat(
            '{% if not ', attr, ' %}',
            '{% set ', attr, ' %}',
            value,
            '{% endset %}',
            '{% endif %}'
          );
        })
      }
      if (response.pattern.render) {
        src = src.concat(response.pattern.render);
      }
      callback(undefined, {
        src: src,
        path: name
      });
    }, function (error) {
      callback(error);
    });


  }
}

module.exports = nunjucks.Loader.extend(dynamicLoader);
