const yaml = require('js-yaml');
const https = require("https");
const crypto = require('crypto');
const fs = require("fs");

const schema = require('./schema');

module.exports.validatePackageFile = (path) => {

    const packageContent = yaml.load(fs.readFileSync(path, 'utf8'))
    validatePackage(packageContent)

}


async function validatePackage(package) {

    let valid = schema.validatePackage(package)

    if(valid) {
        console.log("Package schema is valid")
    } else {
        process.exit(-1)
    }

    for (bundle of package.bundles) {
        let path = "./tmp/plugin-file"

        await download(bundle.downloadUrl, path)
        const file = fs.readFileSync(path);
        const hashSum = crypto.createHash('sha256');
        hashSum.update(file);
        const hex = hashSum.digest('hex');
        console.log(hex);

        // TODO validate wth hex referenced in package.
    }

}

const download = async (url, fileFullPath) => {
    console.log('Downloading file from: '+url)
    return new Promise((resolve, reject) => {
        https.get(url, (resp) => {

            // chunk received from the server
            resp.on('data', (chunk) => {
                fs.appendFileSync(fileFullPath, chunk);
            });

            // last chunk received, we are done
            resp.on('end', () => {
                resolve();
            });

        }).on("error", (err) => {
            reject(new Error(err.message))
        });
    })
}