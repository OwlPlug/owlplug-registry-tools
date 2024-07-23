const os = require("os");
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const crypto = require('crypto');
const prompts = require('prompts');
const download = require('./utils/download')


module.exports.createPackage = () => {

  promptPackage().then((package) => {
      let registryDirectory = './registry'
      let directoryPath = path.join(registryDirectory, package.slug, package.version)
      let filePath = path.join(directoryPath, 'package.yaml')
    try {
      if (!fs.existsSync(directoryPath)){
        fs.mkdirSync(directoryPath, { recursive: true });
      }
      
      fs.writeFileSync(filePath, yaml.dump(package))
      console.log(`Package created : ${filePath}`)
    } catch (error) {
      console.log(`Error during package file creation : ${filePath}`)
      console.log(error)
    }
  })
}


async function promptPackage() {

  const packagePrompts = [
    {
      type: 'text',
      name: 'group',
      message: 'What is your package group id ? (First part of the slug <group>/<name>)'
    },
    {
      type: 'text',
      name: 'name',
      message: 'What is your package name ?'
    },
    {
      type: 'text',
      name: 'version',
      message: 'What is your package version ?',
    },
    {
      type: 'select',
      name: 'type',
      message: 'Select your package type',
      choices: [
        { title: 'Instrument', value: 'instrument' },
        { title: 'Effect', value: 'effect' }
      ]
    },
    {
      type: 'text',
      name: 'creator',
      message: 'Package Creator name ?',
    },
    {
      type: 'text',
      name: 'description',
      message: 'Package description ?',
    },
    {
      type: 'text',
      name: 'pageUrl',
      message: 'Package webpage URL ?',
    },
    {
      type: 'text',
      name: 'screenshotUrl',
      message: 'Package screenshot URL ?',
    },
  ];

  let response = await prompts(packagePrompts);

  let package = {
    slug: response.group.toLowerCase() + "/" + response.name.toLowerCase(),
    name: response.name,
    creator: response.creator,
    version: response.version,
    type: response.type,
    screenshotUrl: response.screenshotUrl,
    pageUrl: response.pageUrl,
    description : response.description,
    bundles: []
  }

  let createBundle = true;
  while(createBundle) {
    response = await prompts({
      type: 'toggle',
      name: 'createBundle',
      message: 'Create a new Bundle ?',
      initial: true,
      active: 'yes',
      inactive: 'no'
    })

    createBundle = response.createBundle
    if(createBundle) {
      let bundle = await promptBundle()
      package.bundles.push(bundle)
    }

  }

  return package;

}


async function promptBundle() {

  const bundlePrompts = [
    {
      type: 'text',
      name: 'name',
      message: 'What is your bundle display name ?'
    },
    {
      type: 'multiselect',
      name: 'targets',
      message: 'Pick compatible target for your bundle',
      choices: [
        { value: 'win32' },
        { value: 'win64' },
        { value: 'osx' },
        { value: 'linux32' },
        { value: 'linux64' },
      ],
      hint: '- Space to select. Return to submit'
    },
    {
      type: 'multiselect',
      name: 'formats',
      message: 'Pick formats included in the Bundle',
      choices: [
        { title: 'VST/VST2', value: 'vst' },
        { title: 'VST3', value: 'vst3' },
        { title: 'Audio Unit (AU)', value: 'au' },
        { title: 'Clap', value: 'clap' },
        { title: 'AAX', value: 'aax' },
        { title: 'Unknown', value: 'unknown' },
      ],
      hint: '- Space to select. Return to submit'
    },
    {
      type: 'text',
      name: 'downloadUrl',
      message: 'Bundle download url ?',
    }
  ];

  let response = await prompts(bundlePrompts);

  let bundle = {
    name: response.name.trim(),
    targets: response.targets,
    formats: response.bundle.formats,
    downloadUrl: response.downloadUrl.trim(),
  }

  let tempPath = os.tmpdir();
  if (!fs.existsSync(tempPath)){
    fs.mkdirSync(tempPath, { recursive: true });
  }

  let tempFilePath = await download.download(bundle.downloadUrl, tempPath);

  let tempFile = fs.readFileSync(tempFilePath);
  let hashSum = crypto.createHash('sha256');
  hashSum.update(tempFile);
  let hex = hashSum.digest('hex');

  console.log(`Computed SHA256: ${hex}`)
  bundle.downloadSha256 = hex;

  // Delete file
  fs.unlinkSync(tempFilePath)
  
  return bundle

}
