const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const semverSort = require('semver-sort');

const validate = require('./validate');

module.exports.buildRegistryCommand = (yargs) => {

  let registry = buildRegistry()
  let valid = validate.validateRegistry(registry)
  if (!valid) {
    process.exit(-1)
  }
  exportRegistryFile(registry)

  let store = buildStore()
  valid = validate.validateStore(store)
  if (!valid) {
    process.exit(-1)
  }
  exportStoreFile(store)

}

module.exports.validateRegistryCommand = (yargs) => {

  let registry = buildRegistry()
  let valid = validate.validateRegistry(registry)
  if (!valid) {
    process.exit(-1)
  }

  let store = buildStore()
  valid = validate.validateStore(store)
  if (!valid) {
    process.exit(-1)
  }

}

function buildStore() {

  console.log("Building the legacy store...");

  let registry = {
    name: "OwlPlug central",
    url: "https://central.owlplug.com",
    schemaVersion: "1.2.0",
    products: []
  }

  let registryDirectory = './registry';

  try {
    let groups = fs.readdirSync(registryDirectory);

    for (let group of groups) {
      let groupPath = path.join(registryDirectory, group)
      let packages = fs.readdirSync(groupPath);

      for (let package of packages) {
        let packagePath = path.join(groupPath, package);
        let versions = fs.readdirSync(packagePath);

        // Only the latest version is used to build the store
        if (versions.length > 0) {
          semverSort.desc(versions);
          let latestVersionTag = versions[0];

          let packageYamlFile = path.join(packagePath, latestVersionTag, 'package.yaml');

          const packageContent = yaml.load(fs.readFileSync(packageYamlFile, 'utf8'));
          registry.products.push(packageContent);

        }
      }
    }
  }
  catch (e) {
    console.error("Error during store build", e);
  }

  return registry
  
}

function buildRegistry() {
  console.log("Building the registry...");

  let registry = {
    name: "OwlPlug central",
    url: "https://central.owlplug.com",
    schemaVersion: "1.2.0",
    packages: {}
  }

  let registryDirectory = './registry';

  try {
    let groups = fs.readdirSync(registryDirectory);

    for (let group of groups) {
      let groupPath = path.join(registryDirectory, group)
      let packages = fs.readdirSync(groupPath);

      for (let package of packages) {
        let packagePath = path.join(groupPath, package);
        let versions = fs.readdirSync(packagePath);

        let packageSlug = group + "/" + package;
        let packageContent = {
          slug : packageSlug,
          latest_version: "",
          versions : {}
        }

        for(let version of versions) {
          let packageVersionYamlFile = path.join(packagePath, version, 'package.yaml');
          let packageVersionContent = yaml.load(fs.readFileSync(packageVersionYamlFile, 'utf8'));

          packageContent.versions[version] = packageVersionContent;
        }

        // Add a latest version tag
        if (versions.length > 0) {
          semverSort.desc(versions);
          packageContent.latest_version = versions[0];
        }

        registry.packages[packageSlug] = packageContent;

      }
    }
  }
  catch (e) {
    console.error("Error during registry build", e);
  }

  return registry

}

function exportStoreFile(store) {

  console.log("Creating store files...");

  try {
    let buildDirectory = './build';
    if (!fs.existsSync(buildDirectory)){
      fs.mkdirSync(buildDirectory, { recursive: true });
    }
    fs.writeFileSync(path.join(buildDirectory, "store.legacy.min.json"), JSON.stringify(store))
    fs.writeFileSync(path.join(buildDirectory, "store.legacy.json"), JSON.stringify(store, null, 2))

  }
  catch (e) {
    console.error("Error during store legacy export", e);
  }

}

function exportRegistryFile(registry) {

  console.log("Creating registry files...");

  try {
    let buildDirectory = './build';
    if (!fs.existsSync(buildDirectory)){
      fs.mkdirSync(buildDirectory, { recursive: true });
    }
    fs.writeFileSync(path.join(buildDirectory, "registry.min.json"), JSON.stringify(registry))
    fs.writeFileSync(path.join(buildDirectory, "registry.json"), JSON.stringify(registry, null, 2))

  }
  catch (e) {
    console.error("Error during registry export", e);
  }

}

