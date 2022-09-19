const build = require('./build')
const schema = require('./schema');
const exporter = require('./export');



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
