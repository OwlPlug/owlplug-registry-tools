const yargs = require('yargs');
const build = require('./build')

var argv = yargs
  .usage('usage: $0 <command>')
  .command('create', 'create a new entry [package|...]', function (yargs) {
    argv = yargs
      .usage('usage: $0 create <item> [options]')
      .command('package', 'create a new package', function (yargs) {
        console.log('Not yet implemented...')
      })
      .help('help')
      .updateStrings({
        'Commands:': 'item:'
      })
      .wrap(null)
      .argv
    checkCommands(yargs, argv, 2)
  })
  .command('validate', 'validate a [registry|package] using schema', function (yargs) {
    argv = yargs
      .usage('usage: $0 validate <item> [options]')
      .command('registry', 'validate the complete registry', function (yargs) {
        build.validateRegistryCommand(yargs)
      })
      .command('package', 'validate a package file definition', function (yargs) {
        console.log('Not yet implemented...')
      })
      .help('help')
      .updateStrings({
        'Commands:': 'item:'
      })
      .wrap(null)
      .argv
    checkCommands(yargs, argv, 2)
  })
  .command('build', 'Build the registry', function (yargs) {
    build.buildRegistryCommand(yargs)
  })
  .help('help')
  .wrap(null)
  .argv

checkCommands(yargs, argv, 1)

function checkCommands(yargs, argv, numRequired) {
  if (argv._.length < numRequired) {
    yargs.showHelp()
  } else {
    // check for unknown command
  }
}

