let _ = require('lodash'),
  q = require('q'),
  path = require('path');

import {Loader} from '../../edd-fs/index';
import {Reader} from '../../edd-fs/index';
import {Input, Output} from '../../edd-io/index';

class ClassFileLoader {

  findPattern(uses) {
    uses = this.explode(uses);

    if (!uses.library) {
      uses.library = Input.ask('Library');
    }
    return q.resolve(uses.library).then((library)=> {
      if (!uses.version) {
        uses.version = Input.ask('Version')
      }
      return q.resolve(uses.version).then((version)=> {
        if (!uses.pattern) {
          uses.pattern = Input.ask('Pattern');
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
      return Loader.loadFile(file).then((_pattern)=> {
        pattern.pattern = _pattern.content;
        pattern.pattern.scope = _pattern.type;
        _.each(pattern.pattern.definitions, (value, key)=> {
          if (_.startsWith(value, '!include')) {
            pattern.pattern.definitions[key] = Reader.readSync(path.dirname(_pattern.path) + '/' + value.replace('!include','').trim())
          }
        });
        return pattern;
      }, function (err) {
        Output.error('Pattern not found: ', path, err);
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
    return Loader.loadFile(path).then((library)=> {
      library.content.scope = library.type;
      return library.content;
    }, ()=> {
      Output.error('The ' + uses.library + '/' + uses.version + ' does not exist');
    });

  }
}
export let FileLoader = new ClassFileLoader();