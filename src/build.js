const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const semverSort = require('semver-sort');

module.exports.buildStore = () => {

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
      assertDirectory(groupPath)
      let packages = fs.readdirSync(groupPath);

      for (let package of packages) {
        let packagePath = path.join(groupPath, package);
        assertDirectory(packagePath)
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

module.exports.buildRegistry = () => {
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
      assertDirectory(groupPath)
      let packages = fs.readdirSync(groupPath);

      for (let package of packages) {
        let packagePath = path.join(groupPath, package);
        assertDirectory(packagePath)
        let versions = fs.readdirSync(packagePath);

        let packageSlug = group + "/" + package;
        let packageContent = {
          slug : packageSlug,
          latest_version: "",
          versions : {}
        }

        for(let version of versions) {
          let versionPath = path.join(packagePath, version);
          assertDirectory(versionPath)

          let packageVersionYamlFile = path.join(versionPath, 'package.yaml');
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

function assertDirectory(file) {
  if (!fs.statSync(file).isDirectory()) {
    console.log("File must be a directory :" + file)
    throw new Error("File must be a directory :" + file)
  }
}