const build = require('./build')
const schema = require('./schema');
const exporter = require('./export');
const validate = require('./validate');
const create = require('./create')


module.exports.buildRegistryCommand = (yargs) => {

  let registry = build.buildRegistry()
  let valid = schema.validateRegistry(registry)
  if (!valid) {
    process.exit(-1)
  }
  exporter.exportRegistryFile(registry)

  let store = build.buildStore()
  valid = schema.validateStore(store)
  if (!valid) {
    process.exit(-1)
  }
  exporter.exportStoreFile(store)
  
}


module.exports.validateRegistryCommand = (yargs) => {

  let registry = build.buildRegistry()
  let valid = schema.validateRegistry(registry)
  if (!valid) {
    process.exit(-1)
  }

  let store = build.buildStore()
  valid = schema.validateStore(store)
  if (!valid) {
    process.exit(-1)
  }
  
}

module.exports.validatePackageCommand = (yargs) => {
  let arg = yargs.argv._[2]
  validate.validatePackageFile(arg)
}

module.exports.createPackageCommand = (yargs) => {
  create.createPackage()
}
