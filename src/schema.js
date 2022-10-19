const Ajv = require("ajv")
const addFormats = require("ajv-formats")
const registrySchema = require("../schemas/registry.json")
const packageSchema = require("../schemas/package.json")
const storeLegacySchema = require("../schemas/store.legacy.json")

module.exports.validateRegistry = (registry) => {

    console.log("Validating registry schema...")
    let ajv = new Ajv();
    addFormats(ajv)
    ajv.addSchema(packageSchema)
    let validate = ajv.compile(registrySchema)

    let valid = validate(registry)

    if (!valid) {
        console.log("Error during schema validation")
        console.log(validate.errors)
    }

    return valid
}


module.exports.validateStore = (store) => {

    console.log("Validating legacy store schema...")
    let ajv = new Ajv();
    addFormats(ajv)
    ajv.addSchema(packageSchema)
    let validate = ajv.compile(storeLegacySchema)

    let valid = validate(store)

    if (!valid) {
        console.log("Error during schema validation")
        console.log(validate.errors)
    }

    return valid
}

module.exports.validatePackage = (pack) => {

    console.log("Validating package schema...")
    let ajv = new Ajv();
    addFormats(ajv)
    let validate = ajv.compile(packageSchema)

    let valid = validate(pack)

    if (!valid) {
        console.log("Error during schema validation")
        console.log(validate.errors)
    }

    return valid;
}

