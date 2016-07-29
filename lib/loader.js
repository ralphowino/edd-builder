'use strict';

let _ = require('lodash'),
  loader = require('../../edd-fs').loader,
  q = require('q'),
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
    let path = 'libraries/' + uses.library + '/edd-config.json';
    return loader.loadFile(path).then((library)=> {
      let pattern = {
        library: library.content
      };
      pattern.library.scope = library.type;

      if (pattern.library) {
        if (!uses.version) {
          uses.version = pattern.library.mainVersion;
        }
        path = 'libraries/' + uses.library + '/' + uses.version + '/edd-config.json'
        return loader.loadFile(path)
          .then((version)=> {
            pattern.version = version.content;
            pattern.version.scope = version.type;

            path = 'libraries/' + uses.library + '/' + uses.version + '/' + uses.pattern + '.json';

            return loader.loadFile(path)
              .then((_pattern)=> {
                pattern.pattern = _pattern.content;
                pattern.pattern.scope = _pattern.type;
                return pattern;
              }, function (err) {
                io.error('Pattern not found: ', path, err);
              })
          }, function (err) {
            io.error('Version not found: ', path, err);
          });
      }
    }, function (err) {
      io.error('Library ' + uses.library + ' does not exist', path, err);
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

    return result;

  };
}

module.exports = new FileLoader();