const yaml = require('js-yaml');
const https = require("https");
const crypto = require('crypto');
const fs = require("fs");
const path = require("path");

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

    for (bundle of package.bundles) {

        let dir = "./build/tmp"
        let filename = "plugin-file"

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }

        let filepath = path.join(dir, filename);
        await download(bundle.downloadUrl, filepath)

        let file = fs.readFileSync(filepath);
        let hashSum = crypto.createHash('sha256');
        hashSum.update(file);
        let hex = hashSum.digest('hex');
        
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

const download = async (url, filepath) => {
    return new Promise((resolve, reject) => {
        https.get(url, (resp) => {

            // Delete previous file
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
            }

            // chunk received
            resp.on('data', (chunk) => {
                fs.appendFileSync(filepath, chunk);
            });

            // last chunk received, download complete
            resp.on('end', () => {
                resolve();
            });

        }).on("error", (err) => {
            reject(new Error(err.message))
        });
    })
}
