var plugin = {};
plugin.name = 'File Builder';

import {CommandInstall} from './commands/install';
import {CommandGenerate} from './commands/generate';
// import { CommandLibraries} from './commands/libraries';

export function init() {
    CommandInstall.init();
    CommandGenerate.init();
}