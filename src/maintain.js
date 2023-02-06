const axions = require('axios')
const build = require('./build')

module.exports.revalidate = () => {

    let registry = build.buildRegistry();
    let problems = [];

    for (packageId in registry.packages) {
        let package = registry.packages[packageId]

        for(versionNumber in package.versions) {
            let packageVersion = package.versions[packageNumber]

            problems.push(await getPackageProblems(packageVersion))

        }
    }
};

async function getPackageProblems(packageVersion) {

    let problems = []
    problems.push(await validateScreenshot(packageVersion));
    problems.push(await validateHomepage(packageVersion))

    for (bundle of packageVersion.bundles) {
        // Download bundle, validate 200
        // Validate bundle SHA 256
    }

    return problems;
}

async function validateScreenshot(packageVersion) {

    let problems = []

    try {
        await axios.get(packageVersion.screenshotUrl)

    } catch(error) {
        if (error.response) {
            problems.push({
                level: "error",
                message: `Error on screenshot response for ${packageVersion.slug} ${packageVersion.version} : ${error.response.status}`
            })
        } else {
            console.log('Error', error.message);
            problems.push({
                level: "error",
                message: `Error while retrieving screenshot for ${packageVersion.slug} ${packageVersion.version}`
            })
        }
    }
    return problems
}

async function validateHomepage(packageVersion) {

    let problems = []

    try {
        await axios.get(packageVersion.pageUrl)

    } catch(error) {
        if (error.response) {
            problems.push({
                level: "error",
                message: `Error on homepage response for ${packageVersion.slug} ${packageVersion.version} : ${error.response.status}`
            })
        } else {
            console.log('Error', error.message);
            problems.push({
                level: "error",
                message: `Error while retrieving homepage for ${packageVersion.slug} ${packageVersion.version}`
            })
        }
    }
    return problems
}