'use strict';

let _ = require('lodash'),
  loader = require('../../edd-fs').loader,
  reader = require('../../edd-fs').reader,
  q = require('q'),
  path = require('path'),
  io = require('../../edd-io');

class FileLoader {

  findPattern(uses) {
    uses = this.explode(uses);

    if (!uses.library) {
      uses.library = io.ask('Library');
    }
    return q.resolve(uses.library).then((library)=> {
      if (!uses.version) {
        uses.version = io.ask('Version')
      }
      return q.resolve(uses.version).then((version)=> {
        if (!uses.pattern) {
          uses.pattern = io.ask('Pattern');
        }
        return q.resolve(uses.pattern).then((pattern)=> {
          uses = library.concat(':', version, ':', pattern);
          return this.getPattern(uses);
        });
      })
    });

  }

  getPattern(uses) {
    uses = this.explode(uses);

    let pattern = {}, file;

    return this.getLibrary(uses).then((library)=> {
      pattern.library = library;
      file = 'libraries/' + uses.library + '/' + uses.version + '/' + uses.pattern;
      return loader.loadFile(file).then((_pattern)=> {
        pattern.pattern = _pattern.content;
        pattern.pattern.scope = _pattern.type;
        _.each(pattern.pattern.definitions, (value, key)=> {
          if (_.startsWith(value, '!include')) {
            pattern.pattern.definitions[key] = reader.readSync(path.dirname(_pattern.path) + '/' + value.replace('!include','').trim())
          }
        });
        return pattern;
      }, function (err) {
        io.output.error('Pattern not found: ', path, err);
      })
    });
  };

  explode(uses) {
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
    if (!result.version) {
      result.version = 'master'
    }
    return result;

  };

  getLibrary(uses) {
    let path = 'libraries/' + uses.library + '/' + uses.version + '/edd-config.json';
    return loader.loadFile(path).then((library)=> {
      library.content.scope = library.type;
      return library.content;
    }, ()=> {
      io.output.error('The ' + uses.library + '/' + uses.version + ' does not exist');
    });

  }
}

module.exports = new FileLoader();
