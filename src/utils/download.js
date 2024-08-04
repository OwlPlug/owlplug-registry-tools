const DownloaderHelper = require("node-downloader-helper");

module.exports.download = (url, saveDirectory) => {
    const downloader = new DownloaderHelper.DownloaderHelper(url, saveDirectory, {
        headers: {
            'User-Agent': 'owlplug/node',
        }
    });
    return new Promise(
        (resolve, reject) => {
            downloader.on("end", () => resolve(downloader.getDownloadPath()));
            downloader.on("error", (error) => reject(error));
            downloader.on("progress.throttled", (downloadEvents) => {
                const percentageComplete = downloadEvents.progress < 100 ? downloadEvents.progress.toPrecision(2) : 100;
                console.log(`Downloaded: ${percentageComplete}%`)
            });
            downloader.start();
        }
    );

}