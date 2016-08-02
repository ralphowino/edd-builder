'use strict';

var q = require('q'),
  exec = require('exec'),
  path = require('path'),
  _ = require('lodash'),
  fs = require('fs-plus'),
  io = require('../../edd-io'),
  ghdownload = require('github-download'),
  fileSys = require('../../edd-fs/components/Filesystem/index'),
  manager = require('../../edd-fs/components/manager');

class Installer {
  /**
   * Install the libraries from github
   *
   * @param library
   * @returns {Promise}
   */
  installLibrary(library, version, skip) {
    let credentials, spinner, localFolder;

    localFolder = fileSys.getLocalFolder();

    if (!localFolder) {
      return io.confirm('I\'m not initialized in this project. Would you like to initialize now?').then((init)=> {
        if (!init) {
          return q.reject('You should first initialize edd for this project. Run edd init in the project base folder');
        }
        manager.init().then(()=> {
          io.output.success('Initialization complete, now lets install the library');
          this.installLibrary(library, version, skip);
        })

      });
    }

    credentials = Installer.getLibraryCredentials(library, version);


    spinner = io.output.spinner('Installing library ' + credentials.user + '/' + credentials.repo);
    return this.download(credentials, localFolder + '/libraries/' + credentials.repo + '/' + credentials.branch).then((src) => {
      return fileSys.readFile(src + '/edd-config.json').then((config)=> {
        spinner.stop();
        if (credentials.repo != config.slug) {
          config = this.moveToSlug(src, localFolder + '/libraries/' + config.slug + '/' + credentials.branch, config);
        }
        return this.installLibraryDependecies(config);
      });
    }).finally(() => {
      spinner.stop();
    });


  }

  installLibraryDependecies(config) {
    return q.resolve(config).then((config)=> {
      let dependencies = [];
      if (config.dependencies) {
        io.output.info('Installing dependencies for ' + config.slug)
        dependencies = _.map(config.dependencies, (version, library)=> {
          this.installLibrary(library, version, true);
        })
      }

      return q.all(dependencies).then(()=> {
        io.output.success('Library ' + config.slug + ' successfully added.');
        return config;
      });
    });
  }

  moveToSlug(src, dest, config) {
    if (path.basename(src) == config.slug) {
      return q.resolve(config);
    }

    if (fs.existsSync(dest)) {
      return io.choice('Library with identifier ' + config.slug + ' already exists. What do we do?', ['overwrite', 'skip', 'rename']).then((choice)=> {
        if (choice == 'skip') {
          fs.removeSync(src);
          return config;
        }
        if (choice == 'overwrite') {
          return this.overwriteExisting(src, config)
        }
        if (choice == 'rename') {
          return io.ask('What should I rename the file to:', path.basename(src)).then((slug) => {
            config.slug = slug;
            return this.moveToSlug(src, config);
          });
        }
      });
    }

    let deferred = q.defer();
    if (!fs.existsSync(path.dirname(dest))) {
      fs.makeTreeSync(path.dirname(dest));
    }
    fs.rename(src, dest, (error)=> {
      if (error) {
        return deferred.reject(error)
      }
      fs.removeSync(path.dirname(src));
      return deferred.fulfill(config);
    });
    return deferred.promise;

  }

  overwriteExisting(src, config) {
    let dest = path.dirname(src) + config.slug;

    if (fs.existsSync(dest)) {
      let result = fs.removeSync(dest);
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
  installPlugin(plugin) {
    var spinner = new Spinner('Installing plugin.. %s');
    spinner.setSpinnerString('|/-\\');
    let localFolder = Installer.localFolderExist();
    // check if the user has a local .edd folder for the project
    if (localFolder) {
      // fetch the library credentials passed by the user
      let credentials = Installer.getPluginCredentials(plugin);
      //Start the library installer loader
      spinner.start();
      // download the library to the libraries folder in the local .edd folder
      return this.download(credentials, localFolder + '/plugins/').then(() => {
        return defered.resolve('\nPlugin successfully installed');
      }).finally(() => {
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
  static getLibraryCredentials(library, version) {
    let credentials = library.split("/");

    return {
      user: credentials[0],
      repo: credentials[1],
      branch: version ? version : 'master'
    }
  }

  /**
   * Parse the plugin credentials
   *
   * @param plugin
   * @returns {{user: *, repo: *, branch: *}}
   */
  static getPluginCredentials(plugin) {
    let credentials = plugin.split("/");

    return {
      user: credentials[0],
      repo: credentials[1],
      branch: credentials[2]
    }
  }

  /**
   * Download library from github and move to the specified destination
   *
   * @param credentials
   * @param destination
   */
  download(credentials, destination) {
    let defered;

    defered = q.defer();
    //Check if the library already exists
    if (fs.existsSync(destination)) {
      return q.reject('Library ' + credentials.user + '/' + credentials.repo + ' : ' + credentials.master + ' already exists');
    }
    if (!fs.existsSync(destination + '/../')) {
      fs.makeTree(destination + '/../');
    }

    ghdownload({user: credentials.user, repo: credentials.repo, ref: credentials.branch}, destination)
      .on('error', (err)=> {
        return defered.reject(err);
      })
      .on('end', ()=> {
        return defered.fulfill(destination)
      });

    return defered.promise;
  }
}

module.exports = new Installer;