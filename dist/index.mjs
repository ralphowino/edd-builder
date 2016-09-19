var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var inquirer = require('inquirer');

var ClassInquirer = function () {
    function ClassInquirer() {
        classCallCheck(this, ClassInquirer);
    }

    createClass(ClassInquirer, [{
        key: 'loopQuestions',
        value: function loopQuestions(questions_array, index, answers) {
            if (!index) {
                index = 0;
            }

            if (!answers) {
                answers = {};
            }

            return inquirer.prompt(questions_array[index]).then(function (answer) {
                Object.assign(answers, answer);

                if (index === questions_array.length - 1) {
                    return answers;
                } else {
                    return this.loopQuestions(questions_array, index + 1, answers);
                }
            });
        }

        /**
         * Modified version of inquirer prompt function
         * @param questions_array
         * @returns {Promise<T>|Promise}
         */

    }, {
        key: 'prompt',
        value: function prompt(questions_array) {
            return new Promise(function (resolve) {
                return resolve(this.loopQuestions(questions_array));
            });
        }
    }]);
    return ClassInquirer;
}();

var Inquirer = new ClassInquirer();

var _$2 = require('lodash');

var ClassTransformers = function () {
    function ClassTransformers() {
        classCallCheck(this, ClassTransformers);
    }

    createClass(ClassTransformers, [{
        key: 'transformArrayField',
        value: function transformArrayField(field) {
            // return input.choose(field.title + '. What do we do next', [
            // 	{	value: 'add',  name: 'Add'},
            // 	{	value: 'stop', name: 'Stop'}
            // ]).then(function ( selected ) {
            // 	if (selected == 'stop')
            // 		return answers;
            // 	var items = _.map(field.items, function (item) {
            // 		return item.replace(field.key.concat('[].'), '');
            // 	});
            // 	return input.fields(field.schema.items, items).then(function (answer) {
            // 		answers.push(answer);
            // 		return input.askArrayQuestion(field, answers)
            // 	})
            // });
        }
    }, {
        key: 'transformBooleanField',
        value: function transformBooleanField(field) {
            return {
                name: field.key,
                message: field.title ? field.title : field.key,
                type: 'confirm'
            };
        }

        // transformCheckboxField(field) {
        // 	return {
        // 		name: field.key,
        // 		message: field.title ? field.title : field.key,
        // 		choices: choices,
        // 		default: _default
        // 	}
        // }

    }, {
        key: 'transformDefaultField',
        value: function transformDefaultField(field, answer) {
            return {
                name: field.key,
                message: field.title ? field.title : field.key,
                type: 'input',
                default: _$2.isUndefined(answer) ? field.default : answer
            };
        }
    }, {
        key: 'transformHelpField',
        value: function transformHelpField(field, answer) {
            console.log('no transform available for help text');
            return null;
        }
    }, {
        key: 'transformIntegerField',
        value: function transformIntegerField(field, answer) {
            return {
                name: field.key,
                message: field.title ? field.title : field.key,
                type: 'input',
                default: _$2.isUndefined(answer) ? field.default : answer //TODO add validate function
            };
        }
    }, {
        key: 'transformNumberField',
        value: function transformNumberField(field, answer) {
            return {
                name: field.key,
                message: field.title ? field.title : field.key,
                type: 'input',
                default: _$2.isUndefined(answer) ? field.default : answer //TODO add validate function
            };
        }
    }, {
        key: 'transformStringField',
        value: function transformStringField(field, answer) {
            var question = transformers.transformDefaultField(field, answer);

            if (field.enum) {
                var choices = _$2.map(field.enum, function (item) {
                    return { value: item, name: item };
                });
                question.type = 'rawlist';
                question.choices = choices;
            }
            return question;
        }
    }, {
        key: 'transformSubmitField',
        value: function transformSubmitField(field, answer) {
            console.log('no transform available for submit buttons');
            return null;
        }
    }, {
        key: 'transformTextareaField',
        value: function transformTextareaField(field, answer) {
            return {
                name: field.key,
                message: field.title ? field.title : field.key,
                type: 'input',
                default: _$2.isUndefined(answer) ? field.default : answer
            };
        }
    }]);
    return ClassTransformers;
}();

var Transformers = new ClassTransformers();

var _$1 = require('lodash');

var ClassFields = function () {
    function ClassFields() {
        classCallCheck(this, ClassFields);
    }

    createClass(ClassFields, [{
        key: 'askQuestions',
        value: function askQuestions(form, default_model) {
            var questions = this.getQuestions(form, default_model);
            return Inquirer.prompt(questions);
        }
    }, {
        key: 'getArrayFields',
        value: function getArrayFields(schema, parent_field) {
            var array_form = [];
            var array_schema = _$1.cloneDeep(_$1.get(schema, ['properties', parent_field.key]));
            _$1.forEach(parent_field.items, function (item_field) {
                if (_$1.isString(item_field)) {
                    item_field = { key: item_field };
                }
                item_field.key = item_field.key.replace(parent_field.key + '[].', ''); // Remove the array key prefix
                array_form.push(this.getNormalField(array_schema, item_field));
            });
            return array_form;
        }
    }, {
        key: 'getAsteriskFields',
        value: function getAsteriskFields(schema, schema_form) {
            var fields = _$1.cloneDeep(_$1.get(schema, ['properties']));
            _$1.forEach(fields, function (object, field) {
                field = { key: field };
                schema_form.push(this.getNormalField(schema, field));
            });
            return schema_form;
        }
    }, {
        key: 'getNormalField',
        value: function getNormalField(schema, field) {
            var field_schema = _$1.cloneDeep(_$1.get(schema, ['properties', field.key]));
            if (_$1.isUndefined(field_schema)) field_schema = _$1.cloneDeep(_$1.get(schema.items, ['properties', field.key])); //check for array

            field = _$1.merge(field_schema, _$1.get(field, ['schema', 'x-schema-form'], {}), field);

            if (field.type === 'array') {
                field = this.getArrayFields(schema, field); // Make the field an array of the objects properties
            }

            return field;
        }
    }, {
        key: 'getQuestions',
        value: function getQuestions(array_fields, default_model) {
            var type,
                questions = [];
            _$1.forEach(array_fields, function (field) {
                "use strict";

                var question;

                if (_$1.isArray(field)) {
                    question = this.getQuestions(field, default_model);
                } else {
                    type = 'transform' + _$1.capitalize(field.type) + 'Field';
                    if (!Transformers[type]) {
                        console.error(type);
                        type = 'transformDefaultField';
                    }
                    question = Transformers[type](field, _$1.get(default_model, field.key));
                }

                if (question != null) {
                    return questions.push(question);
                }
            });
            return questions;
        }
    }, {
        key: 'queries',
        value: function queries(schema, form, model) {
            var schema_form = [];

            _$1.forEach(form, function (field) {
                if (_$1.isString(field)) {
                    field = { key: field };
                }

                if (field.key !== '*') {
                    // normal fields
                    schema_form.push(this.getNormalField(schema, field));
                } else if (field.key === '*') {
                    // dynamic form indicated by asterisk to indicate all fields
                    this.getAsteriskFields(schema, schema_form);
                }
            });
            return this.askQuestions(schema_form, model);
        }
    }]);
    return ClassFields;
}();

var Fields = new ClassFields();

var inquirer$1 = require('inquirer');

var ClassInput = function () {
    function ClassInput() {
        classCallCheck(this, ClassInput);
    }

    createClass(ClassInput, [{
        key: 'ask',
        value: function ask(message, _default) {
            return inquirer$1.prompt([{
                name: 'response',
                message: message,
                type: 'input',
                default: _default
            }]).then(function (answers) {
                return answers.response;
            });
        }
    }, {
        key: 'secret',
        value: function secret(message, _default) {
            console.log(message);
            return inquirer$1.prompt([{
                name: 'response',
                message: message,
                type: 'password',
                default: _default
            }]).then(function (answers) {
                return answers.response;
            });
        }
    }, {
        key: 'confirm',
        value: function confirm(message, _default) {
            return inquirer$1.prompt([{
                name: 'response',
                message: message,
                type: 'confirm',
                default: _default
            }]).then(function (answers) {
                return answers.response;
            });
        }
    }, {
        key: 'choose',
        value: function choose(message, choices, _default) {
            return inquirer$1.prompt([{
                name: 'response',
                message: message,
                type: 'list',
                choices: choices,
                default: _default
            }]).then(function (answers) {
                return answers.response;
            });
        }
    }, {
        key: 'choice',
        value: function choice(question, choices, selected) {
            "use strict";

            return inquirer$1.prompt([{
                name: 'response',
                message: question,
                type: 'list',
                choices: choices,
                default: selected
            }]).then(function (answers) {
                return answers.response;
            });
        }
    }]);
    return ClassInput;
}();

var Input = new ClassInput();

var chalk$1 = require('chalk');
var Spinner$1 = require('cli-spinner').Spinner;
var _$3 = require('lodash');
var ClassOutput = function () {
  function ClassOutput() {
    classCallCheck(this, ClassOutput);
  }

  createClass(ClassOutput, [{
    key: 'line',
    value: function line() {
      _$3.each(arguments, function (message) {
        if (!_$3.isString(message)) {
          message = JSON.stringify(message);
        }
        console.log(message);
      });
    }
  }, {
    key: 'info',
    value: function info() {
      _$3.each(arguments, function (message) {
        if (!_$3.isString(message)) {
          message = JSON.stringify(message);
        }
        console.info(chalk$1.cyan(message));
      });
    }
  }, {
    key: 'success',
    value: function success() {
      _$3.each(arguments, function (message) {
        if (!_$3.isString(message)) {
          message = JSON.stringify(message);
        }
        console.info(chalk$1.green(message));
      });
    }
  }, {
    key: 'error',
    value: function error() {
      _$3.each(arguments, function (message) {
        if (!_$3.isString(message)) {
          message = JSON.stringify(message);
        }
        console.error(chalk$1.white.bgRed(message));
      });
    }
  }, {
    key: 'warning',
    value: function warning() {
      _$3.each(arguments, function (message) {
        if (!_$3.isString(message)) {
          message = JSON.stringify(message);
        }
        console.warn(chalk$1.yellow(message));
      });
    }
  }, {
    key: 'spinner',
    value: function spinner(message) {
      var spinner = new Spinner$1(message + '...%s');
      spinner.setSpinnerString('|/-\\');
      return spinner;
    }
  }]);
  return ClassOutput;
}();

var Output = new ClassOutput();

var _$4 = require('lodash');
var q$1 = require('q');
var inquirer$2 = require('inquirer');
var path$1 = require('path');
var fs$1 = require('fs-plus');
var ClassWriter = function () {
    function ClassWriter() {
        classCallCheck(this, ClassWriter);
    }

    createClass(ClassWriter, [{
        key: 'writeFile',
        value: function writeFile(file_path, content) {
            var defered = q$1.defer();
            var dir = path$1.dirname(file_path);
            if (!fs$1.existsSync(dir)) {
                fs$1.makeTreeSync(dir);
            }

            if (_$4.isObject(content) || _$4.isArray(content)) {
                content = JSON.stringify(content);
            }
            fs$1.writeFile(file_path, content, function (err) {
                if (err) {
                    return defered.reject(new Error(err));
                }
                defered.fulfill(file_path);
            });
            return defered.promise;
        }
    }, {
        key: 'askToOverwrite',
        value: function askToOverwrite() {
            var question = {
                type: "confirm",
                name: "overwrite",
                message: "The file already exists, do you want to overwrite it?",
                default: false
            };
            return inquirer$2.prompt([question]);
        }
    }, {
        key: 'write',
        value: function write(path, content) {
            if (!fs$1.existsSync(path)) {
                return this.writeFile(path, content);
            }

            return this.askToOverwrite().then(function (response) {
                if (response.overwrite) {
                    return this.writeFile(path, content);
                }
                return q$1.reject('File already exists');
            });
        }
    }, {
        key: 'mkdir',
        value: function mkdir(path) {
            var deferred = q$1.defer();
            fs$1.makeTree(path, function (err) {
                if (err) {
                    return deferred.reject(err);
                }
                return deferred.fulfill();
            });
            return deferred.promise;
        }
    }]);
    return ClassWriter;
}();

var Writer = new ClassWriter();

var fs$3 = require('fs-plus');
var path$2 = require('path');
var q$3 = require('q');
var yaml = require('js-yaml');
var _$6 = require('lodash');
var ClassReader = function () {
  function ClassReader() {
    classCallCheck(this, ClassReader);

    this.types = {
      json: {
        extensions: ['json'],
        parser: 'parseJson'
      },
      yaml: {
        extensions: ['yaml', 'yml'],
        parser: 'parseYaml'
      }
    };
  }

  createClass(ClassReader, [{
    key: 'resolveFileType',
    value: function resolveFileType(fileName) {
      var ext = path$2.extname(fileName).substr(1);
      var type = _$6.findIndex(this.types, function (type) {
        return _$6.findIndex(type.extensions, ext) != -1;
      });
      return type != -1 ? type : ext;
    }
  }, {
    key: 'parseYaml',
    value: function parseYaml(data) {
      return yaml.load(data);
    }
  }, {
    key: 'parseJson',
    value: function parseJson(data) {
      return JSON.parse(data);
    }
  }, {
    key: 'read',
    value: function read(path) {
      var _this = this;

      var type = this.resolveFileType(path);
      var defered = q$3.defer();
      fs$3.readFile(path, function (err, content) {
        var data = content.toString();
        if (err) {
          return defered.reject(new Error(err));
        }
        if (_this.types[type]['parser']) {
          return defered.resolve(_this[_this.types[type]['parser']](data));
        }
        return defered.resolve(data);
      });
      return defered.promise;
    }
  }, {
    key: 'readSync',
    value: function readSync(path) {
      var type = this.resolveFileType(path);
      var data = fs$3.readFileSync(path);
      data = data.toString();
      if (_$6.has(this.types, [type, 'parser'])) {
        this[_$6.get(this.types, [type, 'parser'])](data);
      }
      return data;
    }
  }]);
  return ClassReader;
}();

var Reader = new ClassReader();

var q$2 = require('q');
var _$5 = require('lodash');
var fs$2 = require('fs-plus');

var ClassLoader = function () {
    function ClassLoader() {
        classCallCheck(this, ClassLoader);

        this.types = ['json', 'yaml', 'yml'];
        this.globalFolder = fs$2.getHomeDirectory() + '/.edd/';
    }

    /**
     * Load a file given the file's path
     *
     * @param path
     * @returns {*}
     */


    createClass(ClassLoader, [{
        key: 'loadFile',
        value: function loadFile(path) {
            var _this = this;

            return this.getRealPath(path).then(function (response) {
                return _this.readFile(response.path).then(function (content) {
                    response.content = content;
                    return response;
                });
            });
        }

        /**
         * Load a file given the file's path
         *
         * @param path
         * @returns {*}
         */

    }, {
        key: 'loadFileSync',
        value: function loadFileSync(path) {
            var _this2 = this;

            return this.getRealPath(path).then(function (response) {
                return _this2.readFile(response.path).then(function (content) {
                    response.content = content;
                    return response;
                });
            });
        }
    }, {
        key: 'readFile',
        value: function readFile(path) {
            if (fs$2.existsSync(path)) {
                return Reader.read(path);
            }
            return q$2.reject(new Error('File does not exist'));
        }

        /**
         * Get the real path to the file specified
         *
         * @param path
         * @returns {*}
         */

    }, {
        key: 'getRealPath',
        value: function getRealPath(path) {
            // Check if path is absolute and return the absolute path
            if (fs$2.isAbsolute(path)) {
                return q$2.resolve({
                    type: 'absolute',
                    path: path
                });
            }

            // Check and if exists return the local path
            var localFolder = this.getLocalFolder();

            if (localFolder) {
                var localFilePath = this.fileExists(localFolder + '/' + path, this.types);

                if (localFilePath) {
                    return q$2.resolve({
                        type: 'local',
                        path: fs$2.absolute(localFilePath)
                    });
                }
            }

            var globalFilePath = this.fileExists(this.globalFolder + '/' + path, this.types);

            if (globalFilePath) {
                return q$2.resolve({
                    type: 'local',
                    path: globalFilePath
                });
            }

            return q$2.reject(new Error('File not found'));
        }

        /**
         * Check if file exists and returns the path
         *
         * @param path
         * @param possibleExtensions
         * @returns {*}
         */

    }, {
        key: 'fileExists',
        value: function fileExists(path, possibleExtensions) {
            if (fs$2.existsSync(path)) {
                return path;
            }

            if (!_$5.isUndefined(possibleExtensions)) {
                for (var i = 0; i < possibleExtensions.length; i++) {
                    if (this.fileExists(path + '.' + possibleExtensions[i])) {
                        return path + '.' + possibleExtensions[i];
                    }
                }
            }

            return false;
        }

        /**
         * Get the local .edd folder
         *
         * @param targetFile
         * @param startingPoint
         * @param levels
         * @returns {*}
         */

    }, {
        key: 'getLocalFolder',
        value: function getLocalFolder(targetFile, startingPoint, levels) {
            if (!targetFile) {
                targetFile = '.edd';
            }

            if (!startingPoint) {
                startingPoint = './';
            }

            if (!levels) {
                levels = fs$2.absolute(startingPoint).split('/').length;

                //Checks if a windows machines
                if (levels == 1) {
                    levels = fs$2.absolute(startingPoint).split('\\').length;
                }
            }

            if (fs$2.existsSync(startingPoint + '/' + targetFile)) {
                return (startingPoint + '/' + targetFile).replace('//', '/');
            }

            if (levels - 1 != 0) {
                return this.getLocalFolder(targetFile, startingPoint + '../', levels - 1);
            }

            return false;
        }
    }]);
    return ClassLoader;
}();

var Loader = new ClassLoader();

var q$4 = require('q');

var ClassManager = function () {
    function ClassManager() {
        classCallCheck(this, ClassManager);

        this.basePath = process.cwd() + '/';
        this.eddiePath = this.basePath.concat('.edd/');
        this.eddieFile = this.eddiePath.concat('edd-config.json');
    }

    createClass(ClassManager, [{
        key: 'init',
        value: function init() {
            var _this = this,
                _arguments = arguments;

            Output.info('initializing');
            var config = { version: '0.0.1' };

            return Writer.write(this.eddieFile, JSON.stringify(config)).then(function (file) {
                var process = [];
                Output.success('edd successfully initialized at' + file);

                process.push(Writer.mkdir(_this.eddiePath.concat('libraries')).then(function () {
                    Output.success('Created libraries folder');
                }, function () {
                    console.log(_arguments);
                }));
                process.push(Writer.mkdir(_this.eddiePath.concat('templates')));

                return q$4.all(process);
            }, function (err) {
                Output.error(err);
            });
        }
    }]);
    return ClassManager;
}();

var Manager = new ClassManager();

var q$5 = require('q');
var fs$4 = require('fs-plus');
var ClassFileSystem = function () {
    function ClassFileSystem() {
        classCallCheck(this, ClassFileSystem);

        this.globalFolder = fs$4.getHomeDirectory() + '/.edd/';
    }

    /**
     * Checks for the file and reads the content of the file if the file is present
     *
     * @param path
     * @param content
     * @returns {*}
     */


    createClass(ClassFileSystem, [{
        key: 'writeToLocalFile',
        value: function writeToLocalFile(path, content) {
            var deferred = q$5.defer();

            Writer.write(this.getLocalFolder() + '/' + path, content).then(function () {
                return deferred.resolve('Successfully wrote to the file');
            }, function (err) {
                return deferred.reject(err);
            });

            return deferred.promise;
        }

        /**
         * Checks for the file and reads the content of the file if the file is present
         *
         * @param path
         * @returns {*}
         */

    }, {
        key: 'readFile',
        value: function readFile(path) {
            var deferred = q$5.defer();

            fs$4.exists(path, function () {
                Reader.read(path).then(function (response) {
                    return deferred.resolve(response);
                }, function (err) {
                    return deferred.reject(err);
                });
            }, function () {
                return deferred.reject(new Error('File does not exist'));
            });

            return deferred.promise;
        }

        /**
         * Recursively searches up the file system for a file
         *
         * @param targetFile
         * @param startingPoint
         * @param levels
         * @returns {*} relativeFilePath
         */

    }, {
        key: 'getLocalFolder',
        value: function getLocalFolder(targetFile, startingPoint, levels) {

            if (!targetFile) {
                targetFile = '.edd';
            }

            if (!startingPoint) {
                startingPoint = './';
            }

            if (!levels) {
                levels = FileSystem.fetchDirectoryLevels(startingPoint);
            }

            if (fs$4.existsSync(startingPoint + '/' + targetFile)) {
                return (startingPoint + '/' + targetFile).replace('//', '/');
            }

            if (levels - 1 != 0) {
                return this.getLocalFolder(targetFile, startingPoint + '../', levels - 1);
            }

            return false;
        }

        /**
         * Fetches the levels the current directory is compared to the base directory
         *
         * @param {String} startingPoint
         * @returns {Number} directoryLevels
         */

    }, {
        key: 'localDirectoryExists',


        /**
         * Checks if the local .edd folder exists
         *
         * @returns {boolean}
         */
        value: function localDirectoryExists() {
            return Boolean(this.getLocalFolder());
        }

        /**
         * Reads a file from the local .edd folder
         *
         * @param path
         * @returns {*}
         */

    }, {
        key: 'readLocalFile',
        value: function readLocalFile(path) {
            return this.readFile(this.getLocalFolder() + '/' + path);
        }

        /**
         * Reads a file from the global .edd folder
         *
         * @param path
         * @returns {*}
         */

    }, {
        key: 'readGlobalFile',
        value: function readGlobalFile(path) {
            return this.readFile(this.globalFolder + path);
        }

        /**
         * Build up the response object
         *
         * @param source
         * @param path
         * @param content
         * @returns {{source: *, path: *, content: *}}
         */

    }, {
        key: 'buildResponse',
        value: function buildResponse(source, path, content) {
            return {
                'source': source,
                'path': path,
                'content': content
            };
        }
    }], [{
        key: 'fetchDirectoryLevels',
        value: function fetchDirectoryLevels(startingPoint) {
            var absolute = fs$4.absolute(startingPoint);
            var levels = absolute.split('/').length;

            //Checks if a windows machines
            if (levels == 1) {
                levels = absolute.split('\\').length;
            }

            return levels;
        }
    }]);
    return ClassFileSystem;
}();

var FileSystem = new ClassFileSystem();

var program$1 = require('commander');
var q$6 = require('q');
var fs$5 = require('fs-plus');
var ClassCommandInit = function () {
    function ClassCommandInit() {
        classCallCheck(this, ClassCommandInit);
    }

    createClass(ClassCommandInit, [{
        key: 'init',
        value: function init() {
            program$1.command('init').description('Initialize a new edd instance').option('-f, --force', 'Force re-initialization if already existing').action(this.handle);
        }
    }, {
        key: 'handle',
        value: function handle() {
            var overwrite = program$1.force;
            if (fs$5.existsSync(Manager.eddiePath)) {
                overwrite = Input.confirm('edd is already initialized, do you want to re-initialize it', false);
                q$6.resolve(overwrite).then(function (force) {
                    if (force) {
                        Manager.init(force);
                    }
                });
            } else {
                Manager.init();
            }
        }
    }]);
    return ClassCommandInit;
}();

var CommandInit = new ClassCommandInit();

var q$7 = require('q');
var fs$6 = require('fs-plus');

var ClassCopier = function () {
    function ClassCopier() {
        classCallCheck(this, ClassCopier);
    }

    createClass(ClassCopier, [{
        key: 'checkLocalVersion',

        /**
         * Checks if a local version of the file exists and returns the file's contents
         *
         * @param path
         * @returns {*}
         */
        value: function checkLocalVersion(path) {
            var deferred = q$7.defer();

            FileSystem.readLocalFile(path).then(function (fileContent) {
                return deferred.resolve(FileSystem.buildResponse('local', path, fileContent));
            }, function (err) {
                return deferred.reject(err);
            });

            return deferred.promise;
        }

        /**
         * Fetch a global version of the file being seeked
         *
         * @param path
         * @returns {*}
         */

    }, {
        key: 'fetchGlobalVersion',
        value: function fetchGlobalVersion(path) {
            var deferred = q$7.defer();

            file.readGlobalFile(path).then(function (fileContent) {
                return deferred.resolve(fileContent);
            }, function (err) {
                return deferred.reject(err);
            });

            return deferred.promise;
        }

        /**
         * Creates a local version of the file
         *
         * @param path
         * @param content
         * @returns {*}
         */

    }, {
        key: 'createLocalVersion',
        value: function createLocalVersion(path, content) {
            var deferred = q$7.defer();

            file.writeToLocalFile(path, content).then(function () {
                return deferred.resolve(file.buildResponse('local', path, content));
            }, function (err) {
                return deferred.reject(err);
            });

            return deferred.promise;
        }

        /**
         * Loads the file in the specified path from the closest .edd folder
         *
         * @param path
         * @returns {Promise}
         */

    }, {
        key: 'copyFile',
        value: function copyFile(path) {
            var _this = this;

            var deferred = q$7.defer();

            if (!file.localDirectoryExists()) {
                return deferred.reject(new Error('Local .edd folder does not exist.'));
            }

            this.checkLocalVersion(path).then(function (response) {
                return deferred.resolve(response);
            }, function (err) {
                _this.fetchGlobalVersion(path).then(function (content) {
                    _this.createLocalVersion(path, content).then(function (response) {
                        return deferred.resolve(response);
                    }, function (err) {
                        return deferred.reject(err);
                    });
                }, function (err) {
                    return deferred.reject(err);
                });
            });

            return deferred.promise;
        }
    }]);
    return ClassCopier;
}();

var Copier = new ClassCopier();

var program$2 = require('commander');

var ClassCommandRead = function () {
    function ClassCommandRead() {
        classCallCheck(this, ClassCommandRead);
    }

    createClass(ClassCommandRead, [{
        key: 'init',
        value: function init() {
            program$2.command('read').description('Reads a json or yaml file and dumps its contents on the console').arguments('<path>', "The path of the file to read").action(this.handle).parse(process.argv);
        }
    }, {
        key: 'handle',
        value: function handle(path) {
            //
            // if (path == undefined) {
            //   throw new Error('Required argument `path` not provided');
            // }
            //
            // if (!fs.isFileSync(path)) {
            //   console.error('ERROR: Argument `path` is not a valid file path');
            //   process.exit(1);
            // }
            //
            console.log(path);
            Loader.loadFile(path).then(function (response) {
                console.log(response);
            }, function (err) {
                console.log(err);
            });
            // Copier.copyFile(path).then(function (response) {
            //   console.log(response);
            // }, function (err) {
            //   console.log(err)
            // });
        }
    }]);
    return ClassCommandRead;
}();

var CommandRead = new ClassCommandRead();

var program$3 = require('commander');
var q$8 = require('q');
var fs$7 = require('fs-plus');
var ClassCommandWrite = function () {
    function ClassCommandWrite() {
        classCallCheck(this, ClassCommandWrite);
    }

    createClass(ClassCommandWrite, [{
        key: 'init',
        value: function init() {
            program$3.command('write').description('Writes data to a specified file').arguments('<path> <data>', "The path of the file to write", "Data to write").action(this.handle).parse(process.argv);
        }
    }, {
        key: 'handle',
        value: function handle(path, content) {
            if (path == undefined) {
                throw new Error('Required argument `path` not provided');
            }

            if (content == undefined) {
                throw new Error('Required argument `data` not provided');
            }

            Writer.write(path, content).then(function () {
                console.log('Files written successfully');
            }).catch(function (err) {
                console.log(err ? err : '');
            });
        }
    }]);
    return ClassCommandWrite;
}();

var CommandWrite = new ClassCommandWrite();

var q = require('q');
var exec = require('exec');
var path = require('path');
var _ = require('lodash');
var fs = require('fs-plus');
var ghdownload = require('github-download');
var ClassInstaller = function () {
  function ClassInstaller() {
    classCallCheck(this, ClassInstaller);
  }

  createClass(ClassInstaller, [{
    key: 'installLibrary',

    /**
     * Install the libraries from github
     *
     * @param library
     * @returns {Promise}
     */
    value: function installLibrary(library, version, skip) {
      var _this = this;

      var credentials = void 0,
          spinner = void 0,
          localFolder = void 0;

      localFolder = FileSystem.getLocalFolder();

      if (!localFolder) {
        return Input.confirm('I\'m not initialized in this project. Would you like to initialize now?').then(function (init) {
          if (!init) {
            return q.reject('You should first initialize edd for this project. Run edd init in the project base folder');
          }
          Manager.init().then(function () {
            Output.success('Initialization complete, now lets install the library');
            _this.installLibrary(library, version, skip);
          });
        });
      }

      credentials = Installer.getLibraryCredentials(library, version);

      spinner = Output.spinner('Installing library ' + credentials.user + '/' + credentials.repo);
      return this.download(credentials, localFolder + '/libraries/' + credentials.repo + '/' + credentials.branch).then(function (src) {
        return FileSystem.readFile(src + '/edd-config.json').then(function (config) {
          spinner.stop();
          if (credentials.repo != config.slug) {
            config = _this.moveToSlug(src, localFolder + '/libraries/' + config.slug + '/' + credentials.branch, config);
          }
          return _this.installLibraryDependecies(config);
        });
      }).finally(function () {
        spinner.stop();
      });
    }
  }, {
    key: 'installLibraryDependecies',
    value: function installLibraryDependecies(config) {
      var _this2 = this;

      return q.resolve(config).then(function (config) {
        var dependencies = [];
        if (config.dependencies) {
          Output.info('Installing dependencies for ' + config.slug);
          dependencies = _.map(config.dependencies, function (version, library) {
            _this2.installLibrary(library, version, true);
          });
        }

        return q.all(dependencies).then(function () {
          Output.success('Library ' + config.slug + ' successfully added.');
          return config;
        });
      });
    }
  }, {
    key: 'moveToSlug',
    value: function moveToSlug(src, dest, config) {
      var _this3 = this;

      if (path.basename(src) == config.slug) {
        return q.resolve(config);
      }

      if (fs.existsSync(dest)) {
        return Input.choice('Library with identifier ' + config.slug + ' already exists. What do we do?', ['overwrite', 'skip', 'rename']).then(function (choice) {
          if (choice == 'skip') {
            fs.removeSync(src);
            return config;
          }
          if (choice == 'overwrite') {
            return _this3.overwriteExisting(src, config);
          }
          if (choice == 'rename') {
            return Input.ask('What should I rename the file to:', path.basename(src)).then(function (slug) {
              config.slug = slug;
              return _this3.moveToSlug(src, config);
            });
          }
        });
      }

      var deferred = q.defer();
      if (!fs.existsSync(path.dirname(dest))) {
        fs.makeTreeSync(path.dirname(dest));
      }
      fs.rename(src, dest, function (error) {
        if (error) {
          return deferred.reject(error);
        }
        fs.removeSync(path.dirname(src));
        return deferred.fulfill(config);
      });
      return deferred.promise;
    }
  }, {
    key: 'overwriteExisting',
    value: function overwriteExisting(src, config) {
      var dest = path.dirname(src) + config.slug;

      if (fs.existsSync(dest)) {
        var result = fs.removeSync(dest);
        if (result) {
          return q.reject(result);
        }
      }
      return this.moveToSlug(src, config);
    }

    /**
     * Install a plugin from github
     *
     * @param plugin
     * @returns {*}
     */

  }, {
    key: 'installPlugin',
    value: function installPlugin(plugin) {
      var spinner = new Spinner('Installing plugin.. %s');
      spinner.setSpinnerString('|/-\\');
      var localFolder = Installer.localFolderExist();
      // check if the user has a local .edd folder for the project
      if (localFolder) {
        // fetch the library credentials passed by the user
        var credentials = Installer.getPluginCredentials(plugin);
        //Start the library installer loader
        spinner.start();
        // download the library to the libraries folder in the local .edd folder
        return this.download(credentials, localFolder + '/plugins/').then(function () {
          return defered.resolve('\nPlugin successfully installed');
        }).finally(function () {
          spinner.stop();
        });
      }

      return q.reject(new Error('You should initialize edd for this project first by running ' + chalk.white('edd init')));
    }

    /**
     * Parse the library credentials
     *
     * @param library
     * @returns {{user: *, repo: *}}
     */

  }, {
    key: 'download',


    /**
     * Download library from github and move to the specified destination
     *
     * @param credentials
     * @param destination
     */
    value: function download(credentials, destination) {
      var defered = void 0;

      defered = q.defer();
      //Check if the library already exists
      if (fs.existsSync(destination)) {
        return q.reject('Library ' + credentials.user + '/' + credentials.repo + ' : ' + credentials.master + ' already exists');
      }
      if (!fs.existsSync(destination + '/../')) {
        fs.makeTree(destination + '/../');
      }

      ghdownload({ user: credentials.user, repo: credentials.repo, ref: credentials.branch }, destination).on('error', function (err) {
        return defered.reject(err);
      }).on('end', function () {
        return defered.fulfill(destination);
      });

      return defered.promise;
    }
  }], [{
    key: 'getLibraryCredentials',
    value: function getLibraryCredentials(library, version) {
      var credentials = library.split("/");

      return {
        user: credentials[0],
        repo: credentials[1],
        branch: version ? version : 'master'
      };
    }

    /**
     * Parse the plugin credentials
     *
     * @param plugin
     * @returns {{user: *, repo: *, branch: *}}
     */

  }, {
    key: 'getPluginCredentials',
    value: function getPluginCredentials(plugin) {
      var credentials = plugin.split("/");

      return {
        user: credentials[0],
        repo: credentials[1],
        branch: credentials[2]
      };
    }
  }]);
  return ClassInstaller;
}();

var Installer = new ClassInstaller();

var program = require('commander');
var Install = function () {
    function Install() {
        classCallCheck(this, Install);
    }

    createClass(Install, [{
        key: 'init',

        /**
         * Initialize the install commands for:
         * 1. Library
         * 2. Plugin
         */
        value: function init() {
            // Installing edd library
            program.command('library:install').description("Installs edd's libraries from github.com").arguments('<library>', "The library you want to install to edd e.g. username/repo_name").arguments('[version]', "The version you want [default=master]").action(this.handleLibraryInstallation).parse(process.argv);

            // Installing edd plugins
            program.command('install:plugin').description("Installs edd's plugins from github.com").arguments('<plugin>', "The plugin you want to install to edd e.g. username/repo_name").action(this.handlePluginInstallation).parse(process.argv);
        }

        /**
         * Handles the installation of the libraries
         *
         * @param library
         */

    }, {
        key: 'handleLibraryInstallation',
        value: function handleLibraryInstallation(library, version) {
            Installer.installLibrary(library, version).then(function (response) {
                //console.log(response);
            }, function (err) {
                console.log(err);
            });
        }

        /**
         * Handles the installation of the plugins
         *
         * @param plugin
         */

    }, {
        key: 'handlePluginInstallation',
        value: function handlePluginInstallation(plugin) {
            Installer.installPlugin(plugin).then(function (response) {
                console.log(response);
            }, function (err) {
                console.log(err);
            });
        }
    }]);
    return Install;
}();

var CommandInstall = new Install();

var _$8 = require('lodash');
var q$10 = require('q');
var path$3 = require('path');
var ClassFileLoader = function () {
  function ClassFileLoader() {
    classCallCheck(this, ClassFileLoader);
  }

  createClass(ClassFileLoader, [{
    key: 'findPattern',
    value: function findPattern(uses) {
      var _this = this;

      uses = this.explode(uses);

      if (!uses.library) {
        uses.library = Input.ask('Library');
      }
      return q$10.resolve(uses.library).then(function (library) {
        if (!uses.version) {
          uses.version = Input.ask('Version');
        }
        return q$10.resolve(uses.version).then(function (version) {
          if (!uses.pattern) {
            uses.pattern = Input.ask('Pattern');
          }
          return q$10.resolve(uses.pattern).then(function (pattern) {
            uses = library.concat(':', version, ':', pattern);
            return _this.getPattern(uses);
          });
        });
      });
    }
  }, {
    key: 'getPattern',
    value: function getPattern(uses) {
      uses = this.explode(uses);

      var pattern = {},
          file = void 0;

      return this.getLibrary(uses).then(function (library) {
        pattern.library = library;
        file = 'libraries/' + uses.library + '/' + uses.version + '/' + uses.pattern;
        return Loader.loadFile(file).then(function (_pattern) {
          pattern.pattern = _pattern.content;
          pattern.pattern.scope = _pattern.type;
          _$8.each(pattern.pattern.definitions, function (value, key) {
            if (_$8.startsWith(value, '!include')) {
              pattern.pattern.definitions[key] = Reader.readSync(path$3.dirname(_pattern.path) + '/' + value.replace('!include', '').trim());
            }
          });
          return pattern;
        }, function (err) {
          Output.error('Pattern not found: ', path$3, err);
        });
      });
    }
  }, {
    key: 'explode',
    value: function explode(uses) {
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
        result.version = 'master';
      }
      return result;
    }
  }, {
    key: 'getLibrary',
    value: function getLibrary(uses) {
      var path = 'libraries/' + uses.library + '/' + uses.version + '/edd-config.json';
      return Loader.loadFile(path).then(function (library) {
        library.content.scope = library.type;
        return library.content;
      }, function () {
        Output.error('The ' + uses.library + '/' + uses.version + ' does not exist');
      });
    }
  }]);
  return ClassFileLoader;
}();

var FileLoader = new ClassFileLoader();

var _$7 = require('lodash');
var q$9 = require('q');
var nunjucks = require('nunjucks');
var ClassBuilder = function () {
  function ClassBuilder() {
    classCallCheck(this, ClassBuilder);
  }

  createClass(ClassBuilder, [{
    key: 'generate',
    value: function generate(uses) {
      var _this = this;

      FileLoader.findPattern(uses).then(function (pattern) {
        var variables = {};
        if (pattern.pattern.variables.schema && pattern.pattern.variables.form) {
          variables = Fields.queries(pattern.pattern.variables.schema, pattern.pattern.variables.form);
        } else if (pattern.pattern.variables) {
          variables = Fields.queries({ type: 'object', properties: pattern.pattern.variables }, '*');
        }
        q$9.resolve(variables).then(function (definitions) {
          _this.build(uses, definitions).then(function (files) {
            _$7.each(files, function (file) {
              Writer.write(file.name, file.content).then(function () {
                Output.success('Successfully created ' + file.name);
              });
            });
          }, function (response) {
            Output.error(response);
          });
        });
      });
    }
  }, {
    key: 'build',
    value: function build(uses, definitions) {

      var files = [],
          env = void 0,
          filters = void 0,
          dynamicLoader = require('./loaders/dynamic-loader'),
          deferred = q$9.defer();

      env = new nunjucks.Environment(new dynamicLoader(), { preserve_linebreaks: true, autoescape: false });

      filters = {
        lodash: require('./filters/lodash-filters')
      };

      _$7.each(filters, function (filter) {
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
    }
  }]);
  return ClassBuilder;
}();

var Builder = new ClassBuilder();

var program$4 = require('commander');

var Generate = function () {
    function Generate() {
        classCallCheck(this, Generate);
    }

    createClass(Generate, [{
        key: 'init',
        value: function init() {
            program$4.command('generate [uses]').alias('g').description('Generate files based on a library').action(this.handle);
        }
    }, {
        key: 'handle',
        value: function handle(uses) {
            Builder.generate(uses);
        }
    }]);
    return Generate;
}();

var CommandGenerate = new Generate();

// import { CommandLibraries} from './commands/libraries';

function init() {
    CommandInstall.init();
    CommandGenerate.init();
}

export { init };
//# sourceMappingURL=index.mjs.map
