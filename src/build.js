const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const semverSort = require('semver-sort');


module.exports.buildRegistry = () => {
  console.log("Building the registry...");

  let registry = {
    name: "OwlPlug central",
    url: "https://central.owlplug.com",
    schemaVersion: "1.2.0",
    products: [] // TODO : Must be changed to packages ?
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

        // Only the latest version is used to build the registry
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
    console.error("Error during registry build", e);
  }

  try {
    let buildDirectory = './build';
    fs.writeFileSync(path.join(buildDirectory, "registry.min.json"), JSON.stringify(registry))
    fs.writeFileSync(path.join(buildDirectory, "registry.json"), JSON.stringify(registry, null, 2))

  }
  catch (e) {
    console.error("Error during registry export", e);
  }

}
