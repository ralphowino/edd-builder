var program = require('commander');

import {Builder} from './../lib/builder';

class Generate {
    init() {
        program
            .command('generate [uses]')
            .alias('g')
            .description('Generate files based on a library')
            .action(this.handle);

    }

    handle(uses) {
        Builder.generate(uses);
    }
}
export let CommandGenerate = new Generate();

