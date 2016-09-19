class ClassLibrary {
  info() {
    console.log('info', arguments);
  }

  get() {
    console.log('install', arguments);
  }

  versions() {
    console.log('install', arguments);
  }

  patterns() {
    console.log('install', arguments);
  }

  install() {
    console.log('install', arguments);
  }

  update() {
    console.log('update', arguments);
  }

  remove() {
    console.log('remove', arguments);
  }

  config() {
    console.log('config', arguments);
  }
}
export let Library = new ClassLibrary();