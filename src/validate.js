const Ajv = require("ajv")
const registrySchema = require("../schemas/registry.json")
const packageSchema = require("../schemas/package.json")


module.exports.validateRegistry = (registry) => {

    console.log("Validating registry schema...")
    let ajv = new Ajv();
    ajv.addSchema(packageSchema)
    let validate = ajv.compile(registrySchema)

    let valid = validate(registry)

    if (!valid) {
        console.log("Error during schema validation")
        console.log(validate.errors)
    }

    return valid
}

module.exports.validatePackage = (pack) => {

    console.log("Validating package schema...")
    let ajv = new Ajv();
    let validate = ajv.compile(packageSchema)

    let valid = validate(pack)

    if (!valid) {
        console.log("Error during schema validation")
        console.log(validate.errors)
    }

    return valid;
}

