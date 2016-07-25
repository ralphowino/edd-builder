var
  _ = require('lodash'),
  builder = require('./builder'),
  nunjucks = require('nunjucks');

module.exports = nunjucks.Loader.extend({
  getSource: function (name) {
    var  src = '', pattern;

    pattern = builder.getPattern(name);

    if (pattern.uses) {
      src = src.concat('{% extends "', pattern.uses, '" %}')
    }
    if (pattern.definitions) {
      _.forEach(pattern.definitions, function (value, attr) {
        src = src.concat(
          '{% if not ', attr, ' %}',
          '{% set ', attr, ' %}',
          value,
          '{% endset %}',
          '{% endif %}'
        );
      })
    }
    if (pattern.render) {
      src = src.concat(pattern.render);
    }
    return {
      src: src,
      path: name
    }
  }
});

return module.exports;