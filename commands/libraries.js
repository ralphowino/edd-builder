var program = require('commander');

import {Library} from './../lib/library';

class Libraries {
    init() {
        program
            .command('libraries')
            .alias('lib')
            .action(command.handle)
            .on('--help', function () {
                console.log('  Examples:');
                console.log('');
                console.log('    $ custom-help --help');
                console.log('    $ custom-help -h');
                console.log('');
            });
    }

    handle() {
        Library.info(program.global);
    }
}
export let CommandLibraries = new Libraries();


