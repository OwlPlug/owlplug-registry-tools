const yaml = require('js-yaml');
const crypto = require('crypto');
const fs = require("fs");
const download = require("./utils/download")
const schema = require('./schema');

module.exports.validatePackageFile = (path) => {

    if (fs.existsSync(path)) {
        const packageContent = yaml.load(fs.readFileSync(path, 'utf8'))
        validatePackage(packageContent)
    } else {
        console.log(`No such file: ${path}`)
    }

}


async function validatePackage(package) {

    let valid = schema.validatePackage(package)

    if(valid) {
        console.log("Package schema is valid")
    } else {
        console.log("Package schema is invalid")
        process.exit(-1)
    }

    for (let bundle of package.bundles) {

        let dir = "./build/tmp"

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }

        let tempFilePath = await download.download(bundle.downloadUrl, dir);
        let file = fs.readFileSync(tempFilePath);
        let hashSum = crypto.createHash('sha256');
        hashSum.update(file);
        let hex = hashSum.digest('hex');

        fs.unlinkSync(tempFilePath)
        
        if(hex === bundle.downloadSha256) {
            console.log(`Valid SHA256 hash for file ${bundle.downloadUrl}`)

        } else {
            console.log(`Invalid SHA256 hash for file ${bundle.downloadUrl}`)
            console.log(`Computed: ${hex}`)
            console.log(`Expected: ${bundle.downloadSha256}`)
            process.exit(-1)
        }
    }
}
