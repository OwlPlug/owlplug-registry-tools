const fs = require('fs');
const path = require('path');

module.exports.exportStoreFile = (store) => {

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
  
 module.exports.exportRegistryFile = (registry) => {
  
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
  
  