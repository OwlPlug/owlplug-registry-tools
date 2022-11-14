const prompts = require('prompts');


module.exports.createPackage = () => {

    promptPackage().then((package) => {
        console.log(package);
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
              { title: 'Effect', value: 'effect'}
            ]
        },
        {
            type: 'text',
            name: 'creator',
            message: 'Package Creator name ?',
        },
        {
            type: 'text',
            name: 'screenshotUrl',
            message: 'Package schreenshot URL ?',
        },
      ];

      let response = await prompts(packagePrompts);
      
      let package = {
        slug : response.group + "/" + response.name,
        name : response.name,
        creator: response.creator,
        version : response.version,
        type : response.type,
        screenshotUrl: response.screenshotUrl
      }
      
      return package;

}